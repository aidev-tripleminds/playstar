"use client";

import * as React from "react";

import type { PromptChatbarPose } from "../types";
import { hasShowMeTrigger } from "../utils/show-me-trigger";

type UsePromptChatbarMakeImageOptions = {
  currentValue: string;
  isVideoMode: boolean;
  imageMediaSelected: boolean;
  poses: PromptChatbarPose[];
  onPromptChange: (value: string) => void;
  onPoseSelect: (poseId: string, selected: boolean) => void;
  closeImageModeKeepPrompt: () => void;
};

export function usePromptChatbarMakeImage({
  currentValue,
  isVideoMode,
  imageMediaSelected,
  onPromptChange,
  onPoseSelect,
  closeImageModeKeepPrompt,
  poses,
}: UsePromptChatbarMakeImageOptions) {
  const previousHasShowMeRef = React.useRef(hasShowMeTrigger(currentValue));

  React.useEffect(() => {
    previousHasShowMeRef.current = hasShowMeTrigger(currentValue);
  }, [currentValue]);

  const handlePoseSelectedChange = React.useCallback(
    (poseId: string, selected: boolean) => {
      onPoseSelect(poseId, selected);

      if (!selected || isVideoMode || !imageMediaSelected) return;

      const pose = poses.find((entry) => entry.id === poseId);
      if (pose?.imagePrompt) {
        onPromptChange(pose.imagePrompt);
        previousHasShowMeRef.current = true;
      }
    },
    [imageMediaSelected, isVideoMode, onPoseSelect, onPromptChange, poses],
  );

  const handlePromptChange = React.useCallback(
    (nextValue: string) => {
      const previousHasShowMe = previousHasShowMeRef.current;
      const nextHasShowMe = hasShowMeTrigger(nextValue);

      if (!nextHasShowMe && previousHasShowMe && imageMediaSelected && !isVideoMode) {
        closeImageModeKeepPrompt();
        previousHasShowMeRef.current = nextHasShowMe;
        onPromptChange(nextValue);
        return;
      }

      previousHasShowMeRef.current = nextHasShowMe;
      onPromptChange(nextValue);
    },
    [closeImageModeKeepPrompt, imageMediaSelected, isVideoMode, onPromptChange],
  );

  return {
    handlePoseSelectedChange,
    handlePromptChange,
    hasShowMeTrigger: hasShowMeTrigger(currentValue),
  };
}
