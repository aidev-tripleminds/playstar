"use client";

import * as React from "react";

import { ConversationStatus } from "@/components/common/chat/conversation-status/conversation-status";
import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { GroupIcon } from "@/public/assets/icons";

import {
  GROUP_MEMBERS_MODAL_ADD_LABEL,
  GROUP_MEMBERS_MODAL_CREATE_GROUP_LABEL,
  GROUP_MEMBERS_MODAL_DESCRIPTION,
  GROUP_MEMBERS_MODAL_SAVE_LABEL,
  GROUP_MEMBERS_MODAL_TITLE,
  GROUP_MEMBERS_SAMPLE_ITEMS,
  type GroupMember,
  MAX_GROUP_MEMBERS,
} from "./group-members-modal.constants";
import { GROUP_MEMBERS_DOT_MENU_ITEMS } from "./group-members-modal.menu";

function areMemberListsEqual(left: readonly GroupMember[], right: readonly GroupMember[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((member, index) => member.id === right[index]?.id);
}

function hasAddedMembers(current: readonly GroupMember[], baseline: readonly GroupMember[]) {
  const baselineIds = new Set(baseline.map((member) => member.id));
  return current.some((member) => !baselineIds.has(member.id));
}

export type GroupMembersModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  closeLabel?: string;
  addLabel?: string;
  saveLabel?: string;
  members?: GroupMember[];
  /** Committed/original members used as the dirty baseline (and uncontrolled seed). */
  defaultMembers?: GroupMember[];
  maxMembers?: number;
  onAddCharacter?: () => void;
  onMemberClick?: (member: GroupMember) => void;
  onRemoveMember?: (member: GroupMember) => void;
  onSave?: (members: GroupMember[]) => void;
  onClose?: () => void;
  className?: string;
};

export function GroupMembersModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = GROUP_MEMBERS_MODAL_TITLE,
  closeLabel = "Close group members",
  addLabel = GROUP_MEMBERS_MODAL_ADD_LABEL,
  saveLabel = GROUP_MEMBERS_MODAL_SAVE_LABEL,
  members,
  defaultMembers = GROUP_MEMBERS_SAMPLE_ITEMS,
  maxMembers = MAX_GROUP_MEMBERS,
  onAddCharacter,
  onMemberClick,
  onRemoveMember,
  onSave,
  onClose,
  className,
}: GroupMembersModalProps) {
  // Controlled `members` (including parent drafts) fully own the list; local draft is uncontrolled-only.
  const isMembersControlled = members !== undefined;
  const [draftMembers, setDraftMembers] = React.useState<GroupMember[]>(
    () => members ?? defaultMembers,
  );
  const [openMenuMemberId, setOpenMenuMemberId] = React.useState<string | null>(null);
  const [prevOpen, setPrevOpen] = React.useState(open);

  const resolvedMembers = isMembersControlled ? members : draftMembers;
  const canAddCharacter = resolvedMembers.length < maxMembers;
  const canRemoveMember = resolvedMembers.length > 1;
  const hasChanges = !areMemberListsEqual(resolvedMembers, defaultMembers);
  const resolvedSaveLabel = hasAddedMembers(resolvedMembers, defaultMembers)
    ? GROUP_MEMBERS_MODAL_CREATE_GROUP_LABEL
    : saveLabel;

  // Seed uncontrolled draft when the modal opens.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (!isMembersControlled) {
        setDraftMembers(defaultMembers);
      }
      setOpenMenuMemberId(null);
    }
  }

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        if (!isMembersControlled) {
          setDraftMembers(defaultMembers);
        }
        setOpenMenuMemberId(null);
      } else {
        setOpenMenuMemberId(null);
      }
      onOpenChange?.(nextOpen);
    },
    [defaultMembers, isMembersControlled, onOpenChange],
  );

  const handleClose = React.useCallback(() => {
    setOpenMenuMemberId(null);
    onClose?.();
  }, [onClose]);

  const handleSave = React.useCallback(() => {
    setOpenMenuMemberId(null);
    if (onSave) {
      // Parent onSave owns dismiss (e.g. commit draft + close).
      onSave(resolvedMembers);
      return;
    }
    onOpenChange?.(false);
    onClose?.();
  }, [onClose, onOpenChange, onSave, resolvedMembers]);

  const handleDotItemClick = React.useCallback(
    (member: GroupMember, value: string) => {
      setOpenMenuMemberId(null);
      if (value !== "remove" || !canRemoveMember) {
        return;
      }

      if (!isMembersControlled) {
        setDraftMembers((prev) => {
          if (prev.length <= 1) {
            return prev;
          }
          return prev.filter((entry) => entry.id !== member.id);
        });
      }
      onRemoveMember?.(member);
    },
    [canRemoveMember, isMembersControlled, onRemoveMember],
  );

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      title={title}
      titleIcon={<GroupIcon className="text-tooltip-text size-5" />}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      className={cn(
        "border-surface-strong bg-dialog-bg z-100 flex max-h-[90vh] flex-col overflow-hidden",
        "md:max-w-[min(100%,560px)]",
        "data-[vaul-drawer-direction=bottom]:max-h-[90vh]",
        contentClassName,
      )}
      innerClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
    >
      <div
        data-slot="group-members-modal"
        className={cn(
          "scrollbar-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto",
          className,
        )}
      >
        <DialogDescription className="sr-only">{GROUP_MEMBERS_MODAL_DESCRIPTION}</DialogDescription>
        <div className="scrollbar-hidden flex max-h-[min(420px,55vh)] flex-col gap-2 overflow-y-auto">
          {resolvedMembers.map((member) => (
            <ConversationStatus
              key={member.id}
              status="default"
              name={member.name}
              preview={member.preview}
              avatarSrc={member.avatarSrc}
              previewLineClamp={2}
              className="w-full"
              dotMenuItems={GROUP_MEMBERS_DOT_MENU_ITEMS}
              enableMobileMenu
              disableHoverActions={!canRemoveMember}
              menuOpen={canRemoveMember && openMenuMemberId === member.id}
              onMenuOpenChange={(nextOpen) => {
                setOpenMenuMemberId(nextOpen ? member.id : null);
              }}
              onDotItemClick={(value) => handleDotItemClick(member, value)}
              dotAriaLabel={`${member.name} member options`}
              onClick={() => onMemberClick?.(member)}
            />
          ))}
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          {canAddCharacter ? (
            <Buttons
              variant="neutral-border"
              size="btn-m"
              leftIcon
              rightIcon={false}
              leftIconSrc="/assets/add-square.svg"
              label={addLabel}
              onClick={onAddCharacter}
              className="h-11! w-full max-w-none! min-w-0 flex-1!"
            />
          ) : null}
          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={resolvedSaveLabel}
            disabled={!hasChanges}
            onClick={handleSave}
            className="h-11! w-full max-w-none! min-w-0 flex-1!"
          />
        </div>
      </div>
    </ModalLayout>
  );
}
