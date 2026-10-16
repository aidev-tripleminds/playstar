"use client";

import type { StaticImageData } from "next/image";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";

import { defaultMediaPreviewMetadata, defaultMediaPreviewMetaVideodata } from "../constants";
import type { MediaPreviewLockMode } from "../types";
import { MediaPreviewActions } from "./media-preview-actions";
import {
  MediaPreviewMetadata,
  MediaPreviewModelSlot,
  MediaPreviewPromptSection,
} from "./media-preview-details-panel";

type MediaPreviewImageDetailsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modelTitle?: string;
  modelImageSrc?: string | StaticImageData;
  onCreateModelClick?: () => void;
  prompt?: string;
  locked?: boolean;
  lockMode?: MediaPreviewLockMode;
  unlockCost?: number;
  onUnlockPrompt?: () => void;
  metadata?: string[];
  onEdit?: () => void;
  onRemix?: () => void;
  onCreateVideo?: () => void;
  onUseInTemplate?: () => void;
  onExtendVideo?: () => void;
  createVideoLabel?: string;
  hasVideo?: boolean;
  editDisabled?: boolean;
  remixDisabled?: boolean;
  createVideoDisabled?: boolean;
  extendVideoDisabled?: boolean;
  canGenerateFrom?: boolean;
  showVideoActions?: boolean;
  showActions?: boolean;
};

export function MediaPreviewImageDetailsModal({
  hasVideo = false,
  open = false,
  onOpenChange,
  modelTitle,
  modelImageSrc,
  onCreateModelClick,
  prompt,
  locked = false,
  lockMode = "coins",
  unlockCost = 1,
  onUnlockPrompt,
  metadata,
  onEdit,
  onRemix,
  onCreateVideo,
  onUseInTemplate,
  onExtendVideo,
  createVideoLabel = "Animate",
  editDisabled = false,
  remixDisabled = false,
  createVideoDisabled = false,
  extendVideoDisabled = false,
  canGenerateFrom = true,
  showVideoActions = true,
  showActions = true,
}: MediaPreviewImageDetailsModalProps) {
  const resolvedMetadata =
    metadata ?? (hasVideo ? defaultMediaPreviewMetaVideodata : defaultMediaPreviewMetadata);

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={hasVideo ? "Video details" : "Image details"}
      titleIconSrc="/assets/info-outline.svg"
      showIcon
      showMobileHandle
      closeLabel="Close image details"
      overlayClassName="bg-black/40 supports-backdrop-filter:backdrop-blur-sm"
      className="max-h-[90vh] overflow-y-auto md:hidden"
    >
      <div data-slot="media-preview-image-details-modal" className="flex flex-col gap-4">
        <DialogDescription className="sr-only">
          Full image prompt, model details, and actions.
        </DialogDescription>
        <MediaPreviewModelSlot
          modelTitle={modelTitle}
          modelImageSrc={modelImageSrc}
          onCreateModelClick={onCreateModelClick}
        />

        <MediaPreviewPromptSection
          prompt={prompt}
          locked={locked}
          lockMode={lockMode}
          unlockCost={unlockCost}
          onUnlockPrompt={onUnlockPrompt}
          scrollable={false}
        />

        <MediaPreviewMetadata items={resolvedMetadata} />

        {showActions ? (
          <MediaPreviewActions
            hasVideo={hasVideo}
            onEdit={onEdit}
            onRemix={onRemix}
            onCreateVideo={onCreateVideo}
            onUseInTemplate={onUseInTemplate}
            onExtendVideo={onExtendVideo}
            createVideoLabel={createVideoLabel}
            editDisabled={editDisabled}
            remixDisabled={remixDisabled}
            createVideoDisabled={createVideoDisabled}
            extendVideoDisabled={extendVideoDisabled}
            canGenerateFrom={canGenerateFrom}
            showVideoActions={showVideoActions}
          />
        ) : null}
      </div>
    </ModalLayout>
  );
}
