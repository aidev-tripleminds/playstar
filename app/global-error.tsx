"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { ReferenceCode } from "@/components/common/general/reference-code/reference-code";
import { requestIdOf } from "@/lib/api/client";

/**
 * `ReferenceCode` uses Tailwind classes, and the global stylesheet is not on
 * this page. Without these rules its Copy button shows as a native grey
 * button on the dark background.
 */
const REFERENCE_CODE_STYLES = `
[data-slot="reference-code"] { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; opacity: 0.8; }
[data-slot="reference-code"] button { background: none; border: 0; padding: 0; color: inherit; font: inherit; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
`;

/**
 * Last-resort boundary for an error in the root layout itself. It replaces the
 * whole document, so it brings its own `<html>`/`<body>` and inline styles —
 * `globals.css` and the fonts do not load here.
 *
 * Its one job beyond showing a way out is to report: an error that reaches
 * this boundary never reaches `window.onerror`, so without the capture below
 * Sentry would not see the worst failure the app can have.
 *
 * It also shows a reference code (INF-75): the request ID of a failed API
 * call, or else the `digest` that Next.js gives a server error in place of
 * the error. `instrumentation.ts` logs the server error with that digest and
 * its request ID, so either code finds the log lines.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#0A0A0A",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <title>Something went wrong</title>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Something went wrong</h1>
        <style>{REFERENCE_CODE_STYLES}</style>
        <ReferenceCode id={requestIdOf(error) ?? error.digest} />
        <button
          type="button"
          onClick={() => retry()}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: 999,
            background: "#FFFFFF",
            color: "#0A0A0A",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
