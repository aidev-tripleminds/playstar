"use client";

import { useEffect, useRef } from "react";

import { useMe } from "@/hooks/use-me";
import { fetchImageJobs, type GalleryImageJob } from "@/lib/api/character-media";

const isPending = (job: GalleryImageJob) => job.status === "queued" || job.status === "processing";

/**
 * Recover progress after navigation; completed files come from the ordinary gallery.
 * `onCompleted` refreshes that gallery and must reject when the refresh failed.
 * Polls only while a job is pending, a refresh must be retried, or `watching` is
 * set because an image is generating on this page.
 *
 * Renders nothing. A line above the gallery ("Your image is generating…", or a
 * failure such as "Blocked by safety guidelines…") duplicated the cards
 * (FRONT-910).
 */
export function ImageJobStatus({
  onCompleted,
  watching = false,
}: {
  onCompleted: () => Promise<unknown>;
  watching?: boolean;
}) {
  const { isLoggedIn } = useMe();
  // Completed jobs the gallery has been refreshed for.
  const synced = useRef("");
  useEffect(() => {
    if (!isLoggedIn) return;
    const abort = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      let idle = false;
      try {
        const result = await fetchImageJobs(abort.signal);
        if (abort.signal.aborted) return;
        const signature = result.jobs
          .filter((job) => job.status === "completed")
          .map((job) => job.job_id)
          .sort()
          .join(",");
        if (signature !== synced.current) {
          // Recorded only once the refresh succeeds: a failed one is retried
          // on the next poll instead of leaving the finished image missing.
          await onCompleted();
          if (abort.signal.aborted) return;
          synced.current = signature;
        }
        idle = !watching && !result.jobs.some(isPending);
      } catch {
        // A transient network error does not mean that the server job failed,
        // and a failed gallery refresh is retried on the next poll.
      } finally {
        if (!abort.signal.aborted && !idle) timer = setTimeout(refresh, 5000);
      }
    }
    void refresh();
    return () => {
      abort.abort();
      clearTimeout(timer);
    };
  }, [isLoggedIn, onCompleted, watching]);

  return null;
}
