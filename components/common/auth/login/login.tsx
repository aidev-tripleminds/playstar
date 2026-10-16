"use client";

import * as React from "react";
import { useState } from "react";

import { Buttons } from "@/components/common/general/button/buttons";

import { TextInput } from "../../general/text-input/text-input";
import { AuthLayout } from "../auth-layout";
import {
  CONFIRM_EMAIL_DESCRIPTION,
  CONFIRM_EMAIL_RESEND_LABEL,
  CONFIRM_EMAIL_TITLE,
} from "../confirm-email-copy";
import { InstructionsSent } from "../instructions-sent/instructions-sent";
import { ResetPassword } from "../reset-password/reset-password";

/**
 * What the login call reports back (BACK-72). Correct credentials against an
 * unverified address must never authenticate the user, so the modal has to
 * tell that apart from a plain wrong-credentials error: only the former opens
 * the confirm-email popup instead of showing an inline message.
 */
export type LoginSubmitResult = {
  /** Message to show inline. Absent or null when the call succeeded. */
  error?: string | null;
  /** True when the credentials were correct but the address isn't verified yet. */
  emailUnverified?: boolean;
};

export type LoginProps = {
  trigger?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: string;
  subtitle?: string;

  /**
   * Submit the credentials for real. Resolve with an error message to show,
   * or without one on success — the modal then closes and `onLogin` fires.
   */
  onSubmit?: (email: string, password: string) => Promise<LoginSubmitResult>;
  onLogin?: () => void;
  onSignup?: () => void;
  /**
   * Fired when credentials are correct but the address is unverified,
   * immediately before the login shell closes for confirm-email. AuthGate uses
   * this so that close is not treated as dismiss.
   */
  onAuthFlowContinue?: () => void;
  /**
   * Fired when the post-login confirm-email popup closes. The user is still
   * unverified — AuthGate treats this as abandoning the gated action.
   */
  onConfirmEmailClose?: () => void;
  onForgotPassword?: () => void;
  /**
   * Request the password-reset email for real, for the nested reset modal.
   * Resolve to an error message to show inline, or null on success.
   */
  onSendResetLink?: (email: string) => Promise<string | null> | void;
  /**
   * Re-send the verification email from the confirm-email popup opened after
   * an unverified-address login attempt. Resolve to an error message to show
   * inline, or null on success.
   */
  onResendConfirmationEmail?: (email: string) => Promise<string | null> | void;
  /**
   * "Continue with Google" — see {@link AuthLayout}, which owns the button's
   * pending/error state. Resolve to an error message, or null when the
   * browser is leaving for Google.
   */
  onGoogleSignIn?: () => Promise<string | null> | void;
  socialErrorMessage?: string | null;

  /**
   * Shared draft so switching login ↔ signup keeps what the user already
   * typed (FRONT-465). Omit to keep the fields local to this modal.
   */
  email?: string;
  password?: string;
  onEmailChange?: (email: string) => void;
  onPasswordChange?: (password: string) => void;

  className?: string;
};

export function Login({
  trigger,
  open,
  defaultOpen,
  onOpenChange,

  title = "Log in now",
  subtitle = "Access your account",

  onSubmit,
  onLogin,
  onSignup,
  onAuthFlowContinue,
  onConfirmEmailClose,
  onForgotPassword,
  onSendResetLink,
  onResendConfirmationEmail,
  onGoogleSignIn,
  socialErrorMessage,

  email: emailProp,
  password: passwordProp,
  onEmailChange,
  onPasswordChange,

  className,
}: LoginProps) {
  const [uncontrolledEmail, setUncontrolledEmail] = React.useState("");
  const [uncontrolledPassword, setUncontrolledPassword] = React.useState("");
  const email = emailProp ?? uncontrolledEmail;
  const password = passwordProp ?? uncontrolledPassword;
  const setEmail = (value: string) => {
    if (emailProp === undefined) setUncontrolledEmail(value);
    onEmailChange?.(value);
  };
  const setPassword = (value: string) => {
    if (passwordProp === undefined) setUncontrolledPassword(value);
    onPasswordChange?.(value);
  };
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [authError, setAuthError] = React.useState("");
  const [errorForEmail, setErrorForEmail] = React.useState(email);
  const [errorForPassword, setErrorForPassword] = React.useState(password);
  // A sibling modal can change the shared draft without going through these
  // inputs, so only show an error that still matches the current credentials.
  const visibleAuthError =
    errorForEmail === email && errorForPassword === password ? authError : "";
  const reportAuthError = (message: string) => {
    setErrorForEmail(email);
    setErrorForPassword(password);
    setAuthError(message);
  };

  const [confirmEmailOpen, setConfirmEmailOpen] = React.useState(false);
  // Bumped per attempt so each confirm-email dialog is a fresh mount (cooldown
  // resets — matches Signup's own confirm-email popup).
  const [confirmEmailKey, setConfirmEmailKey] = React.useState(0);
  // ModalLayout's close button can report dismissal twice (own handler + Radix).
  const confirmEmailOpenRef = React.useRef(false);

  const handleConfirmEmailOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (confirmEmailOpenRef.current === nextOpen) return;
      confirmEmailOpenRef.current = nextOpen;
      setConfirmEmailOpen(nextOpen);
      if (!nextOpen) {
        onConfirmEmailClose?.();
      }
    },
    [onConfirmEmailClose],
  );

  const handleLogin = async () => {
    if (isSubmitting) return;

    setAuthError("");

    if (!email.trim() || !password.trim()) {
      reportAuthError("Please enter your email and password.");
      return;
    }

    if (!onSubmit) {
      onLogin?.();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(email.trim(), password);

      // Correct credentials, unverified address: never authenticate — show the
      // "Confirm your email" popup instead of an inline error (BACK-72).
      // Mark the upcoming shell close as non-dismiss so AuthGate keeps the
      // gated intent until confirm-email closes (then abandon, not success).
      if (result?.emailUnverified) {
        onAuthFlowContinue?.();
        onOpenChange?.(false);
        confirmEmailOpenRef.current = false;
        setConfirmEmailKey((key) => key + 1);
        handleConfirmEmailOpenChange(true);
        return;
      }

      if (result?.error) {
        reportAuthError(result.error);
        return;
      }

      // Success before close: AuthGate treats `onOpenChange(false)` as dismiss,
      // which would fire route-guard `onDismiss` and abandon `onLogin`.
      onLogin?.();
      onOpenChange?.(false);
    } catch {
      // A rejection (network down, unexpected 5xx) must still say something —
      // otherwise the button just flips back and the modal sits there silent.
      reportAuthError("Could not log you in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [resetOpen, setResetOpen] = useState(false);
  return (
    <>
      <AuthLayout
        trigger={trigger}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        title={title}
        subtitle={
          <p className="text-base leading-[150%] text-[var(--select-muted-text)]">{subtitle}</p>
        }
        subtitleAfterSocialOnMobile
        onGoogleSignIn={onGoogleSignIn}
        socialErrorMessage={socialErrorMessage}
        className={className}
        footer={
          <div className="flex flex-col gap-4 md:mt-4">
            <p className="text-sm leading-[20px] font-[400] text-[var(--select-muted-text)]">
              You don&apos;t have an account yet
            </p>

            <Buttons
              type="button"
              variant="neutral"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label="Sign up"
              onClick={onSignup}
              className="w-full cursor-pointer"
            />
          </div>
        }
      >
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void handleLogin();
          }}
        >
          <div className="flex flex-col gap-2">
            <TextInput
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (authError) {
                  setAuthError("");
                }
              }}
              status={visibleAuthError ? "error" : "default"}
              className="w-full"
              leftIconSrc="/assets/message-icon.svg"
              placeholder="you@email.com"
            />

            <TextInput
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (authError) {
                  setAuthError("");
                }
              }}
              status={visibleAuthError ? "error" : "default"}
              className="w-full"
              leftIconSrc="/assets/password-icon.svg"
              placeholder="Password"
            />

            {visibleAuthError ? (
              <p className="text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]">
                {visibleAuthError}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              onForgotPassword?.();
              onOpenChange?.(false);
              setResetOpen(true);
            }}
            className="w-fit cursor-pointer text-sm leading-[20px] font-[400] text-[var(--select-muted-text)] underline transition-all hover:text-white"
          >
            Forgot your password?
          </button>

          <Buttons
            type="submit"
            variant="rose"
            size="btn-m"
            label={isSubmitting ? "Logging in..." : "Login"}
            leftIcon={false}
            rightIcon={false}
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault();
              void handleLogin();
            }}
            className="w-full cursor-pointer"
          />
        </form>
      </AuthLayout>
      <ResetPassword
        open={resetOpen}
        onOpenChange={setResetOpen}
        onSendResetLink={onSendResetLink}
        onGoBack={() => setResetOpen(false)}
      />
      <InstructionsSent
        key={`login-confirm-email-${confirmEmailKey}`}
        open={confirmEmailOpen}
        onOpenChange={handleConfirmEmailOpenChange}
        title={CONFIRM_EMAIL_TITLE}
        description={CONFIRM_EMAIL_DESCRIPTION}
        resendLabel={CONFIRM_EMAIL_RESEND_LABEL}
        // Unlike signup/password-reset, opening this dialog doesn't itself
        // send an email (it's just an unverified-login check) — so the
        // button must start enabled (startsGated={false}). A real resend
        // click DOES send one, though, so the default cooldown still gates
        // repeat clicks from there — no more spamming "resend" over and
        // over. The backend still enforces its own resend throttle and
        // surfaces a 429 error inline if abused, independent of this.
        startsGated={false}
        onResend={() => onResendConfirmationEmail?.(email.trim())}
      />
    </>
  );
}
