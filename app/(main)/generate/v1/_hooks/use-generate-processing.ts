import * as React from "react";

import {
  type GeneratedMediaItem,
  type GenerateMediaRequest,
  runGenerateMediaRequest,
} from "../../_lib/generate-media";
import {
  createGenerateResultItem,
  filterGenerateProcessingBySection,
  GENERATE_STAGE_GENERATING_MS,
  GENERATE_STAGE_PROCESSING_MS,
  GENERATE_STAGE_PROGRESS_TICK_MS,
  GENERATE_STAGE_QUEUING_MS,
  type GenerateGalleryItem,
  type GenerateProcessingItem,
  type GenerateSectionTabId,
} from "../_lib/constants";

type UseGenerateProcessingOptions = {
  sectionTabId: GenerateSectionTabId;
  onComplete: (item: GenerateGalleryItem) => void;
};

type StartGenerateProcessingOptions = {
  kind: GenerateProcessingItem["kind"];
  skipQueue?: boolean;
  prompt?: string;
  request?: GenerateMediaRequest;
};

export function useGenerateProcessing({ sectionTabId, onComplete }: UseGenerateProcessingOptions) {
  const [processingItems, setProcessingItems] = React.useState<GenerateProcessingItem[]>([]);
  const processingIdRef = React.useRef(0);
  const processingTimersRef = React.useRef<Map<string, number[]>>(new Map());
  const requestByItemRef = React.useRef<Map<string, GenerateMediaRequest>>(new Map());
  const abortByItemRef = React.useRef<Map<string, AbortController>>(new Map());

  const sectionProcessingItems = React.useMemo(
    () => filterGenerateProcessingBySection(processingItems, sectionTabId),
    [processingItems, sectionTabId],
  );

  const abortProcessingItem = React.useCallback((itemId: string) => {
    abortByItemRef.current.get(itemId)?.abort();
    abortByItemRef.current.delete(itemId);
  }, []);

  const clearProcessingTimers = React.useCallback((itemId: string) => {
    const timers = processingTimersRef.current.get(itemId);
    if (!timers) return;
    for (const timerId of timers) {
      window.clearTimeout(timerId);
      window.clearInterval(timerId);
    }
    processingTimersRef.current.delete(itemId);
  }, []);

  const trackProcessingTimer = React.useCallback((itemId: string, timerId: number) => {
    const existing = processingTimersRef.current.get(itemId) ?? [];
    existing.push(timerId);
    processingTimersRef.current.set(itemId, existing);
  }, []);

  const updateProcessingItem = React.useCallback(
    (itemId: string, patch: Partial<GenerateProcessingItem>) => {
      setProcessingItems((previous) =>
        previous.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const removeProcessingItem = React.useCallback(
    (itemId: string) => {
      abortProcessingItem(itemId);
      requestByItemRef.current.delete(itemId);
      clearProcessingTimers(itemId);
      setProcessingItems((previous) => previous.filter((item) => item.id !== itemId));
    },
    [abortProcessingItem, clearProcessingTimers],
  );

  const completeProcessingItem = React.useCallback(
    (item: GenerateProcessingItem, failed: boolean, results?: GeneratedMediaItem[]) => {
      abortProcessingItem(item.id);
      clearProcessingTimers(item.id);

      if (failed) {
        updateProcessingItem(item.id, {
          state: "moderation-issue",
          progressPercent: undefined,
        });
        return;
      }

      const nextResults =
        results && results.length > 0
          ? results
          : [createGenerateResultItem(`generated-${item.id}`, item.kind, item.prompt)];
      requestByItemRef.current.delete(item.id);
      for (const result of nextResults) {
        onComplete(result);
      }
      setProcessingItems((previous) => previous.filter((entry) => entry.id !== item.id));
    },
    [abortProcessingItem, clearProcessingTimers, onComplete, updateProcessingItem],
  );

  const runGenerateStageMachine = React.useCallback(
    (item: GenerateProcessingItem, options?: { skipQueue?: boolean; failed?: boolean }) => {
      const failed = options?.failed ?? item.willFail ?? false;
      // Only the promptbox skip toggle / card Skip CTA may jump past Queue.
      // Otherwise always: Queue → Processing → Generating → Result.
      const skipQueue = options?.skipQueue ?? false;
      const hasRequest = requestByItemRef.current.has(item.id);

      clearProcessingTimers(item.id);

      const startGeneratingStage = () => {
        updateProcessingItem(item.id, { state: "generating", progressPercent: 0 });

        const request = requestByItemRef.current.get(item.id);
        if (request) {
          const abort = new AbortController();
          abortByItemRef.current.set(item.id, abort);

          const startedAt = Date.now();
          const progressTimer = window.setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const nextProgress = Math.min(95, Math.round((elapsed / 120_000) * 95));
            updateProcessingItem(item.id, { progressPercent: nextProgress });
          }, GENERATE_STAGE_PROGRESS_TICK_MS);
          trackProcessingTimer(item.id, progressTimer);

          void (async () => {
            try {
              const results = await runGenerateMediaRequest(request, abort.signal);
              if (abort.signal.aborted) return;
              completeProcessingItem(item, false, results);
            } catch {
              if (abort.signal.aborted) return;
              completeProcessingItem(item, true);
            }
          })();
          return;
        }

        const startedAt = Date.now();
        const progressTimer = window.setInterval(() => {
          const elapsed = Date.now() - startedAt;
          const nextProgress = Math.min(
            100,
            Math.round((elapsed / GENERATE_STAGE_GENERATING_MS) * 100),
          );
          updateProcessingItem(item.id, { progressPercent: nextProgress });

          if (nextProgress < 100) return;

          window.clearInterval(progressTimer);
          completeProcessingItem(item, failed);
        }, GENERATE_STAGE_PROGRESS_TICK_MS);

        trackProcessingTimer(item.id, progressTimer);
      };

      const startProcessingStage = () => {
        updateProcessingItem(item.id, { state: "processing", progressPercent: undefined });

        const toGenerating = window.setTimeout(() => {
          startGeneratingStage();
        }, GENERATE_STAGE_PROCESSING_MS);

        trackProcessingTimer(item.id, toGenerating);
      };

      const startQueuingStage = () => {
        updateProcessingItem(item.id, { state: "queuing", progressPercent: undefined });

        const toProcessing = window.setTimeout(() => {
          startProcessingStage();
        }, GENERATE_STAGE_QUEUING_MS);

        trackProcessingTimer(item.id, toProcessing);
      };

      if (hasRequest) {
        startGeneratingStage();
        return;
      }

      if (skipQueue) {
        startProcessingStage();
        return;
      }

      startQueuingStage();
    },
    [clearProcessingTimers, completeProcessingItem, trackProcessingTimer, updateProcessingItem],
  );

  const startGenerateProcessing = React.useCallback(
    (options: StartGenerateProcessingOptions) => {
      // Skip-queue toggle enabled (`skipQueue === true`) jumps straight to Processing.
      processingIdRef.current += 1;
      const id = `processing-${processingIdRef.current}`;
      const hasRequest = Boolean(options.request);
      const willFail = hasRequest ? false : processingIdRef.current % 3 === 0;
      const skipQueue = options.skipQueue ?? false;
      if (options.request) {
        requestByItemRef.current.set(id, options.request);
      }
      const nextItem: GenerateProcessingItem = {
        id,
        kind: options.kind,
        state: hasRequest ? "generating" : skipQueue ? "processing" : "queuing",
        progressPercent: 0,
        prompt: options.prompt,
        willFail,
      };
      setProcessingItems((previous) => [nextItem, ...previous]);
      runGenerateStageMachine(nextItem, { skipQueue, failed: willFail });
    },
    [runGenerateStageMachine],
  );

  const handleCancelProcessing = React.useCallback(
    (itemId: string) => {
      // Cancel removes the job and clears its timers — aborts the whole mock process.
      removeProcessingItem(itemId);
    },
    [removeProcessingItem],
  );

  const handleSkipQueuedProcessing = React.useCallback(
    (item: GenerateProcessingItem) => {
      runGenerateStageMachine(item, { skipQueue: true, failed: item.willFail ?? false });
    },
    [runGenerateStageMachine],
  );

  const handleRetryProcessing = React.useCallback(
    (item: GenerateProcessingItem, options?: { skipQueue?: boolean }) => {
      runGenerateStageMachine(item, {
        skipQueue: options?.skipQueue ?? false,
        failed: false,
      });
    },
    [runGenerateStageMachine],
  );

  const handleCopyProcessingPrompt = React.useCallback(async (item: GenerateProcessingItem) => {
    const text = item.prompt?.trim();
    if (!text || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can fail without permission; ignore in the mock flow.
    }
  }, []);

  React.useEffect(() => {
    const timersByItem = processingTimersRef.current;
    const abortByItem = abortByItemRef.current;
    const requestByItem = requestByItemRef.current;
    return () => {
      for (const itemId of timersByItem.keys()) {
        const timers = timersByItem.get(itemId);
        if (!timers) continue;
        for (const timerId of timers) {
          window.clearTimeout(timerId);
          window.clearInterval(timerId);
        }
        timersByItem.delete(itemId);
      }
      for (const abort of abortByItem.values()) {
        abort.abort();
      }
      abortByItem.clear();
      requestByItem.clear();
    };
  }, []);

  return {
    processingItems,
    sectionProcessingItems,
    startGenerateProcessing,
    handleCancelProcessing,
    handleSkipQueuedProcessing,
    handleRetryProcessing,
    handleCopyProcessingPrompt,
  };
}
