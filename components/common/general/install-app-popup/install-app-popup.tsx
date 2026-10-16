"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { getInstallAppPlatform, type InstallAppPlatform } from "@/lib/get-install-app-platform";
import { cn } from "@/lib/utils";

import {
  INSTALL_APP_ANDROID_IMAGE_ASSET_KEY,
  INSTALL_APP_CTA_LABEL,
  INSTALL_APP_IOS_IMAGE_ASSET_KEY,
  INSTALL_APP_PLATFORM_CONTENT,
} from "./install-app-popup.constants";

export type InstallAppPopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Force platform content (useful for Storybook / tests). */
  platform?: InstallAppPlatform;
  ctaLabel?: string;
  onOkay?: () => void;
  onClose?: () => void;
  className?: string;
};

function InstallInstructionStep({ platform }: { platform: InstallAppPlatform }) {
  if (platform === "ios") {
    return (
      <p className="text-select-text flex flex-wrap items-center justify-center gap-1 text-sm leading-5 font-medium">
        <span>Tap</span>
        <Image
          src="/assets/ios-share.svg"
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0 object-contain"
        />
        <span>button → Tap “Add to Home Screen”</span>
        <Image
          src="/assets/add-square-install.svg"
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0 object-contain"
        />
      </p>
    );
  }

  return (
    <p className="text-select-text flex flex-wrap items-center justify-center gap-1 text-sm leading-5 font-medium">
      <span>Tap</span>
      <Image
        src="/assets/ellipsis-v.svg"
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0 object-contain"
      />
      <span>button → Tap “Install and create shortcut”</span>
    </p>
  );
}

export function InstallAppPopup({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  platform: platformProp,
  ctaLabel = INSTALL_APP_CTA_LABEL,
  onOkay,
  onClose,
  className,
}: InstallAppPopupProps) {
  const [detectedPlatform] = React.useState<InstallAppPlatform>(() => getInstallAppPlatform());

  const platform = platformProp ?? detectedPlatform;
  const content = INSTALL_APP_PLATFORM_CONTENT[platform];
  const offerImageAssetKey =
    platform === "ios" ? INSTALL_APP_IOS_IMAGE_ASSET_KEY : INSTALL_APP_ANDROID_IMAGE_ASSET_KEY;
  const imageSrc = useAssetImage(offerImageAssetKey, content.imageSrc);

  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleOkay = () => {
    onOkay?.();
    onOpenChange?.(false);
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={content.title}
      titleIconSrc={content.titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel="Close"
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn(
        "border-surface-strong bg-dialog-bg z-71 max-w-[calc(100%-1rem)] md:max-w-[390px]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-[293px] w-full">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={content.imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 390px) 100vw, 390px"
              priority
            />
          ) : null}
        </div>

        <p className="text-modal-text text-center text-sm leading-5 font-normal">
          {content.description}
        </p>

        {content.instructionSourceLabel ? (
          <p className="text-select-text text-center text-sm leading-5 font-semibold">
            {content.instructionSourceLabel}
          </p>
        ) : null}

        <InstallInstructionStep platform={platform} />

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={ctaLabel}
          onClick={handleOkay}
          className="w-full cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
