"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** How many characters of the request ID the screen shows. */
const SHORT_CODE_LENGTH = 8;

/** How long the button says "Copied". */
const COPIED_RESET_MS = 2000;

export type ReferenceCodeProps = {
  /**
   * The full request ID. The copy button copies all of it. Without an ID the
   * component renders nothing.
   */
  id: string | undefined;
  className?: string;
};

/**
 * A reference code on an error screen or an error toast (INF-75). A user
 * gives this code to support, and support uses it to find the frontend and
 * backend log lines for the failed request.
 *
 * The screen shows only the first characters. A Loki line filter
 * (`|= "<code>"`) matches on a substring, so the short form still finds the
 * log lines.
 */
export function ReferenceCode({ id, className }: ReferenceCodeProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = React.useCallback(async () => {
    if (!id) return;
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
    } catch {
      // No clipboard access (an old browser or a denied permission). The code
      // stays on the screen, so the user can still copy it by hand.
    }
  }, [id]);

  if (!id) return null;

  return (
    <span
      data-slot="reference-code"
      className={cn("inline-flex items-center gap-2 text-xs opacity-80", className)}
    >
      <span>
        Reference: <code title={id}>{id.slice(0, SHORT_CODE_LENGTH)}</code>
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy reference code"
        className="cursor-pointer underline underline-offset-2"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
