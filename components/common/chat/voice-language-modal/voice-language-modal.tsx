"use client";

import Image from "next/image";
import * as React from "react";

import { AudioMsg } from "@/components/common/chat/audio-msg/audio-msg";
import { Buttons } from "@/components/common/general/button/buttons";
import { Dropdown } from "@/components/common/general/dropdown/dropdown";
import { Flag } from "@/components/common/general/flag/flag";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import {
  RadioButton,
  RadioButtonGroup,
} from "@/components/common/general/radio-button/radio-button";
import { Toggle } from "@/components/common/general/toggle/toggle";
import { DialogDescription } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useVoices } from "@/hooks/use-voices";
import type { PublicVoice } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { RefreshIcon } from "@/public/assets/icons";
import { MicrophoneIcon } from "@/public/assets/icons/microphone";

import {
  VOICE_LANGUAGE_AUTO_PLAY_LABEL,
  VOICE_LANGUAGE_CHARACTER_LABEL,
  VOICE_LANGUAGE_DEFAULT_AUTO_PLAY,
  VOICE_LANGUAGE_DEFAULT_LANGUAGE_ID,
  VOICE_LANGUAGE_DEFAULT_VOICE_ID,
  VOICE_LANGUAGE_DROPDOWN_LABEL,
  VOICE_LANGUAGE_LANGUAGE_LABEL,
  VOICE_LANGUAGE_MODAL_APPLY_LABEL,
  VOICE_LANGUAGE_MODAL_TITLE,
  VOICE_LANGUAGE_OPTIONS,
  VOICE_LANGUAGE_PLAYBACK_LABEL,
  VOICE_LANGUAGE_PRICE_LABEL,
  VOICE_LANGUAGE_VOICE_LABEL,
  type VoiceLanguageCharacterOption,
  type VoiceLanguageId,
} from "./voice-language-modal.constants";

/** Human-readable language for a BCP-47 tag ("en-US" → "English"), falling back to the raw tag. */
function formatVoiceLanguage(language: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(language) ?? language;
  } catch {
    return language;
  }
}

export type VoiceLanguageModalValues = {
  languageId: VoiceLanguageId;
  voiceId: string;
  autoPlayMessages: boolean;
  characterId?: string;
};

export type VoiceLanguageModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  closeLabel?: string;
  applyLabel?: string;
  languageId?: VoiceLanguageId;
  defaultLanguageId?: VoiceLanguageId;
  voiceId?: string;
  defaultVoiceId?: string;
  autoPlayMessages?: boolean;
  defaultAutoPlayMessages?: boolean;
  /** Group members to choose which character settings apply to. Shown when length >= 2. */
  characters?: readonly VoiceLanguageCharacterOption[];
  characterId?: string;
  defaultCharacterId?: string;
  onApply?: (values: VoiceLanguageModalValues) => void;
  onClose?: () => void;
  className?: string;
};

function CharacterAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="border-tooltip-default-bg bg-border-strong relative size-5 shrink-0 overflow-hidden rounded-full border">
      {src ? <Image src={src} alt={alt} fill sizes="20px" className="object-cover" /> : null}
    </span>
  );
}

const EMPTY_VOICES: PublicVoice[] = [];

const LANGUAGE_DROPDOWN_OPTIONS = VOICE_LANGUAGE_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
  leftIcon: <Flag flags={[option.flag]} size={20} />,
}));

export function VoiceLanguageModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = VOICE_LANGUAGE_MODAL_TITLE,
  closeLabel = "Close voice and language",
  applyLabel = VOICE_LANGUAGE_MODAL_APPLY_LABEL,
  languageId,
  defaultLanguageId = VOICE_LANGUAGE_DEFAULT_LANGUAGE_ID,
  voiceId,
  defaultVoiceId = VOICE_LANGUAGE_DEFAULT_VOICE_ID,
  autoPlayMessages,
  defaultAutoPlayMessages = VOICE_LANGUAGE_DEFAULT_AUTO_PLAY,
  characters = [],
  characterId,
  defaultCharacterId,
  onApply,
  onClose,
  className,
}: VoiceLanguageModalProps) {
  const showCharacterSelect = characters.length >= 2;
  const initialCharacterId = defaultCharacterId ?? characters[0]?.id ?? "";

  const [internalLanguageId, setInternalLanguageId] =
    React.useState<VoiceLanguageId>(defaultLanguageId);
  const [internalVoiceId, setInternalVoiceId] = React.useState<string>(defaultVoiceId);
  const [internalAutoPlay, setInternalAutoPlay] = React.useState(defaultAutoPlayMessages);
  const [internalCharacterId, setInternalCharacterId] = React.useState(initialCharacterId);
  const [baseline, setBaseline] = React.useState<VoiceLanguageModalValues>({
    languageId: defaultLanguageId,
    voiceId: defaultVoiceId,
    autoPlayMessages: defaultAutoPlayMessages,
    ...(showCharacterSelect && initialCharacterId ? { characterId: initialCharacterId } : {}),
  });
  const [resetCounts, setResetCounts] = React.useState<Record<string, number>>({});
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);
  const [isCharacterMenuOpen, setIsCharacterMenuOpen] = React.useState(false);
  const playingVoiceIdRef = React.useRef<string | null>(null);
  const wasOpenRef = React.useRef(false);

  const resolvedLanguageId = languageId ?? internalLanguageId;
  const resolvedVoiceId = voiceId ?? internalVoiceId;
  const resolvedAutoPlay = autoPlayMessages ?? internalAutoPlay;
  const resolvedCharacterId = characterId ?? internalCharacterId;
  const hasChanges =
    Boolean(resolvedVoiceId) &&
    (resolvedLanguageId !== baseline.languageId ||
      resolvedVoiceId !== baseline.voiceId ||
      resolvedAutoPlay !== baseline.autoPlayMessages ||
      (showCharacterSelect && resolvedCharacterId !== (baseline.characterId ?? "")));
  const selectedLanguage =
    VOICE_LANGUAGE_OPTIONS.find((option) => option.id === resolvedLanguageId) ??
    VOICE_LANGUAGE_OPTIONS[0];
  const selectedCharacter =
    characters.find((character) => character.id === resolvedCharacterId) ?? characters[0];
  const isAnyDropdownOpen = isLanguageMenuOpen || isCharacterMenuOpen;

  const {
    data: voices,
    isPending: isVoicesPending,
    isError: isVoicesError,
    refetch: refetchVoices,
  } = useVoices();
  const voiceOptions = voices ?? EMPTY_VOICES;

  const characterDropdownOptions = React.useMemo(
    () =>
      characters.map((character) => ({
        value: character.id,
        label: character.name,
        leftIcon: <CharacterAvatar src={character.avatarSrc} alt={character.name} />,
      })),
    [characters],
  );

  const resetPlaybackState = React.useCallback(() => {
    playingVoiceIdRef.current = null;
    setResetCounts({});
  }, []);

  React.useEffect(() => {
    const justOpened = Boolean(open) && !wasOpenRef.current;
    wasOpenRef.current = Boolean(open);

    if (!justOpened) {
      return;
    }

    const nextLanguageId = languageId ?? defaultLanguageId;
    const nextVoiceId = voiceId ?? defaultVoiceId;
    const nextAutoPlay = autoPlayMessages ?? defaultAutoPlayMessages;
    const nextCharacterId = characterId ?? defaultCharacterId ?? characters[0]?.id ?? "";

    setInternalLanguageId(nextLanguageId);
    setInternalVoiceId(nextVoiceId);
    setInternalAutoPlay(nextAutoPlay);
    setInternalCharacterId(nextCharacterId);
    setBaseline({
      languageId: nextLanguageId,
      voiceId: nextVoiceId,
      autoPlayMessages: nextAutoPlay,
      ...(showCharacterSelect && nextCharacterId ? { characterId: nextCharacterId } : {}),
    });
    setIsLanguageMenuOpen(false);
    setIsCharacterMenuOpen(false);
    resetPlaybackState();
  }, [
    autoPlayMessages,
    characterId,
    characters,
    defaultAutoPlayMessages,
    defaultCharacterId,
    defaultLanguageId,
    defaultVoiceId,
    languageId,
    open,
    resetPlaybackState,
    showCharacterSelect,
    voiceId,
  ]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setIsLanguageMenuOpen(false);
        setIsCharacterMenuOpen(false);
        resetPlaybackState();
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, resetPlaybackState],
  );

  const handleClose = React.useCallback(() => {
    setIsLanguageMenuOpen(false);
    setIsCharacterMenuOpen(false);
    resetPlaybackState();
    onClose?.();
  }, [onClose, resetPlaybackState]);

  const handleLanguageChange = React.useCallback(
    (nextLanguageId: string) => {
      const nextId = nextLanguageId as VoiceLanguageId;
      if (languageId === undefined) {
        setInternalLanguageId(nextId);
      }
    },
    [languageId],
  );

  const handleCharacterChange = React.useCallback(
    (nextCharacterId: string) => {
      if (characterId === undefined) {
        setInternalCharacterId(nextCharacterId);
      }
      const savedVoice = characters.find((character) => character.id === nextCharacterId)?.voiceId;
      if (voiceId === undefined && savedVoice !== undefined) {
        const nextVoice = savedVoice ?? "";
        setInternalVoiceId(nextVoice);
        setBaseline((current) => ({ ...current, voiceId: nextVoice }));
      }
    },
    [characterId, characters, voiceId],
  );

  const handleAutoPlayChange = React.useCallback(
    (checked: boolean) => {
      if (autoPlayMessages === undefined) {
        setInternalAutoPlay(checked);
      }
    },
    [autoPlayMessages],
  );

  const handleVoiceSelect = React.useCallback(
    (nextVoiceId: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (voiceId === undefined) {
        setInternalVoiceId(nextVoiceId);
      }
    },
    [voiceId],
  );

  const handlePlayingChange = React.useCallback(
    (nextVoiceId: string) => (playing: boolean) => {
      if (playing) {
        const previousId = playingVoiceIdRef.current;

        if (previousId && previousId !== nextVoiceId) {
          setResetCounts((current) => ({
            ...current,
            [previousId]: (current[previousId] ?? 0) + 1,
          }));
        }

        playingVoiceIdRef.current = nextVoiceId;
        return;
      }

      if (playingVoiceIdRef.current === nextVoiceId) {
        playingVoiceIdRef.current = null;
      }
    },
    [],
  );

  const handleApply = React.useCallback(() => {
    onApply?.({
      languageId: resolvedLanguageId,
      voiceId: resolvedVoiceId,
      autoPlayMessages: resolvedAutoPlay,
      ...(showCharacterSelect && resolvedCharacterId ? { characterId: resolvedCharacterId } : {}),
    });
    resetPlaybackState();
    onOpenChange?.(false);
  }, [
    onApply,
    onOpenChange,
    resetPlaybackState,
    resolvedAutoPlay,
    resolvedCharacterId,
    resolvedLanguageId,
    resolvedVoiceId,
    showCharacterSelect,
  ]);

  const voiceList = (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center gap-2">
        <p
          className="text-tooltip-text min-w-0 flex-1 text-sm leading-5 font-medium"
          id="voice-language-voice-label"
        >
          {VOICE_LANGUAGE_VOICE_LABEL}
        </p>
        <p className="text-divider-label shrink-0 text-xs leading-3 font-medium">
          {VOICE_LANGUAGE_PRICE_LABEL}
        </p>
      </div>

      {isVoicesPending ? (
        <div
          className="flex flex-1 items-center justify-center py-8"
          role="status"
          aria-live="polite"
        >
          <Spinner />
          <span className="sr-only">Loading voices</span>
        </div>
      ) : isVoicesError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8">
          <p className="text-text-muted-strong text-center text-sm">
            We could not load the voices. Please try again.
          </p>
          <button
            type="button"
            onClick={() => void refetchVoices()}
            className="bg-tooltip-default-bg text-tooltip-text hover:bg-surface-strong rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      ) : voiceOptions.length === 0 ? (
        <p className="text-text-muted-strong flex-1 py-8 text-center text-sm">
          No voices available yet.
        </p>
      ) : (
        <div
          role="radiogroup"
          aria-labelledby="voice-language-voice-label"
          className="scrollbar-hidden flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
        >
          {voiceOptions.map((option) => {
            const label = `${option.name} · ${formatVoiceLanguage(option.language)}`;
            return (
              <AudioMsg
                key={`${option.id}-${resetCounts[option.id] ?? 0}`}
                className="w-full max-w-none shrink-0"
                decorativeWaveform
                label={label}
                src={option.sample_url}
                selected={resolvedVoiceId === option.id}
                playLabel={`Play ${label} voice`}
                pauseLabel={`Pause ${label} voice`}
                onClick={handleVoiceSelect(option.id)}
                onPlayingChange={handlePlayingChange(option.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  const playbackSection = (
    <div className="flex shrink-0 flex-col gap-2">
      <p className="text-tooltip-text text-sm leading-5 font-medium">
        {VOICE_LANGUAGE_PLAYBACK_LABEL}
      </p>
      <div className="bg-tooltip-default-bg flex w-full items-center gap-2 rounded-xl p-3">
        <RefreshIcon className="text-tooltip-text size-5 shrink-0" aria-hidden />
        <span className="text-tooltip-text min-w-0 flex-1 text-sm leading-5 font-medium">
          {VOICE_LANGUAGE_AUTO_PLAY_LABEL}
        </span>
        <Toggle
          checked={resolvedAutoPlay}
          onCheckedChange={handleAutoPlayChange}
          aria-label={VOICE_LANGUAGE_AUTO_PLAY_LABEL}
        />
      </div>
    </div>
  );

  const characterSelect = showCharacterSelect ? (
    <div className="relative z-30 flex shrink-0 flex-col gap-2">
      <p
        className="text-tooltip-text text-sm leading-5 font-medium"
        id="voice-language-character-label"
      >
        {VOICE_LANGUAGE_CHARACTER_LABEL}
      </p>
      <Dropdown
        showLabel={false}
        value={resolvedCharacterId}
        options={characterDropdownOptions}
        leftIcon={
          selectedCharacter ? (
            <CharacterAvatar src={selectedCharacter.avatarSrc} alt={selectedCharacter.name} />
          ) : undefined
        }
        widthMode="trigger"
        onValueChange={handleCharacterChange}
        onOpenChange={setIsCharacterMenuOpen}
        className="w-full max-w-none"
      />
    </div>
  ) : null;

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      title={title}
      titleIcon={<MicrophoneIcon className="text-tooltip-text size-6" />}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      headerClassName="shrink-0"
      className={cn(
        "border-surface-strong bg-dialog-bg md:flex md:h-[564px] md:max-w-[min(100%,780px)] md:flex-col md:overflow-hidden",
        contentClassName,
      )}
      innerClassName="flex min-h-0 flex-1 flex-col gap-4 md:h-full md:overflow-hidden"
    >
      <div
        data-slot="voice-language-modal"
        className={cn(
          "scrollbar-hidden flex min-h-0 flex-1 flex-col gap-4",
          isAnyDropdownOpen ? "overflow-visible" : "overflow-hidden",
          className,
        )}
      >
        <DialogDescription className="sr-only">
          Choose language, voice, and auto-play settings.
        </DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:items-stretch md:gap-4">
          <div className="md:scrollbar-hidden flex w-full shrink-0 flex-col gap-4 md:min-w-0 md:flex-1">
            <div className="relative z-20 shrink-0 md:hidden">
              <Dropdown
                label={VOICE_LANGUAGE_DROPDOWN_LABEL}
                value={resolvedLanguageId}
                options={LANGUAGE_DROPDOWN_OPTIONS}
                leftIcon={
                  selectedLanguage ? <Flag flags={[selectedLanguage.flag]} size={20} /> : undefined
                }
                widthMode="trigger"
                onValueChange={handleLanguageChange}
                onOpenChange={setIsLanguageMenuOpen}
                className="w-full max-w-none"
              />
            </div>
            <div className="hidden min-h-0 w-full flex-1 flex-col gap-2 md:flex">
              <p
                className="text-tooltip-text shrink-0 text-sm leading-5 font-medium"
                id="voice-language-language-label"
              >
                {VOICE_LANGUAGE_LANGUAGE_LABEL}
              </p>

              <RadioButtonGroup
                value={resolvedLanguageId}
                onValueChange={handleLanguageChange}
                aria-labelledby="voice-language-language-label"
                className="scrollbar-hidden grid min-h-0 w-full flex-1 auto-rows-min grid-cols-2 gap-2 overflow-y-auto"
              >
                {VOICE_LANGUAGE_OPTIONS.map((option) => (
                  <RadioButton
                    key={option.id}
                    value={option.id}
                    label={option.label}
                    leftIcon={<Flag flags={[option.flag]} size={20} />}
                    className="w-full max-w-none rounded-full"
                  />
                ))}
              </RadioButtonGroup>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="">{playbackSection}</div>
            {characterSelect}
            <div className="order-1 flex min-h-0 flex-1 flex-col md:order-2">{voiceList}</div>
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
          className="w-full shrink-0"
        />
      </div>
    </ModalLayout>
  );
}
