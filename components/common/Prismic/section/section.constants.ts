/**
 * Chrome shared by every CMS-authored lower-stack section: a centered heading,
 * a centered body, and an optional pill CTA.
 *
 * These mirror the hand-coded homepage lower sections
 * (`components/pages/homepage/_components/homepage-lower-sections.tsx`), which
 * are the reference look. They are duplicated rather than imported because a
 * shared `components/common/*` module must not depend on one page's private
 * `_lib`; `section.test.tsx` asserts the copies stay byte-identical, so they
 * cannot silently drift.
 */

/** Mirrors HOMEPAGE_LOWER_SECTION_SHELL_CLASS, minus its heading-specific margin reset. */
export const PRISMIC_SECTION_SHELL_CLASS = "mx-auto flex w-full max-w-[1148px] flex-col gap-0 py-0";

/** Byte-identical to HOMEPAGE_LOWER_SECTION_HEADING_CLASS. */
export const PRISMIC_SECTION_HEADING_CLASS =
  "text-tooltip-text m-0 mb-4 block md:text-2xl text-[20px] leading-[1.333] font-semibold text-center!";

/** Byte-identical to HOMEPAGE_LOWER_SECTION_BODY_CENTERED_CLASS. */
export const PRISMIC_SECTION_BODY_CLASS = "flex w-full flex-col gap-4 [&>*]:m-0 items-center";

/**
 * Pill-button styling for a section CTA, matching the `Buttons` atom's
 * rose/btn-m look without reusing it: the atom renders a `<button>`, and a
 * CMS destination has to navigate. `gap-1.5` matches the atom's spacing for
 * the count badge beside the label.
 */
export const PRISMIC_SECTION_CTA_CLASS =
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-[64px] bg-[image:var(--gradient-rose)] px-4 py-3 text-sm font-medium text-text-inverse transition-colors duration-300 hover:bg-[image:var(--gradient-rose-hover)]";

/** Matches the badge the homepage CTAs carry (`+10` beside "Try for free"). */
export const PRISMIC_SECTION_CTA_BADGE_CLASS = "gap-[3px] px-0 text-[14px]! leading-[14px]!";

export type PrismicSectionCta = {
  label: string;
  /**
   * Editor-supplied override (`cta_link`). Optional: with no link the CTA is
   * the fixed "Try for free" button that opens signup (BACK-149), which is the
   * ordinary case on a CMS page.
   */
  href?: string;
  signupSource?: string;
};
