import { apiFetch, ApiRequestError } from "./client";

/**
 * The public legal-document API (`src/modules/legal/routes.ts` in
 * omnipink-backend, legal-documents task 6). Server-side only — every call
 * here is brand-scoped and read through `apiFetch`'s server-side
 * `X-Forwarded-Host` header (`lib/api/client.ts`), never the browser.
 *
 * Freshness window: 300s, now a BACKSTOP rather than the only mechanism
 * (D27, whose deferred on-demand half is built: `omnipink-backend` calls
 * `POST /api/revalidate` with a shared secret right after a publish commits,
 * which calls `revalidateTag(LEGAL_DOCUMENTS_TAG)` — so in the normal case a
 * publish is visible on the next request, and this 300s ceiling only matters
 * if that call never arrives (the secret is unconfigured, the backend
 * couldn't reach this deployment, etc). Passed explicitly on every call — a
 * fetch with no cache config inside a dynamic render is forced to `no-store`
 * (`lib/prismic/content-page.tsx` documents the same trap), so neither option
 * here is decorative.
 */
const LEGAL_DOCUMENTS_REVALIDATE_SECONDS = 300;

/** Shared with `app/api/revalidate/route.ts`'s default tag. */
export const LEGAL_DOCUMENTS_TAG = "legal-documents";

const LEGAL_BASE = "/api/v1/legal/documents";

export type LegalDocumentSummary = {
  key: string;
  title: string;
  displayOrder: number;
  version: number;
  effectiveDate: string | null;
  /** ISO timestamp of the live version's `publishedAt`, or `null` for one of
   *  the three documents that shipped without an effective date (D36). Never
   *  substitute another value for a `null` here (R6.3). */
  lastUpdated: string | null;
};

export type LegalDocumentDetail = {
  html: string;
} & LegalDocumentSummary;

export async function fetchLegalDocuments(): Promise<LegalDocumentSummary[]> {
  return apiFetch<LegalDocumentSummary[]>(LEGAL_BASE, {
    next: { revalidate: LEGAL_DOCUMENTS_REVALIDATE_SECONDS, tags: [LEGAL_DOCUMENTS_TAG] },
  });
}

/** A dropped connection (`fetch failed` / `ETIMEDOUT`), not an HTTP answer.
 *  One of these during `next build` prerender used to fail the whole deploy. */
export function isTransientFetchError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if (error instanceof TypeError || error instanceof AggregateError) return true;
  if ("code" in error) {
    const code = String((error as { code?: unknown }).code);
    if (
      code === "ETIMEDOUT" ||
      code === "ECONNRESET" ||
      code === "ECONNREFUSED" ||
      code === "UND_ERR_CONNECT_TIMEOUT" ||
      code === "UND_ERR_SOCKET"
    ) {
      return true;
    }
  }
  if ("cause" in error) return isTransientFetchError((error as { cause?: unknown }).cause);
  if ("errors" in error && Array.isArray((error as { errors?: unknown }).errors)) {
    return (error as { errors: unknown[] }).errors.some(isTransientFetchError);
  }
  return false;
}

const TRANSIENT_FETCH_ATTEMPTS = 3;
const TRANSIENT_FETCH_DELAYS_MS = [0, 200, 500];

async function withTransientRetry<T>(run: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < TRANSIENT_FETCH_ATTEMPTS; attempt++) {
    const delay = TRANSIENT_FETCH_DELAYS_MS[attempt] ?? 0;
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isTransientFetchError(error) || attempt === TRANSIENT_FETCH_ATTEMPTS - 1) throw error;
    }
  }
  throw lastError;
}

/** `null` for an unknown/unpublished key or a 404 of any kind — a normal
 * outcome (`notFound()` territory for a caller), not an error. */
export async function fetchLegalDocument(key: string): Promise<LegalDocumentDetail | null> {
  try {
    return await withTransientRetry(() =>
      apiFetch<LegalDocumentDetail>(`${LEGAL_BASE}/${encodeURIComponent(key)}`, {
        next: { revalidate: LEGAL_DOCUMENTS_REVALIDATE_SECONDS, tags: [LEGAL_DOCUMENTS_TAG] },
      }),
    );
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
