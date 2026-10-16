"use client";

import * as React from "react";

import { CreatePostPanel } from "@/components/common/ai-model-pages/create-post/components/create-post-panel";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { cn } from "@/lib/utils";

export type { CreatePostPanelProps } from "./components/create-post-panel";
export { CreatePostPanel } from "./components/create-post-panel";

export type CreatePostProps = React.ComponentProps<typeof CreatePostPanel> & {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  titleIconSrc?: string;
};

export function CreatePost({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = "Create a post",
  titleIconSrc = "/assets/add-square.svg",
  closeLabel = "Close",
  onClose,
  onPublish,
  ...panelProps
}: CreatePostProps) {
  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handlePublish = React.useCallback(() => {
    onPublish?.();
    onOpenChange?.(false);
  }, [onPublish, onOpenChange]);

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn(
        "border-surface-strong bg-dialog-bg md:max-w-[min(100%,650px)]",
        contentClassName,
      )}
    >
      <CreatePostPanel
        {...panelProps}
        showHeader={false}
        onClose={handleClose}
        onPublish={handlePublish}
      />
    </ModalLayout>
  );
}
