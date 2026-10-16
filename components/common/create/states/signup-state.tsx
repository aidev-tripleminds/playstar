"use client";

import Image from "next/image";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

import { CardShell, SignUpBackground } from "./shared";

/** Geist italic already loaded for display titles. Figma uses 800–900. */
const SIGNUP_DISPLAY_FONT = "font-[family-name:var(--font-geist-extra-bold-italic)] italic";

const signupPerkRows = [
  [
    { label: "AI PORN VIDEOS", icon: "video" },
    { label: "UNLIMITED CHATS", icon: "chat" },
  ],
  [
    { label: "VOICE CALL HER", icon: "phone" },
    { label: "ASK HER NUDES", icon: "cam" },
  ],
] as const;

export type SignupStateProps = {
  onSignUpClick?: () => void;
};

export function SignupState({ onSignUpClick }: SignupStateProps = {}) {
  return (
    <CardShell isSignUp={true} className="relative overflow-hidden rounded-[24px]">
      <SignUpBackground />

      <div className="@container relative z-10 flex h-full w-full min-w-0 flex-col items-center justify-end gap-6 px-4 py-6 text-center">
        <div className="flex w-full flex-col items-center gap-0.5">
          <p
            className={cn(
              SIGNUP_DISPLAY_FONT,
              "text-tooltip-text max-w-full text-[min(32px,9.2cqi)] leading-[1.125] font-extrabold whitespace-nowrap uppercase",
            )}
          >
            SIGN UP TO BRING
          </p>
          <p
            className={cn(
              SIGNUP_DISPLAY_FONT,
              "w-fit max-w-full bg-[linear-gradient(180deg,_#fda5d5_0%,_#fb64b6_20%,_#e60076_100%)]! bg-clip-text text-center text-[min(32px,9.2cqi)] leading-[1.125] font-black whitespace-nowrap text-transparent uppercase",
            )}
          >
            HER TO LIFE
          </p>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          {signupPerkRows.map((row) => (
            <div key={row[0].label} className="flex items-center justify-center gap-1.5">
              {row.map((perk) => (
                <span key={perk.label} className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      SIGNUP_DISPLAY_FONT,
                      "text-tooltip-text text-[min(16px,4.6cqi)] leading-none font-bold whitespace-nowrap uppercase",
                    )}
                  >
                    {perk.label}
                  </span>
                  <PerkIcon name={perk.icon} />
                </span>
              ))}
            </div>
          ))}
        </div>

        <Buttons
          variant="rose"
          leftIcon={false}
          rightIcon={false}
          label="Sign up to bring her to life"
          className="w-full"
          onClick={onSignUpClick}
        />
      </div>
    </CardShell>
  );
}

function PerkIcon({ name }: { name: (typeof signupPerkRows)[number][number]["icon"] }) {
  if (name === "video") {
    return (
      <Image
        src="/assets/gr-play-video.svg"
        alt=""
        width={16}
        height={16}
        unoptimized
        className="size-4 shrink-0"
      />
    );
  }

  if (name === "chat") {
    return (
      <Image
        src="/assets/gr-chat.svg"
        alt=""
        width={16}
        height={16}
        unoptimized
        className="size-4 shrink-0"
      />
    );
  }

  if (name === "phone") {
    return (
      <Image
        src="/assets/gr-phone.svg"
        alt=""
        width={16}
        height={16}
        unoptimized
        className="size-4 shrink-0"
      />
    );
  }

  return (
    <Image
      src="/assets/gr-cam-ai.svg"
      alt=""
      width={16}
      height={16}
      unoptimized
      className="size-4 shrink-0"
    />
  );
}
