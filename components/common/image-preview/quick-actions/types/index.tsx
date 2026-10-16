import type { StaticImageData } from "next/image";
import type * as React from "react";

export type QuickActionsContentType = "image" | "video";
export type QuickActionsModelStatus = "ai-model" | "no-ai-model";

export type QuickActionItem = {
  value: string;
  label: string;
  icon?: string | StaticImageData | React.ReactNode;
  disabled?: boolean;
};

export type QuickActionsProps = Omit<React.ComponentProps<"div">, "onClick"> & {
  content?: QuickActionsContentType;
  modelStatus?: QuickActionsModelStatus;
  items?: QuickActionItem[];
  onActionClick?: (value: string) => void;
};
