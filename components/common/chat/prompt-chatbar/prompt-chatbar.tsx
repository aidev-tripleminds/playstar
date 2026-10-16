"use client";

import Image from "next/image";
import * as React from "react";

import { AiChatAction } from "@/components/common/chat/ai-chat-action/ai-chat-action";
import { MediaButton } from "@/components/common/chat/media-button/media-button";
import { VideoPromptText } from "@/components/common/chat/video-prompt-text/video-prompt-text";
import { cn } from "@/lib/utils";

import { PromptChatbarAiMagicText } from "./components/prompt-chatbar-ai-magic-text";
import { PromptChatbarGroupAvatars } from "./components/prompt-chatbar-group-avatars";
import { PromptChatbarImagePromptField } from "./components/prompt-chatbar-image-prompt-field";
import {
  PromptChatbarPoseGrid,
  usePromptChatbarPoseGridSelection,
} from "./components/prompt-chatbar-pose-grid";
import { PromptChatbarSend } from "./components/prompt-chatbar-send";
import {
  PROMPT_CHATBAR_LAYER_Z,
  PromptChatbarSlideSection,
} from "./components/prompt-chatbar-slide-section";
import {
  DEFAULT_AI_FILLED_TEXT,
  DEFAULT_CHARACTER_NAME,
  DEFAULT_GROUP_MEMBER_AVATARS,
  DEFAULT_PLACEHOLDER,
  DEFAULT_POSES,
  DEFAULT_VIDEO_PROMPT,
  MAKE_IMAGE_PROMPT_PREFILL,
  VIDEO_SCENE_REQUIRED_PLACEHOLDER,
} from "./constants";
// ✅ Import the hook
import { usePromptChatbarAiFill } from "./hooks/use-prompt-chatbar-ai-fill";
import { usePromptChatbarMakeImage } from "./hooks/use-prompt-chatbar-make-image";
import type { PromptChatbarPose, PromptChatbarProps, PromptChatbarVariant } from "./types";
import { PROMPT_CHATBAR_VARIANTS } from "./types";
import { promptChatbarShellVariants } from "./variants";

export { PROMPT_CHATBAR_VARIANTS, promptChatbarShellVariants };
export type { PromptChatbarPose, PromptChatbarVariant };

const desktopGradientStyle: React.CSSProperties = {
  background: `
    linear-gradient(93.91deg, rgba(255,255,255,0), rgba(255,255,255,0.05)) padding-box,
    linear-gradient(#171717, #171717) padding-box,
    linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.1)) border-box
  `,
};

function formatPlaceholder(template: string, characterName: string) {
  return template.replace(/\{\{character\}\}/g, characterName);
}

function resolvePoseVideoPrompt(
  pose: PromptChatbarPose,
  characterName: string,
  fallbackPrompt: string,
) {
  return pose.videoPrompt ?? fallbackPrompt.replace(/\{\{character\}\}/g, characterName);
}

function usePromptChatbarMediaSelection({
  imageMediaSelected,
  videoMediaSelected,
  onImageMediaSelectedChange,
  onVideoMediaSelectedChange,
}: {
  imageMediaSelected?: boolean;
  videoMediaSelected?: boolean;
  onImageMediaSelectedChange?: (selected: boolean) => void;
  onVideoMediaSelectedChange?: (selected: boolean) => void;
}) {
  const [internalImageSelected, setInternalImageSelected] = React.useState(false);
  const [internalVideoSelected, setInternalVideoSelected] = React.useState(false);

  const isImageControlled = imageMediaSelected !== undefined;
  const isVideoControlled = videoMediaSelected !== undefined;

  const resolvedImageSelected = isImageControlled ? imageMediaSelected : internalImageSelected;
  const resolvedVideoSelected = isVideoControlled ? videoMediaSelected : internalVideoSelected;
  const showMediaPoseGrid = Boolean(resolvedImageSelected || resolvedVideoSelected);

  return {
    resolvedImageSelected,
    resolvedVideoSelected,
    showMediaPoseGrid,
    setInternalImageSelected,
    setInternalVideoSelected,
    isImageControlled,
    isVideoControlled,
  };
}

function usePromptChatbarMediaHandlers({
  imageMediaSelected,
  videoMediaSelected,
  onImageMediaSelectedChange,
  onVideoMediaSelectedChange,
  clearPoseSelection,
}: {
  imageMediaSelected?: boolean;
  videoMediaSelected?: boolean;
  onImageMediaSelectedChange?: (selected: boolean) => void;
  onVideoMediaSelectedChange?: (selected: boolean) => void;
  clearPoseSelection: () => void;
}) {
  const {
    resolvedImageSelected,
    resolvedVideoSelected,
    showMediaPoseGrid,
    setInternalImageSelected,
    setInternalVideoSelected,
    isImageControlled,
    isVideoControlled,
  } = usePromptChatbarMediaSelection({
    imageMediaSelected,
    videoMediaSelected,
    onImageMediaSelectedChange,
    onVideoMediaSelectedChange,
  });

  const handleImageSelectedChange = React.useCallback(
    (selected: boolean) => {
      if (selected) clearPoseSelection();
      if (!isImageControlled) setInternalImageSelected(selected);
      if (selected) {
        if (!isVideoControlled) setInternalVideoSelected(false);
        onVideoMediaSelectedChange?.(false);
      }
      onImageMediaSelectedChange?.(selected);
    },
    [
      clearPoseSelection,
      isImageControlled,
      isVideoControlled,
      onImageMediaSelectedChange,
      onVideoMediaSelectedChange,
      setInternalImageSelected,
      setInternalVideoSelected,
    ],
  );

  const handleVideoSelectedChange = React.useCallback(
    (selected: boolean) => {
      if (!selected) clearPoseSelection();
      if (!isVideoControlled) setInternalVideoSelected(selected);

      if (selected) {
        clearPoseSelection();
        if (!isImageControlled) setInternalImageSelected(false);
        onImageMediaSelectedChange?.(false);
      }
      onVideoMediaSelectedChange?.(selected);
    },
    [
      clearPoseSelection,
      isImageControlled,
      isVideoControlled,
      onImageMediaSelectedChange,
      onVideoMediaSelectedChange,
      setInternalImageSelected,
      setInternalVideoSelected,
    ],
  );

  return {
    resolvedImageSelected,
    resolvedVideoSelected,
    showMediaPoseGrid,
    handleImageSelectedChange,
    handleVideoSelectedChange,
  };
}

export function PromptChatbar({
  variant = "default",
  characterName = DEFAULT_CHARACTER_NAME,
  placeholder = DEFAULT_PLACEHOLDER,
  promptText = DEFAULT_AI_FILLED_TEXT,
  value,
  defaultValue,
  onValueChange,
  showPremiumCrown = false,
  groupMemberAvatars = DEFAULT_GROUP_MEMBER_AVATARS,
  poses = DEFAULT_POSES,
  videoPrompt = DEFAULT_VIDEO_PROMPT,
  imageMediaSelected,
  videoMediaSelected,
  showAiAssistActions = true,
  sendLabel,
  settingsLabel,
  tokenCost,
  showTokenCost,
  onSendClick,
  onSettingsClick,
  onFillWithAiClick,
  onContinueClick,
  onDiscardClick,
  onVideoPromptDismiss,
  onPoseSelectedChange,
  onImageMediaSelectedChange,
  onVideoMediaSelectedChange,
  className,
  ...props
}: PromptChatbarProps) {
  const resolvedVariant = (variant ?? "default") as PromptChatbarVariant;
  const isAiFilled = resolvedVariant === "ai-filled";
  const isGroupChat = resolvedVariant === "group-chat";
  const isRequestVideo = resolvedVariant === "request-video";
  const showGroupAvatars = isGroupChat;
  const showAiActions = showAiAssistActions && (resolvedVariant === "default" || isAiFilled);

  const poseSelection = usePromptChatbarPoseGridSelection(poses, onPoseSelectedChange);
  const {
    resolvedImageSelected,
    resolvedVideoSelected,
    showMediaPoseGrid,
    handleImageSelectedChange,
    handleVideoSelectedChange,
  } = usePromptChatbarMediaHandlers({
    imageMediaSelected,
    videoMediaSelected,
    onImageMediaSelectedChange,
    onVideoMediaSelectedChange,
    clearPoseSelection: poseSelection.clearSelection,
  });

  const isVideoMode = isRequestVideo || resolvedVideoSelected;
  const showMediaPoseGridOpen = showMediaPoseGrid || isRequestVideo;

  const {
    currentValue,
    showDiscard,
    showMagicText,
    magicMode,
    magicText,
    handleFillWithAi,
    handleRevealComplete,
    handleDiscard,
    handleEraseComplete,
    handlePromptChange,
    clearAiFillState,
  } = usePromptChatbarAiFill({
    promptText,
    value,
    defaultValue,
    onValueChange,
    startsFilled: isAiFilled,
  });

  const clearAiFillPrompt = React.useCallback(() => {
    clearAiFillState();
    handlePromptChange("");
  }, [clearAiFillState, handlePromptChange]);

  const closeImageModeKeepPrompt = React.useCallback(() => {
    poseSelection.clearSelection();
    handleImageSelectedChange(false);
  }, [handleImageSelectedChange, poseSelection.clearSelection]);

  const closeImageMode = React.useCallback(() => {
    poseSelection.clearSelection();
    handlePromptChange("");
    handleImageSelectedChange(false);
  }, [handleImageSelectedChange, handlePromptChange, poseSelection.clearSelection]);

  const {
    handlePromptChange: handleMakeImagePromptChange,
    handlePoseSelectedChange,
    hasShowMeTrigger,
  } = usePromptChatbarMakeImage({
    currentValue,
    isVideoMode,
    imageMediaSelected: resolvedImageSelected,
    poses,
    onPromptChange: handlePromptChange,
    onPoseSelect: poseSelection.onPoseSelect,
    closeImageModeKeepPrompt,
  });

  const openImageMode = React.useCallback(
    (selected: boolean) => {
      if (selected) {
        clearAiFillState();
        handleImageSelectedChange(true);
        if (!hasShowMeTrigger) {
          handleMakeImagePromptChange(MAKE_IMAGE_PROMPT_PREFILL);
        }
        return;
      }

      closeImageMode();
    },
    [
      clearAiFillState,
      closeImageMode,
      handleImageSelectedChange,
      handleMakeImagePromptChange,
      hasShowMeTrigger,
    ],
  );

  const closeVideoMode = React.useCallback(() => {
    poseSelection.clearSelection();
    handlePromptChange("");
    handleVideoSelectedChange(false);
  }, [handlePromptChange, handleVideoSelectedChange, poseSelection.clearSelection]);

  const handleVideoMediaChange = React.useCallback(
    (selected: boolean) => {
      if (selected) {
        clearAiFillPrompt();
        handleVideoSelectedChange(true);
        return;
      }

      closeVideoMode();
    },
    [clearAiFillPrompt, closeVideoMode, handleVideoSelectedChange],
  );

  const handleImageMediaChange = React.useCallback(
    (selected: boolean) => {
      if (selected) {
        openImageMode(true);
        return;
      }

      if (resolvedImageSelected) {
        closeImageMode();
        return;
      }

      // Show-me typing expands the button; clicking it opens the pose grid.
      if (hasShowMeTrigger) {
        openImageMode(true);
      }
    },
    [closeImageMode, hasShowMeTrigger, openImageMode, resolvedImageSelected],
  );

  const imageButtonSelected = !isVideoMode && (resolvedImageSelected || hasShowMeTrigger);

  const hideAiAssistActions = showMediaPoseGridOpen || hasShowMeTrigger;

  const poseGridSelection = React.useMemo(
    () => ({
      ...poseSelection,
      onPoseSelect: handlePoseSelectedChange,
    }),
    [handlePoseSelectedChange, poseSelection],
  );

  const selectedVideoPose =
    poseSelection.selectedPoseId === null
      ? undefined
      : poses.find((pose) => pose.id === poseSelection.selectedPoseId);
  const showVideoPrompt = isVideoMode && poseSelection.selectedPoseId !== null;
  const resolvedVideoPromptText = selectedVideoPose
    ? resolvePoseVideoPrompt(selectedVideoPose, characterName, videoPrompt)
    : videoPrompt;

  const handleVideoPromptDismiss = React.useCallback(() => {
    poseSelection.clearSelection();
    onVideoPromptDismiss?.();
  }, [onVideoPromptDismiss, poseSelection.clearSelection]);

  const handleFillWithAiClick = React.useCallback(() => {
    handleFillWithAi();
    onFillWithAiClick?.();
  }, [handleFillWithAi, onFillWithAiClick]);

  const handleDiscardClick = React.useCallback(() => {
    handleDiscard();
    onDiscardClick?.();
  }, [handleDiscard, onDiscardClick]);

  const currentValueRef = React.useRef(currentValue);
  const handlePromptChangeRef = React.useRef(handlePromptChange);

  React.useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  React.useEffect(() => {
    handlePromptChangeRef.current = handlePromptChange;
  }, [handlePromptChange]);

  const handleSendClick = React.useCallback(() => {
    const text = currentValue.trim();
    clearAiFillState();
    const result = onSendClick?.(text);
    if (!text) {
      return;
    }

    // Drop the draft immediately. The reply can take a while, and a failed send puts the text back.
    currentValueRef.current = "";
    handlePromptChange("");
    const restoreIfFailed = (sent: void | boolean) => {
      if (sent === false && currentValueRef.current.trim() === "") {
        handlePromptChangeRef.current(text);
      }
    };
    if (result instanceof Promise) {
      void result.then(restoreIfFailed, () => restoreIfFailed(false));
      return;
    }
    restoreIfFailed(result);
  }, [clearAiFillState, currentValue, handlePromptChange, onSendClick]);

  const handlePromptKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }
      // Enter confirms an IME composition; it should not send the message.
      if (event.nativeEvent.isComposing || event.keyCode === 229) {
        return;
      }
      event.preventDefault();
      if (!currentValue.trim()) {
        return;
      }
      handleSendClick();
    },
    [currentValue, handleSendClick],
  );

  const resolvedPlaceholder = formatPlaceholder(placeholder, characterName);

  return (
    <div
      data-slot="prompt-chatbar-root"
      data-media-open={showMediaPoseGridOpen ? "true" : "false"}
      data-show-me-mode={hasShowMeTrigger ? "true" : "false"}
      className={cn(
        "relative isolate flex flex-col rounded-[32px]!",
        showMediaPoseGridOpen ? "gap-0 md:w-full md:max-w-[680px]" : "gap-0 md:max-w-[680px]",
        className,
      )}
      {...props}
    >
      <div className={cn("relative", PROMPT_CHATBAR_LAYER_Z.behind)}>
        <PromptChatbarSlideSection
          show={showGroupAvatars && !showMediaPoseGridOpen}
          layer="behind"
          data-slot="prompt-chatbar-group-avatars-section"
          className="absolute -top-12 right-2 cursor-pointer md:-top-12"
          contentClassName="flex  justify-end"
        >
          <PromptChatbarGroupAvatars avatars={groupMemberAvatars} />
        </PromptChatbarSlideSection>

        {/* ✅ AI actions: shows "Fill with AI" or "Discard" based on hook state */}
        <PromptChatbarSlideSection
          show={showAiActions && !hideAiAssistActions}
          layer="behind"
          data-slot="prompt-chatbar-ai-actions-section"
          className="absolute -top-10! right-2 cursor-pointer md:-top-3"
          contentClassName="flex items-end gap-1"
        >
          <AiChatAction className="cursor-pointer" status="default" onClick={onContinueClick} />
          {showDiscard ? (
            <AiChatAction
              className="cursor-pointer"
              status="discard"
              onClick={handleDiscardClick}
            />
          ) : (
            <AiChatAction
              className="cursor-pointer"
              status="ai"
              onClick={handleFillWithAiClick}
              disabled={showMagicText}
            />
          )}
        </PromptChatbarSlideSection>
      </div>

      <PromptChatbarSlideSection
        show={showMediaPoseGridOpen}
        layer="grid"
        data-slot="prompt-chatbar-desktop-pose-section"
        className="max-md:hidden"
        contentClassName={showMediaPoseGridOpen ? "pb-2" : "pb-0"}
      >
        <PromptChatbarPoseGrid
          placement="desktop"
          poses={poses}
          sharedSelection={poseGridSelection}
        />
      </PromptChatbarSlideSection>

      <div
        data-slot="prompt-chatbar"
        data-variant={resolvedVariant}
        style={desktopGradientStyle}
        className={cn(
          "relative",
          PROMPT_CHATBAR_LAYER_Z.shell,
          promptChatbarShellVariants({ variant: resolvedVariant }),
        )}
      >
        {isVideoMode ? (
          <div data-slot="prompt-chatbar-video-field-section" className="relative z-0 h-7 px-1">
            {showVideoPrompt ? (
              <VideoPromptText
                prompt={resolvedVideoPromptText}
                className="w-fit max-w-full"
                onDismiss={handleVideoPromptDismiss}
              />
            ) : (
              <p
                data-slot="prompt-chatbar-video-scene-placeholder"
                className="text-divider-label flex h-7 items-center text-sm leading-5 font-normal"
              >
                {VIDEO_SCENE_REQUIRED_PLACEHOLDER}
              </p>
            )}
          </div>
        ) : (
          <div data-slot="prompt-chatbar-field-section" className="relative z-0 px-1 py-1">
            <div data-slot="prompt-chatbar-field" className="flex min-w-0 items-start gap-1">
              {/* ✅ Show magic text during reveal/erase, textarea otherwise */}
              {showMagicText ? (
                <PromptChatbarAiMagicText
                  text={magicText}
                  mode={magicMode}
                  onComplete={magicMode === "reveal" ? handleRevealComplete : handleEraseComplete}
                />
              ) : (
                <PromptChatbarImagePromptField
                  value={currentValue}
                  placeholder={currentValue ? undefined : resolvedPlaceholder}
                  onValueChange={handleMakeImagePromptChange}
                  onKeyDown={handlePromptKeyDown}
                  aria-label={resolvedPlaceholder}
                />
              )}
              {showPremiumCrown ? (
                <Image
                  src="/assets/crown-filled.svg"
                  alt=""
                  aria-hidden
                  width={20}
                  height={20}
                  className="size-5 shrink-0 object-contain"
                />
              ) : null}
            </div>
          </div>
        )}

        <div
          data-slot="prompt-chatbar-controls"
          className="relative z-0 flex min-w-0 items-center gap-2 max-md:justify-between"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <MediaButton
              kind="image"
              selected={imageButtonSelected}
              showTooltip={true}
              onSelectedChange={handleImageMediaChange}
            />
            <MediaButton
              kind="video"
              selected={resolvedVideoSelected}
              tooltip="Make Video"
              showTooltip={true}
              onSelectedChange={handleVideoMediaChange}
            />
          </div>
          <PromptChatbarSend
            sendLabel={sendLabel}
            settingsLabel={settingsLabel}
            tokenCost={tokenCost}
            showTokenCost={showTokenCost}
            onSettingsClick={onSettingsClick}
            onClick={handleSendClick}
          />
        </div>

        <PromptChatbarSlideSection
          show={showMediaPoseGridOpen}
          data-slot="prompt-chatbar-mobile-pose-section"
          className="md:hidden"
          contentClassName="min-w-0"
        >
          <PromptChatbarPoseGrid
            placement="mobile"
            poses={poses}
            sharedSelection={poseGridSelection}
          />
        </PromptChatbarSlideSection>
      </div>
    </div>
  );
}
