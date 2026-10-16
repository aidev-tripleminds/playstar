"use client";

import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { Toggle } from "@/components/common/general/toggle/toggle";
import { cn } from "@/lib/utils";

import {
  EARN_FREE_TOKENS_CLOSE_CLASS,
  EARN_FREE_TOKENS_MODAL_CLASS,
  REDEEM_REWARD_BADGE_ICON,
  REDEEM_REWARD_BADGE_TEXT,
  REDEEM_REWARD_CTA_LABEL,
  REDEEM_REWARD_IMAGE_ALT,
  REDEEM_REWARD_IMAGE_SRC,
  REDEEM_REWARD_TITLE,
  REDEEM_REWARD_TITLE_ICON,
  REDEEM_REWARD_TOGGLE_HINT,
  REDEEM_REWARD_TOGGLE_LABEL,
} from "./earn-free-tokens.constants";
import {
  hasPushNotificationPermission,
  requestPushNotificationPermission,
} from "./request-push-notification-permission";

export type RedeemRewardPopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  notificationsEnabled?: boolean;
  defaultNotificationsEnabled?: boolean;
  onNotificationsEnabledChange?: (enabled: boolean) => void;
  /** Override native permission (Storybook / tests). */
  requestPermission?: () => Promise<boolean>;
  redeemLabel?: string;
  badgeText?: string;
  onRedeem?: () => void;
  /** Fired after the native prompt (or in-app toggle) grants notification access. */
  onNotificationsGranted?: () => void;
  onClose?: () => void;
  className?: string;
};

/** Figma 21867-139513 — in-app redeem after install (toggle off / on). */
export function RedeemRewardPopup({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = REDEEM_REWARD_TITLE,
  titleIconSrc = REDEEM_REWARD_TITLE_ICON,
  imageSrc = REDEEM_REWARD_IMAGE_SRC,
  imageAlt = REDEEM_REWARD_IMAGE_ALT,
  notificationsEnabled: notificationsEnabledProp,
  defaultNotificationsEnabled,
  onNotificationsEnabledChange,
  requestPermission = requestPushNotificationPermission,
  redeemLabel = REDEEM_REWARD_CTA_LABEL,
  badgeText = REDEEM_REWARD_BADGE_TEXT,
  onRedeem,
  onNotificationsGranted,
  onClose,
  className,
}: RedeemRewardPopupProps) {
  const isControlled = notificationsEnabledProp !== undefined;
  const [internalEnabled, setInternalEnabled] = React.useState(
    () => defaultNotificationsEnabled ?? hasPushNotificationPermission(),
  );
  const [permissionPending, setPermissionPending] = React.useState(false);

  const enabled = isControlled ? notificationsEnabledProp : internalEnabled;

  const setEnabled = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalEnabled(next);
      }
      onNotificationsEnabledChange?.(next);
    },
    [isControlled, onNotificationsEnabledChange],
  );

  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleToggle = async (next: boolean) => {
    if (!next) {
      setEnabled(false);
      return;
    }

    setPermissionPending(true);
    const granted = await requestPermission();
    setPermissionPending(false);

    if (!granted) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    onNotificationsGranted?.();
  };

  const handleRedeem = () => {
    if (!enabled) {
      return;
    }
    onRedeem?.();
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel="Close"
      closeClassName={EARN_FREE_TOKENS_CLOSE_CLASS}
      onClose={handleClose}
      className={cn(EARN_FREE_TOKENS_MODAL_CLASS, className)}
    >
      <div className="flex flex-col gap-4" data-slot="redeem-reward-popup">
        <div className="relative h-[180px] w-full overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 390px) 100vw, 390px"
            priority
          />
        </div>

        <div className="flex items-center">
          <div className="flex min-w-0 flex-1 flex-col justify-center pr-3">
            <p className="text-select-text text-sm leading-5 font-medium">
              {REDEEM_REWARD_TOGGLE_LABEL}
            </p>
            <p className="text-muted-strong text-sm leading-5 font-normal text-[#a3a3a3]">
              {REDEEM_REWARD_TOGGLE_HINT}
            </p>
          </div>
          <Toggle
            checked={enabled}
            disabled={permissionPending}
            aria-label={REDEEM_REWARD_TOGGLE_LABEL}
            onCheckedChange={(next) => {
              void handleToggle(next);
            }}
          />
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={redeemLabel}
          disabled={!enabled}
          onClick={handleRedeem}
          className="w-full cursor-pointer"
        >
          <Badge
            type="empty"
            size="large"
            text={badgeText}
            showIcon
            iconSrc={REDEEM_REWARD_BADGE_ICON}
          />
        </Buttons>
      </div>
    </ModalLayout>
  );
}
