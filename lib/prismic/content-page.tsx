import { asLink, type Content, NotFoundError, RepositoryNotFoundError } from "@prismicio/client";
import { getPreviewRef } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExploreShowcaseProvider } from "@/components/pages/explore/explore-showcase";
import { logger } from "@/lib/logger";
import { ROUTES } from "@/lib/routes";
import { components } from "@/slices";

import { createClient } from "./client";
import { contentPagePath, type ContentPagePathSource } from "./content-page-path";
import type { ContentPageSliceContext } from "./cta";
import { isCmsUnavailable } from "./errors";

/**
 * API ID of the flexible-Slice-Zone custom type shared by all three content
 * pages (task 7) and the homepage's slice zone (task 8). Exported so the
 * preview route (task 9) can recognize a resolved document without
 * duplicating the string.
 */
export const CONTENT_PAGE_TYPE = "content_page";

/**
 * UID of the homepage document — BACK-148: "Home page https://spicestars.ai/
 * → Prismic page with UID = home". A real `content_page` document, but not a
 * standalone page: it is embedded in `/` (`app/(main)/page.tsx`), which owns
 * the hero, the character grid and the footer around its slices, and which
 * takes its title/description/social image/noindex from it.
 *
 * `/home` is NOT where it renders: that path 308s to `/`, so the homepage has
 * exactly one URL (BACK-156, OMNIPINK AI: "/home is the home page but URL
 * stays clean"). Exported so the `[...path]` catch-all (which serves every
 * OTHER `content_page` at its matching subfolder + UID path) and the preview
 * route can both recognize it by the same value instead of copies of the
 * literal.
 */
export const HOME_PAGE_UID = "home";

/**
 * The homepage document's canonical path: the site root, not `/home`.
 * `contentPagePath()` cannot produce it — that helper derives a path from
 * subfolder + UID, which for this document is the alias, not the page.
 */
export const HOME_PAGE_PATH = ROUTES.root;

/**
 * Fixed UID of the CMS-editable slice zone appended below the Chat SEO hero.
 * Same shape as `home`: a real `content_page` document embedded in
 * `/chat` (`app/(main)/chat/page.tsx`) for logged-out visitors, not served at
 * its own `/chat` path via `[uid]`. Named `chat`, not `ai-chat` (its original
 * UID, from when `/ai-chat` was still its own standalone landing before that
 * route merged into `/chat` and became the legacy alias `ROUTES.aiChat`).
 */
export const CHAT_EXTENSION_UID = "chat";

/**
 * Fixed UID of the CMS-editable slice zone appended below the create wizard
 * on `/create-ai-girlfriend`. Same shape as `home` and `chat`:
 * a real `content_page` document embedded in that route, not served at a
 * second `/create-ai-girlfriend` via `[uid]`.
 */
export const CREATE_AI_GF_EXTENSION_UID = "create-ai-girlfriend";

/**
 * Fixed UIDs of the two gender-preselected create landings (BACK-226) —
 * `/create-ai-boyfriend` and `/create-ai-trans`.
 *
 * Each gets its OWN document rather than sharing `create-ai-girlfriend`'s: the
 * three routes render the same wizard, so identical CMS tails would publish
 * three indexable URLs with the same copy — the exact duplication these pages
 * exist to avoid.
 */
export const CREATE_AI_BF_EXTENSION_UID = "create-ai-boyfriend";
export const CREATE_AI_TRANS_EXTENSION_UID = "create-ai-trans";

/**
 * Fixed UID of the CMS-editable slice zone appended below the Create empty
 * state on `/generate`. Same shape as `chat`: a real `content_page`
 * document embedded in that route for logged-out visitors, not served at a
 * second `/ai-generate` via `[uid]`.
 */
export const GENERATE_EXTENSION_UID = "ai-generate";

/**
 * Fixed UIDs of the two Create landings that open the workspace on one gallery
 * — `/generate-image` and `/generate-video` (BACK-222). Same shape as
 * `ai-generate`: the workspace is product chrome, the stack below it is the
 * document, and neither is served a second time at a UID-shaped path.
 */
export const GENERATE_IMAGE_EXTENSION_UID = "generate-image";
export const GENERATE_VIDEO_EXTENSION_UID = "generate-video";

/**
 * The homepage document's pre-BACK-148 UID. It survives in the embedded set,
 * and nowhere else, as a guard: a workspace whose rename has not run yet
 * still holds a document under this UID, and without this the `[...path]`
 * catch-all would publish the homepage's own tail as a standalone
 * `/home-extension` page and list it in both sitemaps. Delete once every
 * workspace answers to `home` (`scripts/rename-home-page-uid.mjs`).
 */
const LEGACY_HOME_UID = "home-extension";

/**
 * Every embedded `content_page` UID, mapped to the route that renders it.
 *
 * One table rather than a set here and a switch in the preview route: adding a
 * page extension is then a single line, and a UID can never be embedded (so
 * 404 at `[...path]`) while the preview button still fails to find it a home.
 */
const EMBEDDED_CONTENT_PAGE_ROUTES: ReadonlyMap<string, string> = new Map([
  [HOME_PAGE_UID, HOME_PAGE_PATH],
  [LEGACY_HOME_UID, HOME_PAGE_PATH],
  [CHAT_EXTENSION_UID, ROUTES.chat],
  [CREATE_AI_GF_EXTENSION_UID, ROUTES.createAiGirlfriend],
  [CREATE_AI_BF_EXTENSION_UID, ROUTES.createAiBoyfriend],
  [CREATE_AI_TRANS_EXTENSION_UID, ROUTES.createAiTrans],
  [GENERATE_EXTENSION_UID, ROUTES.generate],
  [GENERATE_IMAGE_EXTENSION_UID, ROUTES.generateImage],
  [GENERATE_VIDEO_EXTENSION_UID, ROUTES.generateVideo],
]);

/**
 * UIDs of page extensions whose route has been removed. `create-ai-character`
 * was the gender-neutral create landing; its route is gone, but a workspace
 * may still hold the document (`scripts/author-page-extensions.mjs` used to
 * write it). Without this guard the `[...path]` catch-all would publish that
 * document as a standalone `/create-ai-character` page and both sitemaps
 * would list it again. Delete an entry once its document is archived in
 * Prismic.
 */
const RETIRED_CONTENT_PAGE_UIDS: ReadonlySet<string> = new Set(["create-ai-character"]);

/** True for `content_page` UIDs that are tails of another route, not standalone pages. */
export function isEmbeddedContentPageUid(uid: string): boolean {
  return EMBEDDED_CONTENT_PAGE_ROUTES.has(uid);
}

/** True for `content_page` UIDs whose route was removed and must not be served or listed. */
export function isRetiredContentPageUid(uid: string): boolean {
  return RETIRED_CONTENT_PAGE_UIDS.has(uid);
}

/**
 * The route an embedded document is rendered inside, or `undefined` when the
 * UID is not embedded at all.
 *
 * Deliberately NOT the same question as {@link contentPageCanonicalPath}: this
 * answers "where do I send someone previewing this document", which every
 * embedded UID has an answer to. That one answers "what URL does this document
 * own", which only the homepage does — the other tails hang off routes that
 * are already indexed under their own names, so listing them again would put
 * the same page in the sitemap twice.
 */
export function embeddedContentPageRoute(uid: string): string | undefined {
  return EMBEDDED_CONTENT_PAGE_ROUTES.get(uid);
}

/**
 * The one URL a document is served at, or `undefined` when it has none.
 *
 * The homepage is the case plain `contentPagePath()` cannot express: it is
 * embedded in `/`, so its canonical URL is the root — not the `/home` its UID
 * would otherwise produce, which only redirects there. The other embedded
 * tails hang off routes that own their own metadata and have no URL of their
 * own at all.
 */
export function contentPageCanonicalPath(document: ContentPagePathSource): string | undefined {
  if (document.uid === HOME_PAGE_UID) return HOME_PAGE_PATH;
  if (
    document.uid &&
    (isEmbeddedContentPageUid(document.uid) || isRetiredContentPageUid(document.uid))
  )
    return undefined;
  return contentPagePath(document);
}

/**
 * Freshness window for the Prismic fetch itself, in seconds.
 *
 * This is NOT the same knob as a page's `export const revalidate` — that one
 * governs the route segment's own ISR window and must stay a literal in each
 * page file (Next requires it to be statically analyzable). The segment value
 * does not reach `fetch`: a fetch with no explicit cache config made during a
 * DYNAMIC render is forced to `no-store` (`next/dist/server/lib/patch-fetch.js`
 * — `hasNoExplicitCacheConfig` → `autoNoCache`). The homepage renders
 * dynamically (`hasServerSession()` reads headers), so without this the
 * CMS tail would be re-fetched live on every anonymous request.
 */
export const CONTENT_PAGE_REVALIDATE_SECONDS = 60;

/**
 * Fetches a `content_page` document by UID, returning `null` for a
 * missing/unpublished UID rather than throwing — the shared core both
 * `getContentPageByUID` (page-shaped, 404s) and `getContentPageByUIDOrNull`
 * (degrade-gracefully-shaped, task 8) build on, so the fetch + error-class
 * narrowing lives in exactly one place.
 *
 * Freshness is controlled HERE, by `CONTENT_PAGE_REVALIDATE_SECONDS` passed
 * as `fetchOptions`. The caller's route segment `export const revalidate`
 * governs that route's own ISR window, NOT this fetch — see the constant's
 * doc comment. While a preview ref is active the fetch is `no-store`, because
 * a draft must never be served from a shared cache entry.
 *
 * `RepositoryNotFoundError` is deliberately excluded from the "missing
 * document" case: it extends `NotFoundError` (see `@prismicio/client`'s
 * `errors.js`) but means "the configured Prismic WORKSPACE does not exist" —
 * i.e. a misconfigured `NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME` — not "this page
 * has no document". Swallowing it would let a broken deploy render every
 * caller as if the CMS were simply unauthored. It must stay loud, like any
 * other error.
 *
 * Draft-mode-aware (task 9): `getPreviewRef()` (`@prismicio/next`) reads the
 * active preview session's ref from the request's cookies, but ONLY when
 * Next's Draft Mode is enabled for this render — it resolves `undefined`
 * otherwise, in which case `getByUID`'s own `ref` resolution falls back to
 * the normal published ref exactly as before. This is the one fetch shared
 * by every caller (content pages AND the homepage), so draft-awareness
 * threads through automatically for both without a second copy of this
 * logic.
 */
async function fetchContentPage(uid: string): Promise<Content.ContentPageDocument | null> {
  const client = createClient();

  try {
    const ref = await getPreviewRef();
    return await client.getByUID<Content.ContentPageDocument>(CONTENT_PAGE_TYPE, uid, {
      ref,
      fetchOptions: ref
        ? { cache: "no-store" }
        : { next: { revalidate: CONTENT_PAGE_REVALIDATE_SECONDS } },
    });
  } catch (error) {
    if (error instanceof NotFoundError && !(error instanceof RepositoryNotFoundError)) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetches a `content_page` document by UID, or triggers Next's `notFound()`
 * for a missing/unpublished UID — never an unhandled `NotFoundError` throw
 * (spec's "Tests to Write"). Use this for a page whose ENTIRE content is the
 * document (the three task-7 content pages) — the page has nothing to render
 * without it.
 */
export async function getContentPageByUID(uid: string): Promise<Content.ContentPageDocument> {
  const document = await fetchContentPage(uid);
  if (!document) notFound();
  return document;
}

/**
 * Fetches a `content_page` document by UID, or resolves `null` when it cannot
 * be rendered — never `notFound()`s, never throws for "no document". Use this
 * where the document is an optional ADDITION to a page that has real, non-CMS
 * content of its own and must keep rendering regardless of CMS state (the
 * homepage's tail, task 8, R6.5).
 *
 * Unlike `getContentPageByUID`, this also absorbs a Prismic OUTAGE, not just
 * an unauthored document: `/` is the highest-traffic anonymous entry point and
 * its own content does not come from the CMS, so a third-party API being down
 * must not 500 it. This matches the tolerance `hasServerSession()` already
 * grants the backend on this exact route ("A backend outage/timeout/malformed
 * response must not 500 the page for anonymous visitors").
 *
 * The catch is deliberately NARROW — only Prismic API failures and transport
 * (`fetch`) failures degrade. `RepositoryNotFoundError` (the workspace does not
 * exist) and anything that is not a Prismic/transport error — notably the plain
 * `Error` thrown for a missing `NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME` — stay
 * LOUD, so a misconfigured deploy can never hide behind a homepage that merely
 * looks short.
 */
export async function getContentPageByUIDOrNull(
  uid: string,
): Promise<Content.ContentPageDocument | null> {
  try {
    return await fetchContentPage(uid);
  } catch (error) {
    if (!isCmsUnavailable(error)) throw error;

    logger.error(
      { name: "prismic", uid, err: error },
      "optional content_page could not be fetched; rendering the page without it",
    );
    return null;
  }
}

/**
 * Page `<title>`/meta description sourced entirely from the document — never
 * hardcoded per-route, or the "editable without a redeploy" requirement
 * (R4.4) is only half true.
 *
 * A blank field OMITS the key rather than setting it to `undefined`. Next
 * merges parent metadata with `for (const key in metadata)`, which enumerates
 * own keys whose value is `undefined` — so `{ title: undefined }` still runs
 * the title resolver, and `resolveTitle(undefined, null)`
 * returns `{ absolute: "" }`, which the renderer skips. That would emit NO
 * `<title>` at all instead of inheriting `app/(main)/layout.tsx`'s
 * `title.default` ("Spicestars"). Omitting the key preserves the fallback.
 * (`null` behaves identically to `undefined` here — the key must be absent.)
 */
export function contentPageMetadata(
  document: Content.ContentPageDocument,
  defaultOgImageUrl: string,
): Metadata {
  const { title, meta_description: metaDescription } = document.data;
  const path = contentPagePath(document);
  if (!path) {
    throw new Error(`Prismic content page ${JSON.stringify(document.uid)} has an invalid path.`);
  }

  return {
    ...(title ? { title } : {}),
    ...(metaDescription ? { description: metaDescription } : {}),
    alternates: { canonical: path },
    ...socialMetadata(document.data, title, defaultOgImageUrl),
  };
}

/**
 * The social-image and robots half of a page's metadata — identical for `/`
 * and for every `[...path]` page, so both builders share it rather than
 * keeping two copies of the "authored image, else the backoffice default"
 * rule (BACK-147: "Meta Image ... Default = Mobile Default Home Banner").
 */
function socialMetadata(
  data: Pick<Content.ContentPageDocument["data"], "og_image_url" | "noindex"> | undefined,
  title: string | null | undefined,
  defaultOgImageUrl: string,
): Metadata {
  const imageUrl = asLink(data?.og_image_url) ?? defaultOgImageUrl;
  const imageAlt = title ?? HOME_FALLBACK_TITLE;

  return {
    ...(imageUrl
      ? {
          openGraph: { images: [{ url: imageUrl, alt: imageAlt }] },
          twitter: { images: [imageUrl] },
        }
      : {}),
    ...(data?.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * What `/` ships when the CMS document is missing, unreachable or has that
 * field unauthored — the copy the route carried hardcoded before the homepage
 * became a Prismic page. `/` must render either way (R6.5), so it always needs
 * an answer of its own.
 */
const HOME_FALLBACK_TITLE = "Spicestars";
const HOME_FALLBACK_DESCRIPTION = "Create and explore AI companions on Spicestars.";

export type EmbeddedPageMetadataOptions = {
  /** The route the document is embedded in — its one canonical URL. */
  path: string;
  /** Title and description the route ships when the document cannot supply them. */
  fallbackTitle: string;
  fallbackDescription: string;
  defaultOgImageUrl: string;
  /** Emit an absolute title instead of inheriting parent title metadata. */
  absoluteTitle?: boolean;
};

/**
 * Metadata for a route with an EMBEDDED `content_page` document — `/`, `/chat`,
 * `/create-ai-girlfriend`, `/generate` and the two generate landings. The
 * document supplies the same editable title, meta description, social image
 * and noindex flag every standalone CMS page gets (BACK-147's "traits ...
 * important to be able to edit for each page separately"), and the caller's
 * fallbacks stand behind each one.
 *
 * Distinct from {@link contentPageMetadata} in what it tolerates, because these
 * routes have real product content of their own and must render regardless of
 * CMS state: a missing document is a normal outcome (hence `null`). Canonical
 * paths are resolved against the serving origin by the main layout's
 * metadataBase, so test and preview hosts never inherit the production domain.
 */
export function embeddedPageMetadata(
  document: Content.ContentPageDocument | null,
  {
    path,
    fallbackTitle,
    fallbackDescription,
    defaultOgImageUrl,
    absoluteTitle = false,
  }: EmbeddedPageMetadataOptions,
): Metadata {
  const title = document?.data.title?.trim() || fallbackTitle;
  const description = document?.data.meta_description?.trim() || fallbackDescription;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...socialMetadata(document?.data, title, defaultOgImageUrl),
  };
}

/** `/`'s metadata, sourced from the `home` document. See {@link embeddedPageMetadata}. */
export function homePageMetadata(
  document: Content.ContentPageDocument | null,
  defaultOgImageUrl: string,
): Metadata {
  return embeddedPageMetadata(document, {
    path: HOME_PAGE_PATH,
    fallbackTitle: HOME_FALLBACK_TITLE,
    fallbackDescription: HOME_FALLBACK_DESCRIPTION,
    defaultOgImageUrl,
    absoluteTitle: true,
  });
}

/** True when a H1 or Explore slice supplies the page heading. */
export function hasContentPageHeading(document: Content.ContentPageDocument): boolean {
  return (document.data.slices ?? []).some(
    (slice) =>
      (slice.slice_type === "h1" || slice.slice_type === "explore") &&
      Boolean(slice.primary.heading?.trim()),
  );
}

/**
 * The page-level heading a coded route falls back to when no document supplies
 * one — Prismic unreachable, the document missing, or no populated heading slice.
 *
 * Visually hidden, and that is the deliberate part. The workspaces this backs
 * (`/generate*`, the four create landings) are product chrome whose design has
 * no page title in it, and the CMS heading is the one meant to be SEEN — so
 * this exists to stop the document being headingless, not to put a title on
 * screen. It carries the page's own name, the same string as its `<title>`,
 * and disappears when a slice supplies the page heading.
 */
export function FallbackPageHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 data-slot="fallback-page-heading" className="sr-only">
      {children}
    </h1>
  );
}

/** Renders a `content_page` document's Slice Zone using the shared slice-to-component map. */
export function ContentPageSliceZone({
  document,
  slices = document.data.slices,
  pageHeroSliceId,
}: {
  document: Content.ContentPageDocument;
  slices?: Content.ContentPageDocument["data"]["slices"];
  pageHeroSliceId?: string;
}) {
  const context: ContentPageSliceContext = {
    signupSource: document.uid,
    pageHeroSliceId,
    // Use the complete document, even when a leading hero and the remaining
    // stack render through separate SliceZones.
    h1SliceId: document.data.slices?.find(
      (slice) => slice.slice_type === "h1" && slice.primary.heading?.trim(),
    )?.id,
  };
  return (
    <ExploreShowcaseProvider
      key={document.id ?? document.uid}
      sourceId={document.data.slices?.find((slice) => slice.slice_type === "explore")?.id}
    >
      <SliceZone slices={slices} components={components} context={context} />
    </ExploreShowcaseProvider>
  );
}

/** The CMS slices embedded in a coded route, without a footer or extra heading. */
export function ContentPageTail({ document }: { document: Content.ContentPageDocument }) {
  return <ContentPageSliceZone document={document} />;
}
