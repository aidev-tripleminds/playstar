import { cva } from "class-variance-authority";

export const topChatbarVariants = cva(
  [
    "relative flex w-full items-center justify-between border-b px-4 pt-3 pb-[11px]",
    "border-border-strong bg-dialog-bg",
  ],
  {
    variants: {
      status: {
        default: "",
        mobile: "",
        group: "",
        "group-mobile": "",
        call: "",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export const topChatbarLeadingVariants = cva("flex min-w-0 flex-1 items-center", {
  variants: {
    status: {
      default: "gap-4",
      mobile: "gap-2",
      group: "gap-4",
      "group-mobile": "gap-4",
      call: "gap-4",
    },
  },
  defaultVariants: {
    status: "default",
  },
});
