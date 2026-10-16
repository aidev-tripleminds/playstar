"use client";

import * as React from "react";

import { ConversationStatus } from "@/components/common/chat/conversation-status/conversation-status";
import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { Toggle } from "@/components/common/general/toggle/toggle";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MemoryIcon } from "@/public/assets/icons";

import { CoreMemoryModal } from "./core-memory-modal";
import type { CoreMemoryFormValues } from "./core-memory-modal.constants";
import {
  MEMORY_CORE_MEMORIES_DESCRIPTION,
  MEMORY_CORE_MEMORIES_LABEL,
  MEMORY_CUSTOM_INSTRUCTIONS_DESCRIPTION,
  MEMORY_CUSTOM_INSTRUCTIONS_LABEL,
  MEMORY_CUSTOM_INSTRUCTIONS_PLACEHOLDER,
  MEMORY_DEFAULT_CUSTOM_INSTRUCTIONS,
  MEMORY_DEFAULT_ITEMS,
  MEMORY_DEFAULT_LONG_TERM_ENABLED,
  MEMORY_LONG_TERM_DESCRIPTION,
  MEMORY_LONG_TERM_LABEL,
  MEMORY_MODAL_APPLY_LABEL,
  MEMORY_MODAL_CREATE_LABEL,
  MEMORY_MODAL_TITLE,
  type MemoryItem,
} from "./memory-modal.constants";
import { MEMORY_DOT_MENU_ITEMS } from "./memory-modal.menu";

export type MemoryModalValues = {
  memories: MemoryItem[];
  customInstructions: string;
  longTermMemoryEnabled: boolean;
};

export type MemoryModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  closeLabel?: string;
  applyLabel?: string;
  createLabel?: string;
  memories?: MemoryItem[];
  defaultMemories?: MemoryItem[];
  customInstructions?: string;
  defaultCustomInstructions?: string;
  longTermMemoryEnabled?: boolean;
  defaultLongTermMemoryEnabled?: boolean;
  onApply?: (values: MemoryModalValues) => void;
  onCreateNewMemory?: () => void;
  onMemoryClick?: (memory: MemoryItem) => void;
  onMemoryEdit?: (memory: MemoryItem) => void;
  onMemoryUpdate?: (memory: MemoryItem) => void;
  onMemoryDelete?: (memory: MemoryItem) => void;
  onClose?: () => void;
  className?: string;
};

function createMemoryId() {
  return `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function areMemoryListsEqual(left: MemoryItem[], right: MemoryItem[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => {
    const other = right[index];
    return (
      other !== undefined &&
      item.id === other.id &&
      item.name === other.name &&
      item.preview === other.preview
    );
  });
}

export function MemoryModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = MEMORY_MODAL_TITLE,
  closeLabel = "Close memory",
  applyLabel = MEMORY_MODAL_APPLY_LABEL,
  createLabel = MEMORY_MODAL_CREATE_LABEL,
  memories,
  defaultMemories = MEMORY_DEFAULT_ITEMS,
  customInstructions,
  defaultCustomInstructions = MEMORY_DEFAULT_CUSTOM_INSTRUCTIONS,
  longTermMemoryEnabled,
  defaultLongTermMemoryEnabled = MEMORY_DEFAULT_LONG_TERM_ENABLED,
  onApply,
  onCreateNewMemory,
  onMemoryClick,
  onMemoryEdit,
  onMemoryUpdate,
  onMemoryDelete,
  onClose,
  className,
}: MemoryModalProps) {
  const [internalMemories, setInternalMemories] = React.useState<MemoryItem[]>(defaultMemories);
  const [internalCustomInstructions, setInternalCustomInstructions] =
    React.useState(defaultCustomInstructions);
  const [internalLongTermMemoryEnabled, setInternalLongTermMemoryEnabled] = React.useState(
    defaultLongTermMemoryEnabled,
  );
  const [baseline, setBaseline] = React.useState<MemoryModalValues>({
    memories: defaultMemories,
    customInstructions: defaultCustomInstructions,
    longTermMemoryEnabled: defaultLongTermMemoryEnabled,
  });
  const [openMenuMemoryId, setOpenMenuMemoryId] = React.useState<string | null>(null);
  const [isCoreMemoryFormOpen, setIsCoreMemoryFormOpen] = React.useState(false);
  const [editingMemory, setEditingMemory] = React.useState<MemoryItem | null>(null);
  const wasOpenRef = React.useRef(false);

  const isMemoriesControlled = memories !== undefined;
  const resolvedMemories = memories ?? internalMemories;
  const resolvedCustomInstructions = customInstructions ?? internalCustomInstructions;
  const resolvedLongTermMemoryEnabled = longTermMemoryEnabled ?? internalLongTermMemoryEnabled;
  const hasCoreMemories = resolvedMemories.length > 0;
  const hasChanges =
    resolvedCustomInstructions !== baseline.customInstructions ||
    resolvedLongTermMemoryEnabled !== baseline.longTermMemoryEnabled ||
    !areMemoryListsEqual(resolvedMemories, baseline.memories);

  React.useEffect(() => {
    const justOpened = Boolean(open) && !wasOpenRef.current;
    wasOpenRef.current = Boolean(open);

    if (!justOpened) {
      return;
    }

    const nextMemories = memories ?? defaultMemories;
    const nextCustomInstructions = customInstructions ?? defaultCustomInstructions;
    const nextLongTermMemoryEnabled = longTermMemoryEnabled ?? defaultLongTermMemoryEnabled;

    setInternalMemories(nextMemories);
    setInternalCustomInstructions(nextCustomInstructions);
    setInternalLongTermMemoryEnabled(nextLongTermMemoryEnabled);
    setBaseline({
      memories: nextMemories,
      customInstructions: nextCustomInstructions,
      longTermMemoryEnabled: nextLongTermMemoryEnabled,
    });
    setOpenMenuMemoryId(null);
    setIsCoreMemoryFormOpen(false);
    setEditingMemory(null);
  }, [
    customInstructions,
    defaultCustomInstructions,
    defaultLongTermMemoryEnabled,
    defaultMemories,
    longTermMemoryEnabled,
    memories,
    open,
  ]);

  const updateMemories = React.useCallback(
    (nextMemories: MemoryItem[]) => {
      if (!isMemoriesControlled) {
        setInternalMemories(nextMemories);
      }
    },
    [isMemoriesControlled],
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setOpenMenuMemoryId(null);
        setIsCoreMemoryFormOpen(false);
        setEditingMemory(null);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const handleClose = React.useCallback(() => {
    setOpenMenuMemoryId(null);
    setIsCoreMemoryFormOpen(false);
    setEditingMemory(null);
    onClose?.();
  }, [onClose]);

  const handleCustomInstructionsChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (customInstructions === undefined) {
        setInternalCustomInstructions(event.target.value);
      }
    },
    [customInstructions],
  );

  const handleLongTermMemoryChange = React.useCallback(
    (checked: boolean) => {
      if (longTermMemoryEnabled === undefined) {
        setInternalLongTermMemoryEnabled(checked);
      }
    },
    [longTermMemoryEnabled],
  );

  const handleCreateNewMemory = React.useCallback(() => {
    setEditingMemory(null);
    setIsCoreMemoryFormOpen(true);
    onCreateNewMemory?.();
  }, [onCreateNewMemory]);

  const handleMemoryDotItemClick = React.useCallback(
    (memory: MemoryItem, value: string) => {
      setOpenMenuMemoryId(null);
      if (value === "edit") {
        setEditingMemory(memory);
        setIsCoreMemoryFormOpen(true);
        onMemoryEdit?.(memory);
        return;
      }
      if (value === "delete") {
        updateMemories(resolvedMemories.filter((item) => item.id !== memory.id));
        onMemoryDelete?.(memory);
      }
    },
    [onMemoryDelete, onMemoryEdit, resolvedMemories, updateMemories],
  );

  const handleCoreMemoryFormOpenChange = React.useCallback((nextOpen: boolean) => {
    setIsCoreMemoryFormOpen(nextOpen);
    if (!nextOpen) {
      setEditingMemory(null);
    }
  }, []);

  const handleCoreMemorySave = React.useCallback(
    (values: CoreMemoryFormValues) => {
      if (!values.name || !values.description) {
        return;
      }

      if (editingMemory) {
        const updatedMemory: MemoryItem = {
          ...editingMemory,
          name: values.name,
          preview: values.description,
        };
        updateMemories(
          resolvedMemories.map((item) => (item.id === editingMemory.id ? updatedMemory : item)),
        );
        onMemoryUpdate?.(updatedMemory);
      } else {
        const newMemory: MemoryItem = {
          id: createMemoryId(),
          name: values.name,
          preview: values.description,
        };
        updateMemories([...resolvedMemories, newMemory]);
      }
    },
    [editingMemory, onMemoryUpdate, resolvedMemories, updateMemories],
  );

  const handleApply = React.useCallback(() => {
    onApply?.({
      memories: resolvedMemories,
      customInstructions: resolvedCustomInstructions,
      longTermMemoryEnabled: resolvedLongTermMemoryEnabled,
    });
    onOpenChange?.(false);
  }, [
    onApply,
    onOpenChange,
    resolvedCustomInstructions,
    resolvedLongTermMemoryEnabled,
    resolvedMemories,
  ]);

  return (
    <>
      <ModalLayout
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        title={title}
        titleIcon={<MemoryIcon className="text-tooltip-text size-6" />}
        showIcon
        showMobileHandle={showMobileHandle}
        closeLabel={closeLabel}
        closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
        onClose={handleClose}
        dismissOnOutsideClick={!isCoreMemoryFormOpen}
        overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
        className={cn(
          "border-surface-strong bg-dialog-bg md:max-w-[min(100%,780px)]",
          contentClassName,
        )}
      >
        <div
          data-slot="memory-modal"
          className={cn("scrollbar-hidden flex flex-col gap-2 overflow-y-auto md:gap-4", className)}
        >
          <DialogDescription className="sr-only">
            Manage core memories and custom instructions for this character.
          </DialogDescription>

          <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-4">
            <div className="order-2 flex min-w-0 flex-1 flex-col gap-4 md:order-1">
              <div className="flex flex-col">
                <p className="text-tooltip-text text-sm leading-5 font-medium">
                  {MEMORY_CORE_MEMORIES_LABEL}
                </p>
                <p className="text-divider-label text-[14px] leading-5 font-medium">
                  {MEMORY_CORE_MEMORIES_DESCRIPTION}
                </p>
              </div>

              <div className="scrollbar-hidden flex max-h-[min(360px,50vh)] flex-col gap-2 overflow-y-auto">
                {resolvedMemories.map((memory) => (
                  <ConversationStatus
                    key={memory.id}
                    status="memory"
                    name={memory.name}
                    preview={memory.preview}
                    className="w-full"
                    dotMenuItems={MEMORY_DOT_MENU_ITEMS}
                    enableMobileMenu
                    menuOpen={openMenuMemoryId === memory.id}
                    onMenuOpenChange={(nextOpen) => {
                      setOpenMenuMemoryId(nextOpen ? memory.id : null);
                    }}
                    onDotItemClick={(value) => handleMemoryDotItemClick(memory, value)}
                    dotAriaLabel={`${memory.name} memory options`}
                    onClick={() => onMemoryClick?.(memory)}
                  />
                ))}
              </div>
            </div>

            <div className="order-1 flex min-w-0 flex-1 flex-col gap-4 md:order-2">
              <div className="flex flex-col">
                <p className="text-tooltip-text text-sm leading-5 font-medium">
                  {MEMORY_CUSTOM_INSTRUCTIONS_LABEL}
                </p>
                <p className="text-divider-label text-[14px] leading-5 font-medium">
                  {MEMORY_CUSTOM_INSTRUCTIONS_DESCRIPTION}
                </p>
              </div>

              <TextArea
                showLeftIcon={false}
                value={resolvedCustomInstructions}
                onChange={handleCustomInstructionsChange}
                placeholder={MEMORY_CUSTOM_INSTRUCTIONS_PLACEHOLDER}
                aria-label={MEMORY_CUSTOM_INSTRUCTIONS_LABEL}
                className="flex max-h-32 w-full md:max-h-90"
              />

              {hasCoreMemories ? (
                <div className="flex w-full items-center gap-0">
                  <div className="flex min-w-0 flex-1 flex-col justify-center pr-3">
                    <p className="text-tooltip-text text-sm leading-5 font-medium">
                      {MEMORY_LONG_TERM_LABEL}
                    </p>
                    <p className="text-select-muted-text text-sm leading-5 font-normal">
                      {MEMORY_LONG_TERM_DESCRIPTION}
                    </p>
                  </div>
                  <Toggle
                    checked={resolvedLongTermMemoryEnabled}
                    onCheckedChange={handleLongTermMemoryChange}
                    aria-label={MEMORY_LONG_TERM_LABEL}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Buttons
              variant="neutral-border"
              size="btn-m"
              leftIcon
              rightIcon={false}
              leftIconSrc="/assets/add-square.svg"
              label={createLabel}
              onClick={handleCreateNewMemory}
              className="h-11! w-full! max-w-none! flex-1"
            />
            <Buttons
              variant="rose"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={applyLabel}
              disabled={!hasChanges}
              onClick={handleApply}
              className="h-11! w-full! max-w-none! flex-1"
            />
          </div>
        </div>
      </ModalLayout>

      <CoreMemoryModal
        open={isCoreMemoryFormOpen}
        onOpenChange={handleCoreMemoryFormOpenChange}
        mode={editingMemory ? "edit" : "create"}
        defaultName={editingMemory?.name ?? ""}
        defaultDescription={editingMemory?.preview ?? ""}
        onSave={handleCoreMemorySave}
      />
    </>
  );
}
