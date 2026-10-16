"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import {
  CHOOSE_TEMPLATE_DEFAULT_ITEMS,
  ChooseTemplate,
  type ChooseTemplateItem,
  type ChooseTemplateProps,
} from "@/components/common/chat/choose-template";
import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { Slider } from "@/components/common/general/slider/slider";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { CheckpointSelector } from "@/components/common/generate/checkpoint-selector";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VideoHorizontal } from "@/public/assets/icons";

import {
  ANIMATE_IMAGE_DEFAULT_DURATION,
  ANIMATE_IMAGE_DEFAULT_MODEL_ID,
  ANIMATE_IMAGE_DEFAULT_RESOLUTION,
  ANIMATE_IMAGE_DEFAULT_SCENE,
  ANIMATE_IMAGE_DURATION_MAX,
  ANIMATE_IMAGE_DURATION_MIN,
  ANIMATE_IMAGE_MODAL_GENERATE_LABEL,
  ANIMATE_IMAGE_MODAL_TITLE,
  ANIMATE_IMAGE_MODAL_TITLE_ICON_SRC,
  ANIMATE_IMAGE_MODEL_HELPER_TEXT,
  ANIMATE_IMAGE_MODELS,
  ANIMATE_IMAGE_PROMPT_LABEL,
  ANIMATE_IMAGE_PROMPT_PLACEHOLDER,
  ANIMATE_IMAGE_RESOLUTIONS,
  ANIMATE_IMAGE_SCENE_LABEL,
  type AnimateImageModelId,
  type AnimateImageResolution,
  type AnimateImageScene,
  clampAnimateImageDuration,
  getAnimateImageModelTokenCost,
} from "./animate-image-modal.constants";

const DEFAULT_SCENE_TEMPLATES = CHOOSE_TEMPLATE_DEFAULT_ITEMS.filter(
  (template) => template.variant === "videos",
);

export type AnimateImageModalValues = {
  scene: AnimateImageScene;
  resolution: AnimateImageResolution;
  duration: number;
  modelId: AnimateImageModelId;
  templateId?: string;
  prompt: string;
  estimatedTokenCost: string;
  imageId?: string;
  imageSrc?: string;
};

export type AnimateImageModalProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  titleIconSrc?: string;
  closeLabel?: string;
  generateLabel?: string;
  scene?: AnimateImageScene;
  defaultScene?: AnimateImageScene;
  onSceneChange?: (scene: AnimateImageScene) => void;
  resolution?: AnimateImageResolution;
  defaultResolution?: AnimateImageResolution;
  onResolutionChange?: (resolution: AnimateImageResolution) => void;
  duration?: number;
  defaultDuration?: number;
  onDurationChange?: (duration: number) => void;
  modelId?: AnimateImageModelId;
  defaultModelId?: AnimateImageModelId;
  onModelIdChange?: (modelId: AnimateImageModelId) => void;
  prompt?: string;
  defaultPrompt?: string;
  onPromptChange?: (prompt: string) => void;
  promptPlaceholder?: string;
  imageId?: string;
  imageSrc?: string;
  isSubmitting?: boolean;
  onApply?: (values: AnimateImageModalValues) => void;
  onClose?: () => void;
  templates?: ChooseTemplateProps["templates"];
  selectedTemplateId?: string;
  defaultSelectedTemplateId?: string;
  onTemplateSelect?: (templateId: string, template: ChooseTemplateItem) => void;
  chooseTemplateContentClassName?: string;
  className?: string;
};

function ResolutionTabs({
  value,
  onChange,
}: {
  value: AnimateImageResolution;
  onChange: (resolution: AnimateImageResolution) => void;
}) {
  return (
    <div
      data-slot="animate-image-resolution-tabs"
      role="radiogroup"
      aria-label="Resolution"
      className="flex w-full gap-2"
    >
      {ANIMATE_IMAGE_RESOLUTIONS.map((resolution) => {
        const isSelected = resolution === value;
        return (
          <button
            key={resolution}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(resolution)}
            className={cn(
              "flex min-w-11 flex-1 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-sm leading-5 font-medium transition-colors",
              isSelected
                ? "bg-surface-strong text-tooltip-text shadow-(--toggle-thumb-shadow)"
                : "bg-tooltip-default-bg text-select-muted-text",
            )}
          >
            {resolution}
          </button>
        );
      })}
    </div>
  );
}

export function AnimateImageModal({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = ANIMATE_IMAGE_MODAL_TITLE,
  titleIconSrc = ANIMATE_IMAGE_MODAL_TITLE_ICON_SRC,
  closeLabel = "Close animate image modal",
  generateLabel = ANIMATE_IMAGE_MODAL_GENERATE_LABEL,
  scene,
  defaultScene = ANIMATE_IMAGE_DEFAULT_SCENE,
  onSceneChange,
  resolution,
  defaultResolution = ANIMATE_IMAGE_DEFAULT_RESOLUTION,
  onResolutionChange,
  duration,
  defaultDuration = ANIMATE_IMAGE_DEFAULT_DURATION,
  onDurationChange,
  modelId,
  defaultModelId = ANIMATE_IMAGE_DEFAULT_MODEL_ID,
  onModelIdChange,
  prompt,
  defaultPrompt = "",
  onPromptChange,
  promptPlaceholder = ANIMATE_IMAGE_PROMPT_PLACEHOLDER,
  imageId,
  imageSrc,
  isSubmitting = false,
  onApply,
  onClose,
  templates,
  selectedTemplateId,
  defaultSelectedTemplateId,
  onTemplateSelect,
  chooseTemplateContentClassName,
  className,
}: AnimateImageModalProps) {
  const [internalScene, setInternalScene] = React.useState<AnimateImageScene>(defaultScene);
  const [internalResolution, setInternalResolution] =
    React.useState<AnimateImageResolution>(defaultResolution);
  const [internalDuration, setInternalDuration] = React.useState(() =>
    clampAnimateImageDuration(defaultDuration),
  );
  const [internalModelId, setInternalModelId] = React.useState<AnimateImageModelId>(defaultModelId);
  const [internalPrompt, setInternalPrompt] = React.useState(defaultPrompt);
  const [internalSelectedTemplateId, setInternalSelectedTemplateId] = React.useState<
    string | undefined
  >(defaultSelectedTemplateId);
  const [isChooseTemplateOpen, setIsChooseTemplateOpen] = React.useState(false);
  const [wasParentOpen, setWasParentOpen] = React.useState(open);

  // Keep nested scene picker in sync when the parent is closed from outside.
  if (open !== wasParentOpen) {
    setWasParentOpen(open);
    if (open === false) {
      setIsChooseTemplateOpen(false);
    }
  }

  const resolvedScene = scene ?? internalScene;
  const resolvedResolution = resolution ?? internalResolution;
  const resolvedDuration = clampAnimateImageDuration(duration ?? internalDuration);
  const resolvedModelId = modelId ?? internalModelId;
  const resolvedPrompt = prompt ?? internalPrompt;
  const resolvedSelectedTemplateId = selectedTemplateId ?? internalSelectedTemplateId;
  const estimatedTokenCost = getAnimateImageModelTokenCost(resolvedModelId);
  const isScenePickerOpen = isChooseTemplateOpen && open !== false;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setIsChooseTemplateOpen(false);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  // ModalLayout's DialogClose already closes via onOpenChange; only run the optional side effect.
  const handleClose = React.useCallback(() => {
    setIsChooseTemplateOpen(false);
    onClose?.();
  }, [onClose]);

  const handleSceneClick = React.useCallback(() => {
    setIsChooseTemplateOpen(true);
  }, []);

  const handleTemplateSelect = React.useCallback(
    (templateId: string, template: ChooseTemplateItem) => {
      const nextScene: AnimateImageScene = template.name?.trim() || "Custom";

      if (scene === undefined) setInternalScene(nextScene);
      if (selectedTemplateId === undefined) setInternalSelectedTemplateId(templateId);
      onSceneChange?.(nextScene);
      onTemplateSelect?.(templateId, template);
      setIsChooseTemplateOpen(false);
    },
    [onSceneChange, onTemplateSelect, scene, selectedTemplateId],
  );

  const handleResolutionChange = React.useCallback(
    (nextResolution: AnimateImageResolution) => {
      if (resolution === undefined) setInternalResolution(nextResolution);
      onResolutionChange?.(nextResolution);
    },
    [onResolutionChange, resolution],
  );

  const handleDurationChange = React.useCallback(
    (nextDuration: number) => {
      const clamped = clampAnimateImageDuration(nextDuration);
      if (duration === undefined) setInternalDuration(clamped);
      onDurationChange?.(clamped);
    },
    [duration, onDurationChange],
  );

  const handlePromptChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextPrompt = event.target.value;
      if (prompt === undefined) setInternalPrompt(nextPrompt);
      onPromptChange?.(nextPrompt);
    },
    [onPromptChange, prompt],
  );

  const handleModelSelect = React.useCallback(
    (nextModelId: AnimateImageModelId) => {
      if (modelId === undefined) setInternalModelId(nextModelId);
      onModelIdChange?.(nextModelId);
    },
    [modelId, onModelIdChange],
  );

  const handleApply = React.useCallback(() => {
    if (isSubmitting) return;

    setIsChooseTemplateOpen(false);
    onApply?.({
      scene: resolvedScene,
      resolution: resolvedResolution,
      duration: resolvedDuration,
      modelId: resolvedModelId,
      templateId: resolvedSelectedTemplateId,
      prompt: resolvedPrompt,
      estimatedTokenCost,
      imageId,
      imageSrc,
    });
    onOpenChange?.(false);
  }, [
    estimatedTokenCost,
    imageId,
    imageSrc,
    isSubmitting,
    onApply,
    onOpenChange,
    resolvedDuration,
    resolvedPrompt,
    resolvedModelId,
    resolvedResolution,
    resolvedScene,
    resolvedSelectedTemplateId,
  ]);

  return (
    <>
      <ModalLayout
        trigger={trigger}
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
          data-slot="animate-image-modal"
          className={cn("scrollbar-hidden flex flex-col gap-4 overflow-y-auto", className)}
        >
          <DialogDescription className="sr-only">
            Choose scene, custom prompt, resolution, duration, and AI model to animate this image.
          </DialogDescription>

          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isChooseTemplateOpen}
                aria-label={`${ANIMATE_IMAGE_SCENE_LABEL} ${resolvedScene}`}
                onClick={handleSceneClick}
                className="border-border-strong bg-tooltip-default-bg flex w-full cursor-pointer items-center gap-2 rounded-full border p-3 text-sm leading-5 font-medium transition-colors"
              >
                <VideoHorizontal className="text-divider-label size-5 shrink-0" />
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <span className="text-text-muted-strong shrink-0" aria-hidden>
                    {ANIMATE_IMAGE_SCENE_LABEL}
                  </span>
                  <span className="text-text-inverse truncate" aria-hidden>
                    {resolvedScene}
                  </span>
                </div>
                <ChevronDown className="text-text-muted-strong size-5 shrink-0" aria-hidden />
              </button>

              <div className="flex flex-col gap-2">
                <p className="text-tooltip-text text-sm leading-5 font-medium">
                  {ANIMATE_IMAGE_PROMPT_LABEL}
                </p>
                <TextArea
                  showLeftIcon={false}
                  value={resolvedPrompt}
                  onChange={handlePromptChange}
                  placeholder={promptPlaceholder}
                  aria-label={ANIMATE_IMAGE_PROMPT_LABEL}
                  className="min-h-24 w-full max-w-none"
                />
              </div>

              <div data-slot="animate-image-duration" className="flex w-full flex-col items-center">
                <div className="text-tooltip-text flex w-full items-center justify-between pb-3 text-sm leading-5 font-medium">
                  <span>Duration</span>
                  <span>{resolvedDuration}s</span>
                </div>
                <Slider
                  min={ANIMATE_IMAGE_DURATION_MIN}
                  max={ANIMATE_IMAGE_DURATION_MAX}
                  step={1}
                  value={resolvedDuration}
                  onValueChange={handleDurationChange}
                  minLabel={`${ANIMATE_IMAGE_DURATION_MIN}s`}
                  maxLabel={`${ANIMATE_IMAGE_DURATION_MAX}s`}
                  minLabelSuffix=""
                  showSliderValue={false}
                  formatValueLabel={(value) => `${value}s`}
                  aria-label="Duration"
                  className="flex-col-reverse gap-2 px-0 pt-0 pb-0"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p
                className="text-tooltip-text text-sm leading-5 font-medium"
                id="animate-image-model-label"
              >
                AI model
              </p>
              <p className="text-divider-label text-xs leading-4 font-normal">
                {ANIMATE_IMAGE_MODEL_HELPER_TEXT}
              </p>
              <div
                role="radiogroup"
                aria-labelledby="animate-image-model-label"
                className="flex flex-col gap-2"
              >
                {ANIMATE_IMAGE_MODELS.map((model) => {
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
            label={generateLabel}
            onClick={handleApply}
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            className="w-full"
          >
            <Badge size="large" type="empty" text={estimatedTokenCost} />
          </Buttons>
        </div>
      </ModalLayout>

      <ChooseTemplate
        title="Select a scene"
        showFilterTabs={false}
        showTemplateTypeTabs={false}
        filterByTypeVariant={false}
        open={isScenePickerOpen}
        onOpenChange={setIsChooseTemplateOpen}
        templates={templates ?? DEFAULT_SCENE_TEMPLATES}
        selectedTemplateId={resolvedSelectedTemplateId}
        defaultSelectedTemplateId={defaultSelectedTemplateId}
        onTemplateSelect={handleTemplateSelect}
        contentClassName={cn(
          "h-[min(960px,calc(100vh-4rem))] max-h-[calc(100vh-4rem)] z-999",
          chooseTemplateContentClassName,
        )}
        closeLabel="Close template picker"
      />
    </>
  );
}
