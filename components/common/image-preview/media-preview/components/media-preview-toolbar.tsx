"use client";

import { DotOption } from "@/components/common/ai-model-pages/dot-option/dot-option";
import { Close } from "@/components/common/general/close/close";
import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { cn } from "@/lib/utils";
import { BookmarkIcon, DownloadIcon } from "@/public/assets/icons";

import { getMediaPreviewMenuItems } from "../constants";

type MediaPreviewActionBarProps = {
  hasVideo?: boolean;
  menuItems?: OptionListItem[];
  /** Whether the viewer saved this media. */
  saved?: boolean;
  /** Save switch. Absent: no save button (the slide is not a stored media row). */
  onSave?: () => void;
  onDownload?: () => void;
  onMore?: () => void;
  className?: string;
};

export function MediaPreviewActionBar({
  hasVideo = false,
  menuItems: menuItemsProp,
  saved = false,
  onSave,
  onDownload,
  onMore,
  className,
}: MediaPreviewActionBarProps) {
  const menuItems = menuItemsProp ?? getMediaPreviewMenuItems({ hasVideo });

  return (
    <div data-slot="media-preview-action-bar" className={cn("flex items-center gap-2", className)}>
      {onSave ? (
        <Close
          className="size-9 opacity-90 transition-opacity hover:opacity-100"
          aria-label={saved ? "Unsave" : "Save"}
          aria-pressed={saved}
          onClick={onSave}
          iconSrc={
            <BookmarkIcon
              filled={saved}
              className={cn(
                "size-6",
                saved ? "text-amber-col" : "text-tooltip-text md:text-neutral-300",
              )}
            />
          }
        />
      ) : null}
      <Close
        className="size-9 opacity-90 transition-opacity hover:opacity-100"
        aria-label="Download"
        onClick={onDownload}
        iconSrc={<DownloadIcon className="siz-6 text-tooltip-text md:text-neutral-300" />}
      />

      <DotOption
        items={menuItems}
        onTriggerClick={onMore}
        className="bg-tooltip-default-bg text-modal-text rounded-full p-1 opacity-90 transition-opacity hover:opacity-100"
      />
    </div>
  );
}

type MediaPreviewImageControlsProps = {
  isExpanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  className?: string;
};

export function MediaPreviewImageControls({
  isExpanded = false,
  onExpand,
  onClose,
  className,
}: MediaPreviewImageControlsProps) {
  return (
    <div
      data-slot="media-preview-image-controls"
      data-expanded={isExpanded ? "true" : "false"}
      className={cn("flex items-center gap-2", className)}
    >
      <Close
        className="size-9"
        iconSrc={isExpanded ? "/assets/minimize.svg" : "/assets/maximize.svg"}
        aria-label={isExpanded ? "Exit expanded view" : "Expand image"}
        aria-pressed={isExpanded}
        onClick={onExpand}
      />
      {isExpanded ? null : <Close className="size-9" onClick={onClose} />}
    </div>
  );
}
