"use client";

import Image from "next/image";
import * as React from "react";

import { AudioMsg } from "@/components/common/chat/audio-msg/audio-msg";
import { Buttons } from "@/components/common/general/button/buttons";
import { Dropdown } from "@/components/common/general/dropdown/dropdown";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { GENERATE_GROUP_TOKEN_ICON_SRC } from "@/components/common/generate/generate-group";
import { DialogDescription } from "@/components/ui/dialog";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { EditIconV2, MicrophoneIcon } from "@/public/assets/icons";
import { TrashIcon } from "@/public/assets/icons/trash-icon";

import {
  findGenerateAddAudioOption,
  formatGenerateAddAudioGeneratedMeta,
  GENERATE_ADD_AUDIO_CATEGORIES,
  GENERATE_ADD_AUDIO_DELETE_LABEL,
  GENERATE_ADD_AUDIO_EDIT_LABEL,
  GENERATE_ADD_AUDIO_GENERATE_LABEL,
  GENERATE_ADD_AUDIO_GENERATED_DURATION_SECONDS,
  GENERATE_ADD_AUDIO_GENERATED_LABEL,
  GENERATE_ADD_AUDIO_MODAL_TITLE,
  GENERATE_ADD_AUDIO_SAVE_LABEL,
  GENERATE_ADD_AUDIO_SCRIPT_COST,
  GENERATE_ADD_AUDIO_SCRIPT_COST_SUFFIX,
  GENERATE_ADD_AUDIO_SCRIPT_LABEL,
  GENERATE_ADD_AUDIO_SCRIPT_PLACEHOLDER,
  GENERATE_ADD_AUDIO_VOICE_LABEL,
  GENERATE_ADD_AUDIO_VOICE_MODAL_TITLE,
  GENERATE_DESKTOP_BREAKPOINT,
  GENERATE_MOBILE_DRAWER_496_CLASS,
  GENERATE_MOBILE_DRAWER_FIT_CLASS,
  type GenerateAddAudioGeneratePayload,
  type GenerateAddAudioOption,
  getDefaultGenerateAddAudioOption,
} from "../_lib/constants";

export type GenerateAddAudioModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedAudioId?: string;
  scriptValue?: string;
  onGenerate?: (payload: GenerateAddAudioGeneratePayload) => void;
};

const VOICE_DROPDOWN_OPTIONS = GENERATE_ADD_AUDIO_CATEGORIES.flatMap((category) =>
  category.options.map((option) => ({
    value: option.id,
    label: option.label,
  })),
);

function GenerateAddAudioTrackList({
  draftAudioId,
  resetCounts,
  className,
  onSelect,
  onPlayingChange,
}: {
  draftAudioId?: string;
  resetCounts: Record<string, number>;
  className?: string;
  onSelect: (option: GenerateAddAudioOption) => (event: React.MouseEvent<HTMLDivElement>) => void;
  onPlayingChange: (audioId: string) => (playing: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "scrollbar-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto",
        className,
      )}
    >
      {GENERATE_ADD_AUDIO_CATEGORIES.map((category) => (
        <div key={category.id} className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">{category.label}</p>
          {category.options.map((option) => (
            <AudioMsg
              key={`${option.id}-${resetCounts[option.id] ?? 0}`}
              className="w-full max-w-none"
              label={option.label}
              src={option.audioSrc}
              selected={draftAudioId === option.id}
              playLabel={`Play ${option.label}`}
              pauseLabel={`Pause ${option.label}`}
              onClick={onSelect(option)}
              onPlayingChange={onPlayingChange(option.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function GenerateAddAudioModal({
  open = false,
  onOpenChange,
  selectedAudioId,
  scriptValue = "",
  onGenerate,
}: GenerateAddAudioModalProps) {
  const isDesktop = useIsDesktop(GENERATE_DESKTOP_BREAKPOINT);
  const playingAudioIdRef = React.useRef<string | null>(null);
  const [resetCounts, setResetCounts] = React.useState<Record<string, number>>({});
  const [draftAudioId, setDraftAudioId] = React.useState(selectedAudioId);
  const [script, setScript] = React.useState(scriptValue);
  const [generatedAudio, setGeneratedAudio] = React.useState<GenerateAddAudioOption | undefined>();
  const [generatedScript, setGeneratedScript] = React.useState("");
  const [generatedKey, setGeneratedKey] = React.useState(0);
  const [voicePickerOpen, setVoicePickerOpen] = React.useState(false);
  const [prevOpen, setPrevOpen] = React.useState(open);
  const hasGeneratedAudio = generatedAudio !== undefined;

  const resetPlaybackState = React.useCallback(() => {
    playingAudioIdRef.current = null;
    setResetCounts({});
  }, []);

  // Reset draft/picker while rendering when the controlled `open` prop changes.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (open !== prevOpen) {
    setPrevOpen(open);
    setVoicePickerOpen(false);
    setResetCounts({});
    setGeneratedAudio(undefined);
    setGeneratedScript("");
    if (open) {
      setDraftAudioId(selectedAudioId);
      setScript("");
    }
  }

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetPlaybackState();
        setVoicePickerOpen(false);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, resetPlaybackState],
  );

  const handleClose = React.useCallback(() => {
    resetPlaybackState();
    setVoicePickerOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange, resetPlaybackState]);

  const handleVoicePickerOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetPlaybackState();
      }
      setVoicePickerOpen(nextOpen);
    },
    [resetPlaybackState],
  );

  const handleSelect = React.useCallback(
    (option: GenerateAddAudioOption) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDraftAudioId(option.id);
      if (!isDesktop) {
        resetPlaybackState();
        setVoicePickerOpen(false);
      }
    },
    [isDesktop, resetPlaybackState],
  );

  const handlePlayingChange = React.useCallback(
    (audioId: string) => (playing: boolean) => {
      if (playing) {
        const previousId = playingAudioIdRef.current;

        if (previousId && previousId !== audioId) {
          setResetCounts((current) => ({
            ...current,
            [previousId]: (current[previousId] ?? 0) + 1,
          }));
        }

        playingAudioIdRef.current = audioId;
        return;
      }

      if (playingAudioIdRef.current === audioId) {
        playingAudioIdRef.current = null;
      }
    },
    [],
  );

  const handleGenerate = React.useCallback(() => {
    const audio = findGenerateAddAudioOption(draftAudioId) ?? getDefaultGenerateAddAudioOption();
    if (!audio || !script.trim()) return;

    resetPlaybackState();
    setVoicePickerOpen(false);
    setGeneratedKey((current) => current + 1);
    setGeneratedAudio(audio);
    setGeneratedScript(script);
  }, [draftAudioId, resetPlaybackState, script]);

  const handleEdit = React.useCallback(() => {
    resetPlaybackState();
    setGeneratedAudio(undefined);
    setScript(generatedScript);
  }, [generatedScript, resetPlaybackState]);

  const handleDelete = React.useCallback(() => {
    resetPlaybackState();
    setGeneratedAudio(undefined);
    setGeneratedScript("");
    setScript("");
  }, [resetPlaybackState]);

  const handleSave = React.useCallback(() => {
    onGenerate?.({
      audio: generatedAudio ?? findGenerateAddAudioOption(draftAudioId),
      script,
    });
    handleClose();
  }, [draftAudioId, generatedAudio, handleClose, onGenerate, script]);

  const trackList = (
    <GenerateAddAudioTrackList
      draftAudioId={draftAudioId}
      resetCounts={resetCounts}
      onSelect={handleSelect}
      onPlayingChange={handlePlayingChange}
    />
  );

  return (
    <>
      <ModalLayout
        open={open}
        onOpenChange={handleOpenChange}
        title={GENERATE_ADD_AUDIO_MODAL_TITLE}
        titleIcon={<MicrophoneIcon className="text-tooltip-text size-6" />}
        showIcon
        showMobileHandle
        closeLabel="Close add audio"
        closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
        onClose={handleClose}
        overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, !isDesktop && "z-95")}
        headerClassName="shrink-0 "
        innerClassName="flex min-h-0 flex-col gap-4 overflow-hidden md:h-full md:flex-1"
        className={cn(
          "border-surface-strong bg-dialog-bg z-999 flex! flex-col",
          "md:h-[516px] md:max-w-[min(100%,780px)] md:overflow-hidden",
          GENERATE_MOBILE_DRAWER_FIT_CLASS,
          !isDesktop && "z-100",
        )}
      >
        <div
          data-slot="generate-add-audio-modal"
          className="flex min-h-0 flex-col gap-4 md:flex-1 md:flex-row md:items-stretch"
        >
          <DialogDescription className="sr-only">
            Select an audio track and type a script.
          </DialogDescription>

          {isDesktop ? (
            <GenerateAddAudioTrackList
              draftAudioId={draftAudioId}
              resetCounts={resetCounts}
              className="max-h-[40vh] md:max-h-none"
              onSelect={handleSelect}
              onPlayingChange={handlePlayingChange}
            />
          ) : hasGeneratedAudio ? null : (
            <Dropdown
              label={GENERATE_ADD_AUDIO_VOICE_LABEL}
              value={draftAudioId}
              options={VOICE_DROPDOWN_OPTIONS}
              leftIcon={<MicrophoneIcon className="text-text-muted-strong size-5 shrink-0" />}
              widthMode="trigger"
              disableMenu
              expanded={voicePickerOpen}
              onTriggerClick={() => setVoicePickerOpen(true)}
            />
          )}

          <div className="flex min-h-0 flex-col gap-2 overflow-hidden md:flex-1 md:gap-4">
            <div className="flex min-h-0 flex-col gap-2 md:flex-1 md:gap-4">
              <div className="flex shrink-0 items-center justify-between gap-2">
                <p className="text-tooltip-text text-sm leading-5 font-medium">
                  {GENERATE_ADD_AUDIO_SCRIPT_LABEL}
                </p>
                <div className="flex shrink-0 items-center gap-0.5">
                  <span className="text-divider-label text-xs leading-4 font-medium">
                    {GENERATE_ADD_AUDIO_SCRIPT_COST}
                  </span>
                  <Image
                    src={GENERATE_GROUP_TOKEN_ICON_SRC}
                    alt=""
                    aria-hidden
                    width={16}
                    height={16}
                    className="size-4 shrink-0 object-contain"
                  />
                  <span className="text-divider-label text-xs leading-4 font-medium">
                    {GENERATE_ADD_AUDIO_SCRIPT_COST_SUFFIX}
                  </span>
                </div>
              </div>

              <TextArea
                value={script}
                onChange={(event) => setScript(event.target.value)}
                placeholder={GENERATE_ADD_AUDIO_SCRIPT_PLACEHOLDER}
                aria-label={GENERATE_ADD_AUDIO_SCRIPT_LABEL}
                showLeftIcon={false}
                readOnly={hasGeneratedAudio}
                className={cn(
                  "min-h-24 w-full max-w-none",
                  "border-surface-strong bg-tooltip-default-bg",
                  "[&_textarea]:text-tooltip-text [&_textarea]:h-full [&_textarea]:min-h-0",
                  "[&_textarea]:placeholder:text-divider-label",
                  "md:flex-1",
                )}
              />
            </div>

            {hasGeneratedAudio ? (
              <div
                data-slot="generate-add-audio-generated"
                className="flex shrink-0 flex-col gap-2"
              >
                <p className="text-divider-label text-xs leading-4 font-normal">
                  {formatGenerateAddAudioGeneratedMeta(
                    GENERATE_ADD_AUDIO_GENERATED_DURATION_SECONDS,
                    generatedAudio.label,
                  )}
                </p>
                <AudioMsg
                  key={`generated-${generatedAudio.id}-${generatedKey}`}
                  className="w-full max-w-none"
                  label={GENERATE_ADD_AUDIO_GENERATED_LABEL}
                  src={generatedAudio.audioSrc}
                  selected
                  playLabel={`Play ${GENERATE_ADD_AUDIO_GENERATED_LABEL}`}
                  pauseLabel={`Pause ${GENERATE_ADD_AUDIO_GENERATED_LABEL}`}
                  onClick={(event) => event.preventDefault()}
                  onPlayingChange={handlePlayingChange("generated")}
                />
              </div>
            ) : null}

            {hasGeneratedAudio ? (
              <div className="flex shrink-0 flex-col gap-2">
                <div className="flex gap-2">
                  <Buttons
                    type="button"
                    variant="neutral"
                    size="btn-m"
                    rightIcon={false}
                    leftIconNode={<EditIconV2 className="size-5" />}
                    label={GENERATE_ADD_AUDIO_EDIT_LABEL}
                    onClick={handleEdit}
                    className="min-w-0 flex-1"
                  />
                  <Buttons
                    type="button"
                    variant="neutral"
                    size="btn-m"
                    rightIcon={false}
                    leftIconNode={<TrashIcon className="size-5" />}
                    label={GENERATE_ADD_AUDIO_DELETE_LABEL}
                    onClick={handleDelete}
                    className="min-w-0 flex-1"
                  />
                </div>
                <Buttons
                  type="button"
                  variant="rose"
                  size="btn-m"
                  leftIcon={false}
                  rightIcon={false}
                  label={GENERATE_ADD_AUDIO_SAVE_LABEL}
                  onClick={handleSave}
                  className="w-full"
                />
              </div>
            ) : (
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                leftIcon={false}
                rightIcon={false}
                label={GENERATE_ADD_AUDIO_GENERATE_LABEL}
                disabled={!script.trim()}
                onClick={handleGenerate}
                className="w-full shrink-0"
              />
            )}
          </div>
        </div>
      </ModalLayout>

      {isDesktop ? null : (
        <ModalLayout
          open={open && voicePickerOpen}
          onOpenChange={handleVoicePickerOpenChange}
          title={GENERATE_ADD_AUDIO_VOICE_MODAL_TITLE}
          titleIcon={<MicrophoneIcon className="text-tooltip-text size-6" />}
          showIcon
          showMobileHandle
          closeLabel="Close voice picker"
          closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
          overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-1000")}
          headerClassName="shrink-0"
          innerClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden scrollbar-hidden"
          className={cn(
            "border-surface-strong bg-dialog-bg z-1000",
            "scrollbar-hidden! flex! max-h-[496px]! flex-col overflow-hidden",
            GENERATE_MOBILE_DRAWER_496_CLASS,
          )}
        >
          <div data-slot="generate-add-audio-voice-modal" className="flex min-h-0 flex-1 flex-col">
            <DialogDescription className="sr-only">Choose a voice track.</DialogDescription>
            {trackList}
          </div>
        </ModalLayout>
      )}
    </>
  );
}
