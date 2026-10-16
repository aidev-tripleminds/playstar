"use client";

import { Buttons } from "@/components/common/general/button/buttons";
import { PlayVideoIcon, RecoveryIcon } from "@/public/assets/icons";

type MediaPreviewActionsProps = {
  hasVideo?: boolean;
  onEdit?: () => void;
  onRemix?: () => void;
  onCreateVideo?: () => void;
  onUseInTemplate?: () => void;
  onExtendVideo?: () => void;
  createVideoLabel?: string;
  editDisabled?: boolean;
  remixDisabled?: boolean;
  createVideoDisabled?: boolean;
  extendVideoDisabled?: boolean;
  canGenerateFrom?: boolean;
  showVideoActions?: boolean;
};

export function MediaPreviewActions({
  hasVideo = false,
  onEdit,
  onRemix,
  onCreateVideo,
  onUseInTemplate,
  onExtendVideo,
  createVideoLabel,
  editDisabled = false,
  remixDisabled = false,
  createVideoDisabled = false,
  extendVideoDisabled = false,
  canGenerateFrom = true,
  showVideoActions = true,
}: MediaPreviewActionsProps) {
  // Videos never seed a generation, so only image edit and animate hide.
  const showGenerationSourceActions = hasVideo ? showVideoActions : canGenerateFrom;

  return (
    <div data-slot="media-preview-actions" className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        {showGenerationSourceActions ? (
          <Buttons
            variant="neutral-border"
            size="btn-m"
            label={hasVideo ? "Edit video" : "Edit image"}
            leftIconSrc="/assets/edit-v2.svg"
            rightIcon={false}
            className="flex-1"
            disabled={editDisabled}
            onClick={onEdit}
          />
        ) : null}
        <Buttons
          variant="neutral-border"
          size="btn-m"
          label="Remix"
          leftIconSrc="/assets/refresh.svg"
          rightIcon={false}
          className="flex-1"
          disabled={remixDisabled}
          onClick={onRemix}
        />
      </div>
      {showVideoActions ? (
        <Buttons
          variant="neutral-border"
          size="btn-m"
          label="Use in template"
          leftIconNode={<RecoveryIcon className="size-5" />}
          rightIcon={false}
          className="w-full"
          onClick={onUseInTemplate}
        />
      ) : null}
      {!showVideoActions ? null : hasVideo ? (
        <Buttons
          variant="rose"
          size="btn-m"
          label="Extend video"
          leftIconSrc="/assets/video-horizontal.svg"
          rightIcon={false}
          className="w-full"
          disabled={extendVideoDisabled}
          onClick={onExtendVideo}
        />
      ) : showGenerationSourceActions ? (
        <Buttons
          variant="rose"
          size="btn-m"
          label={createVideoLabel}
          leftIconNode={<PlayVideoIcon className="size-5" />}
          rightIcon={false}
          className="w-full"
          disabled={createVideoDisabled}
          onClick={onCreateVideo}
        />
      ) : null}
    </div>
  );
}
