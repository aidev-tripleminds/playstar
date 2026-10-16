"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { EditIconV2 } from "@/public/assets/icons";

import {
  EDIT_CONVERSATION_NAME_LABEL,
  EDIT_CONVERSATION_NAME_MODAL_TITLE,
  EDIT_CONVERSATION_NAME_PLACEHOLDER,
  EDIT_CONVERSATION_NAME_SAVE_LABEL,
} from "./edit-conversation-name-modal.constants";

export type EditConversationNameModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  closeLabel?: string;
  saveLabel?: string;
  name?: string;
  defaultName?: string;
  onSave?: (name: string) => void;
  onClose?: () => void;
  className?: string;
};

export function EditConversationNameModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = EDIT_CONVERSATION_NAME_MODAL_TITLE,
  closeLabel = "Close edit conversation name",
  saveLabel = EDIT_CONVERSATION_NAME_SAVE_LABEL,
  name,
  defaultName = "",
  onSave,
  onClose,
  className,
}: EditConversationNameModalProps) {
  const [internalName, setInternalName] = React.useState(defaultName);
  const [baselineName, setBaselineName] = React.useState(defaultName);
  const wasOpenRef = React.useRef(false);

  const resolvedName = name ?? internalName;
  const trimmedName = resolvedName.trim();
  const hasChanges = trimmedName.length > 0 && trimmedName !== baselineName.trim();

  React.useEffect(() => {
    const justOpened = Boolean(open) && !wasOpenRef.current;
    wasOpenRef.current = Boolean(open);

    if (!justOpened) {
      return;
    }

    const nextName = name ?? defaultName;
    setInternalName(nextName);
    setBaselineName(nextName);
  }, [defaultName, name, open]);

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (name === undefined) {
        setInternalName(event.target.value);
      }
    },
    [name],
  );

  const handleSave = React.useCallback(() => {
    if (!hasChanges) {
      return;
    }
    onSave?.(trimmedName);
    onOpenChange?.(false);
  }, [hasChanges, onOpenChange, onSave, trimmedName]);

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIcon={<EditIconV2 className="text-tooltip-text size-5" />}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={onClose}
      overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-[998]")}
      className={cn(
        "border-surface-strong bg-dialog-bg z-[999] md:max-w-[min(100%,480px)]",
        contentClassName,
      )}
    >
      <div
        data-slot="edit-conversation-name-modal"
        className={cn("flex flex-col gap-4", className)}
      >
        <DialogDescription className="sr-only">
          Enter a custom name for this conversation.
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">
            {EDIT_CONVERSATION_NAME_LABEL}
          </p>
          <TextInput
            showLeftIcon={false}
            value={resolvedName}
            onChange={handleNameChange}
            placeholder={EDIT_CONVERSATION_NAME_PLACEHOLDER}
            aria-label={EDIT_CONVERSATION_NAME_LABEL}
            className="w-full! max-w-none!"
          />
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={saveLabel}
          disabled={!hasChanges}
          onClick={handleSave}
          className="h-11! w-full! max-w-none!"
        />
      </div>
    </ModalLayout>
  );
}
