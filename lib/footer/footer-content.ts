import {
  footerDefaultLegalLinks,
  type FooterLink,
  type FooterLinkGroup,
} from "@/components/common/Prismic/footer/footer.constants";
import { fetchLegalDocuments } from "@/lib/api/legal";
import { getFooterLinkGroups } from "@/lib/prismic/footer";

export type FooterContent = {
  legalLinks: FooterLink[];
  linkGroups: FooterLinkGroup[];
};

/**
 * Everything the site `Footer` renders, from the ONE place that assembles it.
 *
 * Shared by full Prismic pages and the `/` homepage, including its fallback.
 *
 * Both sources degrade rather than fail: a backend outage costs the legal row,
 * a CMS outage falls back to the built-in socials
 * (`getFooterLinkGroups`). Neither takes the page down with it, which matters
 * because this runs on the highest-traffic anonymous entry points.
 *
 * Server-only, and deliberately NOT re-exported from the footer component's
 * barrel: that barrel is reachable from client components, and pulling this in
 * would drag the backend and Prismic clients into their bundles.
 */
export async function getFooterContent(): Promise<FooterContent> {
  const [legalLinks, linkGroups] = await Promise.all([
    fetchLegalDocuments()
      .then(footerDefaultLegalLinks)
      .catch(() => []),
    getFooterLinkGroups(),
  ]);

  return { legalLinks, linkGroups };
}
