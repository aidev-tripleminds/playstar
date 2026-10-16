"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { InstallAppPopup } from "@/components/common/general/install-app-popup";
import { GetTokensModalOutOfTokens } from "@/components/common/token-modals/get-tokens-modal";
import type { InstallAppPlatform } from "@/lib/get-install-app-platform";

import { EarnFreeTokensPopup } from "./earn-free-tokens-popup";
import { EarnFreeTokensSuccessPopup } from "./earn-free-tokens-success-popup";
import { RedeemRewardPopup } from "./redeem-reward-popup";
import { scheduleModalHandoff } from "./schedule-modal-handoff";

function NativeNotificationPermissionPrompt({
  open,
  origin = "spicestars.com",
  onAllow,
  onBlock,
}: {
  open: boolean;
  origin?: string;
  onAllow: () => void;
  onBlock: () => void;
}) {
  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="native-notification-prompt-title"
    >
      <div className="w-full max-w-[280px] rounded-[28px] bg-white p-5 text-[#1f1f1f] shadow-2xl">
        <p id="native-notification-prompt-title" className="text-[15px] leading-5 font-medium">
          {origin}
        </p>
        <p className="mt-1 text-[14px] leading-5">wants to send you notifications</p>
        <div className="mt-5 flex justify-end gap-6">
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-[#0b57d0]"
            onClick={onBlock}
          >
            Block
          </button>
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-[#0b57d0]"
            onClick={onAllow}
          >
            Allow
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function useNativePermissionPrompt() {
  const [nativePromptOpen, setNativePromptOpen] = React.useState(false);
  const resolvePermissionRef = React.useRef<((granted: boolean) => void) | undefined>(undefined);

  const requestPermission = React.useCallback(() => {
    return new Promise<boolean>((resolve) => {
      resolvePermissionRef.current = resolve;
      setNativePromptOpen(true);
    });
  }, []);

  const finishNativePrompt = React.useCallback((granted: boolean) => {
    setNativePromptOpen(false);
    resolvePermissionRef.current?.(granted);
    resolvePermissionRef.current = undefined;
  }, []);

  return { nativePromptOpen, requestPermission, finishNativePrompt };
}

/** Storybook: Redeem toggle opens a Google-style prompt; Allow shows success. */
export function NativeNotificationPromptPreview() {
  const { nativePromptOpen, requestPermission, finishNativePrompt } = useNativePermissionPrompt();
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [redeemOpen, setRedeemOpen] = React.useState(true);

  return (
    <>
      <RedeemRewardPopup
        open={redeemOpen}
        onOpenChange={setRedeemOpen}
        defaultNotificationsEnabled={false}
        requestPermission={requestPermission}
        onNotificationsGranted={() => {
          setRedeemOpen(false);
          scheduleModalHandoff(() => {
            setSuccessOpen(true);
          });
        }}
        onRedeem={() => {
          setRedeemOpen(false);
          scheduleModalHandoff(() => {
            setSuccessOpen(true);
          });
        }}
      />
      <NativeNotificationPermissionPrompt
        open={nativePromptOpen}
        onAllow={() => finishNativePrompt(true)}
        onBlock={() => finishNativePrompt(false)}
      />
      <EarnFreeTokensSuccessPopup open={successOpen} onOpenChange={setSuccessOpen} />
    </>
  );
}

/** Storybook: out of tokens → offer → OS /app modal → redeem → native prompt → success. */
export function EarnFreeTokensFlowPreview({ platform }: { platform: InstallAppPlatform }) {
  const [outOfTokensOpen, setOutOfTokensOpen] = React.useState(true);
  const [offerOpen, setOfferOpen] = React.useState(false);
  const [installAppOpen, setInstallAppOpen] = React.useState(false);
  const [redeemOpen, setRedeemOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const { nativePromptOpen, requestPermission, finishNativePrompt } = useNativePermissionPrompt();

  return (
    <>
      <GetTokensModalOutOfTokens
        open={outOfTokensOpen}
        onOpenChange={setOutOfTokensOpen}
        onGetFreeTokens={() => {
          setOutOfTokensOpen(false);
          scheduleModalHandoff(() => {
            setOfferOpen(true);
          });
        }}
      />
      <EarnFreeTokensPopup
        open={offerOpen}
        onOpenChange={setOfferOpen}
        onGetTheApp={() => {
          setOfferOpen(false);
          scheduleModalHandoff(() => {
            setInstallAppOpen(true);
          });
        }}
      />
      <InstallAppPopup
        open={installAppOpen}
        platform={platform}
        onOpenChange={setInstallAppOpen}
        onOkay={() => {
          setInstallAppOpen(false);
          scheduleModalHandoff(() => {
            setRedeemOpen(true);
          });
        }}
      />
      <RedeemRewardPopup
        open={redeemOpen}
        onOpenChange={setRedeemOpen}
        notificationsEnabled={notificationsEnabled}
        onNotificationsEnabledChange={setNotificationsEnabled}
        requestPermission={requestPermission}
        onNotificationsGranted={() => {
          setRedeemOpen(false);
          scheduleModalHandoff(() => {
            setSuccessOpen(true);
          });
        }}
        onRedeem={() => {
          setRedeemOpen(false);
          scheduleModalHandoff(() => {
            setSuccessOpen(true);
          });
        }}
      />
      <NativeNotificationPermissionPrompt
        open={nativePromptOpen}
        onAllow={() => finishNativePrompt(true)}
        onBlock={() => finishNativePrompt(false)}
      />
      <EarnFreeTokensSuccessPopup open={successOpen} onOpenChange={setSuccessOpen} />
    </>
  );
}
