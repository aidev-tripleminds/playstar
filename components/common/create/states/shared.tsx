"use client";

import Image from "next/image";
import * as React from "react";

import { SUMMARY_CARD_EDIT } from "@/components/common/create/summary-cards/summary-card-edit.constants";
import { SummaryCardEditForm } from "@/components/common/create/summary-cards/summary-card-edit-form";
import { SummaryCardEditModal } from "@/components/common/create/summary-cards/summary-card-edit-modal";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

import { Close } from "../../general/close/close";
import { SIGNUP_CARD_STAR_SRC } from "./signup-star";

export const profile = {
  name: "Nina Petrov",
  bio: "Fitness junkie searching for a partner in crime. and s#xual partner of the caverns.",
  image: resolveAsset("demo_pics_dog").image ?? "",
};

export function SignUpBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[22px]" aria-hidden>
      {/* Sized by height, then cropped. object-fit: cover shifts tiles of this halftone SVG. */}
      <Image
        src={SIGNUP_CARD_STAR_SRC}
        alt=""
        width={640}
        height={700}
        unoptimized
        priority
        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0)_35%,#0E0E0E_100%)]" />
    </div>
  );
}

type ProfileContextValue = {
  name: string;
  bio: string;
  open: () => void;
};

const ProfileContext = React.createContext<ProfileContextValue>({
  name: profile.name,
  bio: profile.bio,
  open: () => {},
});

export function useProfile() {
  return React.useContext(ProfileContext);
}

// ─── EditPanel (desktop in-card shell) ─────────────────────────────────────────

type EditPanelDesktopProps = {
  onClose: () => void;
  name: string;
  bio: string;
  onNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSave: () => void;
};

function EditPanelDesktop({
  onClose,
  name,
  bio,
  onNameChange,
  onBioChange,
  onSave,
}: EditPanelDesktopProps) {
  return (
    <div className="relative z-20 flex max-h-full min-h-0 w-full flex-col">
      <div
        className={cn(
          "border-surface-strong bg-dialog-bg relative z-10 flex max-h-full min-h-0 w-full flex-col overflow-y-auto",
          "rounded-[24px] border p-4",
          "animate-in slide-in-from-top-5 duration-200 ease-out",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-tooltip-text flex items-center gap-2">
            <Image
              src={SUMMARY_CARD_EDIT.titleIconSrc}
              width={20}
              height={20}
              className="cursor-pointer object-cover"
              alt=""
            />
            <p className="text-[18px] leading-7 font-medium">{SUMMARY_CARD_EDIT.title}</p>
          </div>
          <Close onClick={onClose} />
        </div>

        <SummaryCardEditForm
          name={name}
          bio={bio}
          onNameChange={onNameChange}
          onBioChange={onBioChange}
          onSave={onSave}
        />
      </div>
    </div>
  );
}

export function CardShell({
  className,
  children,
  isSignUp = false,
  name: controlledName,
  bio: controlledBio,
  initialName = profile.name,
  initialBio = profile.bio,
  onNameChange,
  onBioChange,
}: React.PropsWithChildren<{
  className?: string;
  isSignUp?: boolean;
  /**
   * Controlled value — when supplied, this is the source of truth for both
   * display and the edit form, and the internal fallback below is unused.
   * Callers with nowhere to put the saved value (stories, demo previews)
   * leave this undefined and get the old self-contained behaviour instead.
   */
  name?: string;
  bio?: string;
  initialName?: string;
  initialBio?: string;
  onNameChange?: (value: string) => void;
  onBioChange?: (value: string) => void;
}>) {
  const isDesktop = useIsDesktop();
  const [internalName, setInternalName] = React.useState(initialName);
  const [internalBio, setInternalBio] = React.useState(initialBio);
  const name = controlledName ?? internalName;
  const bio = controlledBio ?? internalBio;
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(name);
  const [draftBio, setDraftBio] = React.useState(bio);
  const [editSessionKey, setEditSessionKey] = React.useState<string | null>(null);
  const sessionKey = isEditing ? "open" : null;

  if (sessionKey !== editSessionKey) {
    setEditSessionKey(sessionKey);
    if (sessionKey) {
      setDraftName(name);
      setDraftBio(bio);
    }
  }

  const handleCloseEdit = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSaveEdit = React.useCallback(() => {
    if (controlledName === undefined) setInternalName(draftName);
    if (controlledBio === undefined) setInternalBio(draftBio);
    onNameChange?.(draftName);
    onBioChange?.(draftBio);
    setIsEditing(false);
  }, [controlledBio, controlledName, draftBio, draftName, onBioChange, onNameChange]);

  const editFormProps = {
    name: draftName,
    bio: draftBio,
    onNameChange: setDraftName,
    onBioChange: setDraftBio,
    onSave: handleSaveEdit,
  };

  return (
    <ProfileContext.Provider value={{ name, bio, open: () => setIsEditing(true) }}>
      <div
        className="relative aspect-[95/126] w-full max-w-[380px] min-w-0 overflow-hidden rounded-[24px]"
        data-testid="summary-card-shell"
      >
        <div
          className={cn(
            "bg-tooltip-default-bg border-dialog-bg relative z-10 flex h-full w-full flex-col overflow-hidden rounded-[24px] border-2",
            className,
          )}
        >
          {children}
        </div>

        {isEditing && isDesktop ? (
          <div className="absolute inset-0 z-20 flex min-h-0 flex-col justify-start overflow-hidden p-4">
            <div
              className="bg-background-blur absolute inset-0 backdrop-blur-[3px]"
              onClick={handleCloseEdit}
            />

            <EditPanelDesktop onClose={handleCloseEdit} {...editFormProps} />
          </div>
        ) : null}

        {/* Border overlay */}
        <div
          className={cn(
            "border-dialog-bg pointer-events-none absolute inset-0 z-30 rounded-[24px] border-2",
            isSignUp ? "border-tooltip-default-bg" : "border-dialog-bg",
          )}
        />
      </div>

      {isEditing && !isDesktop ? (
        <SummaryCardEditModal open={isEditing} onOpenChange={setIsEditing} {...editFormProps} />
      ) : null}
    </ProfileContext.Provider>
  );
}

// ─── ProfileContent ────────────────────────────────────────────────────────────

export function ProfileContent() {
  const { open, name, bio } = useProfile();

  return (
    <div className="relative mt-auto rounded-[20px] bg-[image:var(--gradient-overlay-dark-ai-step)] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-tooltip-text line-clamp-1 text-[20px] leading-7 font-bold">{name}</h3>
        <button onClick={open} className="flex-shrink-0 cursor-pointer" aria-label="Edit character">
          <Image
            src="/assets/edit-icon.svg"
            width={20}
            height={20}
            className="object-cover"
            alt=""
          />
        </button>
      </div>
      <p className="text-cookie-bg line-clamp-3 text-sm">{bio}</p>
    </div>
  );
}
