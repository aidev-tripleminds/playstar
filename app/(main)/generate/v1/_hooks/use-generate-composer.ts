import * as React from "react";

import {
  CHOOSE_TEMPLATE_DEFAULT_ITEMS,
  type ChooseTemplateItem,
} from "@/components/common/chat/choose-template";
import {
  getPromptboxHybridDefaultPlaceholders,
  getPromptboxHybridDefaultTabIndex,
  getPromptboxHybridMediaForTab,
  isPromptboxHybridGuestUsageAtLimit,
  PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT,
  PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
  type PromptboxHybridPlaceholderSlot,
} from "@/components/common/generate/promptbox-hybrid";
import { useMe } from "@/hooks/use-me";
import { useMyCharacters } from "@/hooks/use-my-characters";
import type { MyCharacterListItem } from "@/lib/api/types";

import {
  buildCreateImageRequest,
  buildCreateVideoRequest,
  buildEditImageRequest,
  type GenerateMediaRequest,
  isPersistedCharacterId,
} from "../../_lib/generate-media";
import {
  GENERATE_ADVANCED_SETTINGS_DEFAULTS,
  GENERATE_SECTION_TABS,
  type GenerateAddAudioGeneratePayload,
  type GenerateAdvancedSettingsValues,
  type GenerateGalleryItem,
  type GenerateSectionTabId,
  getGenerateAdvancedSettingsFields,
  getGenerateChooseTemplateTitle,
  getGenerateChooseTemplateTypeTab,
  getGeneratePlaceholderSelectionKey,
  getGenerateProcessingKind,
  getGenerateStyleMode,
  isGenerateAudioPlaceholder,
} from "../_lib/constants";
import {
  type GeneratePreviewAction,
  getGeneratePreviewComposerTarget,
  resolveGenerateMediaSrc,
} from "../_lib/preview-actions";

type ImagePlaceholderSelection = {
  kind: "image";
  templateId: string;
  imageSrc: string;
  imageAlt?: string;
};

type AudioPlaceholderSelection = {
  kind: "audio";
  audioId: string;
  audioLabel: string;
  audioSrc: string;
};

type PlaceholderSelection = ImagePlaceholderSelection | AudioPlaceholderSelection;

type StartGenerateProcessingOptions = {
  kind: "image" | "video";
  skipQueue?: boolean;
  prompt?: string;
  request?: GenerateMediaRequest;
};

type RemixSource = {
  mediaId: string;
  characterId?: string | null;
  characterName?: string;
  action?: string | null;
  clothing?: string | null;
  location?: string | null;
};

type AnimateSource = {
  mediaId: string;
  characterId: string;
  characterName?: string;
  imageUrl: string;
};

type EditSource = {
  mediaId: string;
};

type UseGenerateComposerOptions = {
  sectionTabId: GenerateSectionTabId;
  onGenerate: (options: StartGenerateProcessingOptions) => void;
  initialCharacterId?: string;
};

export function useGenerateComposer({
  sectionTabId,
  onGenerate,
  initialCharacterId,
}: UseGenerateComposerOptions) {
  const { isLoggedIn, isPremium, isPremiumResolved } = useMe();
  const { data: myCharacters } = useMyCharacters();
  const [promptTab, setPromptTab] = React.useState(() =>
    getPromptboxHybridDefaultTabIndex(GENERATE_SECTION_TABS[0].media),
  );
  const [promptValue, setPromptValue] = React.useState("");
  const [placeholderSelections, setPlaceholderSelections] = React.useState<
    Record<string, PlaceholderSelection | null>
  >({});
  /** `true` = skip-queue toggle off → jobs enter the queue. `false` = skip enabled → bypass queue. */
  const [skipQueueDisabled, setSkipQueueDisabled] = React.useState(true);
  const [advancedSettings, setAdvancedSettings] = React.useState<GenerateAdvancedSettingsValues>(
    GENERATE_ADVANCED_SETTINGS_DEFAULTS,
  );
  const [chooseTemplateOpen, setChooseTemplateOpen] = React.useState(false);
  const [addAudioOpen, setAddAudioOpen] = React.useState(false);
  const [activePlaceholderIndex, setActivePlaceholderIndex] = React.useState<number | null>(null);
  const [chooseTemplateTypeTab, setChooseTemplateTypeTab] = React.useState(1);
  const [guestUsageCount, setGuestUsageCount] = React.useState(
    PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT,
  );
  const [premiumOpen, setPremiumOpen] = React.useState(false);
  const [remixSource, setRemixSource] = React.useState<RemixSource | null>(null);
  const [animateSource, setAnimateSource] = React.useState<AnimateSource | null>(null);
  const [editSource, setEditSource] = React.useState<EditSource | null>(null);

  const selectedSectionIndex = Math.max(
    0,
    GENERATE_SECTION_TABS.findIndex((tab) => tab.id === sectionTabId),
  );
  const activeSection = GENERATE_SECTION_TABS[selectedSectionIndex] ?? GENERATE_SECTION_TABS[0];
  const activePromptMedia = getPromptboxHybridMediaForTab(activeSection.media, promptTab);
  const guestUsageAtLimit = isPromptboxHybridGuestUsageAtLimit(
    guestUsageCount,
    PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
  );
  const promptLocked = !isPremiumResolved || !isPremium;
  const characterTemplates = React.useMemo<ChooseTemplateItem[]>(
    () =>
      (myCharacters?.items ?? [])
        .filter((character) => !character.removed_at)
        .map((character) => ({
          id: character.id,
          variant: "characters" as const,
          name: character.name,
          description: character.bio ?? undefined,
          imageSrc:
            character.webp_image_url_s3 ??
            character.image_url_s3 ??
            character.presigned_url ??
            "/assets/character-image-pending.png",
          imageAlt: character.name,
        })),
    [myCharacters],
  );
  const templatePickerItems = React.useMemo(
    () => [
      ...characterTemplates,
      ...CHOOSE_TEMPLATE_DEFAULT_ITEMS.filter((template) => template.variant !== "characters"),
    ],
    [characterTemplates],
  );

  const initialCharacterSelection = React.useMemo<ImagePlaceholderSelection | undefined>(() => {
    if (!initialCharacterId) return undefined;
    const template = characterTemplates.find((item) => item.id === initialCharacterId);
    const imageSrc = template?.imageSrc?.trim() || template?.insetImageSrc?.trim();
    if (!template || !imageSrc) return undefined;

    return {
      kind: "image",
      templateId: template.id,
      imageSrc,
      imageAlt: template.name ?? template.imageAlt,
    };
  }, [characterTemplates, initialCharacterId]);
  const initialCharacterSelectionKey = getGeneratePlaceholderSelectionKey("image-presets", 0);

  const placeholders = React.useMemo((): PromptboxHybridPlaceholderSlot[] => {
    const defaults = getPromptboxHybridDefaultPlaceholders(activePromptMedia);

    return defaults.map((slot, index) => {
      const selectionKey = getGeneratePlaceholderSelectionKey(activePromptMedia, index);
      const storedSelection = placeholderSelections[selectionKey];
      const selection =
        storedSelection === undefined && selectionKey === initialCharacterSelectionKey
          ? initialCharacterSelection
          : storedSelection;

      return {
        ...slot,
        ...(selection?.kind === "audio"
          ? {
              status: "audio" as const,
              audioLabel: selection.audioLabel,
            }
          : selection?.kind === "image"
            ? {
                status: "loaded" as const,
                imageSrc: selection.imageSrc,
                imageAlt: selection.imageAlt ?? slot.title,
              }
            : {}),
        onClick: () => {
          if (sectionTabId === "templates") return;

          setActivePlaceholderIndex(index);

          if (isGenerateAudioPlaceholder(slot.title)) {
            setAddAudioOpen(true);
            return;
          }

          setChooseTemplateTypeTab(
            getGenerateChooseTemplateTypeTab(slot.title, activePromptMedia, sectionTabId),
          );
          setChooseTemplateOpen(true);
        },
        onClear: () => {
          setPlaceholderSelections((previous) => {
            if (selectionKey === initialCharacterSelectionKey && initialCharacterSelection) {
              return { ...previous, [selectionKey]: null };
            }
            if (!(selectionKey in previous)) return previous;
            const next = { ...previous };
            delete next[selectionKey];
            return next;
          });
        },
      };
    });
  }, [
    activePromptMedia,
    initialCharacterSelection,
    initialCharacterSelectionKey,
    placeholderSelections,
    sectionTabId,
  ]);

  const chooseTemplateTitle = React.useMemo(() => {
    if (activePlaceholderIndex === null) return getGenerateChooseTemplateTitle(undefined);
    const slotTitle =
      getPromptboxHybridDefaultPlaceholders(activePromptMedia)[activePlaceholderIndex]?.title;
    return getGenerateChooseTemplateTitle(slotTitle);
  }, [activePlaceholderIndex, activePromptMedia]);

  const selectedAddAudioId = React.useMemo(() => {
    if (activePlaceholderIndex === null) return undefined;
    const selectionKey = getGeneratePlaceholderSelectionKey(
      activePromptMedia,
      activePlaceholderIndex,
    );
    const selection = placeholderSelections[selectionKey];
    return selection?.kind === "audio" ? selection.audioId : undefined;
  }, [activePlaceholderIndex, activePromptMedia, placeholderSelections]);

  const handleSectionTabChange = React.useCallback((index: number) => {
    const nextTab = GENERATE_SECTION_TABS[index];
    if (!nextTab) return;
    setPromptTab(getPromptboxHybridDefaultTabIndex(nextTab.media));
  }, []);

  const consumeGuestUsageOrUpsell = () => {
    if (guestUsageAtLimit) {
      setPremiumOpen(true);
      return false;
    }
    setGuestUsageCount((previous) => Math.max(previous - 1, 0));
    return true;
  };

  const startGenerate = React.useCallback(() => {
    const kind = getGenerateProcessingKind(sectionTabId, activePromptMedia);
    let request: GenerateMediaRequest | undefined;

    if (isLoggedIn && activePromptMedia === "image-presets") {
      const characterKey = getGeneratePlaceholderSelectionKey("image-presets", 0);
      const storedCharacterSelection = placeholderSelections[characterKey];
      const characterSelection =
        storedCharacterSelection === undefined
          ? initialCharacterSelection
          : storedCharacterSelection;
      const placeholderCharacterId =
        characterSelection?.kind === "image" ? characterSelection.templateId : undefined;
      const remixCharacterId = remixSource?.characterId;
      const characterId = isPersistedCharacterId(remixCharacterId)
        ? remixCharacterId
        : isPersistedCharacterId(placeholderCharacterId)
          ? placeholderCharacterId
          : undefined;
      const selectedCharacter = myCharacters?.items.find(
        (item: MyCharacterListItem) => item.id === characterId,
      );
      const characterName =
        remixSource?.characterName?.trim() ||
        selectedCharacter?.name ||
        (characterSelection?.kind === "image" ? characterSelection.imageAlt?.trim() : undefined);
      const characterImageSrc =
        (characterSelection?.kind === "image"
          ? resolveGenerateMediaSrc(characterSelection.imageSrc)
          : undefined) ||
        selectedCharacter?.webp_image_url_s3 ||
        selectedCharacter?.image_url_s3 ||
        selectedCharacter?.presigned_url ||
        undefined;

      request = buildCreateImageRequest({
        sourceMediaId: remixSource?.mediaId,
        prompt: promptValue,
        characterId,
        characterName,
        characterImageSrc,
        action: remixSource?.action,
        clothing: remixSource?.clothing,
        location: remixSource?.location,
        aspectRatio: advancedSettings.aspectRatio,
        numImages: Number.parseInt(advancedSettings.generations, 10),
      });
    } else if (isLoggedIn && activePromptMedia === "image-edit" && editSource) {
      request = buildEditImageRequest({
        sourceMediaId: editSource.mediaId,
        prompt: promptValue,
        numImages: Number.parseInt(advancedSettings.generations, 10),
      });
    } else if (isLoggedIn && activePromptMedia === "video-image2vid" && animateSource) {
      request = buildCreateVideoRequest({
        characterId: animateSource.characterId,
        sourceMediaId: animateSource.mediaId,
        characterName: animateSource.characterName,
        prompt: promptValue,
        aspectRatio: advancedSettings.aspectRatio,
      });
    }

    onGenerate({
      kind,
      skipQueue: !skipQueueDisabled,
      prompt: promptValue,
      request,
    });
  }, [
    activePromptMedia,
    advancedSettings.generations,
    advancedSettings.aspectRatio,
    animateSource,
    editSource,
    initialCharacterSelection,
    isLoggedIn,
    myCharacters,
    onGenerate,
    placeholderSelections,
    promptValue,
    remixSource,
    sectionTabId,
    skipQueueDisabled,
  ]);

  const loadFromPreview = React.useCallback(
    async (action: GeneratePreviewAction, item: GenerateGalleryItem) => {
      const target = getGeneratePreviewComposerTarget(action, item);
      setPromptTab(target.promptTab);

      const imageUrl = resolveGenerateMediaSrc(item.src);
      const imageKey = getGeneratePlaceholderSelectionKey(target.media, 0);

      if (action === "animate") {
        setRemixSource(null);
        setEditSource(null);
        if (item.characterId && item.mediaId) {
          setAnimateSource({
            mediaId: item.mediaId,
            characterId: item.characterId,
            characterName: item.characterName,
            imageUrl,
          });
        } else {
          setAnimateSource(null);
        }
        setPlaceholderSelections((previous) => ({
          ...previous,
          [imageKey]: {
            kind: "image",
            templateId: item.mediaId ?? item.id,
            imageSrc: imageUrl,
            imageAlt: item.alt,
          },
        }));
        return;
      }

      if (action === "extend") {
        setRemixSource(null);
        setAnimateSource(null);
        setEditSource(item.mediaId ? { mediaId: item.mediaId } : null);
        setPlaceholderSelections((previous) => ({
          ...previous,
          [imageKey]: {
            kind: "image",
            templateId: item.mediaId ?? item.id,
            imageSrc: imageUrl,
            imageAlt: item.alt,
          },
        }));
        return;
      }

      if (action === "edit") {
        setAnimateSource(null);
        setRemixSource(null);
        setEditSource(item.mediaId ? { mediaId: item.mediaId } : null);
        setPlaceholderSelections((previous) => ({
          ...previous,
          [imageKey]: {
            kind: "image",
            templateId: item.mediaId ?? item.id,
            imageSrc: imageUrl,
            imageAlt: item.alt,
          },
        }));
        return;
      }

      setAnimateSource(null);
      setEditSource(null);
      const characterKey = getGeneratePlaceholderSelectionKey("image-presets", 0);
      setRemixSource({
        mediaId: item.mediaId ?? item.id,
        characterId: item.characterId,
        characterName: item.characterName,
        action: item.pose,
      });
      if (item.characterId && item.characterImageSrc) {
        setPlaceholderSelections((previous) => ({
          ...previous,
          [characterKey]: {
            kind: "image",
            templateId: item.characterId ?? item.id,
            imageSrc: item.characterImageSrc ?? imageUrl,
            imageAlt: item.characterName,
          },
        }));
      }
      if (item.prompt) {
        setPromptValue(item.prompt);
      }

      if (item.mediaId) {
        setRemixSource({
          mediaId: item.mediaId,
          characterId: item.characterId ?? null,
          characterName: item.characterName,
          action: item.pose,
        });
      }
    },
    [],
  );

  /**
   * Desktop PromptboxHybrid owns guest decrement via onGuestUsageCountChange.
   * Parent only opens upsell when free generations are exhausted.
   */
  const handlePromptboxGenerate: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!isLoggedIn && guestUsageAtLimit) {
      setPremiumOpen(true);
      return;
    }
    startGenerate();
  };

  const handleMobileGenerate: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!isLoggedIn) {
      const allowed = consumeGuestUsageOrUpsell();
      if (!allowed) return;
      startGenerate();
      return;
    }
    startGenerate();
  };

  const handleChooseTemplateOpenChange = (open: boolean) => {
    setChooseTemplateOpen(open);
    if (!open) {
      setActivePlaceholderIndex(null);
    }
  };

  const handleAddAudioOpenChange = (open: boolean) => {
    setAddAudioOpen(open);
    if (!open) {
      setActivePlaceholderIndex(null);
    }
  };

  const handleTemplateSelect = (templateId: string, template: ChooseTemplateItem) => {
    if (activePlaceholderIndex === null) {
      setChooseTemplateOpen(false);
      return;
    }

    const imageSrc = template.imageSrc?.trim() || template.insetImageSrc?.trim();
    if (!imageSrc) {
      setChooseTemplateOpen(false);
      setActivePlaceholderIndex(null);
      return;
    }

    const selectionKey = getGeneratePlaceholderSelectionKey(
      activePromptMedia,
      activePlaceholderIndex,
    );

    setPlaceholderSelections((previous) => ({
      ...previous,
      [selectionKey]: {
        kind: "image",
        templateId,
        imageSrc,
        imageAlt: template.name ?? template.imageAlt,
      },
    }));
    setChooseTemplateOpen(false);
    setActivePlaceholderIndex(null);
  };

  const handleAddAudioGenerate = (payload: GenerateAddAudioGeneratePayload) => {
    const selectedAudio = payload.audio;

    if (selectedAudio && activePlaceholderIndex !== null) {
      const selectionKey = getGeneratePlaceholderSelectionKey(
        activePromptMedia,
        activePlaceholderIndex,
      );

      setPlaceholderSelections((previous) => ({
        ...previous,
        [selectionKey]: {
          kind: "audio",
          audioId: selectedAudio.id,
          audioLabel: selectedAudio.label,
          audioSrc: selectedAudio.audioSrc,
        },
      }));
    }

    setAddAudioOpen(false);
    setActivePlaceholderIndex(null);
  };

  const handleAdvancedSettingsApply = (next: GenerateAdvancedSettingsValues) => {
    setAdvancedSettings(next);
    setSkipQueueDisabled(next.autoSkipQueue === "no");
  };

  return {
    isLoggedIn,
    promptLocked,
    characterTemplates,
    templatePickerItems,
    activeSection,
    activePromptMedia,
    promptTab,
    setPromptTab,
    promptValue,
    setPromptValue,
    placeholders,
    skipQueueDisabled,
    setSkipQueueDisabled,
    advancedSettings,
    advancedSettingsFields: getGenerateAdvancedSettingsFields(activePromptMedia),
    styleMode: getGenerateStyleMode(activePromptMedia),
    handleAdvancedSettingsApply,
    guestUsageCount,
    setGuestUsageCount,
    guestUsageAtLimit,
    premiumOpen,
    setPremiumOpen,
    chooseTemplateOpen,
    chooseTemplateTitle,
    chooseTemplateTypeTab,
    setChooseTemplateTypeTab,
    handleChooseTemplateOpenChange,
    handleTemplateSelect,
    addAudioOpen,
    selectedAddAudioId,
    handleAddAudioOpenChange,
    handleAddAudioGenerate,
    handleSectionTabChange,
    handlePromptboxGenerate,
    handleMobileGenerate,
    loadFromPreview,
  };
}
