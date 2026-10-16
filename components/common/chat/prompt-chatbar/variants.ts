import { cva } from "class-variance-authority";

export const promptChatbarShellVariants = cva(
  [
    "flex w-full flex-col gap-4 p-3",
    "shadow-[0_6px_20px_rgba(0,0,0,0.35)]",
    "max-md:rounded-t-[32px] max-md:rounded-b-none",
    "max-md:border-t max-md:border-l max-md:border-r max-md:border-b-0 max-md:border-border-focus",
    "max-md:bg-tooltip-default-bg",
    "md:rounded-[32px] md:border md:border-transparent",
  ],
  {
    variants: {
      variant: {
        default: "",
        "ai-filled": "",
        "group-chat": "",
        "request-picture": "",
        "request-video": "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
