"use client";

import * as React from "react";

import { ConversationStatus } from "@/components/common/chat/conversation-status/conversation-status";
import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PersonaIcon } from "@/public/assets/icons";

import { PersonaAvatar } from "./persona-avatar";
import { PersonaDeleteModal } from "./persona-delete-modal";
import { PersonaFormModal } from "./persona-form-modal";
import {
  createPersonaId,
  PERSONA_CREATE_CUSTOM_LABEL,
  PERSONA_DEFAULT_BACKGROUND_ID,
  PERSONA_DEFAULT_GENDER,
  PERSONA_DEFAULT_ICON_ID,
  PERSONA_MODAL_DESCRIPTION,
  PERSONA_MODAL_SAVE_LABEL,
  PERSONA_MODAL_TITLE,
  PERSONA_NONE_ID,
  PERSONA_NONE_LABEL,
  PERSONA_SELECT_AI_MODEL_LABEL,
  type PersonaFormValues,
  type PersonaItem,
} from "./persona-modal.constants";
import { PERSONA_AI_DOT_MENU_ITEMS, PERSONA_DOT_MENU_ITEMS } from "./persona-modal.menu";

export type PersonaAiDraft = {
  name: string;
  bio: string;
  imageSrc: string;
  sourceCharacterId: string;
  gender?: PersonaFormValues["gender"];
};

export type PersonaModalHandle = {
  openCreateFromAiForm: (draft: PersonaAiDraft) => void;
};

export type PersonaModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  closeLabel?: string;
  personas?: PersonaItem[];
  activePersonaId?: string;
  /** When set while open, opens the create form prefilled from an AI character. */
  aiDraft?: PersonaAiDraft | null;
  onAiDraftConsumed?: () => void;
  onActivePersonaChange?: (personaId: string) => void;
  onPersonasChange?: (personas: PersonaItem[]) => void;
  onSelectAiModel?: () => void;
  /** When it returns false, persona creation is blocked (e.g. signup required). */
  onBeforeCreate?: () => boolean;
  onClose?: () => void;
  className?: string;
};

function getAiDraftFormDefaults(draft: PersonaAiDraft): Partial<PersonaFormValues> {
  return {
    name: draft.name,
    bio: draft.bio,
    imageSrc: draft.imageSrc,
    sourceCharacterId: draft.sourceCharacterId,
    gender: draft.gender ?? PERSONA_DEFAULT_GENDER,
    source: "ai-model",
    iconId: PERSONA_DEFAULT_ICON_ID,
    backgroundId: PERSONA_DEFAULT_BACKGROUND_ID,
  };
}

function PersonaListRow({
  name,
  preview,
  selected,
  avatar,
  showMenu,
  menuItems = PERSONA_DOT_MENU_ITEMS,
  menuOpen,
  onMenuOpenChange,
  onSelect,
  onMenuItemClick,
  menuAriaLabel,
}: {
  name: string;
  preview?: string;
  selected: boolean;
  avatar: React.ReactNode;
  showMenu?: boolean;
  menuItems?: OptionListItem[];
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  onSelect: () => void;
  onMenuItemClick?: (value: string) => void;
  menuAriaLabel?: string;
}) {
  return (
    <ConversationStatus
      data-slot="persona-list-row"
      status={selected ? "radio" : "default"}
      name={name}
      preview={preview ?? ""}
      avatar={avatar}
      className="w-full px-3 py-2"
      showDotMenu={Boolean(showMenu)}
      dotMenuItems={menuItems}
      enableMobileMenu
      menuOpen={menuOpen}
      onMenuOpenChange={onMenuOpenChange}
      onDotItemClick={onMenuItemClick}
      dotAriaLabel={menuAriaLabel ?? `${name} persona options`}
      aria-label={selected ? `${name}, selected` : name}
      previewLineClamp={2}
      onClick={onSelect}
    />
  );
}

export const PersonaModal = React.forwardRef<PersonaModalHandle, PersonaModalProps>(
  function PersonaModal(
    {
      open,
      defaultOpen,
      onOpenChange,
      showMobileHandle = true,
      contentClassName,
      title = PERSONA_MODAL_TITLE,
      closeLabel = "Close persona",
      personas = [],
      activePersonaId = PERSONA_NONE_ID,
      aiDraft = null,
      onAiDraftConsumed,
      onActivePersonaChange,
      onPersonasChange,
      onSelectAiModel,
      onBeforeCreate,
      onClose,
      className,
    },
    ref,
  ) {
    const [openMenuPersonaId, setOpenMenuPersonaId] = React.useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingPersona, setEditingPersona] = React.useState<PersonaItem | null>(null);
    const [deletingPersona, setDeletingPersona] = React.useState<PersonaItem | null>(null);
    const [formDefaults, setFormDefaults] = React.useState<
      Partial<PersonaFormValues> | undefined
    >();
    const [prevOpen, setPrevOpen] = React.useState(open);
    const [appliedAiDraft, setAppliedAiDraft] = React.useState<PersonaAiDraft | null>(null);
    const [skipNextOpenReset, setSkipNextOpenReset] = React.useState(false);
    /** Draft selection — applied only when Save is clicked. */
    const [draftPersonaId, setDraftPersonaId] = React.useState(activePersonaId);
    const [prevActivePersonaId, setPrevActivePersonaId] = React.useState(activePersonaId);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const openCreateFromAiForm = React.useCallback((draft: PersonaAiDraft) => {
      setSkipNextOpenReset(true);
      setEditingPersona(null);
      setFormDefaults(getAiDraftFormDefaults(draft));
      setIsFormOpen(true);
    }, []);

    React.useImperativeHandle(ref, () => ({ openCreateFromAiForm }), [openCreateFromAiForm]);

    // Adjust nested UI while rendering when the controlled `open` / `aiDraft` props change.
    // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    if (open !== prevOpen) {
      setPrevOpen(open);
      if (open) {
        setDraftPersonaId(activePersonaId);
        if (skipNextOpenReset || aiDraft) {
          setSkipNextOpenReset(false);
          setOpenMenuPersonaId(null);
        } else {
          setOpenMenuPersonaId(null);
          setIsFormOpen(false);
          setEditingPersona(null);
          setDeletingPersona(null);
          setFormDefaults(undefined);
        }
      }
    }

    if (activePersonaId !== prevActivePersonaId) {
      setPrevActivePersonaId(activePersonaId);
      if (!open) {
        setDraftPersonaId(activePersonaId);
      }
    }

    if (open && aiDraft && aiDraft !== appliedAiDraft) {
      setAppliedAiDraft(aiDraft);
      setEditingPersona(null);
      setFormDefaults(getAiDraftFormDefaults(aiDraft));
      setIsFormOpen(true);
    } else if ((!open || !aiDraft) && appliedAiDraft !== null) {
      setAppliedAiDraft(null);
    }

    // Parent clears the one-shot draft after we've synced it into local form state.
    React.useEffect(() => {
      if (!open || !aiDraft) {
        return;
      }
      onAiDraftConsumed?.();
    }, [aiDraft, onAiDraftConsumed, open]);

    // Vaul locks an inline height on Android (esp. after nested form/keyboard).
    // Clear it when the list changes so the sheet can grow with content.
    React.useLayoutEffect(() => {
      if (!open || isFormOpen) {
        return;
      }

      const drawer = contentRef.current?.closest<HTMLElement>("[data-vaul-drawer]");
      if (!drawer?.style.height) {
        return;
      }

      drawer.style.height = "";
    }, [open, isFormOpen, personas.length]);

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!nextOpen) {
          setOpenMenuPersonaId(null);
          setIsFormOpen(false);
          setEditingPersona(null);
          setDeletingPersona(null);
          setFormDefaults(undefined);
        }
        onOpenChange?.(nextOpen);
      },
      [onOpenChange],
    );

    const handleClose = React.useCallback(() => {
      setOpenMenuPersonaId(null);
      setIsFormOpen(false);
      setEditingPersona(null);
      setDeletingPersona(null);
      setFormDefaults(undefined);
      onClose?.();
    }, [onClose]);

    const handleSelectPersona = React.useCallback((personaId: string) => {
      setDraftPersonaId(personaId);
    }, []);

    const hasSelectionChanges = draftPersonaId !== activePersonaId;

    const handleSave = React.useCallback(() => {
      if (hasSelectionChanges) {
        onActivePersonaChange?.(draftPersonaId);
      }
      handleOpenChange(false);
    }, [draftPersonaId, handleOpenChange, hasSelectionChanges, onActivePersonaChange]);

    const openCreateCustomForm = React.useCallback(() => {
      setEditingPersona(null);
      setFormDefaults({
        source: "custom",
        gender: PERSONA_DEFAULT_GENDER,
        iconId: PERSONA_DEFAULT_ICON_ID,
        backgroundId: PERSONA_DEFAULT_BACKGROUND_ID,
      });
      setIsFormOpen(true);
    }, []);

    const handleFormOpenChange = React.useCallback((nextOpen: boolean) => {
      setIsFormOpen(nextOpen);
      if (!nextOpen) {
        setEditingPersona(null);
        setFormDefaults(undefined);
      }
    }, []);

    const handleFormSave = React.useCallback(
      (values: PersonaFormValues) => {
        if (!editingPersona && onBeforeCreate && !onBeforeCreate()) {
          return;
        }

        if (editingPersona) {
          const updated: PersonaItem = {
            ...editingPersona,
            name: values.name,
            bio: values.bio,
            gender: values.gender,
            iconId: values.iconId,
            backgroundId: values.backgroundId,
            ...(editingPersona.source === "custom"
              ? {
                  source: "custom" as const,
                  imageSrc: undefined,
                  sourceCharacterId: undefined,
                }
              : {}),
          };
          onPersonasChange?.(
            personas.map((persona) => (persona.id === editingPersona.id ? updated : persona)),
          );
          return;
        }

        const created: PersonaItem = {
          id: createPersonaId(),
          name: values.name,
          bio: values.bio,
          gender: values.gender,
          source: values.source,
          sourceCharacterId: values.sourceCharacterId,
          imageSrc: values.source === "ai-model" ? values.imageSrc : undefined,
          iconId: values.source === "custom" ? values.iconId : undefined,
          backgroundId: values.source === "custom" ? values.backgroundId : undefined,
        };
        onPersonasChange?.([...personas, created]);
        setDraftPersonaId(created.id);
      },
      [editingPersona, onBeforeCreate, onPersonasChange, personas],
    );

    const handleMenuItemClick = React.useCallback((persona: PersonaItem, value: string) => {
      setOpenMenuPersonaId(null);

      if (value === "edit") {
        if (persona.source === "ai-model") {
          return;
        }

        setEditingPersona(persona);
        setFormDefaults({
          name: persona.name,
          bio: persona.bio,
          gender: persona.gender,
          iconId: persona.iconId ?? PERSONA_DEFAULT_ICON_ID,
          backgroundId: persona.backgroundId ?? PERSONA_DEFAULT_BACKGROUND_ID,
          source: "custom",
        });
        setIsFormOpen(true);
        return;
      }

      if (value === "delete") {
        setDeletingPersona(persona);
      }
    }, []);

    const handleDeleteConfirmOpenChange = React.useCallback((nextOpen: boolean) => {
      if (!nextOpen) {
        setDeletingPersona(null);
      }
    }, []);

    const handleDeleteConfirm = React.useCallback(() => {
      if (!deletingPersona) {
        return;
      }

      onPersonasChange?.(personas.filter((item) => item.id !== deletingPersona.id));
      if (draftPersonaId === deletingPersona.id) {
        setDraftPersonaId(PERSONA_NONE_ID);
      }
      if (activePersonaId === deletingPersona.id) {
        onActivePersonaChange?.(PERSONA_NONE_ID);
      }
      setDeletingPersona(null);
    }, [
      activePersonaId,
      deletingPersona,
      draftPersonaId,
      onActivePersonaChange,
      onPersonasChange,
      personas,
    ]);

    return (
      <>
        <ModalLayout
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          title={title}
          titleIcon={<PersonaIcon className="text-tooltip-text size-6" />}
          showIcon
          showMobileHandle={showMobileHandle}
          closeLabel={closeLabel}
          closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
          onClose={handleClose}
          dismissOnOutsideClick={!isFormOpen && !deletingPersona}
          overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
          className={cn(
            // h-fit! overrides Vaul's locked inline height on Android so the sheet
            // can grow when personas are added while the drawer stays open.
            "border-surface-strong bg-dialog-bg h-fit! max-h-[90vh] overflow-y-auto md:max-w-[min(100%,560px)]",
            "data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[90vh]",
            contentClassName,
          )}
        >
          <div
            ref={contentRef}
            data-slot="persona-modal"
            className={cn("scrollbar-hidden flex flex-col gap-4", className)}
          >
            <DialogDescription className="sr-only">{PERSONA_MODAL_DESCRIPTION}</DialogDescription>

            <div aria-label={PERSONA_MODAL_TITLE} className="flex flex-col gap-2">
              <PersonaListRow
                name={PERSONA_NONE_LABEL}
                selected={draftPersonaId === PERSONA_NONE_ID}
                avatar={<PersonaAvatar variant="none" />}
                onSelect={() => handleSelectPersona(PERSONA_NONE_ID)}
              />

              {personas.map((persona) => (
                <PersonaListRow
                  key={persona.id}
                  name={persona.name}
                  preview={persona.bio}
                  selected={draftPersonaId === persona.id}
                  avatar={<PersonaAvatar persona={persona} />}
                  showMenu
                  menuItems={
                    persona.source === "ai-model"
                      ? PERSONA_AI_DOT_MENU_ITEMS
                      : PERSONA_DOT_MENU_ITEMS
                  }
                  menuOpen={openMenuPersonaId === persona.id}
                  onMenuOpenChange={(nextOpen) => {
                    setOpenMenuPersonaId(nextOpen ? persona.id : null);
                  }}
                  onSelect={() => handleSelectPersona(persona.id)}
                  onMenuItemClick={(value) => handleMenuItemClick(persona, value)}
                  menuAriaLabel={`${persona.name} persona options`}
                />
              ))}
            </div>

            <div className="grid w-full shrink-0 grid-cols-1 gap-2 min-[320px]:grid-cols-2">
              <Buttons
                variant="neutral-border"
                size="btn-m"
                leftIcon={false}
                rightIcon={false}
                label={PERSONA_SELECT_AI_MODEL_LABEL}
                onClick={onSelectAiModel}
                className="h-11! w-full max-w-none! min-w-0"
              />
              <Buttons
                variant="neutral-border"
                size="btn-m"
                leftIcon
                rightIcon={false}
                leftIconSrc="/assets/add-square.svg"
                label={PERSONA_CREATE_CUSTOM_LABEL}
                onClick={openCreateCustomForm}
                className="h-11! w-full max-w-none! min-w-0"
              />
              <Buttons
                variant="rose"
                size="btn-m"
                leftIcon={false}
                rightIcon={false}
                label={PERSONA_MODAL_SAVE_LABEL}
                disabled={!hasSelectionChanges}
                onClick={handleSave}
                className="h-11! w-full max-w-none! min-w-0 min-[320px]:col-span-2"
              />
            </div>
          </div>
        </ModalLayout>

        <PersonaFormModal
          open={isFormOpen}
          onOpenChange={handleFormOpenChange}
          mode={editingPersona ? "edit" : "create"}
          defaultValues={formDefaults}
          onSave={handleFormSave}
        />

        <PersonaDeleteModal
          open={Boolean(deletingPersona)}
          onOpenChange={handleDeleteConfirmOpenChange}
          onConfirm={handleDeleteConfirm}
        />
      </>
    );
  },
);
