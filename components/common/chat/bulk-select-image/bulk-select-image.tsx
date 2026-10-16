"use client";

import * as React from "react";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";

import { Buttons } from "../../general/button/buttons";

const ICON_ONLY_BUTTON_CLASS = "gap-0 px-[7.5px]!";

export type BulkSelectImageAction = "download" | "delete" | "exit";

export type BulkSelectImageProps = Omit<React.ComponentProps<"div">, "children"> & {
  selectedCount?: number;
  downloadLabel?: string;
  deleteLabel?: string;
  exitLabel?: string;
  onDownload?: () => void;
  onDelete?: () => void;
  onExit?: () => void;
  onAction?: (action: BulkSelectImageAction) => void;
  desktopResolution?: number;
  downloadDisabled?: boolean;
  isDownloading?: boolean;
};

export function BulkSelectImage({
  selectedCount = 0,
  downloadLabel = "Download",
  deleteLabel = "Delete",
  exitLabel = "Exit",
  onDownload,
  onDelete,
  onExit,
  onAction,
  desktopResolution,
  downloadDisabled = false,
  isDownloading = false,
  className,
  ...props
}: BulkSelectImageProps) {
  const isDesktop = useIsDesktop(desktopResolution);

  return (
    <div
      data-slot="bulk-select-image"
      role="toolbar"
      aria-label="Bulk image selection actions"
      className={cn(
        "bg-tooltip-default-bg flex w-full min-w-0 items-center justify-between gap-2.5 rounded-full py-2 pr-2 pl-4",
        className,
      )}
      {...props}
    >
      <p
        data-slot="bulk-select-image-count"
        className="text-tooltip-text min-w-0 shrink truncate text-sm leading-5 font-medium"
      >
        {selectedCount} Selected
      </p>
      <div data-slot="bulk-select-image-actions" className="flex shrink-0 items-center gap-2">
        <Buttons
          label={isDesktop ? (isDownloading ? "Downloading..." : downloadLabel) : ""}
          rightIcon={false}
          disabled={downloadDisabled || isDownloading}
          aria-label={isDownloading ? "Downloading..." : downloadLabel}
          aria-busy={isDownloading || undefined}
          onClick={() => {
            onDownload?.();
            onAction?.("download");
          }}
          variant={"neutral-hover"}
          size={"btn-s"}
          leftIconSrc={"/assets/import.svg"}
          className={cn(!isDesktop && ICON_ONLY_BUTTON_CLASS)}
        />
        <Buttons
          label={deleteLabel}
          rightIcon={false}
          onClick={() => {
            onDelete?.();
            onAction?.("delete");
          }}
          variant={"neutral-hover"}
          size={"btn-s"}
          leftIconSrc={"/assets/trash.svg"}
          className="bg-rose-700"
        />
        <Buttons
          label=""
          aria-label={exitLabel}
          rightIcon={false}
          onClick={() => {
            onExit?.();
            onAction?.("exit");
          }}
          variant={"neutral-hover"}
          size={"btn-s"}
          leftIconSrc={"/assets/cross-def.svg"}
          className={ICON_ONLY_BUTTON_CLASS}
        />
      </div>
    </div>
  );
}
