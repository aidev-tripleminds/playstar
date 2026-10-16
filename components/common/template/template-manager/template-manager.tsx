"use client";

import "ldrs/react/Hourglass.css";

import { Hourglass } from "ldrs/react";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { GeneratingV2Dotfield } from "@/components/common/general/placeholder-processing/generating-v2-dotfield";
import {
  GENERATING_V2_LABEL_CLASS,
  GENERATING_V2_LABEL_WRAP_CLASS,
} from "@/components/common/general/placeholder-processing/generating-v2-dotfield.constants";
import { cn } from "@/lib/utils";
import { FaceFemaleIcon } from "@/public/assets/icons/face-female-icon";
import { GalleryIcon } from "@/public/assets/icons/gallery-icon";
import { IxPublishIcon } from "@/public/assets/icons/ix-publish";

import {
  isTemplateManagerEmptyVariant,
  isTemplateManagerLoadedDeleteVisible,
  isTemplateManagerLoadedInteractive,
  resolveTemplateManagerCopy,
  resolveTemplateManagerFrameClass,
  resolveTemplateManagerPairSlots,
  TEMPLATE_MANAGER_CANCEL_LABEL,
  TEMPLATE_MANAGER_CHANGE_LABEL,
  TEMPLATE_MANAGER_DEFAULT_IMAGE_SRC,
  TEMPLATE_MANAGER_DELETE_ICON_SRC,
  TEMPLATE_MANAGER_DELETE_LABEL,
  TEMPLATE_MANAGER_DUO_STACK_CLASS,
  TEMPLATE_MANAGER_GENERATING_LABEL,
  TEMPLATE_MANAGER_PROCESSING_LABEL,
  TEMPLATE_MANAGER_QUEUED_SUBTITLE,
  TEMPLATE_MANAGER_QUEUED_TITLE,
  TEMPLATE_MANAGER_SKIP_QUEUE_LABEL,
  TEMPLATE_MANAGER_SKIP_QUEUE_TOKEN_COST,
  TEMPLATE_MANAGER_VARIANTS,
  TEMPLATE_MANAGER_VIDEO_ICON_SRC,
  type TemplateManagerFrame,
  type TemplateManagerSize,
  type TemplateManagerVariant,
} from "./template-manager.constants";

type TemplateManagerEmptyProps = {
  variant: Extract<TemplateManagerVariant, "select-video" | "select-image-char">;
  size: TemplateManagerSize;
  onSelectClick?: React.ComponentProps<"button">["onClick"];
};

function TemplateManagerEmptyIcon({
  variant,
}: {
  variant: Extract<TemplateManagerVariant, "select-video" | "select-image-char">;
}) {
  if (variant === "select-video") {
    return (
      <Image
        src={TEMPLATE_MANAGER_VIDEO_ICON_SRC}
        alt=""
        width={24}
        height={24}
        aria-hidden
        className="text-tooltip-text size-5 shrink-0"
      />
    );
  }

  return (
    <div className="text-tooltip-text flex items-center gap-1.5" aria-hidden>
      <GalleryIcon className="size-5" />
      <span className="text-select-muted-text">/</span>
      <FaceFemaleIcon className="size-5" />
    </div>
  );
}

function TemplateManagerEmpty({ variant, size, onSelectClick }: TemplateManagerEmptyProps) {
  const copy = resolveTemplateManagerCopy(variant);
  if (!copy) return null;

  return (
    <button
      type="button"
      data-slot="template-manager-empty"
      className={cn(
        "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-center",
        size === "mobile" ? "px-2 py-2" : "px-4 py-4",
      )}
      onClick={onSelectClick}
    >
      <TemplateManagerEmptyIcon variant={variant} />
      <div className="flex flex-col items-center gap-2">
        <p
          data-slot="template-manager-title"
          className="text-tooltip-text text-sm leading-5 font-medium"
        >
          {copy.title}
        </p>
        <p
          data-slot="template-manager-description"
          className="text-select-muted-text text-xs leading-4 font-medium"
        >
          {copy.description}
        </p>
      </div>
    </button>
  );
}

type TemplateManagerLoadedProps = {
  size: TemplateManagerSize;
  imageSrc: string;
  imageAlt: string;
  interactive?: boolean;
  showDelete?: boolean;
  onDeleteClick?: React.ComponentProps<"button">["onClick"];
  onChangeClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

function TemplateManagerLoaded({
  size,
  imageSrc,
  imageAlt,
  interactive = true,
  showDelete = true,
  onDeleteClick,
  onChangeClick,
}: TemplateManagerLoadedProps) {
  return (
    <>
      <Image
        data-slot="template-manager-loaded-image"
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />

      {interactive && showDelete ? (
        <button
          type="button"
          data-slot="template-manager-delete"
          aria-label={TEMPLATE_MANAGER_DELETE_LABEL}
          className="bg-tooltip-default-bg absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full"
          onClick={onDeleteClick}
        >
          <Image
            src={TEMPLATE_MANAGER_DELETE_ICON_SRC}
            alt=""
            width={20}
            height={20}
            aria-hidden
            className="size-5"
          />
        </button>
      ) : null}

      {interactive ? (
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-3">
          <Buttons
            data-slot="template-manager-change"
            type="button"
            variant="neutral-border"
            size="btn-s"
            leftIcon={false}
            rightIcon={false}
            label={TEMPLATE_MANAGER_CHANGE_LABEL}
            className={cn(
              "bg-tooltip-default-bg!",
              size === "mobile" ? "w-[135px]! min-w-[135px]!" : "min-w-[198px]",
            )}
            onClick={onChangeClick}
          />
        </div>
      ) : null}
    </>
  );
}

type TemplateManagerQueuedProps = {
  size: TemplateManagerSize;
  showSkipQueue?: boolean;
  skipQueueTokenCost?: React.ReactNode;
  onCancelClick?: React.ComponentProps<typeof Buttons>["onClick"];
  onSkipQueueClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

function TemplateManagerQueued({
  size,
  showSkipQueue = true,
  skipQueueTokenCost = TEMPLATE_MANAGER_SKIP_QUEUE_TOKEN_COST,
  onCancelClick,
  onSkipQueueClick,
}: TemplateManagerQueuedProps) {
  return (
    <div
      data-slot="template-manager-queued"
      className={cn(
        "flex h-full flex-col items-center justify-center gap-4 text-center",
        size === "mobile" ? "px-2 py-2" : "px-4 py-4",
      )}
    >
      <Hourglass size="40" bgOpacity="0.1" speed="1.75" color="var(--tooltip-text)" />
      <div className="flex flex-col items-center gap-1">
        <p
          data-slot="template-manager-queued-title"
          className="text-modal-text text-xs leading-4 font-medium"
        >
          {TEMPLATE_MANAGER_QUEUED_TITLE}
        </p>
        <p
          data-slot="template-manager-queued-subtitle"
          className="text-tooltip-text text-xs leading-4 font-medium"
        >
          {TEMPLATE_MANAGER_QUEUED_SUBTITLE}
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        {showSkipQueue ? (
          <Buttons
            data-slot="template-manager-skip-queue"
            type="button"
            variant="rose"
            size="btn-s"
            leftIcon={false}
            rightIcon={false}
            label={TEMPLATE_MANAGER_SKIP_QUEUE_LABEL}
            rightIconNode={
              <Badge
                type="empty"
                size="large"
                text={skipQueueTokenCost}
                showIcon
                className="px-0!"
              />
            }
            onClick={onSkipQueueClick}
            className="w-full max-w-[127px]"
          />
        ) : null}
        <Buttons
          data-slot="template-manager-cancel"
          type="button"
          variant="neutral-border"
          size="btn-s"
          leftIcon={false}
          rightIcon={false}
          label={TEMPLATE_MANAGER_CANCEL_LABEL}
          onClick={onCancelClick}
          className="w-full max-w-[127px]"
        />
      </div>
    </div>
  );
}

function TemplateManagerDotfieldStage({
  size,
  stage,
  label,
}: {
  size: TemplateManagerSize;
  stage: "processing" | "generating";
  label: string;
}) {
  return (
    <div data-slot={`template-manager-${stage}`} className="absolute inset-0">
      <GeneratingV2Dotfield />
      <div
        data-slot={`template-manager-${stage}-label-wrap`}
        className={cn(
          GENERATING_V2_LABEL_WRAP_CLASS,
          size === "mobile" ? "p-2 md:p-2" : "p-3 md:p-4",
        )}
      >
        <p data-slot={`template-manager-${stage}-label`} className={GENERATING_V2_LABEL_CLASS}>
          {label}
        </p>
      </div>
    </div>
  );
}

export type TemplateManagerProps = Omit<React.ComponentProps<"article">, "children" | "slot"> & {
  variant?: TemplateManagerVariant;
  size?: TemplateManagerSize;
  frame?: TemplateManagerFrame;
  slot?: "primary" | "secondary";
  imageSrc?: string;
  imageAlt?: string;
  loadedInteractive?: boolean;
  loadedShowDelete?: boolean;
  progressPercent?: number;
  showSkipQueue?: boolean;
  skipQueueTokenCost?: React.ReactNode;
  onSelectClick?: React.ComponentProps<"button">["onClick"];
  onDeleteClick?: React.ComponentProps<"button">["onClick"];
  onChangeClick?: React.ComponentProps<typeof Buttons>["onClick"];
  onCancelClick?: React.ComponentProps<typeof Buttons>["onClick"];
  onSkipQueueClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

export function TemplateManager({
  variant = "select-video",
  size = "desktop",
  frame = "default",
  slot = "primary",
  imageSrc = TEMPLATE_MANAGER_DEFAULT_IMAGE_SRC,
  imageAlt = "Selected template content",
  loadedInteractive = true,
  loadedShowDelete = true,
  progressPercent: _progressPercent,
  showSkipQueue = true,
  skipQueueTokenCost,
  onSelectClick,
  onDeleteClick,
  onChangeClick,
  onCancelClick,
  onSkipQueueClick,
  className,
  ...props
}: TemplateManagerProps) {
  return (
    <article
      data-slot="template-manager"
      data-variant={variant}
      data-size={size}
      data-frame={frame}
      data-slot-position={slot}
      className={cn(
        "bg-tooltip-default-bg relative overflow-hidden",
        resolveTemplateManagerFrameClass(size, frame),
        className,
      )}
      {...props}
    >
      {isTemplateManagerEmptyVariant(variant) ? (
        <TemplateManagerEmpty variant={variant} size={size} onSelectClick={onSelectClick} />
      ) : null}

      {variant === "loaded" ? (
        <TemplateManagerLoaded
          size={size}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          interactive={loadedInteractive}
          showDelete={loadedShowDelete}
          onDeleteClick={onDeleteClick}
          onChangeClick={onChangeClick}
        />
      ) : null}

      {variant === "queue" ? (
        <TemplateManagerQueued
          size={size}
          showSkipQueue={showSkipQueue}
          skipQueueTokenCost={skipQueueTokenCost}
          onCancelClick={onCancelClick}
          onSkipQueueClick={onSkipQueueClick}
        />
      ) : null}

      {variant === "processing" ? (
        <TemplateManagerDotfieldStage
          size={size}
          stage="processing"
          label={TEMPLATE_MANAGER_PROCESSING_LABEL}
        />
      ) : null}

      {variant === "generating" ? (
        <TemplateManagerDotfieldStage
          size={size}
          stage="generating"
          label={TEMPLATE_MANAGER_GENERATING_LABEL}
        />
      ) : null}
    </article>
  );
}

function TemplateManagerPairConnector() {
  return (
    <div
      data-slot="template-manager-pair-connector"
      className="relative flex w-[30px] shrink-0 items-center justify-center self-stretch"
      aria-hidden
    >
      <div className="text-tooltip-default-bg relative z-10 flex size-8 items-center justify-center rounded-full">
        <IxPublishIcon className="size-6" />
      </div>
    </div>
  );
}

export type TemplateManagerSourceSlot = Pick<
  TemplateManagerProps,
  | "variant"
  | "imageSrc"
  | "imageAlt"
  | "loadedInteractive"
  | "loadedShowDelete"
  | "onSelectClick"
  | "onDeleteClick"
  | "onChangeClick"
>;

export type TemplateManagerPairProps = Omit<React.ComponentProps<"div">, "children"> &
  Omit<TemplateManagerProps, "slot" | "variant"> & {
    variant?: TemplateManagerVariant;
    /** Overrides the result card (Queue → Processing → Generating → Result). */
    previewVariant?: TemplateManagerVariant;
    /** Per-slot source cards. Two entries use the stacked duo layout. */
    sources?: readonly TemplateManagerSourceSlot[];
  };

function resolveTemplateManagerSourceSlots({
  variant,
  sources,
  imageSrc,
  imageAlt,
  onSelectClick,
  onDeleteClick,
  onChangeClick,
}: {
  variant: TemplateManagerVariant;
  sources?: readonly TemplateManagerSourceSlot[];
  imageSrc?: string;
  imageAlt?: string;
  onSelectClick?: TemplateManagerProps["onSelectClick"];
  onDeleteClick?: TemplateManagerProps["onDeleteClick"];
  onChangeClick?: TemplateManagerProps["onChangeClick"];
}): TemplateManagerSourceSlot[] {
  const { left } = resolveTemplateManagerPairSlots(variant);
  const fallbackSource: TemplateManagerSourceSlot = {
    variant: variant === "duo" ? "loaded" : left,
    imageSrc,
    imageAlt,
    onSelectClick,
    onDeleteClick,
    onChangeClick,
  };

  if (sources?.length) return [...sources];
  if (variant === "duo") return [fallbackSource, fallbackSource];
  return [fallbackSource];
}

export function TemplateManagerPair({
  variant = "select-video",
  size = "desktop",
  sources,
  className,
  imageSrc,
  imageAlt,
  previewVariant,
  progressPercent,
  showSkipQueue,
  skipQueueTokenCost,
  onSelectClick,
  onDeleteClick,
  onChangeClick,
  onCancelClick,
  onSkipQueueClick,
  ...props
}: TemplateManagerPairProps) {
  const { right } = resolveTemplateManagerPairSlots(variant);
  const sourceSlots = resolveTemplateManagerSourceSlots({
    variant,
    sources,
    imageSrc,
    imageAlt,
    onSelectClick,
    onDeleteClick,
    onChangeClick,
  });
  const isDuoLayout = variant === "duo" || sourceSlots.length > 1;
  const resultVariant = previewVariant ?? (isDuoLayout ? "loaded" : right);

  if (isDuoLayout) {
    return (
      <div
        data-slot="template-manager-pair"
        data-variant={variant}
        data-size={size}
        className={cn("flex items-center gap-2", className)}
      >
        <div
          data-slot="template-manager-duo-stack"
          className={cn("flex flex-col gap-2", TEMPLATE_MANAGER_DUO_STACK_CLASS[size])}
        >
          {sourceSlots.slice(0, 2).map((source, index) => {
            const sourceVariant = source.variant ?? "loaded";

            return (
              <TemplateManager
                key={index}
                {...props}
                variant={sourceVariant}
                imageSrc={source.imageSrc}
                imageAlt={source.imageAlt}
                onSelectClick={source.onSelectClick}
                onDeleteClick={source.onDeleteClick}
                onChangeClick={source.onChangeClick}
                size={size}
                frame="duo-source"
                slot="primary"
                loadedInteractive={source.loadedInteractive ?? true}
                loadedShowDelete={source.loadedShowDelete ?? true}
              />
            );
          })}
        </div>
        <TemplateManagerPairConnector />
        <TemplateManager
          {...props}
          variant={resultVariant}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          size={size}
          frame="duo-preview"
          slot="secondary"
          loadedInteractive={false}
          loadedShowDelete={false}
          progressPercent={progressPercent}
          showSkipQueue={showSkipQueue}
          skipQueueTokenCost={skipQueueTokenCost}
          onCancelClick={onCancelClick}
          onSkipQueueClick={onSkipQueueClick}
        />
      </div>
    );
  }

  const [source] = sourceSlots;
  const leftVariant = source?.variant ?? resolveTemplateManagerPairSlots(variant).left;

  return (
    <div
      data-slot="template-manager-pair"
      data-variant={variant}
      data-size={size}
      className={cn("flex items-stretch gap-2", className)}
    >
      <TemplateManager
        {...props}
        variant={leftVariant}
        imageSrc={source?.imageSrc}
        imageAlt={source?.imageAlt}
        onSelectClick={source?.onSelectClick}
        onDeleteClick={source?.onDeleteClick}
        onChangeClick={source?.onChangeClick}
        size={size}
        slot="primary"
        loadedInteractive={isTemplateManagerLoadedInteractive(variant, "primary", leftVariant)}
        loadedShowDelete={isTemplateManagerLoadedDeleteVisible(variant, "primary", leftVariant)}
      />
      <TemplateManagerPairConnector />
      <TemplateManager
        {...props}
        variant={resultVariant}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        size={size}
        slot="secondary"
        loadedInteractive={isTemplateManagerLoadedInteractive(variant, "secondary", resultVariant)}
        loadedShowDelete={isTemplateManagerLoadedDeleteVisible(variant, "secondary", resultVariant)}
        progressPercent={progressPercent}
        showSkipQueue={showSkipQueue}
        skipQueueTokenCost={skipQueueTokenCost}
        onCancelClick={onCancelClick}
        onSkipQueueClick={onSkipQueueClick}
      />
    </div>
  );
}

export type TemplateManagerShowcaseProps = Omit<React.ComponentProps<"div">, "children"> &
  Omit<TemplateManagerProps, "variant" | "slot">;

export function TemplateManagerShowcase({
  size = "desktop",
  className,
  ...props
}: TemplateManagerShowcaseProps) {
  return (
    <div
      data-slot="template-manager-showcase"
      data-size={size}
      className={cn("flex flex-col gap-10 pt-10", className)}
    >
      {TEMPLATE_MANAGER_VARIANTS.map((variant) => (
        <TemplateManagerPair key={variant} variant={variant} size={size} {...props} />
      ))}
    </div>
  );
}

/** @deprecated Use TemplateManagerPair */
export type TemplateManagersProps = React.ComponentProps<"div"> & {
  items?: TemplateManagerProps[];
};

/** @deprecated Use TemplateManagerPair or TemplateManagerShowcase */
export function TemplateManagers({ items, className, ...props }: TemplateManagersProps) {
  if (!items?.length) return null;

  return (
    <div
      data-slot="template-managers"
      className={cn("flex items-stretch gap-2", className)}
      {...props}
    >
      {items.map((item, index) => (
        <TemplateManager
          key={`${item.variant ?? "select-video"}-${item.size ?? "desktop"}-${index}`}
          {...item}
        />
      ))}
    </div>
  );
}
