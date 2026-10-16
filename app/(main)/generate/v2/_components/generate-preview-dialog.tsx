"use client";

import { useCallback } from "react";

import { showToast } from "@/components/common/general/toast/toast";
import { MediaPreview } from "@/components/common/image-preview/media-preview/media-preview";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useMyCharacters, useSetCharacterProfilePicture } from "@/hooks/use-my-characters";
import { cn } from "@/lib/utils";

import {
  canAnimateGeneratedMedia,
  canSetGeneratedMediaAsProfilePicture,
  characterMediaIdFromGalleryItem,
  formatGeneratePreviewPostedAt,
  getGeneratePreviewMetadata,
  resolveGeneratedMediaCharacter,
} from "../../_lib/generate-media";
import { GENERATE_PREVIEW_CREATE_VIDEO_LABEL } from "../_lib/constants";
import {
  canEditGenerateItem,
  canRemixGenerateItem,
  type GeneratePreviewAction,
} from "../_lib/preview-actions";
import type { GenerateGalleryItem } from "../_lib/types";

const GENERATE_SET_PROFILE_PICTURE_SUCCESS_TOAST = "Profile picture updated.";
const GENERATE_SET_PROFILE_PICTURE_ERROR_TOAST =
  "Couldn't set this as the profile picture. Please try again.";

type GeneratePreviewDialogProps = {
  open: boolean;
  items: GenerateGalleryItem[];
  selectedIndex: number | null;
  selectedItem: GenerateGalleryItem | null;
  onOpenChange: (open: boolean) => void;
  onSelectedIndexChange: (index: number) => void;
  onClose: () => void;
  onPreviewAction?: (action: GeneratePreviewAction, item: GenerateGalleryItem) => void;
  onPreviewDelete?: (item: GenerateGalleryItem) => void;
  onPreviewDownload?: (item: GenerateGalleryItem) => void;
  /**
   * Free accounts previewing an image: blur the prompt and offer premium.
   * The parent only sets this after `/me` entitlement has resolved.
   */
  promptLocked?: boolean;
  onUnlockPrompt?: () => void;
  /** False while video generation is closed: no Animate, Extend or template action. */
  videoEnabled?: boolean;
};

export function GeneratePreviewDialog({
  open,
  items,
  selectedIndex,
  selectedItem,
  onOpenChange,
  onSelectedIndexChange,
  onClose,
  onPreviewAction,
  onPreviewDelete,
  onPreviewDownload,
  promptLocked = false,
  onUnlockPrompt,
  videoEnabled = true,
}: GeneratePreviewDialogProps) {
  const { data: myCharacters } = useMyCharacters();
  const { mutateAsync: setProfilePictureAsync, isPending: isSettingProfilePicture } =
    useSetCharacterProfilePicture();
  const previewCharacter = resolveGeneratedMediaCharacter(selectedItem, myCharacters?.items);
  const showSetProfilePicture = canSetGeneratedMediaAsProfilePicture(
    selectedItem,
    myCharacters?.items,
  );

  const handleAction = (action: GeneratePreviewAction) => {
    if (!selectedItem) return;
    onPreviewAction?.(action, selectedItem);
  };

  const handleSetProfilePicture = useCallback(async () => {
    if (!selectedItem || isSettingProfilePicture) return;
    const characterMediaId = characterMediaIdFromGalleryItem(selectedItem);
    if (!characterMediaId) {
      showToast({ type: "error", text: GENERATE_SET_PROFILE_PICTURE_ERROR_TOAST });
      return;
    }

    try {
      await setProfilePictureAsync({ characterMediaId });
      showToast({ type: "success", text: GENERATE_SET_PROFILE_PICTURE_SUCCESS_TOAST });
    } catch (error) {
      showToast({ type: "error", text: GENERATE_SET_PROFILE_PICTURE_ERROR_TOAST, error });
    }
  }, [isSettingProfilePicture, selectedItem, setProfilePictureAsync]);

  return (
    <Dialog forceDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        freezeBackdrop
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
        overlayClassName="bg-black/60 supports-backdrop-filter:backdrop-blur-md"
        className={cn(
          "border-0 bg-transparent p-0 shadow-none ring-0 outline-none",
          "fixed inset-0 top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 items-center justify-center",
          "overflow-x-hidden overflow-y-auto rounded-none sm:max-w-none md:max-w-none",
          "scrollbar-gutter-stable",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
          "px-0 py-0 md:px-6 md:py-6",
        )}
      >
        <DialogTitle className="sr-only">Media preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview generated media with details, actions, and thumbnail navigation.
        </DialogDescription>

        {selectedIndex !== null ? (
          <div className="mx-auto flex h-full w-full max-w-[1260px] items-center justify-center has-data-[image-expanded=true]:max-w-none">
            <MediaPreview
              variant={
                promptLocked && selectedItem != null && selectedItem.kind !== "video"
                  ? "premium"
                  : "default"
              }
              onUnlockPrompt={onUnlockPrompt}
              items={items}
              selectedIndex={selectedIndex}
              onSelectedIndexChange={onSelectedIndexChange}
              prompt={selectedItem?.prompt ?? ""}
              metadata={getGeneratePreviewMetadata(selectedItem)}
              postedAt={formatGeneratePreviewPostedAt(selectedItem?.createdAt)}
              modelStatus={previewCharacter ? "ai-model" : "no-ai-model"}
              modelTitle={previewCharacter?.name}
              modelImageSrc={previewCharacter?.imageSrc ?? ""}
              createVideoLabel={GENERATE_PREVIEW_CREATE_VIDEO_LABEL}
              editDisabled={!canEditGenerateItem(selectedItem)}
              remixDisabled={!canRemixGenerateItem(selectedItem)}
              createVideoDisabled={!canAnimateGeneratedMedia(selectedItem)}
              canGenerateFrom={selectedItem?.canGenerateFrom !== false}
              showVideoActions={videoEnabled}
              showSetProfilePicture={showSetProfilePicture}
              onEdit={() => handleAction("edit")}
              onRemix={() => handleAction("remix")}
              onCreateVideo={() => handleAction("animate")}
              onExtendVideo={() => handleAction("extend")}
              onDownload={() => {
                if (selectedItem) onPreviewDownload?.(selectedItem);
              }}
              onQuickAction={(value) => {
                if (value === "edit" || value === "remix" || value === "animate") {
                  handleAction(value);
                }
              }}
              onMoreItemClick={(value) => {
                if (!selectedItem) return;
                if (value === "delete") {
                  onPreviewDelete?.(selectedItem);
                  return;
                }
                if (value === "download") {
                  onPreviewDownload?.(selectedItem);
                  return;
                }
                if (value === "setProfilePic") {
                  void handleSetProfilePicture();
                }
              }}
              onClose={onClose}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
