"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  CORE_MEMORY_DESCRIPTION_LABEL,
  CORE_MEMORY_DESCRIPTION_PLACEHOLDER,
  CORE_MEMORY_MODAL_CREATE_TITLE,
  CORE_MEMORY_MODAL_EDIT_TITLE,
  CORE_MEMORY_MODAL_SAVE_LABEL,
  CORE_MEMORY_MODAL_TITLE_ICON_SRC,
  CORE_MEMORY_NAME_LABEL,
  CORE_MEMORY_NAME_PLACEHOLDER,
  type CoreMemoryFormValues,
} from "./core-memory-modal.constants";

export type CoreMemoryModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  mode?: "create" | "edit";
  title?: string;
  closeLabel?: string;
  saveLabel?: string;
  name?: string;
  defaultName?: string;
  description?: string;
  defaultDescription?: string;
  onSave?: (values: CoreMemoryFormValues) => void;
  onClose?: () => void;
  className?: string;
};

export function CoreMemoryModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  mode = "create",
  title,
  closeLabel = "Close core memory form",
  saveLabel = CORE_MEMORY_MODAL_SAVE_LABEL,
  name,
  defaultName = "",
  description,
  defaultDescription = "",
  onSave,
  onClose,
  className,
}: CoreMemoryModalProps) {
  const [internalName, setInternalName] = React.useState(defaultName);
  const [internalDescription, setInternalDescription] = React.useState(defaultDescription);
  const wasOpenRef = React.useRef(false);

  const resolvedTitle =
    title ?? (mode === "edit" ? CORE_MEMORY_MODAL_EDIT_TITLE : CORE_MEMORY_MODAL_CREATE_TITLE);
  const resolvedName = name ?? internalName;
  const resolvedDescription = description ?? internalDescription;

  React.useEffect(() => {
    const justOpened = Boolean(open) && !wasOpenRef.current;
    wasOpenRef.current = Boolean(open);

    if (!justOpened) {
      return;
    }

    setInternalName(name ?? defaultName);
    setInternalDescription(description ?? defaultDescription);
  }, [defaultDescription, defaultName, description, name, open]);

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (name === undefined) {
        setInternalName(event.target.value);
      }
    },
    [name],
  );

  const handleDescriptionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (description === undefined) {
        setInternalDescription(event.target.value);
      }
    },
    [description],
  );

  const handleSave = React.useCallback(() => {
    onSave?.({
      name: resolvedName.trim(),
      description: resolvedDescription.trim(),
    });
    onOpenChange?.(false);
  }, [onOpenChange, onSave, resolvedDescription, resolvedName]);

  const canSave = resolvedName.trim().length > 0 && resolvedDescription.trim().length > 0;

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={resolvedTitle}
      titleIconSrc={CORE_MEMORY_MODAL_TITLE_ICON_SRC}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={onClose}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      className={cn(
        "border-surface-strong bg-dialog-bg z-999 md:max-w-[min(100%,480px)]",
        contentClassName,
      )}
    >
      <div data-slot="core-memory-modal" className={cn("flex flex-col gap-4", className)}>
        <DialogDescription className="sr-only">
          {mode === "edit"
            ? "Edit this core memory name and description."
            : "Create a new core memory with a name and description."}
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">
            {CORE_MEMORY_NAME_LABEL}
          </p>
          <TextInput
            showLeftIcon={false}
            value={resolvedName}
            onChange={handleNameChange}
            placeholder={CORE_MEMORY_NAME_PLACEHOLDER}
            aria-label={CORE_MEMORY_NAME_LABEL}
            className="w-full! max-w-none!"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">
            {CORE_MEMORY_DESCRIPTION_LABEL}
          </p>
          <TextArea
            showLeftIcon={false}
            value={resolvedDescription}
            onChange={handleDescriptionChange}
            placeholder={CORE_MEMORY_DESCRIPTION_PLACEHOLDER}
            aria-label={CORE_MEMORY_DESCRIPTION_LABEL}
            className="min-h-32 w-full max-w-none"
          />
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={saveLabel}
          disabled={!canSave}
          onClick={handleSave}
          className="h-11! w-full! max-w-none!"
        />
      </div>
    </ModalLayout>
  );
}
