/** Figma Testimonials section (node 2843-39809). */
export const TESTIMONIALS_MAX_WIDTH_PX = 1148;
export const TESTIMONIALS_PADDING_X_PX = 16;
export const TESTIMONIALS_PADDING_Y_PX = 48;
export const TESTIMONIAL_MAX_RATING = 5;
export const TESTIMONIAL_STAR_SIZE_PX = 15;

export const TESTIMONIALS_DEFAULT_HEADING = "Join over 2,000,000\nHappy users";

export const TESTIMONIALS_DEFAULT_CTA_LABEL = "Click me";
export const TESTIMONIALS_MOBILE_CTA_LABEL = "Start Creating";
export const TESTIMONIALS_CTA_ICON_SRC = "/assets/testimonialgold-star.svg";
export const TESTIMONIALS_CTA_ICON_SIZE_PX = 12.83;

export const TESTIMONIALS_DEFAULT_TRUST_BADGES = [
  {
    id: "shield",
    label: "100% Antivirus Secured",
    mobileLines: ["100% Antivirus", "Secured"],
  },
  {
    id: "incognito",
    label: "Privacy in bank statement",
    mobileLines: ["Privacy in", "bank statement"],
  },
] as const;

export const TESTIMONIAL_DEFAULT_QUOTE =
  "Spicestars has one of the most powerful AI porn image generators known to mankind. Spicestars lets you tweak everything from simple tags to advanced features like face references, custom poses, and style uploads. Whether you want quick results or full creative control, this app has you covered.";

export const TESTIMONIAL_DEFAULT_AUTHOR_NAME = "Herman Carter";
export const TESTIMONIAL_DEFAULT_AUTHOR_SOURCE = "aipornratings.com";
export const TESTIMONIAL_DEFAULT_RATING = 5;
export const TESTIMONIAL_STAR_BG_COLOR = "#00B67A";

export const TESTIMONIALS_SECTION_CLASS = "mx-auto flex w-full flex-col items-center gap-6";

export const TESTIMONIALS_HEADING_CLASS =
  "text-tooltip-text w-[315px] text-center text-[20px] leading-[24px] font-semibold md:text-[24px] md:leading-7";

export const TESTIMONIALS_GRID_CLASS =
  "grid w-full grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-3 md:gap-10";

export const TESTIMONIAL_CARD_CLASS = "flex w-full flex-col items-center gap-4 text-center";

export const TESTIMONIAL_QUOTE_CLASS =
  "text-select-muted-text text-sm font-medium leading-5 md:text-sm md:leading-5";

export const TESTIMONIAL_AUTHOR_NAME_CLASS = "text-tooltip-text text-base leading-6 font-semibold";

export const TESTIMONIAL_AUTHOR_SOURCE_CLASS =
  "text-select-muted-text font-semibold text-[12px] leading-[18px]";

export const TESTIMONIAL_RATING_CLASS = "flex items-center justify-center gap-1";

export const TESTIMONIALS_TRUST_ITEM_WIDTH_MOBILE_PX = 118;
export const TESTIMONIALS_TRUST_ITEM_WIDTH_DESKTOP_PX = 250;

export const TESTIMONIALS_TRUST_ROW_CLASS =
  "flex w-full items-start justify-center gap-8 md:gap-10";

export const TESTIMONIALS_TRUST_ITEM_CLASS =
  "text-select-muted-text flex shrink-0 flex-col items-center gap-2 text-center text-sm leading-5";

export const TESTIMONIALS_TRUST_LABEL_CLASS = "text-modal-text text-sm leading-5 font-medium";

export type TestimonialItem = {
  id: string;
  quote: string;
  authorName: string;
  authorSource: string;
  rating?: number;
};

export type TestimonialTrustBadge = {
  id: "shield" | "incognito";
  label: string;
  mobileLines: readonly [string, string];
};

export const TESTIMONIAL_DEFAULT_ITEMS: TestimonialItem[] = [
  {
    id: "herman-aipornratings",
    quote: TESTIMONIAL_DEFAULT_QUOTE,
    authorName: TESTIMONIAL_DEFAULT_AUTHOR_NAME,
    authorSource: TESTIMONIAL_DEFAULT_AUTHOR_SOURCE,
    rating: TESTIMONIAL_DEFAULT_RATING,
  },
  {
    id: "herman-theporndude",
    quote:
      "No shit, these guys have one of the best AI porn generators I've seen on a chat site. They use a hybrid interface with both prompts and menus for maximum versatility, and in case you haven't seen those previews yet, the machine is well trained to bake up actual porn.",
    authorName: "Herman Carter",
    authorSource: "theporndude.com",
    rating: 5,
  },
  {
    id: "rumba-discord",
    quote:
      "I've been using SL to create content for my AI influencer, and it's been a game-changer. The high-quality visuals—especially the nudes—drive serious engagement and income. If you're looking to monetize AI-generated content, SL is absolutely worth it. I'm making solid money thanks to this platform.",
    authorName: "Rumba, Discord",
    authorSource: "@ava_starz",
    rating: 5,
  },
];

/**
 * Anchor styling for a CMS-authored testimonials CTA (`ctaHref`), matching the
 * `Buttons` atom's rose/btn-m look without reusing that component — it renders
 * a `<button>`, and an editor-chosen destination has to navigate. Mirrors
 * `FEATURE_BLOCK_CTA_CLASS`, plus the `gap-1.5` the button variant carries for
 * the count badge that sits beside the label.
 */
export const TESTIMONIALS_CTA_LINK_CLASS =
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-[64px] bg-[image:var(--gradient-rose)] px-4 py-3 text-sm font-medium text-text-inverse transition-colors duration-300 hover:bg-[image:var(--gradient-rose-hover)]";
