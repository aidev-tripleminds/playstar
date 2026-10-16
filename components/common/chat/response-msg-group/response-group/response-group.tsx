"use client";

import * as React from "react";

import { AudioCompact } from "@/components/common/chat/audio-compact";
import {
  ResponseMsg,
  type ResponseMsgVariant,
} from "@/components/common/chat/response-msg-group/response-msg/response-msg";
import { SenderName } from "@/components/common/chat/sender-name/sender-name";
import { Alert } from "@/components/common/general/alert/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessagePart } from "@/lib/api/chats";
import { cn } from "@/lib/utils";
import { EditIconV2, RefreshIcon, TrashIcon, VolumeIcon } from "@/public/assets/icons";
import { ChevronLeftIcon } from "@/public/assets/icons/chevron";

import { CONTENT_MODERATED_MESSAGE } from "./response-group.constants";

export type ResponseGroupAction = "refresh" | "edit" | "delete" | "volume";

export type ResponseGroupMessage = {
  id?: string;
  message: string;
  variant?: ResponseMsgVariant;
};

export type ResponseGroupStatus = "default" | "moderated";

/** @deprecated Use `"moderated"` instead. */
export type ResponseGroupLegacyStatus = "status2";

export { CONTENT_MODERATED_MESSAGE };

const MODERATED_ACTIONS: ResponseGroupAction[] = ["edit", "delete"];

export type ResponseGroupProps = {
  /** `"moderated"` shows the community-guidelines alert (Figma Flag). `"status2"` is accepted as an alias. */
  status?: ResponseGroupStatus | ResponseGroupLegacyStatus;
  messages?: ResponseGroupMessage[];
  /** Paginated message sets — one group per page. Overrides `messages` when set. */
  pages?: ResponseGroupMessage[][];
  showActions?: boolean;
  /** Audio source for the volume action player. */
  audioSrc?: string;
  /** Controlled 1-based page index. */
  pageIndex?: number;
  /** Uncontrolled initial page index. */
  defaultPageIndex?: number;
  pageTotal?: number;
  /** Override copy for the moderated alert. Defaults to community-guidelines message. */
  moderatedMessage?: string;
  /** Group chat: show sender identity above the bubbles (Figma sender-id). */
  senderName?: string;
  senderAvatarSrc?: string;
  className?: string;
  children?: React.ReactNode;
  /** Regenerate is only offered on the latest reply. */
  showRegenerate?: boolean;
  editing?: boolean;
  editParts?: ChatMessagePart[];
  onEditPartsChange?: (parts: ChatMessagePart[]) => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
  editSaving?: boolean;
  confirmingDelete?: boolean;
  onDeleteConfirm?: () => void;
  onDeleteCancel?: () => void;
  onAction?: (action: ResponseGroupAction) => void;
  onPageIndexChange?: (pageIndex: number) => void;
  onPagePrevious?: () => void;
  onPageNext?: () => void;
};

function resolveResponseGroupStatus(
  status: ResponseGroupStatus | ResponseGroupLegacyStatus,
): ResponseGroupStatus {
  return status === "status2" ? "moderated" : status;
}

const defaultMessages: ResponseGroupMessage[] = [
  { message: "This is the text user sends." },
  { message: "Lorem ipsum" },
];

const ACTION_ICON_SIZE = 20;

const ACTION_ICON_CLASS = "hover:text-tooltip-text";

const ACTION_ITEMS: Array<{
  action: ResponseGroupAction;
  icon: React.ReactNode;
  label: string;
}> = [
  {
    action: "volume",
    icon: null,
    label: "Play response audio",
  },
  {
    action: "edit",
    icon: (
      <EditIconV2
        className={ACTION_ICON_CLASS}
        width={ACTION_ICON_SIZE}
        height={ACTION_ICON_SIZE}
      />
    ),
    label: "Edit response",
  },
  {
    action: "delete",
    icon: (
      <TrashIcon className={ACTION_ICON_CLASS} width={ACTION_ICON_SIZE} height={ACTION_ICON_SIZE} />
    ),
    label: "Delete response",
  },

  {
    action: "refresh",
    icon: (
      <RefreshIcon
        className={ACTION_ICON_CLASS}
        width={ACTION_ICON_SIZE}
        height={ACTION_ICON_SIZE}
      />
    ),
    label: "Regenerate response",
  },
];

const actionButtonClassName = cn(
  "text-divider-label focus-visible:ring-brand-primary inline-flex size-5 shrink-0 cursor-pointer items-center justify-center",
  "transition-colors focus-visible:ring-2 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-40",
);

function ActionButton({
  icon,
  label,
  onClick,
  pressed,
  // disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      // disabled={disabled}
      onClick={onClick}
      className={cn(actionButtonClassName, pressed && "text-tooltip-text")}
    >
      {icon}
    </button>
  );
}

function ResponseGroupPagination({
  pageIndex,
  pageTotal,
  onPrevious,
  onNext,
}: {
  pageIndex: number;
  pageTotal: number;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const canGoPrevious = pageIndex > 1;
  const canGoNext = pageIndex < pageTotal;

  return (
    <div
      data-slot="response-group-pagination"
      className="flex items-center gap-1"
      aria-label="Response page navigation"
    >
      <ActionButton
        icon={
          <ChevronLeftIcon
            className={cn(
              "size-5 shrink-0",
              canGoPrevious ? "text-tooltip-text" : "text-border-control",
            )}
            aria-hidden
          />
        }
        label="Previous response"
        disabled={!canGoPrevious}
        onClick={onPrevious}
      />
      <span aria-live="polite" className="text-tooltip-text text-sm leading-5 tabular-nums">
        {pageIndex}/{pageTotal}
      </span>
      <ActionButton
        icon={
          <ChevronLeftIcon
            className={cn(
              "disabled:text-border-control text-tooltip-text size-5 shrink-0 rotate-180",
              canGoNext ? "text-tooltip-text" : "text-border-control",
            )}
            aria-hidden
          />
        }
        label="Next response"
        disabled={!canGoNext}
        onClick={onNext}
      />
    </div>
  );
}

function clampPageIndex(pageIndex: number, pageTotal: number) {
  return Math.max(1, Math.min(pageIndex, pageTotal));
}

export function ResponseGroup({
  status = "default",
  messages,
  pages,
  showActions = true,
  audioSrc,
  pageIndex: pageIndexProp,
  defaultPageIndex = 1,
  pageTotal: pageTotalProp = 1,
  moderatedMessage = CONTENT_MODERATED_MESSAGE,
  senderName,
  senderAvatarSrc,
  className,
  children,
  showRegenerate = true,
  editing = false,
  editParts,
  onEditPartsChange,
  onEditSave,
  onEditCancel,
  editSaving = false,
  confirmingDelete = false,
  onDeleteConfirm,
  onDeleteCancel,
  onAction,
  onPageIndexChange,
  onPagePrevious,
  onPageNext,
}: ResponseGroupProps) {
  const resolvedStatus = resolveResponseGroupStatus(status);
  const isModerated = resolvedStatus === "moderated";
  const resolvedPageTotal = pages?.length ?? pageTotalProp;
  const isControlled = pageIndexProp !== undefined;
  const [uncontrolledPageIndex, setUncontrolledPageIndex] = React.useState(
    clampPageIndex(defaultPageIndex, resolvedPageTotal),
  );
  const [isAudioVisible, setIsAudioVisible] = React.useState(false);

  const currentPageIndex = clampPageIndex(
    isControlled ? pageIndexProp : uncontrolledPageIndex,
    resolvedPageTotal,
  );

  const activeMessages = pages?.[currentPageIndex - 1] ?? messages ?? defaultMessages;
  const alertText = messages?.[0]?.message ?? moderatedMessage;
  const visibleActions = (
    isModerated ? MODERATED_ACTIONS : ACTION_ITEMS.map((item) => item.action)
  ).filter(
    (action) =>
      (showRegenerate || action !== "refresh") && (action !== "volume" || Boolean(audioSrc)),
  );
  const canSaveEdit = (editParts ?? []).some((part) => part.text.trim().length > 0);

  const goToPage = React.useCallback(
    (nextPageIndex: number) => {
      const clamped = clampPageIndex(nextPageIndex, resolvedPageTotal);
      if (!isControlled) {
        setUncontrolledPageIndex(clamped);
      }
      onPageIndexChange?.(clamped);
    },
    [isControlled, onPageIndexChange, resolvedPageTotal],
  );

  const handlePrevious = React.useCallback(() => {
    if (currentPageIndex <= 1) return;
    goToPage(currentPageIndex - 1);
    onPagePrevious?.();
  }, [currentPageIndex, goToPage, onPagePrevious]);

  const handleNext = React.useCallback(() => {
    if (currentPageIndex >= resolvedPageTotal) return;
    goToPage(currentPageIndex + 1);
    onPageNext?.();
  }, [currentPageIndex, goToPage, onPageNext, resolvedPageTotal]);

  const handleAction = React.useCallback(
    (action: ResponseGroupAction) => {
      if (action === "volume" && audioSrc) {
        setIsAudioVisible(true);
      }
      onAction?.(action);
    },
    [audioSrc, onAction],
  );

  return (
    <div
      data-slot="response-group"
      data-status={resolvedStatus}
      data-page={isModerated ? undefined : currentPageIndex}
      className={cn("inline-flex flex-col items-start justify-center gap-3", className)}
    >
      <div className="flex w-full max-w-[461px] flex-col items-start gap-1">
        {senderName ? <SenderName name={senderName} avatarSrc={senderAvatarSrc} /> : null}
        {isModerated ? (
          <Alert type="alert" text={alertText} className="w-full" />
        ) : editing && editParts ? (
          <form
            data-slot="response-edit"
            className="flex w-full max-w-[380px] flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editSaving && canSaveEdit) onEditSave?.();
            }}
          >
            {editParts.map((part, index) => (
              <Textarea
                key={`${part.type}-${index}`}
                value={part.text}
                rows={2}
                aria-label={
                  part.type === "quote"
                    ? "Edit quote"
                    : part.type === "narration"
                      ? "Edit narration"
                      : "Edit response"
                }
                disabled={editSaving}
                onChange={(event) => {
                  const next = editParts.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, text: event.target.value } : item,
                  );
                  onEditPartsChange?.(next);
                }}
                className="bg-surface-strong text-tooltip-text min-h-10 rounded-[16px_16px_16px_4px] border-0 px-3 py-2 text-sm leading-5 shadow-none"
              />
            ))}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={editSaving}
                onClick={onEditCancel}
              >
                Cancel
              </Button>
              <Button type="submit" size="xs" disabled={editSaving || !canSaveEdit}>
                Save
              </Button>
            </div>
          </form>
        ) : (
          (children ??
          activeMessages.map((item, index) => (
            <ResponseMsg
              key={item.id ?? `${currentPageIndex}-${item.message}-${index}`}
              variant={item.variant ?? "chat"}
              message={item.message}
            />
          )))
        )}
      </div>

      {!isModerated && isAudioVisible && audioSrc ? (
        <AudioCompact src={audioSrc} className="w-full max-w-[210px]! min-w-0" />
      ) : null}

      {showActions && confirmingDelete ? (
        <div data-slot="response-delete-confirm" className="flex items-center gap-2">
          <span className="text-tooltip-text text-xs leading-4">Delete this reply?</span>
          <Button type="button" variant="ghost" size="xs" onClick={onDeleteCancel}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" size="xs" onClick={onDeleteConfirm}>
            Delete
          </Button>
        </div>
      ) : null}

      {showActions && !editing && !confirmingDelete ? (
        <div
          data-slot="response-group-actions"
          className={cn("flex w-full items-center", isModerated ? "gap-3" : "gap-4")}
          role="toolbar"
          aria-label="Message actions"
        >
          {ACTION_ITEMS.filter(({ action }) => visibleActions.includes(action)).map(
            ({ action, icon, label }) => {
              const isVolumeActive = action === "volume" && isAudioVisible;
              const resolvedIcon =
                action === "volume" ? (
                  <VolumeIcon
                    className={cn(ACTION_ICON_CLASS, isVolumeActive && "text-tooltip-text")}
                    width={ACTION_ICON_SIZE}
                    height={ACTION_ICON_SIZE}
                  />
                ) : (
                  icon
                );

              return (
                <ActionButton
                  key={action}
                  icon={resolvedIcon}
                  label={label}
                  pressed={isVolumeActive || undefined}
                  onClick={() => handleAction(action)}
                />
              );
            },
          )}
          {!isModerated && resolvedPageTotal > 1 ? (
            <ResponseGroupPagination
              pageIndex={currentPageIndex}
              pageTotal={resolvedPageTotal}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
