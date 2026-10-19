import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import {
  CHOOSE_TEMPLATE_DEFAULT_ITEMS,
  type ChooseTemplateItem,
} from "@/components/common/chat/choose-template";
import type { SelectFileSelection } from "@/components/common/general/select-file-v2";
import type { InfoButtonStatus } from "@/components/common/generate/info-button";
import {
  getPromptBoxCheckpointOptions,
  isPromptBoxCheckpointPremium,
  isPromptBoxVideoMedia,
  PROMPT_BOX_CHECKPOINT_IMAGE_DEFAULT_VALUE,
  PROMPT_BOX_CHECKPOINT_VIDEO_DEFAULT_VALUE,
  PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID,
  PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
  PROMPT_BOX_VIDEO_MODE_DEFAULT_VALUE,
  type PromptBoxActionItem,
  type PromptBoxMedia,
  type PromptBoxPlaceholderSlot,
} from "@/components/common/generate/prompt-box";
import { EMPTY_GENERATE_OPTIONS, useGenerateOptions } from "@/hooks/use-generate-options";
import { useMe } from "@/hooks/use-me";
import { useMyCharacters } from "@/hooks/use-my-characters";
import { fetchRemixParams } from "@/lib/api/character-media";
import { fetchExplorePreview } from "@/lib/api/explore";
import type { MyCharacterListItem } from "@/lib/api/types";
import { useAssetMap } from "@/lib/assets/asset-map-context";
import { characterCardSrc } from "@/lib/media-card-sources";

import {
  buildCreateImageRequest,
  buildCreateVideoRequest,
  buildEditImageRequest,
  buildEditVideoRequest,
  buildExtendVideoRequest,
  buildTextToVideoRequest,
  type GenerateMediaRequest,
  isPersistedCharacterId,
} from "../../_lib/generate-media";
import {
  canAffordGenerateTokens,
  canEnableGenerateSkipQueue,
  GENERATE_DEFAULT_ASPECT_RATIO,
  GENERATE_DEFAULT_DURATION,
  GENERATE_DEFAULT_GENERATION_COUNT,
  GENERATE_DEFAULT_RESOLUTION,
  GENERATE_DEFAULT_VIDEO_ASPECT_RATIO,
  GENERATE_TOKEN_COST,
  type GenerateAddAudioGeneratePayload,
  getAvailableGenerateTokenBalance,
  getGenerateChooseTemplateTitle,
  getGenerateChooseTemplateTypeTab,
  getGenerateControlButtons,
  getGenerateCreateKind,
  getGeneratePickerCatalogVariant,
  getGeneratePromptActionState,
  getGenerateSourceSlots,
  isGeneratePromptInteractive,
  parseGenerateDurationSeconds,
  parseGenerateGenerationCount,
  shouldShowGenerateChooseTemplateTypeTabs,
} from "../_lib/constants";
import { editImageLoadTarget } from "../_lib/edit-image-picker";
import {
  getGenerateImageActionValue,
  getGenerateSourceFieldValue,
  getGenerateSourcePickerItems,
  getGenerateVideoActionValue,
  getStoredGenerateOptionValue,
} from "../_lib/generate-source-assets";
import {
  hasSeenGenerateInfoTutorial,
  markGenerateInfoTutorialSeen,
  subscribeGenerateInfoTutorialSeen,
} from "../_lib/info-tutorial-session";
import { type GeneratePreviewAction, resolveGenerateMediaSrc } from "../_lib/preview-actions";
import {
  type GeneratePromptTagSlot,
  getGeneratePromptTagActions,
  getGeneratePromptTagSlot,
  shouldShowGeneratePromptTagSeeAll,
} from "../_lib/prompt-tag-recommendations";
import { textImagePickerItems } from "../_lib/text-image-picker";
import { textVideoActionIds, textVideoPickerItems } from "../_lib/text-video-picker";
import type {
  GenerateCreatePayload,
  GenerateGalleryItem,
  GenerateSectionTabId,
  GenerateSourceSelection,
  GenerateSourceSlotId,
} from "../_lib/types";

type AnimateSource = {
  mediaId: string;
  characterId: string;
  characterName?: string;
};

type RemixSource = {
  mediaId: string;
  characterId?: string | null;
  characterName?: string;
  action?: string | null;
  clothing?: string | null;
  location?: string | null;
};

type EditSource = {
  mediaId: string;
};

type PickerTarget = GenerateSourceSlotId | "see-all";

type GenerateComposerSources = Partial<Record<GenerateSourceSlotId, GenerateSourceSelection>>;

/** Thumbnails that show the selected name. Image, video, and audio stay unlabeled. */
const SOURCE_SLOTS_WITH_CAPTION = new Set<GenerateSourceSlotId>([
  "character",
  "action",
  "clothing",
  "location",
]);

function withoutCatalogSources(previous: GenerateComposerSources): GenerateComposerSources {
  if (!previous.action && !previous.clothing && !previous.location) {
    return previous;
  }
  const next = { ...previous };
  delete next.action;
  delete next.clothing;
  delete next.location;
  return next;
}

type UseGenerateComposerOptions = {
  sectionTabId: GenerateSectionTabId;
  onGenerate: (payload: GenerateCreatePayload) => void;
  /** Runs after a generate actually starts (not login/upgrade gates). */
  onAfterGenerate?: () => void;
  onUpgrade?: () => void;
  /** `Character.id` from the `?character=` entry point (My AIs → Generate). */
  initialCharacterId?: string;
  /** Tokens already reserved by queued or in-flight generates. */
  reservedTokenCost?: number;
};

export function useGenerateComposer({
  sectionTabId,
  onGenerate,
  onAfterGenerate,
  onUpgrade,
  initialCharacterId,
  reservedTokenCost = 0,
}: UseGenerateComposerOptions) {
  const {
    session,
    isLoggedIn,
    isSessionPending,
    isPremium,
    isPremiumResolved,
    isPremiumPlan,
    isInfinitePlan,
    tokenBalance,
  } = useMe();
  const { data: myCharacters, refetch: refetchMyCharacters } = useMyCharacters();
  // No options while the request is pending or after it failed: the pickers
  // are empty and the rest of the page works.
  const generateOptions = useGenerateOptions().data ?? EMPTY_GENERATE_OPTIONS;
  // The live map, so an option added in the admin shows its media without a rebuild.
  const assetMap = useAssetMap();
  const [promptValue, setPromptValue] = React.useState("");
  const [imageMode, setImageMode] = React.useState<PromptBoxMedia>(
    PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
  );
  const [videoMode, setVideoMode] = React.useState<PromptBoxMedia>(
    PROMPT_BOX_VIDEO_MODE_DEFAULT_VALUE,
  );
  const [sources, setSources] = React.useState<GenerateComposerSources>({});
  const [aspectRatio, setAspectRatio] = React.useState(GENERATE_DEFAULT_ASPECT_RATIO);
  const [videoAspectRatio, setVideoAspectRatio] = React.useState(
    GENERATE_DEFAULT_VIDEO_ASPECT_RATIO,
  );
  const [generationCount, setGenerationCount] = React.useState(GENERATE_DEFAULT_GENERATION_COUNT);
  const [resolution, setResolution] = React.useState(GENERATE_DEFAULT_RESOLUTION);
  const [duration, setDuration] = React.useState(GENERATE_DEFAULT_DURATION);
  const [imageCheckpointValue, setImageCheckpointValue] = React.useState(
    PROMPT_BOX_CHECKPOINT_IMAGE_DEFAULT_VALUE,
  );
  const [videoCheckpointValue, setVideoCheckpointValue] = React.useState(
    PROMPT_BOX_CHECKPOINT_VIDEO_DEFAULT_VALUE,
  );
  const [skipQueueDisabled, setSkipQueueDisabled] = React.useState(true);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [dismissedInfoTutorial, setDismissedInfoTutorial] = React.useState(false);
  const storedHasSeenInfoTutorial = React.useSyncExternalStore(
    subscribeGenerateInfoTutorialSeen,
    hasSeenGenerateInfoTutorial,
    () => false,
  );
  const hasSeenInfoTutorial = dismissedInfoTutorial || storedHasSeenInfoTutorial;
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerTarget, setPickerTarget] = React.useState<PickerTarget>("character");
  const [trackedSection, setTrackedSection] = React.useState(sectionTabId);
  if (trackedSection !== sectionTabId) {
    setTrackedSection(sectionTabId);
    if (pickerOpen) setPickerOpen(false);
  }
  const [addAudioOpen, setAddAudioOpen] = React.useState(false);
  const [animateSource, setAnimateSource] = React.useState<AnimateSource | null>(null);
  const [remixSource, setRemixSource] = React.useState<RemixSource | null>(null);
  const [editSource, setEditSource] = React.useState<EditSource | null>(null);
  const [seededCharacterId, setSeededCharacterId] = React.useState<string | null>(null);
  const previewLoadIdRef = React.useRef(0);

  /**
   * The picker's Characters tab must list the visitor's own My AIs — the mock
   * `template-N` catalog entries are not `Character.id` values, so a selection
   * made from them can never reach create-image (`isPersistedCharacterId`).
   */
  const characterTemplates = React.useMemo<ChooseTemplateItem[]>(() => {
    const items: MyCharacterListItem[] = myCharacters?.items ?? [];
    return items
      .filter((character) => !character.removed_at)
      .map((character) => ({
        id: character.id,
        variant: "characters" as const,
        name: character.name,
        // Empty string, never undefined: AiModel substitutes dummy copy when
        // description is omitted.
        description: character.bio ?? "",
        imageSrc:
          characterCardSrc(character) ??
          character.presigned_url ??
          "/assets/character-image-pending.png",
        imageAlt: character.name,
        blurred: character.blurred === true,
      }));
  }, [myCharacters]);
  /**
   * Characters whose portrait was uploaded (`can_generate_from: false`) cannot
   * seed new images; videos read the portrait directly, so they still can.
   */
  const imageBlockedCharacterIds = React.useMemo(
    () =>
      new Set(
        (myCharacters?.items ?? [])
          .filter((character) => character.can_generate_from === false)
          .map((character) => character.id),
      ),
    [myCharacters],
  );

  const ownedInitialCharacter = characterTemplates.find(
    (template) => template.id === initialCharacterId,
  );
  const publicCharacterQuery = useQuery({
    queryKey: ["explore", "preview", session?.user.id ?? "guest", initialCharacterId],
    queryFn: () => fetchExplorePreview(initialCharacterId!),
    enabled: Boolean(initialCharacterId) && !isSessionPending && !ownedInitialCharacter,
    retry: false,
  });
  const publicCharacter = publicCharacterQuery.data?.character;
  const isLinkedCharacterPending = Boolean(
    initialCharacterId &&
    seededCharacterId !== initialCharacterId &&
    !ownedInitialCharacter &&
    publicCharacterQuery.isPending,
  );

  /** Seed once from My AIs or the public preview, preserving later user changes. */
  const initialCharacterTemplate =
    initialCharacterId && seededCharacterId !== initialCharacterId
      ? (ownedInitialCharacter ??
        (publicCharacter && {
          id: publicCharacter.id,
          name: publicCharacter.name,
          imageSrc: characterCardSrc(publicCharacter),
          imageAlt: publicCharacter.name,
        }))
      : undefined;

  const initialCharacterBlocksImages =
    sectionTabId !== "videos" &&
    (ownedInitialCharacter
      ? imageBlockedCharacterIds.has(ownedInitialCharacter.id)
      : publicCharacter?.can_generate_from === false);

  if (initialCharacterId && initialCharacterTemplate?.imageSrc && !initialCharacterBlocksImages) {
    setSeededCharacterId(initialCharacterId);
    setSources((previous) => ({
      ...previous,
      character: {
        kind: "image",
        id: initialCharacterTemplate.id,
        imageSrc: initialCharacterTemplate.imageSrc ?? "",
        imageAlt: initialCharacterTemplate.imageAlt ?? initialCharacterTemplate.name ?? "character",
        label: initialCharacterTemplate.name ?? "character",
      },
    }));
  }

  const rememberInfoTutorialSeen = React.useCallback(() => {
    markGenerateInfoTutorialSeen();
    setDismissedInfoTutorial(true);
  }, []);

  const handleInfoOpenChange = React.useCallback(
    (open: boolean) => {
      if (infoOpen && !open) {
        rememberInfoTutorialSeen();
      }
      setInfoOpen(open);
    },
    [infoOpen, rememberInfoTutorialSeen],
  );

  const isInteractive = isGeneratePromptInteractive(sectionTabId);
  const media = sectionTabId === "videos" ? videoMode : imageMode;
  const sourceSlots = getGenerateSourceSlots(media);
  const isVideoMedia = isPromptBoxVideoMedia(media);
  const [trackedVideoMedia, setTrackedVideoMedia] = React.useState(isVideoMedia);
  if (trackedVideoMedia !== isVideoMedia) {
    setTrackedVideoMedia(isVideoMedia);
    // An image pose is not a video action and a timeline is not a pose. Drop
    // the action that the new request would ignore, so no slot shows it.
    const actionValue = isVideoMedia
      ? getGenerateVideoActionValue(sources.action)
      : getGenerateImageActionValue(sources.action);
    if (sources.action && !actionValue) {
      setSources((previous) => {
        const next = { ...previous };
        delete next.action;
        return next;
      });
    }
  }
  const selectableCharacterTemplates = isVideoMedia
    ? characterTemplates
    : characterTemplates.filter((template) => !imageBlockedCharacterIds.has(template.id));
  const catalogPickerItems = [
    ...selectableCharacterTemplates,
    ...CHOOSE_TEMPLATE_DEFAULT_ITEMS.filter((template) => template.variant !== "characters"),
  ];
  const pickerCatalogVariant = getGeneratePickerCatalogVariant(pickerTarget, media);
  const sourcePickerItems = getGenerateSourcePickerItems(
    pickerTarget,
    media,
    generateOptions,
    assetMap,
  );
  // An option picker lists the backend's options only, even when there are
  // none: the demo catalog is not something create-image accepts.
  const isOptionPicker =
    pickerTarget === "action" ||
    pickerTarget === "see-all" ||
    pickerTarget === "clothing" ||
    pickerTarget === "location";
  const templatePickerItems =
    pickerCatalogVariant === "characters"
      ? selectableCharacterTemplates
      : isOptionPicker
        ? sourcePickerItems
        : pickerCatalogVariant === "images"
          ? catalogPickerItems.filter((template) => template.variant === "images")
          : pickerCatalogVariant === "videos"
            ? catalogPickerItems.filter((template) => template.variant === "videos")
            : catalogPickerItems;
  const selectedCharacter =
    sources.character && sources.character.kind !== "audio" ? sources.character : undefined;
  const textImageItems = React.useMemo(() => {
    // Every My AI, so a finished portrait stays visible in Text to Image.
    const characters = characterTemplates.map((template) => ({
      id: template.id,
      name: template.name ?? template.id,
      imageSrc: template.imageSrc,
    }));
    if (
      selectedCharacter &&
      !characters.some((character) => character.id === selectedCharacter.id)
    ) {
      characters.unshift({
        id: selectedCharacter.id,
        name: selectedCharacter.label || selectedCharacter.imageAlt,
        imageSrc: selectedCharacter.imageSrc,
      });
    }
    return textImagePickerItems(characters, generateOptions, assetMap);
  }, [assetMap, characterTemplates, generateOptions, selectedCharacter]);
  const textVideoItems = React.useMemo(() => {
    const characters = characterTemplates.map((template) => ({
      id: template.id,
      name: template.name ?? template.id,
      imageSrc: template.imageSrc,
    }));
    if (
      selectedCharacter &&
      !characters.some((character) => character.id === selectedCharacter.id)
    ) {
      characters.unshift({
        id: selectedCharacter.id,
        name: selectedCharacter.label || selectedCharacter.imageAlt,
        imageSrc: selectedCharacter.imageSrc,
      });
    }
    return textVideoPickerItems(characters, generateOptions, assetMap);
  }, [assetMap, characterTemplates, generateOptions, selectedCharacter]);
  const selectedAction =
    sources.action && sources.action.kind !== "audio" ? sources.action : undefined;
  const promptTagSlot = getGeneratePromptTagSlot(
    media,
    sources,
    selectableCharacterTemplates,
    (slot) => getGenerateSourcePickerItems(slot, media, generateOptions, assetMap).length > 0,
  );
  const promptActions = getGeneratePromptTagActions({
    slot: promptTagSlot,
    characterTemplates: selectableCharacterTemplates,
    sourceItems:
      promptTagSlot === "custom-prompt"
        ? undefined
        : getGenerateSourcePickerItems(promptTagSlot, media, generateOptions, assetMap),
  });
  const showSeeAll = shouldShowGeneratePromptTagSeeAll(promptTagSlot);
  const showPickerTypeTabs = shouldShowGenerateChooseTemplateTypeTabs(pickerTarget, media);
  const checkpointValue = isVideoMedia ? videoCheckpointValue : imageCheckpointValue;
  const resolvedAspectRatio = isVideoMedia ? videoAspectRatio : aspectRatio;
  const setResolvedAspectRatio = isVideoMedia ? setVideoAspectRatio : setAspectRatio;
  const createKind = getGenerateCreateKind(sectionTabId);
  const canEnableSkipQueue = canEnableGenerateSkipQueue({
    isLoggedIn,
    isPremiumResolved,
    isPremium,
    isPremiumPlan,
    isInfinitePlan,
  });
  const isTrialUser = isLoggedIn && isPremiumResolved && !isPremium;
  const availableTokenBalance = getAvailableGenerateTokenBalance(tokenBalance, reservedTokenCost);

  if (!canEnableSkipQueue && !skipQueueDisabled) {
    setSkipQueueDisabled(true);
  }

  const handleSkipQueueDisabledChange = React.useCallback(
    (disabled: boolean) => {
      if (!isInteractive || !canEnableSkipQueue) {
        setSkipQueueDisabled(true);
        return;
      }

      setSkipQueueDisabled(disabled);
    },
    [canEnableSkipQueue, isInteractive],
  );
  const promptAction = getGeneratePromptActionState({
    isLoggedIn,
    isSessionPending,
    isPremium,
    isPremiumResolved,
    tokenBalance: availableTokenBalance,
    tokenCost: GENERATE_TOKEN_COST,
  });

  const openPicker = React.useCallback(
    (target: PickerTarget) => {
      if (!isInteractive) return;
      setPickerTarget(target);
      setPickerOpen(true);
      if (isLoggedIn) {
        void refetchMyCharacters();
      }
    },
    [isInteractive, isLoggedIn, refetchMyCharacters],
  );

  if (!isInteractive) {
    if (pickerOpen) setPickerOpen(false);
    if (addAudioOpen) setAddAudioOpen(false);
    if (infoOpen) setInfoOpen(false);
  }

  const placeholders = React.useMemo((): PromptBoxPlaceholderSlot[] => {
    return sourceSlots.map((slot) => {
      const selection = sources[slot.id];
      const isAudioSlot = slot.id === "audio";
      const audioSelection = selection?.kind === "audio" ? selection : undefined;
      const imageSelection = selection && selection.kind !== "audio" ? selection : undefined;

      return {
        title: slot.title,
        subtitle: slot.subtitle,
        kind: isAudioSlot ? "audio" : "image",
        selected: Boolean(selection),
        imageSrc: imageSelection?.imageSrc,
        imageAlt: imageSelection?.imageAlt ?? slot.title,
        caption: SOURCE_SLOTS_WITH_CAPTION.has(slot.id) ? imageSelection?.label : undefined,
        audioSrc: audioSelection?.audioSrc,
        audioLabel: audioSelection?.audioLabel ?? slot.title,
        onClick: (event) => {
          event.preventDefault();
          if (!isInteractive) return;
          if (isAudioSlot) {
            setAddAudioOpen(true);
            return;
          }
          openPicker(slot.id);
        },
        onClear: () => {
          if (slot.id === "character") setSeededCharacterId(initialCharacterId ?? null);
          if (slot.id === "image" || slot.id === "video") {
            setEditSource(null);
            setAnimateSource(null);
          }
          setSources((previous) => {
            if (!(slot.id in previous)) return previous;
            const next = { ...previous };
            delete next[slot.id];
            return next;
          });
        },
      };
    });
  }, [initialCharacterId, isInteractive, openPicker, sourceSlots, sources]);

  const handleGenerationCountChange = React.useCallback((value: string) => {
    setGenerationCount(value);
  }, []);

  const controlButtons = React.useMemo(
    () =>
      getGenerateControlButtons({
        media,
        aspectRatio: resolvedAspectRatio,
        generationCount,
        resolution,
        duration,
        onAspectRatioChange: setResolvedAspectRatio,
        onGenerationCountChange: handleGenerationCountChange,
        onResolutionChange: setResolution,
        onDurationChange: setDuration,
      }),
    [
      duration,
      generationCount,
      handleGenerationCountChange,
      media,
      resolution,
      resolvedAspectRatio,
      setResolvedAspectRatio,
    ],
  );

  const applyTagSelection = React.useCallback(
    (slotId: Exclude<GeneratePromptTagSlot, "custom-prompt">, action: PromptBoxActionItem) => {
      if (slotId === "character") setSeededCharacterId(initialCharacterId ?? null);

      const imageSrc = action.imageSrc ?? "";

      setSources((previous) => ({
        ...previous,
        [slotId]: {
          kind: "image",
          id: action.id ?? action.label,
          imageSrc,
          imageAlt: action.imageAlt ?? action.label,
          label: action.label,
        },
      }));
    },
    [initialCharacterId],
  );

  const handleActionClick = React.useCallback(
    (action: PromptBoxActionItem, event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isInteractive) return;

      if (action.id === PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID) {
        if (!isPremiumResolved || !isPremium) {
          event.preventDefault();
          if (isPremiumResolved) {
            onUpgrade?.();
          }
          return;
        }

        return;
      }

      event.preventDefault();

      const slotId = promptTagSlot === "custom-prompt" ? "action" : promptTagSlot;
      applyTagSelection(slotId, action);
    },
    [
      applyTagSelection,
      isInteractive,
      isPremium,
      isPremiumResolved,
      onUpgrade,
      promptTagSlot,
    ],
  );

  const handleTemplateSelect = React.useCallback(
    (templateId: string, template: ChooseTemplateItem) => {
      if (pickerTarget === "audio") {
        setPickerOpen(false);
        return;
      }

      const imageSrc = template.imageSrc ?? template.insetImageSrc ?? "";
      const slotId: GenerateSourceSlotId = pickerTarget === "see-all" ? "action" : pickerTarget;
      const isCatalogSlot = slotId === "action" || slotId === "clothing" || slotId === "location";
      if (!imageSrc && !isCatalogSlot) {
        setPickerOpen(false);
        return;
      }
      if (slotId === "character") setSeededCharacterId(initialCharacterId ?? null);

      if (slotId === "image" || slotId === "video") {
        setEditSource(null);
        setAnimateSource(null);
      }

      setSources((previous) => ({
        ...previous,
        [slotId]: {
          kind: "image",
          id: templateId,
          imageSrc,
          imageAlt: template.imageAlt ?? template.name ?? slotId,
          label: template.name ?? slotId,
        },
      }));
      setPickerOpen(false);
    },
    [initialCharacterId, pickerTarget],
  );

  const handleTextImageConfirm = React.useCallback(
    (selection: SelectFileSelection) => {
      setSeededCharacterId(initialCharacterId ?? null);
      setSources((previous) => {
        const next = { ...previous };
        const entries = [
          ["character", selection.characters],
          ["action", selection.actions],
          ["clothing", selection.clothings],
          ["location", selection.location],
        ] as const;

        for (const [slotId, item] of entries) {
          if (!item) {
            delete next[slotId];
            continue;
          }
          next[slotId] = {
            kind: "image",
            id: item.id,
            imageSrc: item.imageSrc ?? "",
            imageAlt: item.name,
            label: item.name,
          };
        }
        return next;
      });
      setPickerOpen(false);
    },
    [initialCharacterId],
  );

  const handleTextVideoConfirm = React.useCallback(
    (selection: SelectFileSelection) => {
      setSeededCharacterId(initialCharacterId ?? null);
      const clips = selection.actionClips?.length
        ? [...selection.actionClips]
        : selection.actions
          ? [selection.actions]
          : [];

      setSources((previous) => {
        const next = { ...previous };
        const entries = [
          ["character", selection.characters],
          ["clothing", selection.clothings],
          ["location", selection.location],
        ] as const;

        for (const [slotId, item] of entries) {
          if (!item) {
            delete next[slotId];
            continue;
          }
          next[slotId] = {
            kind: "image",
            id: item.id,
            imageSrc: item.imageSrc ?? "",
            imageAlt: item.name,
            label: item.name,
          };
        }

        if (clips.length === 0) {
          delete next.action;
        } else {
          next.action = {
            kind: "image",
            id: clips[0].id,
            imageSrc: clips[0].imageSrc ?? "",
            imageAlt: clips[0].name,
            label: clips.map((clip) => clip.name).join(", "),
            clips: clips.map((clip) => ({
              id: clip.id,
              label: clip.name,
              imageSrc: clip.imageSrc ?? "",
            })),
          };
        }
        return next;
      });
      setPickerOpen(false);
    },
    [initialCharacterId],
  );

  const handleImageToVideoConfirm = React.useCallback(
    (item: {
      id: string;
      name: string;
      imageSrc?: string;
      characterId?: string | null;
      characterName?: string;
    }) => {
      if (!isPersistedCharacterId(item.id)) {
        setPickerOpen(false);
        return;
      }

      setEditSource(null);
      setRemixSource(null);
      setAnimateSource(
        isPersistedCharacterId(item.characterId)
          ? {
              mediaId: item.id,
              characterId: item.characterId,
              characterName: item.characterName,
            }
          : null,
      );
      setSources((previous) => ({
        ...previous,
        image: {
          kind: "image",
          id: item.id,
          imageSrc: item.imageSrc ?? "",
          imageAlt: item.name,
          label: item.name,
        },
      }));
      setPickerOpen(false);
    },
    [],
  );

  const handleEditImageConfirm = React.useCallback(
    (item: { id: string; name: string; imageSrc?: string }) => {
      if (!isPersistedCharacterId(item.id)) {
        setPickerOpen(false);
        return;
      }

      setAnimateSource(null);
      setRemixSource(null);
      setEditSource({ mediaId: item.id });
      setSources((previous) => ({
        ...previous,
        image: {
          kind: "image",
          id: item.id,
          imageSrc: item.imageSrc ?? "",
          imageAlt: item.name,
          label: item.name,
        },
      }));
      setPickerOpen(false);
    },
    [],
  );

  const loadEditImageFromGallery = React.useCallback((item: GenerateGalleryItem) => {
    const target = editImageLoadTarget(item);
    if (!target) return;

    setAnimateSource(null);
    setRemixSource(null);
    setEditSource({ mediaId: target.id });
    setSources((previous) => ({
      ...previous,
      image: {
        kind: "image",
        id: target.id,
        imageSrc: target.imageSrc,
        imageAlt: target.name,
        label: target.name,
      },
    }));
  }, []);

  const handleEditVideoConfirm = React.useCallback(
    (item: { id: string; name: string; imageSrc?: string }) => {
      if (!isPersistedCharacterId(item.id)) {
        setPickerOpen(false);
        return;
      }

      setAnimateSource(null);
      setRemixSource(null);
      setEditSource({ mediaId: item.id });
      setSources((previous) => ({
        ...previous,
        video: {
          kind: "image",
          id: item.id,
          imageSrc: item.imageSrc ?? "",
          imageAlt: item.name,
          label: item.name,
        },
      }));
      setPickerOpen(false);
    },
    [],
  );

  const handleAddAudioOpenChange = React.useCallback((open: boolean) => {
    setAddAudioOpen(open);
  }, []);

  const selectedAddAudioId = sources.audio?.kind === "audio" ? sources.audio.id : undefined;

  const handleAddAudioGenerate = React.useCallback((payload: GenerateAddAudioGeneratePayload) => {
    const selectedAudio = payload.audio;

    if (selectedAudio) {
      setSources((previous) => ({
        ...previous,
        audio: {
          kind: "audio",
          id: selectedAudio.id,
          audioSrc: selectedAudio.audioSrc,
          audioLabel: "Audio",
        },
      }));
    }

    setAddAudioOpen(false);
  }, []);

  const infoButtonStatus: InfoButtonStatus = hasSeenInfoTutorial ? "dark" : "highlight";

  const generateDisabled = media === "image-presets" && isLinkedCharacterPending;
  const promptLocked =
    remixSource !== null &&
    media === "image-presets" &&
    promptValue.trim().length > 0 &&
    (!isPremiumResolved || !isPremium);

  const handlePromptValueChange = React.useCallback(
    (value: string) => {
      if (promptLocked) return;
      setPromptValue(value);
    },
    [promptLocked],
  );

  const handleGenerate = React.useCallback(() => {
    if (!isInteractive || generateDisabled) return;

    const requestedCount = isVideoMedia ? 1 : parseGenerateGenerationCount(generationCount);

    if (isTrialUser && !canAffordGenerateTokens(availableTokenBalance, requestedCount)) {
      onUpgrade?.();
      return;
    }

    if (media === "image-edit") {
      if (!isPremiumResolved || !isPremium) {
        if (isPremiumResolved) {
          onUpgrade?.();
        }
        return;
      }
      if (!promptValue.trim()) {
        return;
      }
    }

    // A video job cannot start without its required source. Open the picker
    // for that source, so the click is never silent.
    const videoCharacterId =
      sources.character && sources.character.kind !== "audio" ? sources.character.id : undefined;
    if (media === "video-presets" && !isPersistedCharacterId(videoCharacterId)) {
      openPicker("character");
      return;
    }
    if ((media === "video-edit" || media === "video-extend") && !editSource) {
      openPicker("video");
      return;
    }
    if (media === "video-image2vid" && !animateSource) {
      openPicker("image");
      return;
    }

    if ((media === "video-edit" || media === "video-extend") && !promptValue.trim()) {
      return;
    }

    let request: GenerateMediaRequest | undefined;

    if (isLoggedIn && media === "image-presets") {
      const characterSelection =
        sources.character?.kind === "audio" ? undefined : sources.character;
      const remixCharacterId = remixSource?.characterId;
      const characterId = isPersistedCharacterId(remixCharacterId)
        ? remixCharacterId
        : isPersistedCharacterId(characterSelection?.id)
          ? characterSelection?.id
          : undefined;
      const characterName = characterId
        ? remixSource?.characterName?.trim() ||
          characterSelection?.label.trim() ||
          characterSelection?.imageAlt.trim()
        : undefined;
      const characterImageSrc = characterId ? characterSelection?.imageSrc || undefined : undefined;

      request = buildCreateImageRequest({
        sourceMediaId: remixSource?.mediaId,
        prompt: promptValue,
        characterId,
        characterName,
        characterImageSrc,
        // A remixed image's stored values name options: send their keys.
        action:
          getGenerateImageActionValue(sources.action) ??
          getStoredGenerateOptionValue(generateOptions.actions.image, remixSource?.action),
        clothing:
          getGenerateSourceFieldValue(sources.clothing) ??
          getStoredGenerateOptionValue(generateOptions.clothing, remixSource?.clothing),
        location:
          getGenerateSourceFieldValue(sources.location) ??
          getStoredGenerateOptionValue(generateOptions.locations, remixSource?.location),
        aspectRatio: resolvedAspectRatio,
        numImages: requestedCount,
      });
    } else if (isLoggedIn && media === "video-presets") {
      const characterSelection =
        sources.character?.kind === "audio" ? undefined : sources.character;
      if (isPersistedCharacterId(characterSelection?.id)) {
        request = buildTextToVideoRequest({
          characterId: characterSelection.id,
          characterName:
            characterSelection.label.trim() || characterSelection.imageAlt.trim() || undefined,
          prompt: promptValue,
          duration: parseGenerateDurationSeconds(duration),
          resolution,
          action: getGenerateVideoActionValue(sources.action),
          clothing: getGenerateSourceFieldValue(sources.clothing),
          location: getGenerateSourceFieldValue(sources.location),
          aspectRatio: resolvedAspectRatio,
        });
      }
    } else if (isLoggedIn && media === "image-edit" && editSource) {
      request = buildEditImageRequest({
        sourceMediaId: editSource.mediaId,
        prompt: promptValue,
        numImages: requestedCount,
      });
    } else if (isLoggedIn && media === "video-edit" && editSource) {
      request = buildEditVideoRequest({
        sourceMediaId: editSource.mediaId,
        prompt: promptValue,
        duration: parseGenerateDurationSeconds(duration),
        resolution,
        aspectRatio: resolvedAspectRatio,
      });
    } else if (isLoggedIn && media === "video-extend" && editSource) {
      request = buildExtendVideoRequest({
        sourceMediaId: editSource.mediaId,
        prompt: promptValue,
        duration: parseGenerateDurationSeconds(duration),
        resolution,
        aspectRatio: resolvedAspectRatio,
      });
    } else if (isLoggedIn && media === "video-image2vid" && animateSource) {
      request = buildCreateVideoRequest({
        characterId: animateSource.characterId,
        sourceMediaId: animateSource.mediaId,
        characterName: animateSource.characterName,
        prompt: promptValue,
        duration: parseGenerateDurationSeconds(duration),
        resolution,
        aspectRatio: resolvedAspectRatio,
      });
    }

    onGenerate({
      prompt: promptValue,
      kind: createKind,
      count: requestedCount,
      aspectRatio: resolvedAspectRatio,
      skipQueue: !skipQueueDisabled,
      request,
      ...(isVideoMedia ? { resolution, duration } : {}),
    });
    setRemixSource(null);
    onAfterGenerate?.();
  }, [
    animateSource,
    createKind,
    duration,
    editSource,
    generationCount,
    generateDisabled,
    generateOptions,
    isInteractive,
    isLoggedIn,
    isPremium,
    isPremiumResolved,
    isTrialUser,
    isVideoMedia,
    media,
    onAfterGenerate,
    onGenerate,
    onUpgrade,
    openPicker,
    promptValue,
    resolution,
    resolvedAspectRatio,
    remixSource,
    skipQueueDisabled,
    sources,
    availableTokenBalance,
  ]);

  const loadFromPreview = React.useCallback(
    async (action: GeneratePreviewAction, item: GenerateGalleryItem) => {
      const loadId = ++previewLoadIdRef.current;
      const imageUrl = resolveGenerateMediaSrc(item.src);

      const setImageSlot = (
        slotId: "image" | "character" | "video",
        options: {
          id: string;
          imageSrc: string;
          imageAlt?: string;
        },
      ) => {
        setSources((previous) => ({
          ...previous,
          [slotId]: {
            kind: "image" as const,
            id: options.id,
            imageSrc: options.imageSrc,
            imageAlt: options.imageAlt ?? slotId,
            label: options.imageAlt ?? slotId,
          },
        }));
      };

      const applyItemPrompt = () => {
        setPromptValue(item.prompt ?? "");
      };

      const applyRemixParamsPrompt = async () => {
        if (!item.mediaId) return null;
        try {
          const params = await fetchRemixParams(item.mediaId);
          if (loadId !== previewLoadIdRef.current) return null;
          if (params.prompt_available && params.prompt) {
            setPromptValue(params.prompt);
          } else if (!params.prompt_available) {
            setPromptValue("");
          }
          return params;
        } catch {
          return null;
        }
      };

      if (action === "animate") {
        setRemixSource(null);
        setEditSource(null);
        setVideoMode("video-image2vid");
        if (item.characterId && item.mediaId) {
          setAnimateSource({
            mediaId: item.mediaId,
            characterId: item.characterId,
            characterName: item.characterName,
          });
        } else {
          setAnimateSource(null);
        }
        setSources((previous) => ({
          ...withoutCatalogSources(previous),
          image: {
            kind: "image",
            id: item.mediaId ?? item.id,
            imageSrc: imageUrl,
            imageAlt: item.alt ?? "Generated image",
            label: item.alt ?? "Generated image",
          },
        }));
        return;
      }

      if (action === "extend") {
        setRemixSource(null);
        setAnimateSource(null);
        setVideoMode("video-extend");
        setEditSource(item.mediaId ? { mediaId: item.mediaId } : null);
        setImageSlot("video", {
          id: item.mediaId ?? item.id,
          imageSrc: imageUrl,
          imageAlt: item.alt ?? "Generated video",
        });
        setPromptValue("");
        return;
      }

      if (action === "edit") {
        setAnimateSource(null);
        setRemixSource(null);
        if (item.kind === "video") {
          setVideoMode("video-edit");
          setEditSource(item.mediaId ? { mediaId: item.mediaId } : null);
          setImageSlot("video", {
            id: item.mediaId ?? item.id,
            imageSrc: imageUrl,
            imageAlt: item.alt ?? "Generated video",
          });
        } else {
          setImageMode("image-edit");
          setEditSource(item.mediaId ? { mediaId: item.mediaId } : null);
          setImageSlot("image", {
            id: item.mediaId ?? item.id,
            imageSrc: imageUrl,
            imageAlt: item.alt ?? "Generated image",
          });
        }
        setPromptValue("");
        return;
      }

      setAnimateSource(null);
      setEditSource(null);
      setImageMode("image-presets");
      setSeededCharacterId(initialCharacterId ?? null);
      setSources((previous) => withoutCatalogSources(previous));
      setRemixSource({
        mediaId: item.mediaId ?? item.id,
        characterId: item.characterId,
        characterName: item.characterName,
        action: item.pose,
      });
      if (item.characterId && item.characterImageSrc) {
        setImageSlot("character", {
          id: item.characterId,
          imageSrc: item.characterImageSrc,
          imageAlt: item.characterName,
        });
      }
      applyItemPrompt();

      const params = await applyRemixParamsPrompt();
      if (!params || loadId !== previewLoadIdRef.current) return;
      if (params.character?.removed_at) {
        setRemixSource(null);
        return;
      }

      setRemixSource({
        mediaId: params.media_id,
        characterId: params.character_id ?? params.character?.id ?? null,
        characterName: params.character?.name,
        action: params.action,
        clothing: params.clothing,
        location: params.location,
      });

      if (params.character?.image_url) {
        setImageSlot("character", {
          id: params.character.id,
          imageSrc: params.character.image_url,
          imageAlt: params.character.name,
        });
      }
    },
    [initialCharacterId],
  );

  const handleCheckpointValueChange = React.useCallback(
    (nextValue: string) => {
      if (!isInteractive) return;

      if (isPromptBoxCheckpointPremium(nextValue, getPromptBoxCheckpointOptions(media))) {
        if (!isPremiumResolved || !isPremium) {
          if (isPremiumResolved) {
            onUpgrade?.();
          }
          return;
        }
      }

      if (isVideoMedia) {
        setVideoCheckpointValue(nextValue);
        return;
      }

      setImageCheckpointValue(nextValue);
    },
    [
      isInteractive,
      isPremium,
      isPremiumResolved,
      isVideoMedia,
      media,
      onUpgrade,
    ],
  );

  const handleImageModeValueChange = React.useCallback(
    (value: string) => {
      if (!isInteractive) return;
      if (value === "image-edit") {
        if (!isPremiumResolved || !isPremium) {
          if (isPremiumResolved) {
            onUpgrade?.();
          }
          return;
        }
      }
      if (value === "image-presets" || value === "image-edit") {
        setPickerOpen(false);
        setImageMode(value);
        return;
      }

      if (
        value === "video-presets" ||
        value === "video-image2vid" ||
        value === "video-speech2vid" ||
        value === "video-extend" ||
        value === "video-edit"
      ) {
        if (value === "video-image2vid") {
          setSources((previous) => withoutCatalogSources(previous));
        }
        setVideoMode(value);
      }
    },
    [isInteractive, isPremium, isPremiumResolved, onUpgrade],
  );

  return {
    media,
    promptValue,
    setPromptValue: handlePromptValueChange,
    promptLocked,
    placeholders,
    controlButtons,
    checkpointValue,
    setCheckpointValue: handleCheckpointValueChange,
    aspectRatio: resolvedAspectRatio,
    setAspectRatio: setResolvedAspectRatio,
    generationCount,
    setGenerationCount: handleGenerationCountChange,
    maxGenerationCount: undefined,
    resolution,
    setResolution,
    duration,
    setDuration,
    skipQueueDisabled,
    setSkipQueueDisabled,
    handleSkipQueueDisabledChange,
    canEnableSkipQueue,
    tokenCost: promptAction.tokenCost,
    generateLabel: promptAction.generateLabel,
    generateDisabled,
    generateActionVariant: promptAction.variant,
    infoOpen,
    setInfoOpen,
    handleInfoOpenChange,
    infoButtonStatus,
    pickerOpen,
    setPickerOpen,
    pickerTitle: getGenerateChooseTemplateTitle(pickerTarget, media),
    pickerTypeTab: getGenerateChooseTemplateTypeTab(pickerTarget),
    pickerTarget,
    editImageFileId: sources.image?.id,
    editVideoFileId: sources.video?.id,
    textImageItems,
    textImageSelection: {
      characters: selectedCharacter?.id,
      actions: sources.action && sources.action.kind !== "audio" ? sources.action.id : undefined,
      clothings:
        sources.clothing && sources.clothing.kind !== "audio" ? sources.clothing.id : undefined,
      location:
        sources.location && sources.location.kind !== "audio" ? sources.location.id : undefined,
    },
    textVideoItems,
    textVideoSelection: {
      characters: selectedCharacter?.id,
      clothings:
        sources.clothing && sources.clothing.kind !== "audio" ? sources.clothing.id : undefined,
      location:
        sources.location && sources.location.kind !== "audio" ? sources.location.id : undefined,
    },
    textVideoActionIds: textVideoActionIds(selectedAction),
    handleTextImageConfirm,
    handleTextVideoConfirm,
    handleEditImageConfirm,
    loadEditImageFromGallery,
    handleEditVideoConfirm,
    handleImageToVideoConfirm,
    showPickerTypeTabs,
    templatePickerItems,
    isInteractive,
    showSeeAll,
    handleSeeAll: () => {
      if (promptTagSlot === "custom-prompt") return;
      openPicker(promptTagSlot);
    },
    handleActionClick,
    actions: promptActions,
    handleTemplateSelect,
    addAudioOpen,
    handleAddAudioOpenChange,
    selectedAddAudioId,
    handleAddAudioGenerate,
    handleGenerate,
    loadFromPreview,
    handleInfoButtonClick: () => {
      if (!isInteractive) return;
      setInfoOpen(true);
    },
    imageMode,
    handleImageModeValueChange,
  };
}
