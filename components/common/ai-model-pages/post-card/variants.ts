import { cva } from "class-variance-authority";

export const postCardVariants = cva(
  [
    "flex w-full flex-col",
    "rounded-[24px] border border-surface-strong bg-dialog-bg",
    "font-[Onest] text-tooltip-text",
    "gap-4 p-4",
    "md:p-6",
    "isolation-isolate",
  ].join(" "),
);

export const mediaVariants = cva(
  ["relative w-full overflow-hidden", "rounded-[16px] md:rounded-[24px]", "isolation-isolate"].join(
    " ",
  ),
  {
    variants: {
      ratio: {
        default: "h-[273px] md:h-[550px]",
        horizontal: "h-[189px] md:h-[380px]",
        vertical: "h-[358px] w-[248px] md:w-[380px] md:h-[550px]",
      },
    },
    defaultVariants: {
      ratio: "default",
    },
  },
);
