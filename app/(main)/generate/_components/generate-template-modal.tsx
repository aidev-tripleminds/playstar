"use client";

import Image from "next/image";
import * as React from "react";

import {
  CHOOSE_TEMPLATE_DEFAULT_TITLE,
  ChooseTemplate,
  type ChooseTemplateItem,
} from "@/components/common/chat/choose-template";
import { Buttons } from "@/components/common/general/button/buttons";
import {
  INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import Tabs from "@/components/common/general/tabs/tabs";
import {
  TemplateManagerPair,
  type TemplateManagerSourceSlot,
} from "@/components/common/template/template-manager";
import { DialogDescription } from "@/components/ui/dialog";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { SKIP_QUEUE_FEATURE_ENABLED } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";
import { HeartIcon, RecoveryIcon } from "@/public/assets/icons";

import {
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS,
  GENERATE_TEMPLATE_CHOOSE_TEMPLATE_CLASS,
  GENERATE_TEMPLATE_CHOOSE_TEMPLATE_CLOSE_LABEL,
  GENERATE_TEMPLATE_CHOOSE_TEMPLATE_OVERLAY_CLASS,
  GENERATE_TEMPLATE_MODAL_CLASS,
  GENERATE_TEMPLATE_MODAL_CLOSE_LABEL,
  GENERATE_TEMPLATE_MODAL_GALLERY_LABEL,
  GENERATE_TEMPLATE_MODAL_GENERATE_LABEL,
  GENERATE_TEMPLATE_MODAL_LIKE_LABEL,
  GENERATE_TEMPLATE_MODAL_MODE_TABS,
  GENERATE_TEMPLATE_MODAL_PLACEHOLDER_COUNT,
  GENERATE_TEMPLATE_MODAL_SETTINGS_ICON_SRC,
  GENERATE_TEMPLATE_MODAL_SETTINGS_LABEL,
  GENERATE_TEMPLATE_MODAL_TAGS,
  GENERATE_TEMPLATE_MODAL_TOKEN_COST,
  GENERATE_TEMPLATE_MODAL_TOKEN_ICON_SRC,
  GENERATE_TEMPLATE_MODAL_UNLIKE_LABEL,
  GENERATE_TEMPLATE_STAGE_PROCESSING_MS,
  GENERATE_TEMPLATE_STAGE_PROGRESS_TICK_MS,
  GENERATE_TEMPLATE_STAGE_QUEUING_MS,
  GENERATE_TEMPLATE_STAGE_RESULT_HOLD_MS,
  type GenerateTemplateAdvancedSettingsValues,
  type GenerateTemplateItem,
  type GenerateTemplateStage,
  getGenerateTemplateChooseTemplateTypeTab,
  getGenerateTemplateEmptyVariant,
  getGenerateTemplatePreviewVariant,
  isGenerateTemplateStageBusy,
  isGenerateTemplateStageInFlight,
} from "../_lib/generate-templates";
import { GenerateTemplateAdvancedSettingsModal } from "./generate-template-advanced-settings-modal";

type GenerateTemplateSlotSelection = {
  templateId: string;
  imageSrc: string;
  imageAlt: string;
};

function createEmptySlotSelections(): (GenerateTemplateSlotSelection | null)[] {
  return Array.from({ length: GENERATE_TEMPLATE_MODAL_PLACEHOLDER_COUNT }, () => null);
}

export type GenerateTemplateModalProps = {
  open?: boolean;
  item?: GenerateTemplateItem | null;
  onOpenChange?: (open: boolean) => void;
  onGenerate?: (item: GenerateTemplateItem) => void;
  onGoToGallery?: () => void;
  onSettingsClick?: () => void;
  onSettingsApply?: (values: GenerateTemplateAdvancedSettingsValues) => void;
  onSelectContent?: (item: GenerateTemplateItem) => void;
  className?: string;
};

export function GenerateTemplateModal({
  open = false,
  item = null,
  onOpenChange,
  onGenerate,
  onGoToGallery,
  onSettingsClick,
  onSettingsApply,
  onSelectContent,
  className,
}: GenerateTemplateModalProps) {
  const isDesktop = useIsDesktop();
  const [modeIndex, setModeIndex] = React.useState(0);
  const [liked, setLiked] = React.useState(true);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = React.useState(false);
  const [advancedSettings, setAdvancedSettings] = React.useState(
    GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS,
  );
  const [prevOpen, setPrevOpen] = React.useState(open);
  const [prevItemId, setPrevItemId] = React.useState(item?.id);
  const [slotSelections, setSlotSelections] = React.useState(createEmptySlotSelections);
  const [chooseTemplateOpen, setChooseTemplateOpen] = React.useState(false);
  const [chooseTemplateTypeTab, setChooseTemplateTypeTab] = React.useState<number>(
    getGenerateTemplateChooseTemplateTypeTab(0),
  );
  const [activeSlotIndex, setActiveSlotIndex] = React.useState<number | null>(null);
  const [stage, setStage] = React.useState<GenerateTemplateStage>("idle");
  const [progressPercent, setProgressPercent] = React.useState<number | undefined>();
  const generationTimersRef = React.useRef<number[]>([]);

  const clearGenerationTimers = React.useCallback(() => {
    for (const timerId of generationTimersRef.current) {
      window.clearTimeout(timerId);
      window.clearInterval(timerId);
    }
    generationTimersRef.current = [];
  }, []);

  const trackGenerationTimer = React.useCallback((timerId: number) => {
    generationTimersRef.current.push(timerId);
  }, []);

  const resetGeneration = React.useCallback(() => {
    clearGenerationTimers();
    setStage("idle");
    setProgressPercent(undefined);
  }, [clearGenerationTimers]);

  const startGeneration = React.useCallback(
    (options?: { skipQueue?: boolean }) => {
      clearGenerationTimers();

      const startGeneratingStage = () => {
        let progress = 1;
        setStage("generating");
        setProgressPercent(progress);

        const progressTimer = window.setInterval(() => {
          progress = Math.min(100, progress + 1);
          setProgressPercent(progress);
          if (progress < 100) return;

          window.clearInterval(progressTimer);
          const doneTimer = window.setTimeout(() => {
            setStage("result");
            setProgressPercent(undefined);
          }, GENERATE_TEMPLATE_STAGE_RESULT_HOLD_MS);
          trackGenerationTimer(doneTimer);
        }, GENERATE_TEMPLATE_STAGE_PROGRESS_TICK_MS);

        trackGenerationTimer(progressTimer);
      };

      const startProcessingStage = () => {
        setStage("processing");
        setProgressPercent(undefined);
        trackGenerationTimer(
          window.setTimeout(startGeneratingStage, GENERATE_TEMPLATE_STAGE_PROCESSING_MS),
        );
      };

      if (options?.skipQueue) {
        startProcessingStage();
        return;
      }

      setStage("queuing");
      setProgressPercent(undefined);
      trackGenerationTimer(
        window.setTimeout(startProcessingStage, GENERATE_TEMPLATE_STAGE_QUEUING_MS),
      );
    },
    [clearGenerationTimers, trackGenerationTimer],
  );

  React.useEffect(() => {
    clearGenerationTimers();
  }, [item?.id, open, clearGenerationTimers]);

  React.useEffect(() => {
    return () => {
      clearGenerationTimers();
    };
  }, [clearGenerationTimers]);

  if (open !== prevOpen || item?.id !== prevItemId) {
    setPrevOpen(open);
    setPrevItemId(item?.id);
    setAdvancedSettingsOpen(false);
    setChooseTemplateOpen(false);
    setActiveSlotIndex(null);
    setStage("idle");
    setProgressPercent(undefined);
    if (open) {
      setModeIndex(0);
      setLiked(item?.liked ?? true);
      setAdvancedSettings(GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS);
      setSlotSelections(createEmptySlotSelections());
      setChooseTemplateTypeTab(getGenerateTemplateChooseTemplateTypeTab(0));
    }
  }

  const tags = item?.tags?.length ? item.tags : GENERATE_TEMPLATE_MODAL_TAGS;
  const emptyVariant = getGenerateTemplateEmptyVariant(modeIndex);
  const managerVariant = GENERATE_TEMPLATE_MODAL_PLACEHOLDER_COUNT > 1 ? "duo" : emptyVariant;
  const title = item?.name ?? "Template";
  const selectedTemplateId =
    activeSlotIndex === null ? undefined : slotSelections[activeSlotIndex]?.templateId;
  const canGenerate = slotSelections.some((selection) => selection !== null);
  const isGenerationBusy = isGenerateTemplateStageBusy(stage);
  const isGenerationInFlight = isGenerateTemplateStageInFlight(stage);
  const previewVariant = getGenerateTemplatePreviewVariant(stage);

  const openContentPicker = React.useCallback(
    (slotIndex: number) => {
      setActiveSlotIndex(slotIndex);
      setChooseTemplateTypeTab(getGenerateTemplateChooseTemplateTypeTab(modeIndex));
      setAdvancedSettingsOpen(false);
      setChooseTemplateOpen(true);
      if (item) onSelectContent?.(item);
    },
    [item, modeIndex, onSelectContent],
  );

  const handleGenerate = () => {
    if (!item || !canGenerate || isGenerationBusy) return;
    onGenerate?.(item);
    startGeneration();
  };

  const handleSkipQueue = () => {
    if (stage !== "queuing") return;
    startGeneration({ skipQueue: true });
  };

  const handleSettingsClick = () => {
    setAdvancedSettingsOpen(true);
    onSettingsClick?.();
  };

  const handleAdvancedSettingsApply = (next: GenerateTemplateAdvancedSettingsValues) => {
    setAdvancedSettings(next);
    onSettingsApply?.(next);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setAdvancedSettingsOpen(false);
      setChooseTemplateOpen(false);
      setActiveSlotIndex(null);
      resetGeneration();
    }
    onOpenChange?.(nextOpen);
  };

  const handleGoToGallery = () => {
    handleOpenChange(false);
    onGoToGallery?.();
  };

  const handleChooseTemplateOpenChange = (nextOpen: boolean) => {
    setChooseTemplateOpen(nextOpen);
    if (!nextOpen) setActiveSlotIndex(null);
  };

  const handleTemplateSelect = (_templateId: string, template: ChooseTemplateItem) => {
    if (activeSlotIndex === null) {
      setChooseTemplateOpen(false);
      return;
    }

    const imageSrc = template.imageSrc?.trim() || template.insetImageSrc?.trim();
    if (!imageSrc) {
      setChooseTemplateOpen(false);
      setActiveSlotIndex(null);
      return;
    }

    setSlotSelections((previous) => {
      const next = [...previous];
      next[activeSlotIndex] = {
        templateId: template.id,
        imageSrc,
        imageAlt: template.name ?? template.imageAlt ?? title,
      };
      return next;
    });
    setChooseTemplateOpen(false);
    setActiveSlotIndex(null);
  };

  const handleDeleteSlot = React.useCallback((slotIndex: number) => {
    setSlotSelections((previous) => {
      const next = [...previous];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const managerSources = React.useMemo<TemplateManagerSourceSlot[]>(
    () =>
      slotSelections.map((selection, slotIndex) =>
        selection
          ? {
              variant: "loaded",
              imageSrc: selection.imageSrc,
              imageAlt: selection.imageAlt,
              loadedShowDelete: !isGenerationInFlight,
              onChangeClick: () => openContentPicker(slotIndex),
              onDeleteClick: () => handleDeleteSlot(slotIndex),
            }
          : {
              variant: emptyVariant,
              onSelectClick: () => openContentPicker(slotIndex),
            },
      ),
    [emptyVariant, handleDeleteSlot, isGenerationInFlight, openContentPicker, slotSelections],
  );

  return (
    <>
      <ModalLayout
        open={open}
        onOpenChange={handleOpenChange}
        title={title}
        titleIcon={<RecoveryIcon className="text-tooltip-text size-5" />}
        showIcon
        showMobileHandle
        freezeBackdrop
        overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
        closeLabel={GENERATE_TEMPLATE_MODAL_CLOSE_LABEL}
        className={cn(GENERATE_TEMPLATE_MODAL_CLASS, className)}
      >
        <div data-slot="generate-template-modal" className="flex flex-col gap-4">
          <DialogDescription className="sr-only">
            Choose a start image and generate a video from {title}.
          </DialogDescription>

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Buttons
                  key={tag}
                  type="button"
                  variant="neutral"
                  size="btn-xs"
                  leftIcon={false}
                  rightIcon={false}
                  label={tag}
                  tabIndex={-1}
                  className="h-6! w-auto! px-2! py-1!"
                />
              ))}
            </div>

            <button
              type="button"
              aria-label={
                liked ? GENERATE_TEMPLATE_MODAL_UNLIKE_LABEL : GENERATE_TEMPLATE_MODAL_LIKE_LABEL
              }
              aria-pressed={liked}
              onClick={() => setLiked((current) => !current)}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center"
            >
              <HeartIcon
                className="size-6"
                filled={liked}
                fillColor="var(--brand-primary)"
                strokeColor={liked ? "var(--brand-primary)" : "var(--tooltip-text)"}
              />
            </button>
          </div>

          <Tabs
            variant="compact"
            compactLayout="segmented"
            unstyled
            showTabIcon
            listLabel="Template mode"
            selected={modeIndex}
            onChange={setModeIndex}
            tabs={[...GENERATE_TEMPLATE_MODAL_MODE_TABS]}
            className="p-0!"
          />

          <TemplateManagerPair
            variant={managerVariant}
            size={isDesktop ? "desktop" : "mobile"}
            sources={managerSources}
            previewVariant={previewVariant}
            progressPercent={progressPercent}
            imageSrc={item?.imageSrc}
            imageAlt={title}
            onCancelClick={resetGeneration}
            showSkipQueue={SKIP_QUEUE_FEATURE_ENABLED}
            onSkipQueueClick={handleSkipQueue}
            className="w-full justify-center"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={GENERATE_TEMPLATE_MODAL_SETTINGS_LABEL}
              onClick={handleSettingsClick}
              className="border-surface-strong bg-tooltip-default-bg flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[32px] border"
            >
              <Image
                src={GENERATE_TEMPLATE_MODAL_SETTINGS_ICON_SRC}
                alt=""
                aria-hidden
                width={20}
                height={20}
                className="size-5"
              />
            </button>

            {isGenerationBusy ? (
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                leftIcon={false}
                rightIcon={false}
                label={GENERATE_TEMPLATE_MODAL_GALLERY_LABEL}
                onClick={handleGoToGallery}
                className="min-w-0 flex-1"
              />
            ) : (
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                leftIcon={false}
                rightIcon
                rightIconSrc={GENERATE_TEMPLATE_MODAL_TOKEN_ICON_SRC}
                rightIconSizeClassName="h-3.5! w-3.5!"
                label={GENERATE_TEMPLATE_MODAL_GENERATE_LABEL}
                disabled={!canGenerate}
                onClick={handleGenerate}
                className="min-w-0 flex-1 disabled:opacity-40"
              >
                <span className="text-sm leading-5 font-medium">
                  {GENERATE_TEMPLATE_MODAL_TOKEN_COST}
                </span>
              </Buttons>
            )}
          </div>
        </div>
      </ModalLayout>

      <GenerateTemplateAdvancedSettingsModal
        open={open && advancedSettingsOpen}
        onOpenChange={setAdvancedSettingsOpen}
        values={advancedSettings}
        onApply={handleAdvancedSettingsApply}
      />

      <ChooseTemplate
        open={open && chooseTemplateOpen}
        onOpenChange={handleChooseTemplateOpenChange}
        title={CHOOSE_TEMPLATE_DEFAULT_TITLE}
        showFilterTabs={false}
        showTemplateTypeTabs
        selectedTypeTab={chooseTemplateTypeTab}
        onTypeTabChange={setChooseTemplateTypeTab}
        selectedTemplateId={selectedTemplateId}
        onTemplateSelect={handleTemplateSelect}
        overlayClassName={cn(
          INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
          GENERATE_TEMPLATE_CHOOSE_TEMPLATE_OVERLAY_CLASS,
        )}
        contentClassName={GENERATE_TEMPLATE_CHOOSE_TEMPLATE_CLASS}
        closeLabel={GENERATE_TEMPLATE_CHOOSE_TEMPLATE_CLOSE_LABEL}
      />
    </>
  );
}
