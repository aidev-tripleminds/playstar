"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { OptionList } from "@/components/common/general/option-list/option-list";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { cn } from "@/lib/utils";
import { HeartIcon } from "@/public/assets/icons/heart";

export type GenderPopupOption = "woman" | "man";

/**
 * Only the fields the user actually filled in. Registration already persisted a
 * server-assigned username and a default gender, so an untouched field means
 * "keep the default" — not "save an empty value".
 */
export type GenderPopupSavePayload = {
  username?: string;
  gender?: GenderPopupOption;
};

export type GenderPopupGenderOption = {
  value: GenderPopupOption;
  label: string;
  leftIconSrc?: string;
};

const DEFAULT_GENDER_OPTIONS: GenderPopupGenderOption[] = [
  { value: "woman", label: "Woman", leftIconSrc: "/assets/woman.svg" },
  { value: "man", label: "Man", leftIconSrc: "/assets/man.svg" },
];

export type GenderPopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIcon?: React.ReactNode;
  usernamePlaceholder?: string;
  username?: string;
  defaultUsername?: string;
  onUsernameChange?: (username: string) => void;
  gender?: GenderPopupOption | null;
  defaultGender?: GenderPopupOption | null;
  /**
   * Required to drive `gender` from the parent: without it a controlled caller
   * never learns about a selection, so the field would look inert. The
   * counterpart to `onUsernameChange`.
   */
  onGenderChange?: (gender: GenderPopupOption) => void;
  genderOptions?: GenderPopupGenderOption[];
  genderPlaceholder?: string;
  saveLabel?: string;
  /** Resolve to an error message to show inline, or null on success — the popup only closes on null. */
  onSave?: (data: GenderPopupSavePayload) => Promise<string | null> | void;
  onClose?: () => void;
  className?: string;
};

export function GenderPopup({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Personalize your experience",
  titleIcon = <HeartIcon className="size-5" filled={false} />,
  usernamePlaceholder = "Username",
  username: usernameProp,
  defaultUsername = "",
  onUsernameChange,
  gender: genderProp,
  defaultGender = null,
  onGenderChange,
  genderOptions = DEFAULT_GENDER_OPTIONS,
  genderPlaceholder = "Gender",
  saveLabel = "Save",
  onSave,
  onClose,
  className,
}: GenderPopupProps) {
  const [internalUsername, setInternalUsername] = React.useState(defaultUsername);
  const [internalGender, setInternalGender] = React.useState<GenderPopupOption | null>(
    defaultGender,
  );
  const [genderMenuOpen, setGenderMenuOpen] = React.useState(false);
  // Both fields are optional, so the only error that can surface here comes from
  // the backend rejecting the username (e.g. 409 "already taken").
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const genderMenuRef = React.useRef<HTMLDivElement>(null);
  const submittingRef = React.useRef(false);

  const username = usernameProp ?? internalUsername;
  // `undefined` means uncontrolled, but `null` is a legitimate controlled value
  // ("nothing selected yet"), so this cannot collapse to `??` — that would fall
  // back to the internal state for a parent that is genuinely driving the field.
  const gender = genderProp !== undefined ? genderProp : internalGender;
  const selectedGenderOption = genderOptions.find((option) => option.value === gender);
  const genderLabel = selectedGenderOption?.label ?? genderPlaceholder;
  const usernameHasError = error !== null;

  const setUsername = (value: string) => {
    if (usernameProp === undefined) {
      setInternalUsername(value);
    }
    onUsernameChange?.(value);
  };

  const setGender = (value: GenderPopupOption) => {
    if (genderProp === undefined) {
      setInternalGender(value);
    }
    onGenderChange?.(value);
  };

  // ModalLayout drives `onOpenChange` itself when its close button is pressed —
  // calling it here too would report the same dismissal twice.
  const handleClose = React.useCallback(() => {
    setGenderMenuOpen(false);
    onClose?.();
  }, [onClose]);

  React.useEffect(() => {
    if (!genderMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (genderMenuRef.current?.contains(target)) return;
      setGenderMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGenderMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [genderMenuOpen]);

  const handleSave = async () => {
    // The disabled button already blocks a second click, but the guard belongs
    // here too rather than resting on a distant component honouring `disabled`.
    if (submittingRef.current) return;

    setError(null);

    const trimmedUsername = username.trim();

    // Signup already wrote a username and a gender, so leaving both untouched is
    // a valid "keep what I was given" — there is nothing to send.
    if (!trimmedUsername && !gender) {
      setGenderMenuOpen(false);
      onOpenChange?.(false);
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const message = await onSave?.({
        username: trimmedUsername || undefined,
        gender: gender ?? undefined,
      });
      if (message) {
        // Save failed (e.g. 409 "already taken") — keep the popup open and
        // pin the message to the username field.
        setError(message);
        return;
      }
      setGenderMenuOpen(false);
      onOpenChange?.(false);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setGenderMenuOpen(false);
        }
        onOpenChange?.(nextOpen);
      }}
      title={title}
      titleIcon={titleIcon}
      showIcon
      showClose={false}
      showMobileHandle
      onClose={handleClose}
      className={cn("border-surface-strong bg-dialog-bg z-71 md:max-w-[320px]", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <TextInput
            type="text"
            value={username}
            placeholder={usernamePlaceholder}
            leftIconSrc="/assets/character.svg"
            status={usernameHasError ? "error" : "default"}
            className="w-full"
            onChange={(event) => {
              setUsername(event.target.value);
              if (error) setError(null);
            }}
          />

          <div ref={genderMenuRef} className="relative w-full">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={genderMenuOpen}
              aria-label="Select gender"
              onClick={() => setGenderMenuOpen((prev) => !prev)}
              className={cn(
                "border-border-strong bg-tooltip-default-bg flex w-full items-center gap-2 rounded-full border p-3 transition-colors",
                "hover:border-border-muted focus-visible:border-border-muted focus-visible:outline-none",
                genderMenuOpen && "border-border-focus",
              )}
            >
              <span
                className={cn(
                  "flex-1 text-left text-sm leading-5 font-medium",
                  selectedGenderOption ? "text-text-inverse" : "text-text-muted-strong",
                )}
              >
                {genderLabel}
              </span>
              <Image
                src="/assets/chevron-down.svg"
                alt=""
                width={20}
                height={20}
                className={cn(
                  "size-5 shrink-0 object-contain transition-transform duration-200",
                  genderMenuOpen && "rotate-180",
                )}
              />
            </button>

            {genderMenuOpen ? (
              <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full">
                <OptionList
                  variant="menu"
                  className="w-full"
                  items={genderOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                    leftIconSrc: option.leftIconSrc,
                    highlighted: option.value === gender,
                  }))}
                  onItemClick={(value) => {
                    setGender(value as GenderPopupOption);
                    setGenderMenuOpen(false);
                    if (error) setError(null);
                  }}
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]">
              {error}
            </p>
          ) : null}
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={isSubmitting ? "Saving..." : saveLabel}
          disabled={isSubmitting}
          onClick={handleSave}
          className="w-full cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
