import { cva } from "class-variance-authority";

export const aiModelVariants = cva(
  "group relative inline-flex shrink-0 mx-auto px-0! cursor-pointer  transition-transform duration-250  focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
  {
    variants: {
      size: {
        default: "rounded-[12px] md:rounded-[24px]",
        tiny: "rounded-[12px]",
        mobile: "rounded-[12px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const aiModelCardVariants = cva(
  "border-dialog-bg relative isolate flex flex-col overflow-hidden",
  {
    variants: {
      size: {
        default:
          "w-full aspect-[24/35] min-h-[242px] rounded-[12px] md:aspect-auto md:min-h-[330px] md:rounded-[24px]",
        tiny: "w-full w-[175px] h-[242px] min-w-[175px] min-h-[175px] rounded-[12px]",
        mobile: "w-[175px] h-[242px] min-w-[175px] min-h-[175px] rounded-[12px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const aiModelOverlayVariants = cva(
  "absolute inset-x-0 bottom-0 top-auto [background:var(--gradient-character-black)]",
  {
    variants: {
      size: {
        default: "",
        tiny: "",
        mobile: "",
      },
      variant: {
        characters: "",
        images: "",
        videos: "",
        templates: "",
      },
    },
    compoundVariants: [
      {
        variant: "characters",
        size: ["default", "tiny", "mobile"],
        class:
          " after:pointer-events-none after:absolute after:inset-0 after:bg-[image:var(--gradient-ai-model)] after:opacity-0 after:transition-opacity after:duration-300 after:ease-out after:content-[''] group-hover:after:opacity-100",
      },
      { variant: "characters", size: "default", class: "h-[156px]" },
      { variant: "characters", size: "tiny", class: "h-[121px]" },
      { variant: "characters", size: "mobile", class: "h-[121px]" },
      { variant: "images", size: "default", class: "h-[156px]" },
      { variant: "images", size: "tiny", class: "h-[72px]" },
      { variant: "images", size: "mobile", class: "h-[72px]" },
      { variant: "videos", size: "default", class: "h-[156px]" },
      { variant: "videos", size: "tiny", class: "h-[72px]" },
      { variant: "videos", size: "mobile", class: "h-[72px]" },
      { variant: "templates", size: "default", class: "h-[100px]" },
      { variant: "templates", size: "tiny", class: "h-[80px]" },
      { variant: "templates", size: "mobile", class: "h-[80px]" },
    ],
    defaultVariants: {
      size: "default",
      variant: "characters",
    },
  },
);

export const aiModelLiveBadgeDotVariants = cva("", {
  variants: {
    size: {
      default: "",
      tiny: "size-1.5",
      mobile: "size-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const aiModelLiveBadgeVariants = cva("absolute z-20 font-normal", {
  variants: {
    size: {
      default: "top-2 right-2 md:top-3 md:right-3",
      tiny: "top-1.5 right-1.5 gap-1 px-2 py-1.5 text-[14px]! leading-[14px]!",
      mobile: "top-1.5 right-1.5 gap-1 px-2 py-1.5 text-[14px]! leading-[14px]!",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const aiModelInsetVariants = cva(
  "absolute z-20 overflow-hidden border-white shadow-[0_0_5px_0_rgba(0,0,0,0.25)]",
  {
    variants: {
      size: {
        default: "top-2 left-3 h-[80px] w-[66px] border-2 rounded-[8px] rotate-[5deg]",
        tiny: "top-2 left-2 h-[53px] w-[44px] border rounded-[6px] rotate-[5deg]",
        mobile: "top-2 left-2 h-[53px] w-[44px] border rounded-[6px] rotate-[5deg]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const aiModelContentVariants = cva("relative z-10 mt-auto flex flex-col", {
  variants: {
    size: {
      default: "gap-1 p-4 md:gap-1.5 md:p-4  ",
      tiny: "gap-1 p-2.5",
      mobile: "gap-1 p-2.5",
    },
    align: {
      start: "",
      center: "items-center text-center",
    },
  },
  defaultVariants: {
    size: "default",
    align: "start",
  },
});

export const aiModelTemplatesContentVariants = cva("", {
  variants: {
    size: {
      default: "gap-1.5 p-4",
      tiny: "gap-2 px-2 py-3",
      mobile: "gap-2 px-2 py-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const aiModelTemplatesStackVariants = cva("flex w-full flex-col items-center", {
  variants: {
    size: {
      default: "gap-1.5",
      tiny: "gap-2",
      mobile: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const aiModelTemplatesHoverVariants = cva(
  "absolute inset-x-0 bottom-0 flex flex-col items-center",
  {
    variants: {
      size: {
        default: "gap-1.5 p-4",
        tiny: "gap-2 px-2 py-3",
        mobile: "gap-2 px-2 py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const aiModelVerifiedIconVariants = cva("relative inline-block shrink-0", {
  variants: {
    size: {
      default: "size-4 md:size-6",
      tiny: "size-4",
      mobile: "size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const aiModelHoverFadeOutVariants = cva("transition-all duration-300 ease-out", {
  variants: {
    enabled: {
      true: "translate-y-0 opacity-100 group-hover:pointer-events-none group-hover:-translate-y-2 group-hover:opacity-0",
      false: "",
    },
  },
  defaultVariants: {
    enabled: false,
  },
});

export const aiModelHoverFadeInVariants = cva("transition-all duration-300 ease-out", {
  variants: {
    enabled: {
      true: "pointer-events-none translate-y-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
      false: "",
    },
  },
  defaultVariants: {
    enabled: false,
  },
});

export const aiModelNameVariants = cva("text-tooltip-text truncate font-semibold", {
  variants: {
    size: {
      default: "text-sm leading-5 md:text-[18px] md:leading-6",
      tiny: "text-xs md:text-[12px] leading-4",
      mobile: "text-[14px] leading-4",
    },
    align: {
      start: "",
      center: "w-full text-center",
    },
    hideOnHover: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      hideOnHover: true,
      class: aiModelHoverFadeOutVariants({ enabled: true }),
    },
  ],
  defaultVariants: {
    size: "default",
    align: "start",
    hideOnHover: false,
  },
});

export const aiModelActionHoverLiftVariants = cva(
  "inline-flex transition-all duration-300 ease-out",
  {
    variants: {
      enabled: {
        true: "pointer-events-none translate-y-3 opacity-0 group-hover:pointer-events-auto group-hover:-translate-y-3 group-hover:opacity-100 md:group-hover:-translate-y-4",
        false: "",
      },
    },
    defaultVariants: {
      enabled: true,
    },
  },
);

export const aiModelHoverActionStackVariants = cva(
  "relative flex w-full items-center justify-center [&_[data-slot=ai-model-action-button]]:absolute [&_[data-slot=ai-model-action-button]]:left-1/2 [&_[data-slot=ai-model-action-button]]:-translate-x-1/2",
);

export const aiModelShowOnHoverVariants = cva("inline-flex", {
  variants: {
    enabled: {
      true: aiModelHoverFadeInVariants({ enabled: true }),
      false: "",
    },
  },
  defaultVariants: {
    enabled: true,
  },
});

export const aiModelDescriptionVariants = cva(
  "text-tooltip-text line-clamp-2 text-left font-medium opacity-90",
  {
    variants: {
      size: {
        default: "text-[11px] leading-4 md:text-[14px] md:leading-5",
        tiny: "text-[12px] leading-4 line-clamp-1!",
        mobile: "text-[12px] leading-4 line-clamp-1!",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);
