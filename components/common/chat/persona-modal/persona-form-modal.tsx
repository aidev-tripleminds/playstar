"use client";

import Image from "next/image";
import * as React from "react";

import { TextBasedSelector } from "@/components/common/create/text-based-selector/text-based-selector";
import { Buttons } from "@/components/common/general/button/buttons";
import { Dropdown } from "@/components/common/general/dropdown/dropdown";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  PERSONA_BACKGROUND_OPTIONS,
  PERSONA_DEFAULT_BACKGROUND_ID,
  PERSONA_DEFAULT_GENDER,
  PERSONA_DEFAULT_ICON_ID,
  PERSONA_FORM_BACKGROUND_LABEL,
  PERSONA_FORM_BIO_LABEL,
  PERSONA_FORM_BIO_PLACEHOLDER,
  PERSONA_FORM_CREATE_TITLE,
  PERSONA_FORM_EDIT_SAVE_LABEL,
  PERSONA_FORM_EDIT_TITLE,
  PERSONA_FORM_GENDER_LABEL,
  PERSONA_FORM_GENDER_PLACEHOLDER,
  PERSONA_FORM_ICON_LABEL,
  PERSONA_FORM_NAME_LABEL,
  PERSONA_FORM_NAME_PLACEHOLDER,
  PERSONA_FORM_SAVE_LABEL,
  PERSONA_GENDER_OPTIONS,
  PERSONA_ICON_OPTIONS,
  type PersonaBackgroundId,
  type PersonaFormValues,
  type PersonaGender,
  type PersonaIconId,
  type PersonaSource,
} from "./persona-modal.constants";

export type PersonaFormModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  mode?: "create" | "edit";
  title?: string;
  closeLabel?: string;
  saveLabel?: string;
  defaultValues?: Partial<PersonaFormValues>;
  onSave?: (values: PersonaFormValues) => void;
  onClose?: () => void;
  className?: string;
};

function buildInitialValues(defaults?: Partial<PersonaFormValues>): PersonaFormValues {
  return {
    name: defaults?.name ?? "",
    gender: defaults?.gender ?? PERSONA_DEFAULT_GENDER,
    bio: defaults?.bio ?? "",
    iconId: defaults?.iconId ?? PERSONA_DEFAULT_ICON_ID,
    backgroundId: defaults?.backgroundId ?? PERSONA_DEFAULT_BACKGROUND_ID,
    source: defaults?.source ?? "custom",
    sourceCharacterId: defaults?.sourceCharacterId,
    imageSrc: defaults?.imageSrc,
  };
}

export function PersonaFormModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  mode = "create",
  title,
  closeLabel = "Close persona form",
  saveLabel,
  defaultValues,
  onSave,
  onClose,
  className,
}: PersonaFormModalProps) {
  const [values, setValues] = React.useState<PersonaFormValues>(() =>
    buildInitialValues(defaultValues),
  );
  const wasOpenRef = React.useRef(false);

  const resolvedTitle =
    title ?? (mode === "edit" ? PERSONA_FORM_EDIT_TITLE : PERSONA_FORM_CREATE_TITLE);
  const resolvedSaveLabel =
    saveLabel ?? (mode === "edit" ? PERSONA_FORM_EDIT_SAVE_LABEL : PERSONA_FORM_SAVE_LABEL);
  const isCustomAppearance = values.source !== "ai-model";

  React.useEffect(() => {
    const justOpened = Boolean(open) && !wasOpenRef.current;
    wasOpenRef.current = Boolean(open);

    if (!justOpened) {
      return;
    }

    setValues(buildInitialValues(defaultValues));
  }, [defaultValues, open]);

  const updateField = React.useCallback(
    <K extends keyof PersonaFormValues>(key: K, value: PersonaFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSave = React.useCallback(() => {
    const next: PersonaFormValues = {
      ...values,
      name: values.name.trim(),
      bio: values.bio.trim(),
      source: (values.source ?? "custom") as PersonaSource,
    };
    if (!next.name) {
      return;
    }
    onSave?.(next);
    onOpenChange?.(false);
  }, [onOpenChange, onSave, values]);

  const canSave = values.name.trim().length > 0;

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={resolvedTitle}
      titleIconSrc="/assets/persona.svg"
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
      <div data-slot="persona-form-modal" className={cn("flex flex-col gap-4", className)}>
        <DialogDescription className="sr-only">
          {mode === "edit"
            ? "Edit this persona name, gender, bio, and appearance."
            : "Create a new persona with a name, gender, bio, and appearance."}
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">
            {PERSONA_FORM_NAME_LABEL}
          </p>
          <TextInput
            showLeftIcon={false}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder={PERSONA_FORM_NAME_PLACEHOLDER}
            aria-label={PERSONA_FORM_NAME_LABEL}
            className="w-full! max-w-none!"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">
            {PERSONA_FORM_BIO_LABEL}
          </p>
          <TextArea
            showLeftIcon={false}
            value={values.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            placeholder={PERSONA_FORM_BIO_PLACEHOLDER}
            aria-label={PERSONA_FORM_BIO_LABEL}
            className="min-h-28 w-full max-w-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-tooltip-text text-sm leading-5 font-medium">
            {PERSONA_FORM_GENDER_LABEL}
          </p>
          <Dropdown
            showLabel={false}
            showLeftIcon={false}
            label={PERSONA_FORM_GENDER_PLACEHOLDER}
            value={
              PERSONA_GENDER_OPTIONS.find((option) => option.value === values.gender)?.label ??
              PERSONA_FORM_GENDER_PLACEHOLDER
            }
            options={PERSONA_GENDER_OPTIONS.map((option) => option.label)}
            onValueChange={(label) => {
              const next = PERSONA_GENDER_OPTIONS.find((option) => option.label === label);
              if (next) {
                updateField("gender", next.value as PersonaGender);
              }
            }}
            className="w-full! max-w-none!"
            widthMode="trigger"
          />
        </div>

        {isCustomAppearance ? (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-tooltip-text text-sm leading-5 font-medium">
                {PERSONA_FORM_BACKGROUND_LABEL}
              </p>
              <div className="flex flex-wrap items-center justify-start gap-1">
                {PERSONA_BACKGROUND_OPTIONS.map((option) => (
                  <TextBasedSelector
                    key={option.id}
                    label={option.label}
                    colors={[option.color]}
                    tone={option.tone}
                    status={values.backgroundId === option.id ? "selected" : "unselected"}
                    onStatusChange={(status) => {
                      if (status !== "selected") {
                        return;
                      }
                      updateField("backgroundId", option.id as PersonaBackgroundId);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-tooltip-text text-sm leading-5 font-medium">
                {PERSONA_FORM_ICON_LABEL}
              </p>
              <div className="flex gap-2 max-[339px]:flex-wrap">
                {PERSONA_ICON_OPTIONS.map((option) => {
                  const selected = values.iconId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-label={option.label}
                      aria-pressed={selected}
                      onClick={() => updateField("iconId", option.id as PersonaIconId)}
                      className={cn(
                        "flex size-9 cursor-pointer items-center justify-center rounded-full text-xl transition-colors min-[320px]:break-all min-[400px]:size-10 md:size-12",
                        selected
                          ? "border-border-focus bg-surface-strong"
                          : "hover:bg-surface-strong",
                      )}
                    >
                      <span
                        className="relative size-6 shrink-0 min-[400px]:size-7 md:size-8"
                        aria-hidden
                      >
                        <Image src={option.src} alt="" fill className="object-contain" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={resolvedSaveLabel}
          disabled={!canSave}
          onClick={handleSave}
          className="h-11! w-full! max-w-none!"
        />
      </div>
    </ModalLayout>
  );
}
