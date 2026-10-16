import type { Content } from "@prismicio/client";

import { logger } from "@/lib/logger";

import { createClient } from "./client";
import {
  CONTENT_PAGE_REVALIDATE_SECONDS,
  CONTENT_PAGE_TYPE,
  contentPageCanonicalPath,
  embeddedContentPageRoute,
  HOME_PAGE_UID,
} from "./content-page";
import { isCmsUnavailable } from "./errors";

/**
 * One canonical CMS page, reduced to the fields the sitemaps need.
 */
export type SitemapContentPage = {
  uid: string;
  /** Canonical app path, e.g. `/dirty-talk-ai` or `/generator/ai-blowjob`. */
  path: string;
  /** Meta title. Empty when the document has none — callers pick their own fallback. */
  title: string;
  /** Meta description. Empty when the document has none. */
  description: string;
  lastModified: string;
};

/**
 * Narrows one document to a sitemap page, or `null`.
 *
 * Both sitemaps list indexable canonical pages. Embedded tails
 * (`ai-chat`, `create-ai-girlfriend`, …) are rendered inside another route and
 * have no URL of their own; redirected and invalidly authored pages are also
 * excluded, as are pages marked noindex.
 *
 * The homepage is the embedded tail that DOES belong here — it is the site's
 * most important URL, and it was missing from both sitemaps for as long as
 * `/` had no path a UID could produce. `contentPageCanonicalPath` gives it
 * one (`/`). Its `subfolder` and `redirect` fields are ignored, exactly as
 * the root route ignores them: honouring `redirect` here would quietly drop
 * `/` from the sitemap while it kept answering 200.
 */
/**
 * Formats a Prismic `last_publication_date` for `lastmod` in W3C datetime
 * form (a colon in the UTC offset, e.g. `+00:00`). Prismic's own string
 * omits the colon (`+0000`), a format Google Search Console rejects as an
 * invalid date.
 */
function toSitemapLastModified(lastPublicationDate: string): string {
  return new Date(lastPublicationDate).toISOString();
}

export function toSitemapContentPage(
  document: Content.ContentPageDocument,
): SitemapContentPage | null {
  const path = contentPageCanonicalPath(document);
  const isHome = document.uid === HOME_PAGE_UID;
  const hasRedirect = !isHome && Boolean(document.data.redirect?.trim());

  if (!path || !document.uid || hasRedirect || document.data.noindex) {
    return null;
  }

  return {
    uid: document.uid,
    path,
    title: document.data.title ?? "",
    description: document.data.meta_description ?? "",
    lastModified: toSitemapLastModified(document.last_publication_date),
  };
}

async function getSitemapDocuments(): Promise<Content.ContentPageDocument[]> {
  const client = createClient();
  return client.getAllByType<Content.ContentPageDocument>(CONTENT_PAGE_TYPE, {
    fetchOptions: { next: { revalidate: CONTENT_PAGE_REVALIDATE_SECONDS } },
  });
}

function featureSitemapPages(featurePaths: readonly string[]): SitemapContentPage[] {
  return featurePaths.map((path) => ({
    uid: path.slice(1),
    path,
    title: "",
    description: "",
    lastModified: "",
  }));
}

/**
 * Every eligible CMS and supplied feature sitemap page, sorted by path.
 *
 * Prismic's own order is neither alphabetical nor stable enough to publish, so
 * the sort is ours. Sorting by PATH rather than title is what makes subfolders
 * read as groups on `/sitemap`: every `/generator/*` page lands next to its
 * siblings without the page needing a group heading, which would otherwise
 * break BACK-160's fixed H2-section/H3-title structure. Paths are constrained
 * to lowercase `a-z0-9-` segments (`content-page-path.ts`), so a plain
 * comparison is deterministic — no locale to disagree about.
 *
 * A side effect worth knowing: the visible titles are then NOT in alphabetical
 * order, because a title is authored independently of its UID.
 *
 * Throws if the CMS is unreachable — `sitemap.xml` must fail rather than
 * publish a silently truncated index that would drop real URLs from Google.
 * Use {@link getSitemapContentPagesOrEmpty} where a short page beats a 500.
 */
export async function getSitemapContentPages(
  featurePaths: readonly string[] = [],
): Promise<SitemapContentPage[]> {
  const documents = await getSitemapDocuments();
  const pages = new Map(featureSitemapPages(featurePaths).map((page) => [page.path, page]));

  for (const document of documents) {
    const embeddedPath = document.uid ? embeddedContentPageRoute(document.uid) : undefined;
    const featurePath =
      embeddedPath && featurePaths.includes(embeddedPath) ? embeddedPath : undefined;
    if (featurePath) {
      // Embedded routes use the document's noindex flag, but ignore redirect and subfolder fields.
      if (document.data.noindex) {
        pages.delete(featurePath);
      } else {
        pages.set(featurePath, {
          uid: document.uid,
          path: featurePath,
          title: document.data.title ?? "",
          description: document.data.meta_description ?? "",
          lastModified: toSitemapLastModified(document.last_publication_date),
        });
      }
      continue;
    }

    const page = toSitemapContentPage(document);
    // A standalone CMS document cannot override an app feature route's metadata.
    if (page && !featurePaths.includes(page.path)) pages.set(page.path, page);
  }

  return [...pages.values()].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

/**
 * As {@link getSitemapContentPages}, but falls back to the supplied feature routes
 * when the CMS is unavailable. For the human `/sitemap` page, which has real content of its
 * own (Features, Socials) and is linked from every footer — a Prismic outage
 * must not 500 it. A misconfigured repository still throws.
 */
export async function getSitemapContentPagesOrEmpty(
  featurePaths: readonly string[] = [],
): Promise<SitemapContentPage[]> {
  try {
    return await getSitemapContentPages(featurePaths);
  } catch (error) {
    if (!isCmsUnavailable(error)) throw error;

    logger.error(
      { name: "prismic", err: error },
      "content pages could not be listed; rendering /sitemap without them",
    );
    return featureSitemapPages(featurePaths);
  }
}
