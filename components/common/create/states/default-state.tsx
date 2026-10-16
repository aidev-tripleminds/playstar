"use client";

import Image from "next/image";

import { Buttons } from "@/components/common/general/button/buttons";
import { UnblurOverlay } from "@/components/common/general/unblur-overlay";
import { RefreshIcon } from "@/public/assets/icons";

import { CardShell, profile, ProfileContent, useProfile } from "./shared";

function DefaultStateImage({ imageSrc }: { imageSrc: string }) {
  const { name } = useProfile();

  return <Image src={imageSrc} alt={name} fill className="object-cover" />;
}

export function DefaultState({
  name,
  bio,
  imageSrc = profile.image,
  blurred = false,
  onNameChange,
  onBioChange,
  onRegenerate,
  regenerateDisabled = false,
}: {
  name?: string;
  bio?: string;
  imageSrc?: string;
  blurred?: boolean;
  onNameChange?: (value: string) => void;
  onBioChange?: (value: string) => void;
  /** FRONT-890: pink Retry on the finished portrait. Opens image guidance. */
  onRegenerate?: () => void;
  /** Undo or a metadata Apply is still saving — the click must not start a regeneration. */
  regenerateDisabled?: boolean;
}) {
  return (
    <CardShell
      className="bg-dialog-bg"
      name={name}
      bio={bio}
      onNameChange={onNameChange}
      onBioChange={onBioChange}
    >
      <DefaultStateImage imageSrc={imageSrc} />
      {blurred ? <UnblurOverlay /> : null}
      {onRegenerate ? (
        <Buttons
          type="button"
          variant="rose"
          size="btn-m"
          aria-label="Retry"
          label="Retry"
          leftIcon
          rightIcon={false}
          leftIconNode={<RefreshIcon className="size-5" />}
          disabled={regenerateDisabled}
          onClick={onRegenerate}
          className="absolute top-3 right-3 z-20 size-10! w-10! min-w-10! shrink-0 gap-0! px-0! [&>span:nth-child(2)]:sr-only"
        />
      ) : null}
      <ProfileContent />
    </CardShell>
  );
}
