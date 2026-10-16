"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import {
  RadioButton,
  RadioButtonGroup,
} from "@/components/common/general/radio-button/radio-button";
import { Slider } from "@/components/common/general/slider/slider";
import { CheckpointSelector } from "@/components/common/generate/checkpoint-selector";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  getWritingStyleChatModeDescription,
  WRITING_STYLE_AI_MODEL_LABEL,
  WRITING_STYLE_CHAT_MODE_LABEL,
  WRITING_STYLE_CHAT_MODES,
  WRITING_STYLE_DEFAULT_MODEL_ID,
  WRITING_STYLE_DEFAULT_RESPONSE_LENGTH,
  WRITING_STYLE_MODAL_APPLY_LABEL,
  WRITING_STYLE_MODAL_TITLE,
  WRITING_STYLE_MODAL_TITLE_ICON_SRC,
  WRITING_STYLE_MODELS,
  WRITING_STYLE_RESPONSE_LENGTH_LABEL,
  WRITING_STYLE_RESPONSE_LENGTH_MAX,
  WRITING_STYLE_RESPONSE_LENGTH_MIN,
  type WritingStyleChatMode,
  type WritingStyleModelId,
} from "./writing-style-modal.constants";

export type WritingStyleModalValues = {
  chatMode: WritingStyleChatMode;
  responseLength: number;
  modelId: WritingStyleModelId;
};

export type WritingStyleModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  titleIconSrc?: string;
  closeLabel?: string;
  applyLabel?: string;
  chatMode?: WritingStyleChatMode;
  defaultChatMode?: WritingStyleChatMode;
  responseLength?: number;
  defaultResponseLength?: number;
  modelId?: WritingStyleModelId;
  defaultModelId?: WritingStyleModelId;
  onApply?: (values: WritingStyleModalValues) => void;
  onChatModeChange?: (chatMode: WritingStyleChatMode) => void;
  onClose?: () => void;
  className?: string;
};

export function WritingStyleModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = WRITING_STYLE_MODAL_TITLE,
  titleIconSrc = WRITING_STYLE_MODAL_TITLE_ICON_SRC,
  closeLabel = "Close writing style",
  applyLabel = WRITING_STYLE_MODAL_APPLY_LABEL,
  chatMode,
  defaultChatMode = "chat",
  responseLength,
  defaultResponseLength = WRITING_STYLE_DEFAULT_RESPONSE_LENGTH,
  modelId,
  defaultModelId = WRITING_STYLE_DEFAULT_MODEL_ID,
  onApply,
  onChatModeChange,
  onClose,
  className,
}: WritingStyleModalProps) {
  const [internalChatMode, setInternalChatMode] =
    React.useState<WritingStyleChatMode>(defaultChatMode);
  const [internalResponseLength, setInternalResponseLength] = React.useState(defaultResponseLength);
  const [internalModelId, setInternalModelId] = React.useState<WritingStyleModelId>(defaultModelId);
  const [baseline, setBaseline] = React.useState<WritingStyleModalValues>({
    chatMode: defaultChatMode,
    responseLength: defaultResponseLength,
    modelId: defaultModelId,
  });

  const resolvedChatMode = chatMode ?? internalChatMode;
  const resolvedResponseLength = responseLength ?? internalResponseLength;
  const resolvedModelId = modelId ?? internalModelId;
  const hasChanges =
    resolvedChatMode !== baseline.chatMode ||
    resolvedResponseLength !== baseline.responseLength ||
    resolvedModelId !== baseline.modelId;
  const wasOpenRef = React.useRef(false);

  React.useEffect(() => {
    const justOpened = Boolean(open) && !wasOpenRef.current;
    wasOpenRef.current = Boolean(open);

    if (!justOpened) {
      return;
    }

    const nextChatMode = chatMode ?? defaultChatMode;
    const nextResponseLength = responseLength ?? defaultResponseLength;
    const nextModelId = modelId ?? defaultModelId;

    setInternalChatMode(nextChatMode);
    setInternalResponseLength(nextResponseLength);
    setInternalModelId(nextModelId);
    setBaseline({
      chatMode: nextChatMode,
      responseLength: nextResponseLength,
      modelId: nextModelId,
    });
  }, [
    chatMode,
    defaultChatMode,
    defaultModelId,
    defaultResponseLength,
    modelId,
    open,
    responseLength,
  ]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const handleClose = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleChatModeChange = React.useCallback(
    (nextMode: string) => {
      const mode = nextMode as WritingStyleChatMode;
      if (chatMode === undefined) {
        setInternalChatMode(mode);
      }
      onChatModeChange?.(mode);
    },
    [chatMode, onChatModeChange],
  );

  const handleResponseLengthChange = React.useCallback(
    (nextLength: number) => {
      if (responseLength === undefined) {
        setInternalResponseLength(nextLength);
      }
    },
    [responseLength],
  );

  const handleModelSelect = React.useCallback(
    (nextModelId: WritingStyleModelId) => {
      if (modelId === undefined) {
        setInternalModelId(nextModelId);
      }
    },
    [modelId],
  );

  const handleApply = React.useCallback(() => {
    onApply?.({
      chatMode: resolvedChatMode,
      responseLength: resolvedResponseLength,
      modelId: resolvedModelId,
    });
    onOpenChange?.(false);
  }, [onApply, onOpenChange, resolvedChatMode, resolvedModelId, resolvedResponseLength]);

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      className={cn(
        "border-surface-strong bg-dialog-bg md:max-w-[min(100%,760px)]",
        contentClassName,
      )}
    >
      <div
        data-slot="writing-style-modal"
        className={cn("scrollbar-hidden flex flex-col gap-4 overflow-y-auto", className)}
      >
        <DialogDescription className="sr-only">
          Choose chat mode, response length, and AI model for writing style.
        </DialogDescription>

        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p
                className="text-tooltip-text text-sm leading-5 font-medium"
                id="writing-style-chat-mode-label"
              >
                {WRITING_STYLE_CHAT_MODE_LABEL}
              </p>

              <RadioButtonGroup
                value={resolvedChatMode}
                onValueChange={handleChatModeChange}
                aria-labelledby="writing-style-chat-mode-label"
                className="flex w-full gap-1.5"
              >
                {WRITING_STYLE_CHAT_MODES.map((mode) => (
                  <RadioButton
                    key={mode.id}
                    value={mode.id}
                    label={mode.label}
                    className="w-full max-w-none"
                  />
                ))}
              </RadioButtonGroup>

              <p className="text-divider-label text-sm leading-5 font-normal">
                {getWritingStyleChatModeDescription(resolvedChatMode)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-tooltip-text text-sm leading-5 font-medium">
                {WRITING_STYLE_RESPONSE_LENGTH_LABEL}
              </p>
              <div className="text-divider-label flex w-full items-center justify-between text-xs leading-4 font-medium">
                <span>Short</span>
                <span>Long</span>
              </div>
              <Slider
                min={WRITING_STYLE_RESPONSE_LENGTH_MIN}
                max={WRITING_STYLE_RESPONSE_LENGTH_MAX}
                step={1}
                value={resolvedResponseLength}
                onValueChange={handleResponseLengthChange}
                showFlexCol
                showMaxlabel={false}
                showSliderValue={false}
                minLabel=""
                className="pt-0 pb-3 pl-2.5! [&>div:first-child]:hidden"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p
              className="text-tooltip-text text-sm leading-5 font-medium"
              id="writing-style-model-label"
            >
              {WRITING_STYLE_AI_MODEL_LABEL}
            </p>
            <div
              role="radiogroup"
              aria-labelledby="writing-style-model-label"
              className="flex flex-col gap-2"
            >
              {WRITING_STYLE_MODELS.map((model) => {
                const isSelected = resolvedModelId === model.id;
                return (
                  <CheckpointSelector
                    key={model.id}
                    role="radio"
                    aria-checked={isSelected}
                    aria-pressed={undefined}
                    name={model.name}
                    description={model.description}
                    tokenCost={model.tokenCost}
                    checkpointVariant={model.checkpointVariant}
                    selected={isSelected}
                    showUnlimitedBadge={model.showUnlimitedBadge}
                    showTokenBadge={model.showTokenBadge}
                    showPremiumBadge={model.showPremiumBadge}
                    onSelectedChange={(selected) => {
                      if (selected) handleModelSelect(model.id);
                    }}
                    className="w-full max-w-none"
                  />
                );
              })}
            </div>
          </div>
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={applyLabel}
          disabled={!hasChanges}
          onClick={handleApply}
          className="w-full"
        />
      </div>
    </ModalLayout>
  );
}
