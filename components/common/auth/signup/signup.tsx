"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { validatePassword } from "@/lib/auth/password-policy";
import { checkAndRememberPendingSignup, forgetPendingSignup } from "@/lib/auth/pending-signups";
import { cn } from "@/lib/utils";

import { TextInput } from "../../general/text-input/text-input";
import { PerkList } from "../../membership/perk-list/perk-list";
import { AuthLayout } from "../auth-layout";
import {
  CONFIRM_EMAIL_DESCRIPTION,
  CONFIRM_EMAIL_RESEND_LABEL,
  CONFIRM_EMAIL_TITLE,
} from "../confirm-email-copy";
import { InstructionsSent } from "../instructions-sent/instructions-sent";

/**
 * What the register call reports back (BACK-53). Registering with credentials
 * that already match an account signs the user in instead of failing, and the
 * modal has to tell the two apart: only a brand-new account gets the
 * confirm-email popup.
 */
export type SignupSubmitResult = {
  /** Message to show inline. Absent or null when the call succeeded. */
  error?: string | null;
  /** True when an existing account was signed into rather than created. */
  autoLoggedIn?: boolean;
  /**
   * True when the address belongs to an existing account that has never
   * confirmed its email. Routes into the confirm-email popup (resend, no
   * Okay) instead of `error`, same as a session-detected repeat Join.
   */
  emailUnverified?: boolean;
};

export type SignupProps = {
  trigger?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: string;
  subtitle?: string;
  imageIcon?: string;

  signupTokens?: number | string;
  secondPerkText?: string;
  thirdPerkText?: string;

  /**
   * Submit the registration for real. Resolve with an error message to show,
   * or without one on success — the modal then closes and, for a newly created
   * account, the confirm-email popup opens.
   */
  onSubmit?: (email: string, password: string) => Promise<SignupSubmitResult>;
  /**
   * Fired when the user is actually authenticated from this modal — today that
   * is only the auto-login path (existing verified account). Confirm-email
   * close is not auth success; use `onConfirmEmailClose` for that. Email
   * preferences and personalization open after the verification link.
   */
  onSignup?: () => void;
  /**
   * Fired when a new account was created, immediately before the signup shell
   * closes for confirm-email. AuthGate uses this so that close is not
   * treated as dismiss (which would clear gated onSuccess / fire onDismiss).
   */
  onRegistrationContinue?: () => void;
  /**
   * Fired when the post-signup confirm-email popup closes. The user is still
   * unverified — AuthGate treats this as abandoning the gated action.
   */
  onConfirmEmailClose?: () => void;
  onLogin?: () => void;
  onForgotPassword?: () => void;
  /**
   * Re-send the confirmation email from the post-Join "Confirm your email"
   * popup. Better Auth already re-sends on a Join submitted for an existing,
   * still-unverified address (matching password or not — it cannot tell the
   * two apart, same as the initial submit itself), so this is safe to wire
   * for every Join outcome, not just genuinely new accounts. Resolve to an
   * error message to show inline, or null on success.
   */
  onResendConfirmationEmail?: (email: string) => Promise<string | null> | void;
  /**
   * "Continue with Google" — see {@link AuthLayout}, which owns the button's
   * pending/error state. Resolve to an error message, or null when the browser
   * is leaving for Google. Note this bypasses the whole confirm-email chain
   * below: a Google address arrives verified, so there is nothing to confirm.
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

export function Signup({
  trigger,
  open,
  defaultOpen,
  onOpenChange,

  title = "Create your account",

  subtitle,
  imageIcon = "/assets/spice-coin.png",

  signupTokens = "XX",
  secondPerkText = "Unlimited free chat",
  thirdPerkText = "Unlimited free content",
  onSubmit,
  onSignup,
  onRegistrationContinue,
  onConfirmEmailClose,
  onLogin,
  onResendConfirmationEmail,
  onGoogleSignIn,
  socialErrorMessage,

  email: emailProp,
  password: passwordProp,
  onEmailChange,
  onPasswordChange,

  className,
}: SignupProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
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
  const [confirmEmailOpen, setConfirmEmailOpen] = React.useState(false);
  // Bumped per successful registration so each confirm-email dialog is a fresh
  // mount (cooldown resets; Radix/jsdom cannot get stuck on a prior close).
  const [confirmEmailKey, setConfirmEmailKey] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Confirm-email close must fire once per dialog, and ModalLayout's close
  // button reports the dismissal twice (its own handler plus Radix's DialogClose).
  const confirmEmailOpenRef = React.useRef(false);
  // Whether the CURRENT confirm-email popup is for a Join that sent no email
  // (an address already known to be registered and unverified) — see the
  // comment where it's set.
  const [confirmEmailIsRepeat, setConfirmEmailIsRepeat] = React.useState(false);

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

  const resolvedOpen = isControlled ? Boolean(open) : uncontrolledOpen;
  const showPasswordField = email.trim().length > 0;

  const setSignupOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

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

  const handleSignup = async () => {
    if (isSubmitting) return;

    setAuthError("");

    if (!email.trim()) {
      reportAuthError("Please enter your email.");
      return;
    }

    // Length is checked here so the too-short/too-long cases never cost a round
    // trip; the backend enforces the same bounds regardless.
    const passwordError = validatePassword(password);
    if (passwordError) {
      reportAuthError(passwordError);
      return;
    }

    // The button must stay disabled for the whole registration. Releasing it too
    // early would leave an enabled "Join for Free" on a still-open modal for an
    // account that already exists — a second click then re-registers and strands
    // the user on a "that email is taken" error.
    setIsSubmitting(true);
    try {
      let autoLoggedIn = false;
      let emailUnverified = false;
      if (onSubmit) {
        let result: SignupSubmitResult;
        try {
          result = await onSubmit(email.trim(), password);
        } catch {
          // A rejection (network down, unexpected 5xx) must still say something —
          // otherwise the button just flips back and the modal sits there silent.
          reportAuthError("Could not create your account right now. Please try again.");
          return;
        }

        if (result?.error) {
          reportAuthError(result.error);
          return;
        }
        autoLoggedIn = Boolean(result?.autoLoggedIn);
        emailUnverified = Boolean(result?.emailUnverified);
      }

      // BACK-53: the credentials matched an existing account, so this was a
      // login, not a registration. That user already verified their email —
      // re-asking them to confirm it would look like their account had been
      // reset. Finish here instead.
      //
      // Success before close: AuthGate treats `onOpenChange(false)` as dismiss,
      // which would fire route-guard `onDismiss` and abandon `onSignup`.
      if (autoLoggedIn) {
        // Signing in proves the address is verified (the login gate refuses
        // otherwise), so any stale "pending" record for it is wrong.
        forgetPendingSignup(email.trim());
        onSignup?.();
        setSignupOpen(false);
        return;
      }

      // New accounts: show confirm-email. Closing that popup is abandon, not
      // auth success — see `onConfirmEmailClose`. Mark the upcoming shell
      // close as non-dismiss so AuthGate keeps the gated intent until then.
      onRegistrationContinue?.();
      setSignupOpen(false);

      // Clear any prior-cycle ref so a second registration on this same mounted
      // Signup (sign up → dismiss → sign up again) can open confirm-email again.
      confirmEmailOpenRef.current = false;
      setConfirmEmailKey((key) => key + 1);
      const submittedEmail = email.trim();
      // Two ways to know this Join sent nothing:
      //  - `emailUnverified`: the backend said so outright (the auto-login
      //    retry hit EMAIL_NOT_VERIFIED — only reachable when the password
      //    matches an existing unconfirmed account).
      //  - the browser already submitted a Join for the same address. The
      //    plain duplicate-signup response is a fake 200 (no account
      //    touched, no email sent) that no client can tell from a real one,
      //    so this local record is the only signal there is.
      // Either way Okay would claim an email is on its way when none is.
      const wasAlreadyPending = checkAndRememberPendingSignup(submittedEmail);
      setConfirmEmailIsRepeat(emailUnverified || wasAlreadyPending);
      handleConfirmEmailOpenChange(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const perkList = (
    <PerkList
      variant="signup"
      line="one"
      secondPerkText={secondPerkText}
      thirdPerkText={thirdPerkText}
    />
  );

  return (
    <>
      <AuthLayout
        trigger={trigger}
        open={resolvedOpen}
        onOpenChange={setSignupOpen}
        title={title}
        subtitle={
          <p className="flex items-center gap-1 [background-image:var(--button-token-gradient)] bg-clip-text text-base font-[500] text-transparent md:mt-1">
            {subtitle ?? `Register to earn ${signupTokens} tokens`}
            <Image src={imageIcon} width={16} height={16} alt="imageIcon" />
          </p>
        }
        perkList={perkList}
        onGoogleSignIn={onGoogleSignIn}
        socialErrorMessage={socialErrorMessage}
        className={className}
        legal={
          <p className="text-xs leading-[133.333%] font-[400] text-[var(--gray-text)] md:mt-2 md:mb-4">
            By signing up, you agree to our{" "}
            <Link href="/" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/">
              Privacy Policy
            </Link>
          </p>
        }
        footer={
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-[142.857%] text-[var(--select-muted-text)]">
              Already have an account?
            </p>

            <Buttons
              type="button"
              variant="neutral"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label="Login"
              onClick={onLogin}
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
            void handleSignup();
          }}
        >
          <div className="flex flex-col">
            <TextInput
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (authError) setAuthError("");
              }}
              status={visibleAuthError ? "error" : "default"}
              className="w-full"
              leftIconSrc="/assets/message-icon.svg"
              placeholder="you@email.com"
            />

            <div
              className={cn(
                "grid min-h-0 overflow-hidden transition-all duration-300 ease-out",
                showPasswordField
                  ? "mt-2 grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <TextInput
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  status={visibleAuthError ? "error" : "default"}
                  className="w-full"
                  leftIconSrc="/assets/password-icon.svg"
                  placeholder="Password"
                />
              </div>
            </div>

            {visibleAuthError ? (
              <p className="mt-2 text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]">
                {visibleAuthError}
              </p>
            ) : null}
          </div>

          <Buttons
            type="submit"
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon
            rightIconSrc="/assets/spice-coin.png"
            rightIconSizeClassName="h-[14px] w-[14px]"
            label={isSubmitting ? "Creating account..." : `Join for Free +${signupTokens}`}
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault();
              void handleSignup();
            }}
            className="w-full cursor-pointer"
          />
        </form>
      </AuthLayout>

      <InstructionsSent
        key={`confirm-email-${confirmEmailKey}`}
        open={confirmEmailOpen}
        onOpenChange={handleConfirmEmailOpenChange}
        title={CONFIRM_EMAIL_TITLE}
        description={CONFIRM_EMAIL_DESCRIPTION}
        // Exactly one action, chosen by which case this is:
        //  - A genuinely new account (`confirmEmailIsRepeat` false): the
        //    signup call already sent the confirmation email, so there is
        //    nothing to re-request — only acknowledge, Okay alone.
        //  - A repeat Join on an address already known to be unverified
        //    (either the backend told us so on this very call, or we saw the
        //    same address earlier this session): Okay would suggest a fresh
        //    acknowledgement is enough when nothing new happened — Resend
        //    alone, disabled for the cooldown after the first click.
        showOkayButton={!confirmEmailIsRepeat}
        showResendButton={confirmEmailIsRepeat}
        resendLabel={CONFIRM_EMAIL_RESEND_LABEL}
        // See confirm-email-copy.ts: neither this dialog nor Login's can
        // assume an email just went out when it opens, so both start
        // ungated — the backend's own per-address throttle still applies.
        startsGated={false}
        onResend={() => onResendConfirmationEmail?.(email.trim())}
      />
    </>
  );
}
