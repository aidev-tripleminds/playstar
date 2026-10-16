import type { Content } from "@prismicio/client";

import { Footer } from "@/components/common/Prismic/footer/footer";
import type {
  FooterLink,
  FooterLinkGroup,
} from "@/components/common/Prismic/footer/footer.constants";
import { ExploreShowcaseProvider } from "@/components/pages/explore/explore-showcase";
import { cn } from "@/lib/utils";

import { ContentPageSliceZone } from "./content-page";

/**
 * Reading column for a CMS content page.
 *
 * Wider than the homepage's own lower-section column (`max-w-[1148px]`),
 * because these pages carry image + text feature blocks side by side and
 * 1148px squeezes both. Still bounded: without a max width the slice zone
 * filled the whole viewport, which on a wide screen left the character grid
 * and the body copy running edge to edge.
 *
 * `px-4` matches the inset the homepage's own character grid sits in, so the
 * gallery lines up with the equivalent block on `/explore`.
 */
export const CONTENT_PAGE_STACK_CLASS =
  "mx-auto flex w-full max-w-[1632px] flex-col px-4 py-6 [&>*+*]:mt-14 md:[&>*+*]:mt-16";

/** Preserves the normal 64px desktop slice gap after a full-width leading Explore slice. */
export const CONTENT_PAGE_STACK_AFTER_HERO_CLASS = "pt-14 md:pt-16";

/** Matches HOMEPAGE_FOOTER_CLASS. Horizontal inset lives on the footer inner, not here. */
export const CONTENT_PAGE_FOOTER_CLASS = "mt-10 md:mt-16";

/**
 * True when the document's first slice is an Explore slice — i.e. when the
 * document supplies its own full-width page hero (banner, H1, read-more copy
 * and character grid) rather than opening with a block in the reading column.
 *
 * `/` asks this before deciding whether the `home` document can render as a
 * CMS page at all (BACK-222): without a leading Explore slice there is nothing
 * to draw the hero and grid that route has always had, so it falls back to its
 * hardcoded composition instead of shipping a homepage with no hero.
 */
export function hasLeadingExploreSlice(document: Content.ContentPageDocument): boolean {
  return document.data.slices?.[0]?.slice_type === "explore";
}

/**
 * A complete CMS content page: the document's slices in a bounded, padded
 * column, with the site footer beneath them.
 *
 * The footer is a shared COMPONENT rather than an authored slice, so it is
 * written once and appears identically on every page — an editor cannot get
 * three pages' footers out of step, and there is nothing to re-enter per page.
 *
 * Distinct from {@link ContentPageSliceZone}, which stays bare: the homepage
 * and app extensions embed their slice zones in existing layouts without a
 * site footer. Only a complete CMS page receives this shell.
 *
 * Stays a SYNCHRONOUS component on purpose: its caller (`[...path]/page.tsx`) is
 * itself an async server component, and fetching `legalLinks` there instead
 * of here keeps this one nested async component out of the tree — an async
 * component nested under an already-awaited one cannot be awaited by a
 * plain `render()` in a test (see `[...path]/page.test.tsx`).
 */
export function ContentPageBody({
  document,
  legalLinks,
  linkGroups,
}: {
  document: Content.ContentPageDocument;
  legalLinks: FooterLink[];
  linkGroups: FooterLinkGroup[];
}) {
  const slices = document.data.slices ?? [];
  const [firstSlice] = slices;
  const leadingExploreSlice = firstSlice?.slice_type === "explore" ? firstSlice : undefined;
  const stackSlices: typeof slices = leadingExploreSlice
    ? slices.length > 1
      ? [slices[1]!, ...slices.slice(2)]
      : []
    : slices;
  const showStack = !leadingExploreSlice || stackSlices.length > 0;

  return (
    <ExploreShowcaseProvider
      key={document.id ?? document.uid}
      sourceId={slices.find((slice) => slice.slice_type === "explore")?.id}
    >
      {leadingExploreSlice ? (
        <ContentPageSliceZone
          document={document}
          slices={[leadingExploreSlice]}
          pageHeroSliceId={leadingExploreSlice.id}
        />
      ) : null}

      {showStack ? (
        <div
          data-slot="content-page-stack"
          className={cn(
            CONTENT_PAGE_STACK_CLASS,
            leadingExploreSlice && CONTENT_PAGE_STACK_AFTER_HERO_CLASS,
          )}
        >
          <ContentPageSliceZone document={document} slices={stackSlices} />
        </div>
      ) : null}
      <Footer
        className={CONTENT_PAGE_FOOTER_CLASS}
        legalLinks={legalLinks}
        linkGroups={linkGroups}
      />
    </ExploreShowcaseProvider>
  );
}
