"use client";

import * as React from "react";

import { type AuthModalKind, AuthModals } from "@/components/common/auth/auth-modals";
import { useMe } from "@/hooks/use-me";
import { ACCOUNT_PENDING_DELETION_CODE, pendingDeletionMessage } from "@/lib/auth/pending-deletion";

type PendingAuthIntent = {
  onSuccess?: () => void;
  onDismiss?: () => void;
};

export type RequireAuthOptions = {
  /** Runs after a successful login/signup from this gate (not on dismiss). */
  onSuccess?: () => void;
  /**
   * Runs when the user closes Login/Signup without authenticating.
   * Route guards use this to leave protected URLs; click handlers usually omit it.
   */
  onDismiss?: () => void;
  /** Which modal to open when auth is required. Defaults to login. */
  preferModal?: Exclude<AuthModalKind, null>;
  /** Explicit in-app destination for a signup verification email. */
  verifyEmailReturnTo?: string;
};

export type AuthGateContextValue = {
  /**
   * Returns `true` when the caller may proceed immediately.
   * Returns `false` when the session is still resolving, or when Login was
   * opened and the caller must wait for `onSuccess`.
   */
  requireAuth: (options?: RequireAuthOptions) => boolean;
  isLoggedIn: boolean;
  isSessionPending: boolean;
  /** Ephemeral page default for layout-owned signup entry points. */
  registerPageReturnTo?: (destination: string) => () => void;
};

const AuthGateContext = React.createContext<AuthGateContextValue | null>(null);

export type AuthGateProviderProps = {
  children: React.ReactNode;
  signupTokens?: number | string;
  /**
   * Rendered on the funnel (funnel-page task 5 / D21). Forwarded to `AuthModals`
   * so a signup/resend started from the bar mails a verify link that returns to
   * the wizard rather than to Explore.
   */
  isFunnel?: boolean;
};

function mergePendingIntent(
  previous: PendingAuthIntent | null,
  options: RequireAuthOptions,
): PendingAuthIntent {
  return {
    // Later callers may only supply onSuccess (nav clicks); keep a route-guard
    // onDismiss so dismissing Login still leaves protected URLs.
    onSuccess: options.onSuccess ?? previous?.onSuccess,
    onDismiss: options.onDismiss ?? previous?.onDismiss,
  };
}

/**
 * Layout-owned auth gate: one Login/Signup modal + one pending resume/dismiss intent.
 * Click handlers and route guards share this instead of each mounting AuthModals.
 */
export function AuthGateProvider({
  children,
  signupTokens = 30,
  isFunnel = false,
}: AuthGateProviderProps) {
  const { isLoggedIn, isSessionPending } = useMe();
  const [modal, setModal] = React.useState<AuthModalKind>(null);
  const [verifyEmailReturnTo, setVerifyEmailReturnTo] = React.useState<string>();
  const [socialErrorMessage, setSocialErrorMessage] = React.useState<string | null>(null);
  const pageReturnTo = React.useRef<{ destination: string; pathname: string } | null>(null);
  const registerPageReturnTo = React.useCallback((destination: string) => {
    const registration = { destination, pathname: window.location.pathname };
    pageReturnTo.current = registration;
    return () => {
      if (pageReturnTo.current === registration) pageReturnTo.current = null;
    };
  }, []);
  const pendingIntentRef = React.useRef<PendingAuthIntent | null>(null);
  const preferModalRef = React.useRef<Exclude<AuthModalKind, null>>("login");
  /** True when requireAuth ran during session settle and should resume after. */
  const awaitingSessionRef = React.useRef(false);
  /**
   * Login/Signup close their shell before confirm-email finishes. That close must
   * not count as dismiss (which would clear onSuccess and run route-guard onDismiss).
   */
  const suppressNextDismissRef = React.useRef(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")?.toUpperCase() !== ACCOUNT_PENDING_DELETION_CODE) return;

    const message = pendingDeletionMessage(params.get("restorableUntil"));
    const showPendingError = window.setTimeout(() => {
      setSocialErrorMessage(message);
      setModal("login");
      params.delete("error");
      params.delete("error_description");
      params.delete("restorableUntil");
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      );
    }, 0);
    return () => window.clearTimeout(showPendingError);
  }, []);

  const requireAuth = React.useCallback(
    (options: RequireAuthOptions = {}): boolean => {
      const isNewIntent = pendingIntentRef.current === null;
      pendingIntentRef.current = mergePendingIntent(pendingIntentRef.current, options);
      if (options.verifyEmailReturnTo !== undefined) {
        setVerifyEmailReturnTo(options.verifyEmailReturnTo);
      } else if (isNewIntent) {
        setVerifyEmailReturnTo(
          pageReturnTo.current?.pathname === window.location.pathname
            ? pageReturnTo.current.destination
            : undefined,
        );
      }
      if (options.preferModal) {
        preferModalRef.current = options.preferModal;
      }

      // Hydration / Better Auth settle — never flash Login for a logged-in user.
      // Stash the intent and resume once the session resolves.
      if (isSessionPending) {
        awaitingSessionRef.current = true;
        return false;
      }

      if (isLoggedIn) {
        awaitingSessionRef.current = false;
        // Caller proceeds synchronously; drop any stashed resume callbacks.
        pendingIntentRef.current = null;
        setVerifyEmailReturnTo(undefined);
        return true;
      }

      awaitingSessionRef.current = false;
      setModal(preferModalRef.current);
      return false;
    },
    [isLoggedIn, isSessionPending],
  );

  React.useEffect(() => {
    if (isSessionPending || !awaitingSessionRef.current) {
      return;
    }

    awaitingSessionRef.current = false;

    if (isLoggedIn) {
      const resume = pendingIntentRef.current?.onSuccess;
      pendingIntentRef.current = null;
      resume?.();
      return;
    }

    setModal(preferModalRef.current);
  }, [isLoggedIn, isSessionPending]);

  const handleModalChange = React.useCallback((next: AuthModalKind) => {
    // The OAuth callback warning belongs only to the modal opened for that
    // callback. Dismissal or an explicit login↔signup transition starts a new
    // authentication attempt and must not carry the previous account's state.
    setSocialErrorMessage(null);
    // Dismiss (null) abandons the gated action; login↔signup keeps the intent.
    if (!next) {
      if (suppressNextDismissRef.current) {
        suppressNextDismissRef.current = false;
        setModal(null);
        return;
      }

      const onDismiss = pendingIntentRef.current?.onDismiss;
      pendingIntentRef.current = null;
      setVerifyEmailReturnTo(undefined);
      // Route-guard dismiss may navigate away — run it before tearing down the
      // modal so leave logic sees a still-open history entry (same order as
      // password-changed / reset-password).
      onDismiss?.();
      setModal(null);
      return;
    }
    setModal(next);
  }, []);

  const handleAuthSuccess = React.useCallback(() => {
    suppressNextDismissRef.current = false;
    const resume = pendingIntentRef.current?.onSuccess;
    pendingIntentRef.current = null;
    setVerifyEmailReturnTo(undefined);
    setModal(null);
    resume?.();
  }, []);

  const handleAuthFlowContinue = React.useCallback(() => {
    // Confirm-email still needs to run outside the login/signup shell.
    // The upcoming onOpenChange(false) must keep the pending gated intent.
    suppressNextDismissRef.current = true;
  }, []);

  const handleAuthFlowAbandon = React.useCallback(() => {
    // Confirm-email closed without a session — same outcome as dismissing Login.
    suppressNextDismissRef.current = false;
    const onDismiss = pendingIntentRef.current?.onDismiss;
    pendingIntentRef.current = null;
    setVerifyEmailReturnTo(undefined);
    onDismiss?.();
    setModal(null);
  }, []);

  const value = React.useMemo(
    () => ({
      requireAuth,
      registerPageReturnTo,
      isLoggedIn,
      isSessionPending,
    }),
    [requireAuth, registerPageReturnTo, isLoggedIn, isSessionPending],
  );

  return (
    <AuthGateContext.Provider value={value}>
      {children}
      <AuthModals
        modal={modal}
        onModalChange={handleModalChange}
        onAuthSuccess={handleAuthSuccess}
        onAuthFlowContinue={handleAuthFlowContinue}
        onAuthFlowAbandon={handleAuthFlowAbandon}
        signupTokens={signupTokens}
        isFunnel={isFunnel}
        verifyEmailReturnTo={verifyEmailReturnTo}
        socialErrorMessage={socialErrorMessage}
      />
    </AuthGateContext.Provider>
  );
}

const STORY_AND_TEST_FALLBACK: AuthGateContextValue = {
  // Isolated Storybook / unit mounts are not behind the layout provider.
  // Production always mounts AuthGateProvider from MainLayoutShell.
  requireAuth: () => true,
  isLoggedIn: true,
  isSessionPending: false,
};

/**
 * Storybook / isolated mounts that are not behind `MainLayoutShell`.
 * Static Storybook builds run with `NODE_ENV=production`, so the hook fallback
 * below does not apply — wrap preview with this instead of `AuthGateProvider`
 * (that one also mounts login/signup modals).
 */
export function IsolatedAuthGateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthGateContext.Provider value={STORY_AND_TEST_FALLBACK}>{children}</AuthGateContext.Provider>
  );
}

export function useAuthGate(): AuthGateContextValue {
  const ctx = React.useContext(AuthGateContext);
  if (!ctx) {
    if (process.env.NODE_ENV !== "production") {
      return STORY_AND_TEST_FALLBACK;
    }
    throw new Error("useAuthGate must be used within AuthGateProvider");
  }
  return ctx;
}
