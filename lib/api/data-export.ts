import { apiFetch } from "./client";

/**
 * GDPR data export (BACK-123).
 *
 * Support triggers the export from the admin panel; the backend then emails
 * the user a verify link and, once the archive is built, a download link.
 * Both links land on this app carrying a one-shot token — the token IS the
 * credential, so neither endpoint requires a session (same shape as
 * verify-email / reset-password). They still go through {@link apiFetch} so
 * they are proxied first-party, which is what keeps a signed-in visitor's
 * cookie attached when there happens to be one.
 */

export type DataExportStatus = "queued" | "processing" | "ready" | "failed";

export type DataExportVerifyResponse = {
  id: string;
  status: DataExportStatus;
};

/**
 * Field names are the backend's, verbatim. This payload is handed to S3 and to
 * the browser's download manager unchanged, so renaming it here would buy a
 * naming convention at the price of a translation layer over four fields.
 */
export type DataExportDownloadResponse = {
  download_url: string;
  file_name: string;
  size_bytes: number;
  expires_at: string;
};

/**
 * Confirm ownership of the address the export was requested for.
 *
 * Idempotent: re-opening an already-verified link returns 200 with the request's
 * current status rather than an error, so a forwarded or re-clicked email is not
 * a failure. Throws `ApiRequestError` with 400 `INVALID_TOKEN` or 410
 * `TOKEN_EXPIRED` (which also covers cancelled and superseded requests).
 */
export function verifyDataExport(token: string): Promise<DataExportVerifyResponse> {
  return apiFetch<DataExportVerifyResponse>("/api/v1/user/data-export/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

/**
 * Mint a presigned S3 URL for the finished archive.
 *
 * The download token is NOT the verify token — it arrives in a second email —
 * so this is never callable off the back of a verify link. Throws
 * `ApiRequestError` with 400 `INVALID_TOKEN`, 409 `EXPORT_NOT_READY` or 410
 * `EXPORT_EXPIRED`.
 */
export function requestDataExportDownload(token: string): Promise<DataExportDownloadResponse> {
  return apiFetch<DataExportDownloadResponse>("/api/v1/user/data-export/download", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
