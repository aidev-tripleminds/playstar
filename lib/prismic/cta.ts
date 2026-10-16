import { type FieldState, isFilled, type KeyTextField, type LinkField } from "@prismicio/client";

import { apiFetch } from "@/lib/api/client";

/** Context passed from a content_page document to each of its slices. */
export type ContentPageSliceContext = {
  signupSource?: string;
  /** ID of a leading Explore slice that owns the standalone page hero. */
  pageHeroSliceId?: string;
  /** ID of the first populated H1 slice in the full document. */
  h1SliceId?: string;
};

/** Ask the backend to remember that signup was initiated on a Prismic page. */
export async function setSignupSource(): Promise<void> {
  await apiFetch("/api/v1/auth/signup-source", {
    method: "POST",
  });
}

/**
 * The optional destination override on a CMS CTA (BACK-149).
 *
 * Every CMS CTA is the fixed "Try for free" button by default — it opens the
 * signup modal, or sends a logged-in visitor to /explore. `cta_link` exists
 * only for the occasional page that needs the button to point somewhere
 * specific instead; leaving it empty is the ordinary case, NOT a reason to
 * hide the CTA (which is what every slice did before this).
 *
 * Returns `undefined` for an empty link and for a filled link that carries no
 * resolvable URL (a document link whose route resolver produced nothing) —
 * both mean "no override", and an anchor with `href={undefined}` would render
 * a CTA that silently does nothing at all.
 */
export function ctaHrefFromLink(link: LinkField | null | undefined): string | undefined {
  if (!link || !isFilled.link(link)) return undefined;
  return "url" in link ? link.url : undefined;
}

/** The label every CMS CTA falls back to (BACK-149). */
export const DEFAULT_CTA_LABEL = "Try for free";

/**
 * The label of a CMS CTA, defaulting to "Try for free".
 *
 * `cta_label` is an override, not a switch: like `cta_link`, leaving it empty
 * means "use the standard button", never "remove the button". A section CTA
 * that vanished because nobody typed a label was the most likely way to lose
 * the primary conversion action on a published page.
 */
export function ctaLabelFromField(field: KeyTextField | null | undefined): string {
  if (!isFilled.keyText(field)) return DEFAULT_CTA_LABEL;
  return field.trim() || DEFAULT_CTA_LABEL;
}

/**
 * One entry of a slice's "Custom CTA" group — the shape every CTA-bearing
 * slice's group generates, so the reader below is written once.
 */
export type CustomCtaItem = {
  cta_label: KeyTextField;
  cta_link: LinkField<string, string, unknown, FieldState, never>;
};

/** A CTA as every CMS block takes it: a resolved label plus optional overrides. */
export type CmsCta = {
  label: string;
  /** Editor override (`cta_link`); absent means the fixed signup CTA. */
  href?: string;
  signupSource?: string;
};

/**
 * The CTA for a slice, with the editor's optional overrides applied.
 *
 * Both override fields live in a GROUP rather than loose on the slice, because
 * leaving them alone is the ordinary case: an empty group is one "Add item"
 * button in the Page Builder instead of a Label and a Link that every editor
 * reads past on every section. Adding the item unfolds them.
 *
 * Prismic has no single-item group, so the model cannot stop a second entry —
 * only the first is read, since these sections have one CTA.
 */
export function ctaFromCustomGroup(
  group: readonly CustomCtaItem[] | null | undefined,
  signupSource?: string,
): CmsCta {
  const [override] = group ?? [];

  return {
    label: ctaLabelFromField(override?.cta_label),
    href: ctaHrefFromLink(override?.cta_link),
    signupSource,
  };
}

/**
 * Whether the editor asked for a CTA at all.
 *
 * Only for the blocks whose CTA is opt-in because it repeats — a feature box,
 * not a section. Everywhere else the CTA always renders and the group only
 * customises it.
 */
export function hasCustomCta(group: readonly CustomCtaItem[] | null | undefined): boolean {
  return (group?.length ?? 0) > 0;
}
