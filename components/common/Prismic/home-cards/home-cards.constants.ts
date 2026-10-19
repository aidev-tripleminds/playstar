import { dummyImage } from "@/lib/dummy-images";
/** Figma Home Cards (node 11751-116464). */
export const HOME_CARD_DESKTOP_WIDTH_PX = 277;
export const HOME_CARD_DESKTOP_HEIGHT_PX = 410;
export const HOME_CARD_UNBLUR_DESKTOP_WIDTH_PX = 220;
export const HOME_CARD_UNBLUR_DESKTOP_HEIGHT_PX = 330;
export const HOME_CARD_UNBLUR_CREATE_DESKTOP_WIDTH_PX = 278;
export const HOME_CARD_UNBLUR_CREATE_DESKTOP_HEIGHT_PX = 417;
export const HOME_CARD_UNBLUR_CREATE_MEDIUM_WIDTH_PX = 220;
export const HOME_CARD_UNBLUR_CREATE_MEDIUM_HEIGHT_PX = 330;
export const HOME_CARD_UNBLUR_CREATE_TINY_WIDTH_PX = 175;
export const HOME_CARD_UNBLUR_CREATE_TINY_HEIGHT_PX = 255;
export const HOME_CARD_MOBILE_WIDTH_PX = 175;
export const HOME_CARD_MOBILE_HEIGHT_PX = 255;

export const HOME_CARD_DEFAULT_IMAGE_SRC = dummyImage(168);
/** Figma home-cards Create fill (node 4152:31684). */
export const HOME_CARD_UNBLUR_CREATE_IMAGE_SRC = "/assets/home-cards/unblur-create-bg.png";
export const HOME_CARD_CROWN_ICON_SRC = "/assets/crown-filled.svg";
export const HOME_CARD_UNBLUR_ICON_SRC = "/assets/eye-slash.svg";

export const HOME_CARD_BORDER_RADIUS_PX = 24;
export const HOME_CARD_COMPACT_BORDER_RADIUS_PX = 16;

export const HOME_CARD_ROOT_RADIUS_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "rounded-[24px]",
  create: "rounded-[24px]",
  tiny: "rounded-[16px]",
  mobile: "rounded-[16px]",
};

export const HOME_CARD_SIGNUP_BADGE_TEXT_SIZE_PX = 14;
export const HOME_CARD_SIGNUP_BADGE_CLASS =
  "gap-[3px] px-0 text-[14px]! leading-[14px]! font-semibold";

export const HOME_CARD_MOBILE_CTA_TEXT_CLASS = "font-semibold!";

export const HOME_CARD_DEFAULT_COUNTDOWN = [
  { value: 28, label: "MIN" },
  { value: 36, label: "SEC" },
  { value: 54, label: "MS" },
] as const;

export const HOME_CARD_COUNTDOWN_TICK_INTERVAL_MS = 80;

export const HOME_CARD_COUNTDOWN_INITIAL_MS =
  (HOME_CARD_DEFAULT_COUNTDOWN[0].value * 60 + HOME_CARD_DEFAULT_COUNTDOWN[1].value) * 1000 +
  HOME_CARD_DEFAULT_COUNTDOWN[2].value * 10;

export type HomeCardVariant =
  | "buy-premium"
  | "unblur--verify-age"
  | "unblur--premium"
  | "unblur--sign-up"
  | "unblur--create";

export type HomeCardSize = "desktop" | "mobile" | "create" | "tiny";

export const HOME_CARD_STANDARD_SIZES = [
  "desktop",
  "mobile",
] as const satisfies readonly HomeCardSize[];

export const HOME_CARD_CREATE_SIZES = [
  "desktop",
  "create",
  "tiny",
] as const satisfies readonly HomeCardSize[];
export type HomeCardCreateSize = (typeof HOME_CARD_CREATE_SIZES)[number];

export const HOME_CARD_UNBLUR_CREATE_SIZE_OPTIONS = [
  ...HOME_CARD_CREATE_SIZES,
  "mobile",
] as const satisfies readonly HomeCardSize[];

export function resolveHomeCardSizeOptions(variant: HomeCardVariant): readonly HomeCardSize[] {
  return variant === "unblur--create"
    ? HOME_CARD_UNBLUR_CREATE_SIZE_OPTIONS
    : HOME_CARD_STANDARD_SIZES;
}

export function isHomeCardSizeValidForVariant(
  variant: HomeCardVariant,
  size: HomeCardSize,
): boolean {
  return resolveHomeCardSizeOptions(variant).includes(size);
}

export type HomeCardCountdownUnit = {
  value: number;
  label: string;
};

export type HomeCardVariantConfig = {
  layout: "center" | "bottom";
  background: "premium-gradient" | "image" | "image-blur";
  showCountdown: boolean;
  showCrown: boolean;
  offerText?: string;
  unblurLabel?: string;
  title?: string;
  ctaLabel: string;
  buttonVariant: "rose" | "premium-full";
  buttonSize: "btn-s" | "btn-m";
  showUnblurIcon: boolean;
  showSignupBadge: boolean;
  showMagicPen: boolean;
};

export const HOME_CARD_VARIANT_CONFIG: Record<HomeCardVariant, HomeCardVariantConfig> = {
  "buy-premium": {
    layout: "center",
    background: "premium-gradient",
    showCountdown: true,
    showCrown: true,
    offerText: "75% OFF",
    ctaLabel: "Subscribe now",
    buttonVariant: "premium-full",
    buttonSize: "btn-m",
    showUnblurIcon: false,
    showSignupBadge: false,
    showMagicPen: false,
  },
  "unblur--verify-age": {
    layout: "center",
    background: "image-blur",
    showCountdown: false,
    showCrown: false,
    unblurLabel: "Unblur",
    ctaLabel: "Verify Age",
    buttonVariant: "rose",
    buttonSize: "btn-m",
    showUnblurIcon: true,
    showSignupBadge: false,
    showMagicPen: false,
  },
  "unblur--premium": {
    layout: "center",
    background: "image-blur",
    showCountdown: false,
    showCrown: false,
    unblurLabel: "Unblur",
    ctaLabel: "Subscribe now",
    buttonVariant: "premium-full",
    buttonSize: "btn-m",
    showUnblurIcon: true,
    showSignupBadge: false,
    showMagicPen: false,
  },
  "unblur--sign-up": {
    layout: "center",
    background: "image-blur",
    showCountdown: false,
    showCrown: false,
    unblurLabel: "Unblur",
    ctaLabel: "Signup",
    buttonVariant: "rose",
    buttonSize: "btn-m",
    showUnblurIcon: true,
    showSignupBadge: true,
    showMagicPen: false,
  },
  "unblur--create": {
    layout: "bottom",
    background: "image",
    showCountdown: false,
    showCrown: false,
    ctaLabel: "Create my AI",
    buttonVariant: "rose",
    buttonSize: "btn-m",
    showUnblurIcon: false,
    showSignupBadge: false,
    showMagicPen: true,
  },
};

export const HOME_CARD_SIZE_CLASS: Record<HomeCardSize, string> = {
  desktop: "h-[410px] w-[277px]",
  create: "h-[410px] w-[277px]",
  tiny: "h-[255px] w-[175px]",
  mobile: "h-[255px] w-[175px]",
};

export const HOME_CARD_UNBLUR_SIZE_CLASS: Record<HomeCardSize, string> = {
  desktop: "h-[330px] w-[220px]",
  create: "h-[330px] w-[220px]",
  tiny: "h-[255px] w-[175px]",
  mobile: "h-[255px] w-[175px]",
};

export const HOME_CARD_UNBLUR_CREATE_SIZE_CLASS: Record<HomeCardSize, string> = {
  desktop: "h-[417px] w-[278px]",
  create: "h-[330px] w-[220px]",
  tiny: "h-[255px] w-[175px]",
  mobile: "h-[255px] w-[175px]",
};

export function resolveUnblurCreateSize(size: HomeCardSize): HomeCardCreateSize {
  if (size === "desktop") return "desktop";
  if (size === "create") return "create";
  return "tiny";
}

export function resolveHomeCardLayoutSize(
  variant: HomeCardVariant,
  size: HomeCardSize,
): HomeCardSize {
  if (variant === "unblur--create") {
    return size;
  }

  if (size === "create" || size === "tiny") {
    return size === "tiny" ? "mobile" : "desktop";
  }

  return size;
}

export function isUnblurHomeCardVariant(variant: HomeCardVariant): boolean {
  return variant.startsWith("unblur--");
}

export function resolveHomeCardSizeClass(variant: HomeCardVariant, size: HomeCardSize): string {
  if (variant === "unblur--create") {
    return HOME_CARD_UNBLUR_CREATE_SIZE_CLASS[size];
  }

  const layoutSize = resolveHomeCardLayoutSize(variant, size);

  if (isUnblurHomeCardVariant(variant)) {
    return HOME_CARD_UNBLUR_SIZE_CLASS[layoutSize];
  }

  return HOME_CARD_SIZE_CLASS[layoutSize];
}

export const HOME_CARD_ROOT_CLASS =
  "relative isolate overflow-hidden border-4 border-[var(--Button-Pink-Primary-Gradient,#F6339A)]";

export const HOME_CARD_UNBLUR_ROOT_CLASS = "relative isolate overflow-hidden";

export function resolveHomeCardRootRadiusSize(
  variant: HomeCardVariant,
  size: HomeCardSize,
): HomeCardSize {
  return variant === "unblur--create" ? size : resolveHomeCardLayoutSize(variant, size);
}

export function resolveHomeCardRootClass(variant: HomeCardVariant, size: HomeCardSize): string {
  const radiusClass =
    HOME_CARD_ROOT_RADIUS_CLASS_BY_SIZE[resolveHomeCardRootRadiusSize(variant, size)];

  return isUnblurHomeCardVariant(variant)
    ? `${HOME_CARD_UNBLUR_ROOT_CLASS} ${radiusClass}`
    : `${HOME_CARD_ROOT_CLASS} ${radiusClass}`;
}

export const HOME_CARD_CONTENT_CENTER_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop:
    "relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6 py-6 text-center",
  create:
    "relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6 py-6 text-center",
  tiny: "relative z-10 flex h-full flex-col items-center justify-center gap-5 px-5 py-5 text-center",
  mobile:
    "relative z-10 flex h-full flex-col items-center justify-center gap-5 px-5 py-5 text-center",
};

export const HOME_CARD_CONTENT_BOTTOM_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "relative z-10 flex h-full flex-col items-stretch justify-end gap-3 px-4 pb-4 text-left",
  create: "relative z-10 flex h-full flex-col items-stretch justify-end gap-3 px-4 pb-4 text-left",
  tiny: "relative z-10 flex h-full flex-col items-stretch justify-end gap-2 px-3 pb-3 text-left",
  mobile: "relative z-10 flex h-full flex-col items-stretch justify-end gap-2 px-3 pb-3 text-left",
};

export const HOME_CARD_UNBLUR_CREATE_TINY_CONTENT_PADDING_PX = 8;
export const HOME_CARD_UNBLUR_CREATE_MEDIUM_CONTENT_PADDING_PX = 20;
export const HOME_CARD_UNBLUR_CREATE_MEDIUM_CONTENT_PADDING_CLASS = "p-5";
export const HOME_CARD_UNBLUR_CREATE_TINY_CONTENT_PADDING_CLASS = "p-2";

export const HOME_CARD_CONTENT_CREATE_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "relative z-10 flex h-full flex-col items-center justify-end gap-4 p-6 text-center",
  create: "relative z-10 flex h-full flex-col items-center justify-end gap-3 p-5 text-center",
  tiny: "relative z-10 flex h-full flex-col items-center justify-end gap-2 p-2 text-center",
  mobile: "relative z-10 flex h-full flex-col items-center justify-end gap-3 p-5 text-center",
};

export function resolveHomeCardBackgroundImageWidth(
  variant: HomeCardVariant,
  size: HomeCardSize,
): number {
  if (variant === "unblur--create") {
    const createSize = resolveUnblurCreateSize(size);

    if (createSize === "desktop") return HOME_CARD_UNBLUR_CREATE_DESKTOP_WIDTH_PX;
    if (createSize === "create") return HOME_CARD_UNBLUR_CREATE_MEDIUM_WIDTH_PX;

    return HOME_CARD_UNBLUR_CREATE_TINY_WIDTH_PX;
  }

  if (variant.startsWith("unblur--")) {
    return HOME_CARD_UNBLUR_DESKTOP_WIDTH_PX;
  }

  return HOME_CARD_DESKTOP_WIDTH_PX;
}

export function resolveHomeCardContentClass(variant: HomeCardVariant, size: HomeCardSize): string {
  if (variant === "unblur--create") {
    return HOME_CARD_CONTENT_CREATE_CLASS_BY_SIZE[size];
  }

  return HOME_CARD_CONTENT_CENTER_CLASS_BY_SIZE[resolveHomeCardLayoutSize(variant, size)];
}

export const HOME_CARD_COUNTDOWN_ROW_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "flex items-center justify-center gap-1.5",
  create: "flex items-center justify-center gap-1.5",
  tiny: "flex items-center justify-center gap-1.5",
  mobile: "flex items-center justify-center gap-1.5",
};

export const HOME_CARD_COUNTDOWN_UNIT_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop:
    "bg-[image:var(--gradient-pink-counter)] gap-1 shadow-[0_2px_10px_0_rgba(253,31,80,0.4)] flex min-w-[51px] min-h-[62px] flex-col items-center justify-center rounded-[16px] px-2 border border-[var(--Colors-Pink-600,#E60076)] py-2 text-text-inverse",
  create:
    "bg-[image:var(--gradient-pink-counter)] gap-1 shadow-[0_2px_10px_0_rgba(253,31,80,0.4)] flex min-w-[51px] min-h-[62px] flex-col items-center justify-center rounded-[16px] px-2 border border-[var(--Colors-Pink-600,#E60076)] py-2 text-text-inverse",
  tiny: "bg-[image:var(--gradient-pink-counter)] flex min-w-[40px] min-h-[50px] flex-col items-center justify-center gap-0.5 rounded-[10px] border border-[var(--Colors-Pink-600,#E60076)] px-1 py-1 text-text-inverse shadow-[0_1px_6px_0_rgba(253,31,80,0.4)]",
  mobile:
    "bg-[image:var(--gradient-pink-counter)] flex min-w-[40px] min-h-[50px] flex-col items-center justify-center gap-0.5 rounded-[10px] border border-[var(--Colors-Pink-600,#E60076)] px-1 py-1 text-text-inverse shadow-[0_1px_6px_0_rgba(253,31,80,0.4)]",
};

export const HOME_CARD_COUNTDOWN_VALUE_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "text-[26px] leading-6 font-semibold",
  create: "text-[26px] leading-6 font-semibold",
  tiny: "text-[20px] leading-5 font-semibold",
  mobile: "text-[20px] leading-5 font-semibold",
};

export const HOME_CARD_COUNTDOWN_LABEL_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "text-[14px] leading-[14px] font-normal uppercase",
  create: "text-[14px] leading-[14px] font-normal uppercase",
  tiny: "text-[12px] leading-[12px] font-normal uppercase",
  mobile: "text-[12px] leading-[12px] font-normal uppercase",
};

export const HOME_CARD_CROWN_SIZE_PX: Record<HomeCardSize, number> = {
  desktop: 60,
  create: 60,
  tiny: 40,
  mobile: 40,
};

export const HOME_CARD_OFFER_SIZE_BY_CARD_SIZE: Record<
  HomeCardSize,
  { width: number; height: number }
> = {
  desktop: { width: 180, height: 40 },
  create: { width: 180, height: 40 },
  tiny: { width: 114, height: 25 },
  mobile: { width: 114, height: 25 },
};

/** 12px between crown icon and 75% OFF offer art on buy-premium. */
export const HOME_CARD_PREMIUM_CROWN_OFFER_GAP_PX = 12;
export const HOME_CARD_PREMIUM_OFFER_STACK_CLASS = "flex flex-col items-center gap-3";

export const HOME_CARD_UNBLUR_ICON_SIZE_PX: Record<HomeCardSize, number> = {
  desktop: 32,
  create: 32,
  tiny: 24,
  mobile: 24,
};

export const HOME_CARD_UNBLUR_LABEL_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "text-tooltip-text text-[22px] leading-[22px] font-semibold",
  create: "text-tooltip-text text-[22px] leading-[22px] font-semibold",
  tiny: "text-tooltip-text text-base leading-5 font-semibold",
  mobile: "text-tooltip-text text-base leading-5 font-semibold",
};

/** 6px between eye-slash icon and Unblur label. */
export const HOME_CARD_UNBLUR_HEADER_CLASS = "flex flex-col items-center gap-1.5";

/** 20px between Unblur label group and CTA. */
export const HOME_CARD_UNBLUR_STACK_CLASS = "flex flex-col items-center gap-5";

export const HOME_CARD_CREATE_TITLE_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "text-tooltip-text text-center text-[24px] leading-[32px] font-semibold",
  create: "text-tooltip-text text-center text-[20px] leading-[28px] font-semibold",
  tiny: "text-tooltip-text text-center text-[16px] leading-[22px] font-semibold",
  mobile: "text-tooltip-text text-center text-[16px] leading-[22px] font-semibold",
};

export const HOME_CARD_UNBLUR_CREATE_TINY_STACK_GAP_PX = 8;

export const HOME_CARD_CREATE_STACK_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "flex flex-col items-center gap-5",
  create: "flex flex-col items-center gap-4",
  tiny: "flex flex-col items-center gap-2",
  mobile: "flex flex-col items-center gap-2",
};

export const HOME_CARD_CTA_WIDTH_CLASS_BY_SIZE: Record<
  HomeCardSize,
  Record<"btn-s" | "btn-m", string>
> = {
  desktop: {
    "btn-s": "w-fit",
    "btn-m": "w-full max-w-[131px] min-h-[44px]",
  },
  create: {
    "btn-s": "w-fit",
    "btn-m": "w-full max-w-[131px] min-h-[44px]",
  },
  tiny: {
    "btn-s": "w-full min-w-[131px] min-h-[44px]",
    "btn-m": "w-full min-w-[131px] min-h-[44px]",
  },
  mobile: {
    "btn-s": "w-full min-w-[131px] min-h-[44px]",
    "btn-m": "w-full min-w-[131px] min-h-[44px]",
  },
};

export const HOME_CARD_UNBLUR_CTA_WIDTH_PX = 102;
export const HOME_CARD_UNBLUR_CTA_HEIGHT_PX = 44;
export const HOME_CARD_UNBLUR_CTA_CLASS = "h-[44px]! w-[102px]!";

export const HOME_CARD_UNBLUR_SIGNUP_CTA_WIDTH_PX = 127;
export const HOME_CARD_UNBLUR_SIGNUP_CTA_HEIGHT_PX = 44;
export const HOME_CARD_UNBLUR_SIGNUP_CTA_CLASS = "h-[44px]! w-[127px]!";

/** Create CTA uses Buttons `btn-m` (44px). Tiny is the only 32px exception. */
export const HOME_CARD_UNBLUR_CREATE_CTA_HEIGHT_PX = 44;
export const HOME_CARD_UNBLUR_CREATE_TINY_CTA_HEIGHT_PX = 32;
export const HOME_CARD_UNBLUR_CREATE_TINY_CTA_ICON_SIZE_PX = 16;
export const HOME_CARD_UNBLUR_CREATE_TINY_CTA_ICON_GAP_PX = 2;
export const HOME_CARD_UNBLUR_CREATE_TINY_CTA_ICON_CLASS = "h-[16px] w-[16px]";
export const HOME_CARD_UNBLUR_CREATE_TINY_CTA_GAP_CLASS = "gap-[2px]";

export const HOME_CARD_UNBLUR_CREATE_CTA_CLASS_BY_SIZE: Record<HomeCardSize, string> = {
  desktop: "w-fit!",
  create: "w-fit!",
  tiny: "h-8! w-fit! gap-[2px]! px-2! py-1! text-xs!",
  mobile: "w-fit!",
};

/** @deprecated Use HOME_CARD_UNBLUR_CREATE_CTA_CLASS_BY_SIZE.desktop */
export const HOME_CARD_UNBLUR_CREATE_CTA_CLASS = HOME_CARD_UNBLUR_CREATE_CTA_CLASS_BY_SIZE.desktop;

export function usesUnblurCompactCta(variant: HomeCardVariant): boolean {
  return variant === "unblur--verify-age";
}

export function resolveHomeCardCtaClass(
  variant: HomeCardVariant,
  size: HomeCardSize,
  buttonSize: "btn-s" | "btn-m",
): string {
  if (variant === "unblur--sign-up") {
    return HOME_CARD_UNBLUR_SIGNUP_CTA_CLASS;
  }

  if (variant === "unblur--create") {
    return HOME_CARD_UNBLUR_CREATE_CTA_CLASS_BY_SIZE[size];
  }

  if (usesUnblurCompactCta(variant)) {
    return HOME_CARD_UNBLUR_CTA_CLASS;
  }

  return HOME_CARD_CTA_WIDTH_CLASS_BY_SIZE[resolveHomeCardLayoutSize(variant, size)][buttonSize];
}

export function resolveHomeCardButtonSize(
  variant: HomeCardVariant,
  cardSize: HomeCardSize,
  configButtonSize: "btn-s" | "btn-m",
): "btn-s" | "btn-m" {
  if (variant === "unblur--create" && cardSize === "tiny") {
    return "btn-s";
  }

  return configButtonSize;
}

/** @deprecated Use HOME_CARD_CONTENT_CENTER_CLASS_BY_SIZE */
export const HOME_CARD_CONTENT_CENTER_CLASS = HOME_CARD_CONTENT_CENTER_CLASS_BY_SIZE.desktop;

/** @deprecated Use HOME_CARD_CONTENT_BOTTOM_CLASS_BY_SIZE */
export const HOME_CARD_CONTENT_BOTTOM_CLASS = HOME_CARD_CONTENT_BOTTOM_CLASS_BY_SIZE.desktop;

/** @deprecated Use HOME_CARD_COUNTDOWN_ROW_CLASS_BY_SIZE */
export const HOME_CARD_COUNTDOWN_ROW_CLASS = HOME_CARD_COUNTDOWN_ROW_CLASS_BY_SIZE.desktop;

/** @deprecated Use HOME_CARD_COUNTDOWN_UNIT_CLASS_BY_SIZE */
export const HOME_CARD_COUNTDOWN_UNIT_CLASS = HOME_CARD_COUNTDOWN_UNIT_CLASS_BY_SIZE.desktop;

export const HOME_CARD_OFFER_TEXT_CLASS =
  "text-[48px] leading-[56px] font-bold text-[var(--premium-accent)] md:text-[56px] md:leading-[64px]";

/** @deprecated Use HOME_CARD_UNBLUR_LABEL_CLASS_BY_SIZE */
export const HOME_CARD_UNBLUR_LABEL_CLASS = HOME_CARD_UNBLUR_LABEL_CLASS_BY_SIZE.desktop;

/** @deprecated Use HOME_CARD_CREATE_TITLE_CLASS_BY_SIZE */
export const HOME_CARD_CREATE_TITLE_CLASS = HOME_CARD_CREATE_TITLE_CLASS_BY_SIZE.desktop;
