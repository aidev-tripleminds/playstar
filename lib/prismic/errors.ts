import { PrismicError, RepositoryNotFoundError } from "@prismicio/client";

/**
 * True for a Prismic failure a page may DEGRADE around — the CMS is
 * unreachable or unhappy, not misconfigured.
 *
 * Deliberately narrow. `RepositoryNotFoundError` (the configured workspace does
 * not exist — i.e. a wrong `NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME`) and anything
 * that is not a Prismic/transport error — notably the plain `Error` thrown for
 * a MISSING repository name — are excluded, so a broken deploy stays loud
 * instead of hiding behind a page that merely looks short.
 *
 * `TypeError` is included because that is what `fetch` throws for a transport
 * failure (DNS, TLS, connection reset), which never becomes a `PrismicError`.
 */
export function isCmsUnavailable(error: unknown): boolean {
  return (
    (error instanceof PrismicError && !(error instanceof RepositoryNotFoundError)) ||
    error instanceof TypeError
  );
}
