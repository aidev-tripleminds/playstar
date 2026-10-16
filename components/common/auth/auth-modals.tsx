"use client";

import * as React from "react";

import { Login } from "@/components/common/auth/login/login";
import { Signup } from "@/components/common/auth/signup/signup";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { ROUTES } from "@/lib/routes";

export type AuthModalKind = "login" | "signup" | null;

/**
 * Login and Signup stay mounted together. A leftover dismiss from the idle
 * shell (common on Android Vaul) must not close the modal the user just opened.
 */
export function resolveAuthModalOpenChange(
  source: Exclude<AuthModalKind, null>,
  current: AuthModalKind,
  open: boolean,
): AuthModalKind {
  if (open) {
    return source;
  }

  return current === source ? null : current;
}

export type AuthModalsProps = {
  /** Which modal is open, or null for none. */
  modal: AuthModalKind;
  onModalChange: (modal: AuthModalKind) => void;
  /** Fired after a real login or authenticated registration (auto-login). */
  onAuthSuccess?: () => void;
  /**
   * Fired when login/signup must leave the shell for confirm-email without
   * authenticating. Lets AuthGate treat that shell close as non-dismiss.
   */
  onAuthFlowContinue?: () => void;
  /**
   * Fired when confirm-email closes without a session. AuthGate abandons the
   * gated action (onDismiss) instead of treating it as auth success.
   */
  onAuthFlowAbandon?: () => void;
  signupTokens?: number | string;
  /**
   * Rendered on the funnel (funnel-page task 5 / D21). The only thing this
   * changes: the verify-email link a registration/resend sends carries an
   * explicit `returnTo` of the wizard's own path, rather than whatever
   * `buildVerifyEmailCallbackUrl` would derive from `window.location` — on the
   * funnel that location IS `/`, which is deliberately dropped there, so left
   * alone the mailed link would land the visitor on `ROUTES.explore` with
   * their draft claimed but nothing showing it.
   */
  isFunnel?: boolean;
  /** Overrides the page encoded into signup and resend verification links. */
  verifyEmailReturnTo?: string;
  socialErrorMessage?: string | null;
};

/**
 * The login/signup modal pair wired to the real Better Auth actions, including
 * the cross-links between them. Single home for the auth modal contract — every
 * surface that gates on auth renders this rather than its own copy.
 */
export function AuthModals({
  modal,
  onModalChange,
  onAuthSuccess,
  onAuthFlowContinue,
  onAuthFlowAbandon,
  signupTokens = 30,
  isFunnel = false,
  verifyEmailReturnTo,
  socialErrorMessage,
}: AuthModalsProps) {
  const {
    login,
    register,
    signInWithGoogle,
    isGoogleAvailable,
    sendPasswordResetEmail,
    sendConfirmationEmail,
  } = useAuthActions();

  // Passing `undefined` is what hides the button (see AuthLayout): this brand
  // has no Google client, or bootstrap has not answered yet.
  const onGoogleSignIn = isGoogleAvailable
    ? () =>
        verifyEmailReturnTo
          ? signInWithGoogle({ returnTo: verifyEmailReturnTo })
          : signInWithGoogle()
    : undefined;

  // One draft for both shells so login ↔ signup does not wipe the fields (FRONT-465).
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleAuthSuccess = React.useCallback(() => {
    setEmail("");
    setPassword("");
    onAuthSuccess?.();
  }, [onAuthSuccess]);

  const verifyEmailOptions = React.useMemo(() => {
    const returnTo = verifyEmailReturnTo ?? (isFunnel ? ROUTES.createAiGirlfriend : undefined);
    return returnTo ? { returnTo } : undefined;
  }, [isFunnel, verifyEmailReturnTo]);
  const handleRegister = React.useCallback(
    (email: string, password: string) => register(email, password, verifyEmailOptions),
    [register, verifyEmailOptions],
  );
  const handleResendConfirmation = React.useCallback(
    (email: string) => sendConfirmationEmail(email, verifyEmailOptions),
    [sendConfirmationEmail, verifyEmailOptions],
  );

  const modalRef = React.useRef(modal);
  React.useLayoutEffect(() => {
    modalRef.current = modal;
  });

  const handleLoginOpenChange = React.useCallback(
    (open: boolean) => {
      const next = resolveAuthModalOpenChange("login", modalRef.current, open);
      if (next !== modalRef.current) {
        onModalChange(next);
      }
    },
    [onModalChange],
  );

  const handleSignupOpenChange = React.useCallback(
    (open: boolean) => {
      const next = resolveAuthModalOpenChange("signup", modalRef.current, open);
      if (next !== modalRef.current) {
        onModalChange(next);
      }
    },
    [onModalChange],
  );

  return (
    <>
      <Login
        className="md:max-w-[800px]!"
        open={modal === "login"}
        onOpenChange={handleLoginOpenChange}
        onSubmit={login}
        onLogin={handleAuthSuccess}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onAuthFlowContinue={onAuthFlowContinue}
        onConfirmEmailClose={onAuthFlowAbandon}
        onSignup={() => onModalChange("signup")}
        onSendResetLink={sendPasswordResetEmail}
        onResendConfirmationEmail={handleResendConfirmation}
        onGoogleSignIn={onGoogleSignIn}
        socialErrorMessage={socialErrorMessage}
      />

      <Signup
        className="md:max-w-[800px]!"
        open={modal === "signup"}
        onOpenChange={handleSignupOpenChange}
        onSubmit={handleRegister}
        onSignup={handleAuthSuccess}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRegistrationContinue={onAuthFlowContinue}
        onConfirmEmailClose={onAuthFlowAbandon}
        onLogin={() => onModalChange("login")}
        onResendConfirmationEmail={handleResendConfirmation}
        onGoogleSignIn={onGoogleSignIn}
        socialErrorMessage={socialErrorMessage}
        signupTokens={signupTokens}
      />
    </>
  );
}
