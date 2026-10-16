import { cva } from "class-variance-authority";

export const conversationStatusVariants = cva(
  [
    "group relative flex w-full items-center gap-2 rounded-xl p-2",
    "transition-colors motion-reduce:transition-none",
  ],
  {
    variants: {
      status: {
        default: "bg-transparent",
        focus: "bg-tooltip-default-bg",
        unread: "bg-transparent",
        pinned: "bg-transparent",
        group: "bg-transparent",
        radio: "bg-surface-strong p-3",
        memory: "border border-surface-strong bg-transparent p-3",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);
