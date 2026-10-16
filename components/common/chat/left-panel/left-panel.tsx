"use client";

import { cva } from "class-variance-authority";
import * as React from "react";

import { ConversationStatus } from "@/components/common/chat/conversation-status/conversation-status";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import { cn } from "@/lib/utils";
import { ChatIcon, ClockIcon, NewChatIcon, ProfileIcon, TextIcon } from "@/public/assets/icons";

import { Buttons } from "../../general/button/buttons";
import {
  ConversationOptionsModal,
  DeleteConversationModal,
  getConversationDotMenuItems,
} from "./components/conversation-action-modals";
import {
  DEFAULT_LEFT_PANEL_NEW_CHAT_LABEL,
  DEFAULT_LEFT_PANEL_PINNED_CHATS_LABEL,
  DEFAULT_LEFT_PANEL_SEARCH_PLACEHOLDER,
  DEFAULT_LEFT_PANEL_SUGGESTED_CHATS_LABEL,
  DEFAULT_LEFT_PANEL_TITLE,
  DEFAULT_LEFT_PANEL_YOUR_CHATS_LABEL,
} from "./constants";
import {
  filterConversationsByQuery,
  isConversationPinned,
  normalizeSearchQuery,
  partitionConversationsByPinned,
} from "./filter-conversations";
import type { LeftPanelConversation, LeftPanelProps } from "./types";

export {
  DEFAULT_LEFT_PANEL_CONVERSATIONS,
  DEFAULT_LEFT_PANEL_SEARCH_PLACEHOLDER,
  DEFAULT_LEFT_PANEL_SEARCH_VALUE,
  DEFAULT_LEFT_PANEL_SUGGESTED_CONVERSATIONS,
  DEFAULT_LEFT_PANEL_TITLE,
  DEFAULT_SPICE_BOT,
} from "./constants";
export type { aiSuggestion, LeftPanelConversation, LeftPanelProps, LeftPanelStatus } from "./types";
export { LEFT_PANEL_STATUSES } from "./types";

const NO_CONVERSATIONS: LeftPanelConversation[] = [];

const leftPanelVariants = cva(
  [
    "flex w-full max-w-[330px] flex-col items-center gap-4",
    "border-r border-border-strong bg-dialog-bg pt-4 pr-2 pb-0 pl-2",
    // Desktop keeps a nested scroll pane; mobile grows with the document so Safari can hide its HUD.
    "md:h-full md:min-h-0 md:overflow-hidden",
  ],
  {
    variants: {
      status: {
        default: "",
        search: "",
        mobile: "max-w-none border-r-0",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

function LeftPanelSectionLabel({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-divider-label w-full px-2 text-sm leading-5 font-medium">
      {children}
    </p>
  );
}

function LeftPanelSection({
  sectionId,
  title,
  children,
}: {
  sectionId: string;
  title?: string;
  children: React.ReactNode;
}) {
  const titleId = `${sectionId}-title`;

  return (
    <section
      data-slot="left-panel-section"
      data-section={sectionId}
      aria-labelledby={title ? titleId : undefined}
      className="flex w-full flex-col gap-2"
    >
      {title ? <LeftPanelSectionLabel id={titleId}>{title}</LeftPanelSectionLabel> : null}
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function LeftPanelConversationRow({
  conversation,
  className,
  onConversationClick,
  onDotItemClick,
  onDotTriggerClick,
  disableHoverActions = false,
  actionTarget = "conversation",
}: {
  conversation: LeftPanelConversation;
  onConversationClick?: (id: string) => void;
  onDotItemClick?: (id: string, value: string, target: "conversation" | "character") => void;
  onDotTriggerClick?: (id: string, target: "conversation" | "character") => void;
  disableHoverActions?: boolean;
  actionTarget?: "conversation" | "character";
  className?: string;
}) {
  const pinned = isConversationPinned(conversation);

  return (
    <ConversationStatus
      className={className}
      status={conversation.status ?? "default"}
      name={conversation.name}
      preview={conversation.preview}
      avatarSrc={conversation.avatarSrc}
      memberAvatars={conversation.memberAvatars}
      isPinned={pinned}
      disableHoverActions={disableHoverActions}
      dotMenuItems={getConversationDotMenuItems(pinned)}
      onClick={() => onConversationClick?.(conversation.id)}
      onDotItemClick={(value) => onDotItemClick?.(conversation.id, value, actionTarget)}
      onDotTriggerClick={() => onDotTriggerClick?.(conversation.id, actionTarget)}
    />
  );
}

function LeftPanelNewChatButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Buttons
      onClick={onClick}
      label={label}
      rightIcon={false}
      className="w-full"
      variant={"light-grey"}
      size={"btn-m"}
      leftIconNode={<ChatIcon className="text-dialog-bg size-5" />}
    />
  );
}

function LeftPanelNewChatFab({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Buttons
      type="button"
      data-slot="left-panel-new-chat-fab"
      aria-label={label}
      variant="rose"
      size="btn-l"
      onClick={onClick}
      rightIcon={false}
      leftIcon={false}
      label=""
      className="fixed right-4 bottom-22 z-30 size-12! h-12! w-12! max-w-12! min-w-12! gap-0! rounded-full! p-0! shadow-lg [&>span:empty]:hidden"
    >
      <NewChatIcon className="size-6" aria-hidden />
    </Buttons>
  );
}

const LEFT_PANEL_TABS = [
  { label: "Chats", icon: TextIcon },
  { label: "Characters", icon: ProfileIcon },
  { label: "History", icon: ClockIcon },
] as const;

function LeftPanelTabs({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (index: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chat lists"
      className="flex items-center justify-center gap-3 px-2"
    >
      {LEFT_PANEL_TABS.map((tab, index) => {
        const Icon = tab.icon;
        const isSelected = selected === index;

        return (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(index)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-xl text-base leading-6 font-medium",
              isSelected ? "text-tooltip-text" : "text-divider-label",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function LeftPanel({
  status = "default",
  title = DEFAULT_LEFT_PANEL_TITLE,
  searchValue,
  defaultSearchValue,
  searchPlaceholder = DEFAULT_LEFT_PANEL_SEARCH_PLACEHOLDER,
  spiceBot,
  aiSuggestion,
  conversations = NO_CONVERSATIONS,
  suggestedConversations = NO_CONVERSATIONS,
  onSearchChange,
  onSearchClear,
  onNewChatClick,
  onCollapseClick,
  onConversationClick,
  onConversationPin,
  onConversationDelete,
  characters = NO_CONVERSATIONS,
  onCharacterClick,
  onCharacterPin,
  onCharacterDelete,
  serverSearch = false,
  newChatLabel = DEFAULT_LEFT_PANEL_NEW_CHAT_LABEL,
  pinnedChatsLabel = DEFAULT_LEFT_PANEL_PINNED_CHATS_LABEL,
  yourChatsLabel = DEFAULT_LEFT_PANEL_YOUR_CHATS_LABEL,
  suggestedChatsLabel = DEFAULT_LEFT_PANEL_SUGGESTED_CHATS_LABEL,
  collapseLabel = "Collapse chat list",
  className,
  ...props
}: LeftPanelProps) {
  const isSearchControlled = searchValue !== undefined;
  const [internalSearchValue, setInternalSearchValue] = React.useState(
    () => defaultSearchValue ?? "",
  );
  const [optionsConversationId, setOptionsConversationId] = React.useState<string | null>(null);
  const [optionsTarget, setOptionsTarget] = React.useState<"conversation" | "character">(
    "conversation",
  );
  const [deleteConversationId, setDeleteConversationId] = React.useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const resolvedSearchQuery = isSearchControlled ? (searchValue ?? "") : internalSearchValue;
  const isSearching = normalizeSearchQuery(resolvedSearchQuery).length > 0;

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isSearchControlled) {
        setInternalSearchValue(event.target.value);
      }
      onSearchChange?.(event);
    },
    [isSearchControlled, onSearchChange],
  );

  const handleSearchClear = React.useCallback(() => {
    if (!isSearchControlled) {
      setInternalSearchValue("");
    }
    onSearchClear?.();
  }, [isSearchControlled, onSearchClear]);

  const resolvedStatus = status ?? "default";
  const isMobile = resolvedStatus === "mobile";
  const showSpiceBot =
    resolvedStatus === "default" && spiceBot !== undefined && !isSearching && selectedTab === 0;
  const hasAISuggestion = aiSuggestion != null && !isSearching;

  const allConversations = React.useMemo(
    () => [...conversations, ...suggestedConversations],
    [conversations, suggestedConversations],
  );

  const optionsConversation = React.useMemo(
    () => allConversations.find((conversation) => conversation.id === optionsConversationId),
    [allConversations, optionsConversationId],
  );

  const openDeleteModal = React.useCallback(
    (id: string) => {
      const shouldDefer = optionsConversationId !== null;
      setOptionsConversationId(null);

      if (shouldDefer) {
        // Let the options dialog unmount before opening delete confirmation.
        window.setTimeout(() => setDeleteConversationId(id), 0);
        return;
      }

      setDeleteConversationId(id);
    },
    [optionsConversationId],
  );

  const handleDotItemClick = React.useCallback(
    (id: string, value: string, target: "conversation" | "character" = "conversation") => {
      if (value === "pin") {
        if (target === "character") {
          onCharacterPin?.(id);
        } else {
          onConversationPin?.(id);
        }
        setOptionsConversationId(null);
        return;
      }

      if (value === "delete") {
        if (target === "character") {
          onCharacterDelete?.(id);
          setOptionsConversationId(null);
          return;
        }
        openDeleteModal(id);
      }
    },
    [onCharacterDelete, onCharacterPin, onConversationPin, openDeleteModal],
  );

  const handleDotTriggerClick = React.useCallback(
    (id: string, target: "conversation" | "character" = "conversation") => {
      if (isMobile) {
        setOptionsTarget(target);
        setOptionsConversationId(id);
      }
    },
    [isMobile],
  );

  const handleOptionsOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setOptionsConversationId(null);
    }
  }, []);

  const handleDeleteOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setDeleteConversationId(null);
    }
  }, []);

  const handleDeleteConfirm = React.useCallback(() => {
    if (!deleteConversationId) {
      return;
    }
    onConversationDelete?.(deleteConversationId);
    setDeleteConversationId(null);
  }, [deleteConversationId, onConversationDelete]);

  const filteredConversations = React.useMemo(
    () =>
      serverSearch
        ? [...conversations]
        : filterConversationsByQuery(conversations, resolvedSearchQuery),
    [conversations, resolvedSearchQuery, serverSearch],
  );
  const filteredSuggestedConversations = React.useMemo(
    () =>
      serverSearch
        ? [...suggestedConversations]
        : filterConversationsByQuery(suggestedConversations, resolvedSearchQuery),
    [resolvedSearchQuery, serverSearch, suggestedConversations],
  );

  const { pinned: pinnedYourChats, unpinned: unpinnedYourChats } = React.useMemo(
    () => partitionConversationsByPinned(filteredConversations),
    [filteredConversations],
  );
  const { pinned: pinnedSuggestedChats, unpinned: unpinnedSuggestedChats } = React.useMemo(
    () => partitionConversationsByPinned(filteredSuggestedConversations),
    [filteredSuggestedConversations],
  );

  // Single pinned bucket: Your chats first, then Suggested — preserves relative order in each source.
  const pinnedConversations = React.useMemo(
    () => [...pinnedYourChats, ...pinnedSuggestedChats],
    [pinnedYourChats, pinnedSuggestedChats],
  );

  const hasPinnedChats = pinnedConversations.length > 0;
  const hasYourChats = unpinnedYourChats.length > 0;
  const hasSuggestedChats = unpinnedSuggestedChats.length > 0;
  const isInboxTab = selectedTab === 0;
  const isCharactersTab = selectedTab === 1;

  const filteredCharacters = React.useMemo(
    () => filterConversationsByQuery(characters, resolvedSearchQuery),
    [characters, resolvedSearchQuery],
  );
  const { pinned: pinnedCharacters, unpinned: unpinnedCharacters } = React.useMemo(
    () => partitionConversationsByPinned(filteredCharacters),
    [filteredCharacters],
  );

  const optionsCharacter = characters.find((character) => character.id === optionsConversationId);

  return (
    <aside
      data-slot="left-panel"
      data-status={resolvedStatus}
      aria-label={title}
      className={cn(leftPanelVariants({ status: resolvedStatus }), className)}
      {...props}
    >
      <div
        data-slot="left-panel-list"
        className="flex w-full flex-1 [scrollbar-width:none] flex-col gap-4 pb-4 md:min-h-0 md:overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        <LeftPanelTabs selected={selectedTab} onChange={setSelectedTab} />

        <div data-slot="left-panel-actions" className="flex w-full min-w-0 flex-col gap-2 px-2">
          {isMobile ? null : (
            <LeftPanelNewChatButton label={newChatLabel} onClick={onNewChatClick} />
          )}
          <SearchInput
            value={searchValue}
            defaultValue={defaultSearchValue}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder={searchPlaceholder}
            wrapperClassName="w-full [&>div]:w-full"
            className="w-full min-w-0"
          />
        </div>
        {showSpiceBot && spiceBot ? (
          <LeftPanelConversationRow
            conversation={spiceBot}
            disableHoverActions
            onConversationClick={onConversationClick}
          />
        ) : null}

        {isCharactersTab ? (
          <>
            {pinnedCharacters.length > 0 ? (
              <LeftPanelSection sectionId="pinned-characters" title={pinnedChatsLabel}>
                {pinnedCharacters.map((character) => (
                  <LeftPanelConversationRow
                    key={character.id}
                    conversation={character}
                    actionTarget="character"
                    onConversationClick={onCharacterClick}
                    onDotItemClick={handleDotItemClick}
                    onDotTriggerClick={handleDotTriggerClick}
                  />
                ))}
              </LeftPanelSection>
            ) : null}
            {unpinnedCharacters.length > 0 ? (
              <LeftPanelSection sectionId="characters">
                {unpinnedCharacters.map((character) => (
                  <LeftPanelConversationRow
                    key={character.id}
                    conversation={character}
                    actionTarget="character"
                    onConversationClick={onCharacterClick}
                    onDotItemClick={handleDotItemClick}
                    onDotTriggerClick={handleDotTriggerClick}
                  />
                ))}
              </LeftPanelSection>
            ) : null}
          </>
        ) : null}

        {isInboxTab && hasPinnedChats ? (
          <LeftPanelSection sectionId="pinned-chats" title={pinnedChatsLabel}>
            {pinnedConversations.map((conversation) => (
              <LeftPanelConversationRow
                key={conversation.id}
                conversation={conversation}
                onConversationClick={onConversationClick}
                onDotItemClick={handleDotItemClick}
                onDotTriggerClick={handleDotTriggerClick}
              />
            ))}
          </LeftPanelSection>
        ) : null}

        {isInboxTab && hasAISuggestion ? (
          <LeftPanelSection sectionId="ai-suggestion">
            <LeftPanelConversationRow
              key={aiSuggestion.id}
              conversation={aiSuggestion}
              disableHoverActions
              onConversationClick={onConversationClick}
            />
          </LeftPanelSection>
        ) : null}

        {isInboxTab && hasYourChats ? (
          <LeftPanelSection sectionId="your-chats" title={yourChatsLabel}>
            {unpinnedYourChats.map((conversation) => (
              <LeftPanelConversationRow
                key={conversation.id}
                conversation={conversation}
                onConversationClick={onConversationClick}
                onDotItemClick={handleDotItemClick}
                onDotTriggerClick={handleDotTriggerClick}
              />
            ))}
          </LeftPanelSection>
        ) : null}

        {isInboxTab && hasSuggestedChats ? (
          <LeftPanelSection sectionId="suggested-chats" title={suggestedChatsLabel}>
            {unpinnedSuggestedChats.map((conversation) => (
              <LeftPanelConversationRow
                key={conversation.id}
                conversation={conversation}
                onConversationClick={onConversationClick}
                onDotItemClick={handleDotItemClick}
                onDotTriggerClick={handleDotTriggerClick}
              />
            ))}
          </LeftPanelSection>
        ) : null}
      </div>

      <ConversationOptionsModal
        open={optionsConversationId !== null}
        isPinned={
          optionsTarget === "character"
            ? optionsCharacter
              ? isConversationPinned(optionsCharacter)
              : false
            : optionsConversation
              ? isConversationPinned(optionsConversation)
              : false
        }
        onOpenChange={handleOptionsOpenChange}
        onItemClick={(value) => {
          if (optionsConversationId) {
            handleDotItemClick(optionsConversationId, value, optionsTarget);
          }
        }}
      />

      <DeleteConversationModal
        open={deleteConversationId !== null}
        onOpenChange={handleDeleteOpenChange}
        onConfirm={handleDeleteConfirm}
      />

      {isMobile ? <LeftPanelNewChatFab label={newChatLabel} onClick={onNewChatClick} /> : null}
    </aside>
  );
}
