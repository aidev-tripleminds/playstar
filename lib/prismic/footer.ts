import {
  asLink,
  type Content,
  NotFoundError,
  PrismicError,
  RepositoryNotFoundError,
} from "@prismicio/client";
import { getPreviewRef } from "@prismicio/next";

import {
  FOOTER_DEFAULT_LINK_GROUPS,
  type FooterLink,
  type FooterLinkGroup,
  type FooterSocialPlatform,
} from "@/components/common/Prismic/footer/footer.constants";

import { createClient } from "./client";

export const FOOTER_TYPE = "footer";

const FOOTER_REVALIDATE_SECONDS = 60;

const FOOTER_SOCIAL_LABELS: Record<FooterSocialPlatform, string> = {
  reddit: "Reddit",
  x: "X.com",
  discord: "Discord",
  instagram: "Instagram",
  tiktok: "TikTok",
  redgifs: "Redgifs",
};

/**
 * Maps the authored social-links group onto footer links.
 *
 * Every field except the link itself is OPTIONAL, and each one only fills a gap
 * the others leave:
 *
 * - `platform` picks one of the six built-in glyphs AND supplies the label, so
 *   overriding a social we already draw is one field plus a URL — no icon file
 *   to find, no label to retype.
 * - `label` names a network `platform` has never heard of, or renames one it has.
 * - `icon_url` draws a network we ship no glyph for; leaving it empty falls back
 *   to the built-in glyph for the selected `platform` (BACK-160).
 *
 * What a row genuinely cannot do without is somewhere to go and something to
 * call it — a row missing either is dropped rather than rendered as an
 * unlabelled or dead link.
 */
export function footerLinkGroups(document: Content.FooterDocument): FooterLinkGroup[] {
  const links = document.data.social_links.flatMap<FooterLink>((item, index) => {
    const platform = item.platform;
    const href = asLink(item.link);
    const label = item.label || (platform ? FOOTER_SOCIAL_LABELS[platform] : "");
    const iconUrl = item.icon_url?.trim();

    if (!href || !label) return [];

    return [
      {
        id: platform ? `${platform}-${index}` : `social-${index}`,
        label,
        href,
        ...(platform ? { icon: platform } : {}),
        ...(iconUrl ? { iconUrl } : {}),
      },
    ];
  });

  return links.length > 0 ? [{ id: "socials", title: "Socials", links }] : [];
}

/**
 * Reads the one global footer document. A published document with an empty
 * social-links group intentionally removes the social column; a missing or
 * temporarily unavailable document preserves the current built-in links.
 */
export async function getFooterLinkGroups(): Promise<FooterLinkGroup[]> {
  const client = createClient();

  try {
    const ref = await getPreviewRef();
    const document = await client.getSingle<Content.FooterDocument>(FOOTER_TYPE, {
      ref,
      fetchOptions: ref
        ? { cache: "no-store" }
        : { next: { revalidate: FOOTER_REVALIDATE_SECONDS } },
    });

    return footerLinkGroups(document);
  } catch (error) {
    const isMissingDocument =
      error instanceof NotFoundError && !(error instanceof RepositoryNotFoundError);
    const isCmsFailure =
      (error instanceof PrismicError && !(error instanceof RepositoryNotFoundError)) ||
      error instanceof TypeError;

    if (!isMissingDocument && !isCmsFailure) throw error;

    return FOOTER_DEFAULT_LINK_GROUPS;
  }
}
