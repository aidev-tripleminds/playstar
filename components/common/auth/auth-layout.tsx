"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Handle } from "@/components/common/general/handle/handle";
import {
  MODAL_LAYOUT_MOBILE_CLASSNAME,
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
} from "@/components/common/general/modal-layout/modal-layout.constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  useResponsiveModalMode,
} from "@/components/ui/dialog";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import { Close } from "../general/close/close";
import { Divider } from "../general/divider/divider";

export const AUTH_SIGNUP_BANNER_ASSET_KEY = "banner_signup";

const AUTH_LAYOUT_MOBILE_CHROME_CLASSNAME =
  "border-surface-strong bg-dialog-bg w-full gap-4 rounded-[28px]! border";

export type AuthLayoutProps = {
  trigger?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  title: string;
  subtitle: React.ReactNode;

  /** Form fields and primary CTA unique to login/signup */
  children: React.ReactNode;

  /**
   * Legal copy (terms) rendered after the perk list on mobile, and after the
   * form on desktop.
   */
  legal?: React.ReactNode;
  /**
   * Switch-to-the-other-auth-mode CTA. On mobile this sits below a divider
   * after perks (and legal); desktop keeps it in the left column.
   */
  footer?: React.ReactNode;

  /** Optional perk list (signup). Shown on mobile and in the desktop side panel. */
  perkList?: React.ReactNode;

  /**
   * On the mobile sheet, render `subtitle` after the Google / X row (and the
   * "OR CONTINUE WITH EMAIL" divider). Login uses this so "Access your account"
   * sits with the email fields, matching Figma; signup keeps the token pitch
   * under the title. Desktop always groups title + subtitle above social.
   */
  subtitleAfterSocialOnMobile?: boolean;

  /**
   * "Continue with Google". Resolve to an error message to show under the
   * social buttons, or null when the browser is on its way to Google — the
   * button then stays disabled, because on success this page is being
   * navigated away from and re-enabling it would only invite a second click
   * during the redirect. Omitted (Storybook, the presentational tests) leaves
   * the button inert, exactly as it was before it was wired.
   */
  onGoogleSignIn?: () => Promise<string | null> | void;
  socialErrorMessage?: string | null;

  className?: string;
  /** Overrides for the two-column panel (e.g. height) */
  panelClassName?: string;
};

type AuthLayoutBodyProps = Omit<
  AuthLayoutProps,
  "trigger" | "open" | "defaultOpen" | "onOpenChange"
>;

export function AuthLayout({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  ...contentProps
}: AuthLayoutProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <AuthLayoutBody {...contentProps} />
    </Dialog>
  );
}

function AuthLayoutBody({
  title,
  subtitle,
  children,
  legal,
  footer,
  perkList,
  subtitleAfterSocialOnMobile = false,
  onGoogleSignIn,
  socialErrorMessage,
  className,
  panelClassName,
}: AuthLayoutBodyProps) {
  const isDrawer = useResponsiveModalMode() === "drawer";
  const signupBannerImageSrc = useAssetImage(AUTH_SIGNUP_BANNER_ASSET_KEY);
  const [socialError, setSocialError] = React.useState("");
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const handleGoogleSignIn = async () => {
    if (!onGoogleSignIn) return;

    setSocialError("");
    setIsRedirecting(true);
    try {
      const error = await onGoogleSignIn();
      if (!error) return;
      setSocialError(error);
      setIsRedirecting(false);
    } catch {
      setSocialError("Could not continue with Google right now. Please try again.");
      setIsRedirecting(false);
    }
  };

  const socialSection = (
    <>
      <div className="flex gap-2">
        {onGoogleSignIn && (
          <Buttons
            variant="light-grey"
            className="w-1/2 cursor-pointer"
            size="btn-m"
            label="Google"
            leftIconSrc="/assets/google-icon.svg"
            rightIcon={false}
            disabled={isRedirecting}
            onClick={handleGoogleSignIn}
          />
        )}

        <Buttons
          variant="neutral-border"
          className={cn(
            "cursor-pointer border-[var(--select-trigger-focus-border)] bg-[var(--dialog-bg)]",
            onGoogleSignIn ? "w-1/2" : "w-full",
          )}
          size="btn-m"
          label="X.com"
          leftIconSrc="/assets/x-icon.svg"
          rightIcon={false}
        />
      </div>

      {(socialError || socialErrorMessage) && (
        <p
          className={cn(
            "text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]",
            isDrawer ? null : "mt-2",
          )}
        >
          {socialError || socialErrorMessage}
        </p>
      )}

      <div className={cn("relative", isDrawer ? null : "my-4")}>
        <Divider className="w-full" label="OR CONTINUE WITH EMAIL" />
      </div>
    </>
  );

  return (
    <DialogContent
      overlayClassName={
        isDrawer
          ? MODAL_LAYOUT_OVERLAY_CLASSNAME
          : "md:bg-black/20 md:supports-backdrop-filter:backdrop-blur-lg"
      }
      showCloseButton={false}
      onOpenAutoFocus={(event) => event.preventDefault()}
      className={cn(
        "scrollbar-hidden z-[999] overflow-auto",
        isDrawer
          ? [AUTH_LAYOUT_MOBILE_CHROME_CLASSNAME, MODAL_LAYOUT_MOBILE_CLASSNAME]
          : [
              "mb-0! border-0 border-transparent bg-transparent p-0 shadow-none ring-0",
              "w-full min-w-full sm:w-full sm:max-w-[800px] md:min-w-[720px] lg:min-w-[800px]",
              "top-1/2 bottom-auto md:-translate-y-1/2",
              "rounded-[0px]! md:max-h-[90vh] md:overflow-hidden",
            ],
        className,
      )}
    >
      {isDrawer ? (
        <>
          <div
            className="flex! h-auto! w-full! justify-center bg-transparent! opacity-100!"
            data-vaul-handle=""
          >
            <Handle className="mx-auto" />
          </div>

          <div className="flex items-center gap-2">
            <DialogTitle className="text-select-text flex-1 text-left text-[18px]! leading-7 font-medium">
              {title}
            </DialogTitle>
            <DialogClose asChild className="cursor-pointer">
              <Close aria-label="Close" />
            </DialogClose>
          </div>

          {subtitleAfterSocialOnMobile ? (
            <>
              {socialSection}
              {subtitle}
            </>
          ) : (
            <>
              {subtitle}
              {socialSection}
            </>
          )}
          {children}
          {perkList}
          {legal}
          {footer}
        </>
      ) : (
        <div
          className={cn(
            "relative overflow-auto md:overflow-hidden",
            "bg-[image:var(--background-neutral-gradient)]",
            "border-white/10 md:border",
            "rounded-0! md:rounded-[28px] lg:rounded-[28px]",
            "flex flex-col md:flex-row",
            "w-full",
            "md:h-[566px] md:max-h-[90vh] md:min-h-0",
            "md:w-[800px]",
            panelClassName,
          )}
        >
          <div
            className={cn(
              "relative z-10 flex w-full flex-col",
              "scrollbar-hidden md:w-[52%] md:overflow-y-auto",
              "p-4 md:p-[40px]",
            )}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <DialogTitle
                  className={cn(
                    "font-bold text-[var(--select-text)]",
                    "text-[20px] leading-[140%]",
                    "md:text-[24px] md:leading-[133.333%]",
                  )}
                >
                  {title}
                </DialogTitle>
                {subtitle}
              </div>
            </div>

            {socialSection}
            {children}
            {legal}
            {footer}
          </div>

          <div className="relative hidden p-[40px] md:block md:w-[48%]">
            <DialogClose asChild className="absolute top-4 right-4 z-[1] cursor-pointer">
              <Close aria-label="Close" />
            </DialogClose>

            {signupBannerImageSrc ? (
              <Image
                src={signupBannerImageSrc}
                alt="Signup promotion"
                fill
                className="object-cover"
              />
            ) : null}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_50%,#000_100%)]" />

            <div className="relative flex h-full">
              <div className="absolute right-0 bottom-0 left-0">
                <div className="mb-6 flex items-center justify-center gap-2">
                  <Image src="/assets/logo-spicestars.svg" width={146} height={29} alt="Logo" />
                </div>

                {perkList ? <div className="space-y-3">{perkList}</div> : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
