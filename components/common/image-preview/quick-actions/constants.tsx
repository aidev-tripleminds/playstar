import Image from "next/image";

import { PlayVideoIcon, UserAIIcon } from "@/public/assets/icons";

import type { QuickActionItem, QuickActionsContentType, QuickActionsModelStatus } from "./types";

const iconClassName = "size-6 shrink-0";

export const imageQuickActions: QuickActionItem[] = [
  {
    value: "edit",
    label: "Edit",
    icon: (
      <Image src="/assets/edit-v2.svg" alt="" width={24} height={24} className={iconClassName} />
    ),
  },
  {
    value: "remix",
    label: "Remix",
    icon: (
      <Image src="/assets/refresh.svg" alt="" width={24} height={24} className={iconClassName} />
    ),
  },
  {
    value: "animate",
    label: "Animate",
    icon: <PlayVideoIcon className={iconClassName} />,
  },
];

export const videoQuickActions: QuickActionItem[] = [
  {
    value: "add-sound",
    label: "Add sound",
    icon: (
      <Image src="/assets/microphone.svg" alt="" width={24} height={24} className={iconClassName} />
    ),
  },
  {
    value: "extend",
    label: "Extend",
    icon: (
      <Image
        src="/assets/video-horizontal.svg"
        alt=""
        width={24}
        height={24}
        className={iconClassName}
      />
    ),
  },
  {
    value: "loop",
    label: "Loop",
    icon: <Image src="/assets/loop.svg" alt="" width={24} height={24} className={iconClassName} />,
  },
];

export const createAiQuickAction: QuickActionItem = {
  value: "create-ai",
  label: "Create AI",
  icon: <UserAIIcon className={iconClassName} />,
};

export function getQuickActionItems(
  content: QuickActionsContentType,
  modelStatus: QuickActionsModelStatus,
): QuickActionItem[] {
  const baseItems = content === "image" ? imageQuickActions : videoQuickActions;

  if (modelStatus === "no-ai-model") {
    return [...baseItems, createAiQuickAction];
  }

  return baseItems;
}
