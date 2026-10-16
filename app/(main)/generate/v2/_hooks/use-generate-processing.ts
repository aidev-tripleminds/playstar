import * as React from "react";

import { showToast } from "@/components/common/general/toast/toast";
import { useInvalidateMe } from "@/hooks/use-me";
import { isForbiddenError } from "@/lib/api/client";

import {
  type GeneratedMediaItem,
  type GenerateMediaRequest,
  runGenerateMediaRequest,
} from "../../_lib/generate-media";
import {
  filterGenerateProcessingBySection,
  GENERATE_STAGE_PROCESSING_MS,
  GENERATE_STAGE_PROGRESS_TICK_MS,
  GENERATE_STAGE_QUEUING_MS,
  GENERATE_STAGE_RESULT_HOLD_MS,
  GENERATE_TOKEN_COST_AMOUNT,
} from "../_lib/constants";
import { backendFailureMessage } from "../_lib/generate-card-failure";
import type {
  GenerateCreatePayload,
  GenerateProcessingItem,
  GenerateSectionTabId,
} from "../_lib/types";

type UseGenerateProcessingOptions = {
  sectionTabId: GenerateSectionTabId;
  onComplete: (payload: GenerateCreatePayload, results?: GeneratedMediaItem[]) => void;
  /** edit-image 403 for free users — open the upgrade flow instead of a moderation card. */
  onPremiumRequired?: () => void;
};

type PromoteNextOptions = {
  /** When true, honor `payload.skipQueue`. Later jobs skip Queue — they already waited. */
  respectSkipQueue?: boolean;
};

function withSingleImageRequest(
  request: GenerateMediaRequest | undefined,
): GenerateMediaRequest | undefined {
  if (!request) return undefined;
  if (request.type === "create-image") {
    return {
      ...request,
      body: { ...request.body, num_images: 1 },
    };
  }
  if (request.type === "edit-image") {
    return {
      ...request,
      body: { ...request.body, num_images: 1 },
    };
  }
  return request;
}

function toSingleGenerationPayload(payload: GenerateCreatePayload): GenerateCreatePayload {
  const request = withSingleImageRequest(payload.request);
  return {
    ...payload,
    count: 1,
    ...(request ? { request } : {}),
  };
}

const GENERATE_COPY_PROMPT_TOAST = "Prompt copied!";

export function useGenerateProcessing({
  sectionTabId,
  onComplete,
  onPremiumRequired,
}: UseGenerateProcessingOptions) {
  const invalidateMe = useInvalidateMe();
  const [processingItems, setProcessingItems] = React.useState<GenerateProcessingItem[]>([]);
  const processingIdRef = React.useRef(0);
  const processingTimersRef = React.useRef<Map<string, number[]>>(new Map());
  const requestByItemRef = React.useRef<Map<string, GenerateMediaRequest>>(new Map());
  const abortByItemRef = React.useRef<Map<string, AbortController>>(new Map());
  const itemsByIdRef = React.useRef<Map<string, GenerateProcessingItem>>(new Map());
  const waitingIdsRef = React.useRef<string[]>([]);
  const activeItemIdRef = React.useRef<string | null>(null);
  const promoteNextRef = React.useRef<(options?: PromoteNextOptions) => void>(() => {});

  const sectionProcessingItems = React.useMemo(
    () => filterGenerateProcessingBySection(processingItems, sectionTabId),
    [processingItems, sectionTabId],
  );
  const reservedTokenCost = React.useMemo(() => {
    const reservedCount = processingItems.filter(
      (item) => item.state !== "moderation-issue",
    ).length;
    return reservedCount * GENERATE_TOKEN_COST_AMOUNT;
  }, [processingItems]);

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
      const current = itemsByIdRef.current.get(itemId);
      if (current) {
        itemsByIdRef.current.set(itemId, { ...current, ...patch });
      }
      setProcessingItems((previous) =>
        previous.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const forgetProcessingItem = React.useCallback((itemId: string) => {
    itemsByIdRef.current.delete(itemId);
    waitingIdsRef.current = waitingIdsRef.current.filter((id) => id !== itemId);
  }, []);

  const removeProcessingItem = React.useCallback(
    (itemId: string) => {
      abortProcessingItem(itemId);
      requestByItemRef.current.delete(itemId);
      clearProcessingTimers(itemId);
      forgetProcessingItem(itemId);
      setProcessingItems((previous) => previous.filter((item) => item.id !== itemId));
    },
    [abortProcessingItem, clearProcessingTimers, forgetProcessingItem],
  );

  const completeProcessingItem = React.useCallback(
    (
      item: GenerateProcessingItem,
      failed: boolean,
      results?: GeneratedMediaItem[],
      failure?: string,
    ) => {
      abortProcessingItem(item.id);
      clearProcessingTimers(item.id);

      const isActive = activeItemIdRef.current === item.id;
      if (isActive) {
        activeItemIdRef.current = null;
      }

      if (failed) {
        updateProcessingItem(item.id, {
          state: "moderation-issue",
          progressPercent: undefined,
          failure,
          createdAt: new Date().toISOString(),
        });
        if (isActive) {
          promoteNextRef.current();
        }
        return;
      }

      requestByItemRef.current.delete(item.id);
      forgetProcessingItem(item.id);
      onComplete(item.payload, results);
      setProcessingItems((previous) => previous.filter((entry) => entry.id !== item.id));
      if (isActive) {
        promoteNextRef.current();
      }
    },
    [
      abortProcessingItem,
      clearProcessingTimers,
      forgetProcessingItem,
      onComplete,
      updateProcessingItem,
    ],
  );

  const runGenerateStageMachine = React.useCallback(
    (item: GenerateProcessingItem, options?: { skipQueue?: boolean; failed?: boolean }) => {
      const failed = options?.failed ?? item.willFail ?? false;
      // Only the promptbox skip toggle / card Skip CTA may jump past Queue.
      // Otherwise always: Queue → Processing → Generating (1–100%) → Result.
      const skipQueue = options?.skipQueue ?? false;

      clearProcessingTimers(item.id);

      const startGeneratingStage = () => {
        let progress = 1;
        updateProcessingItem(item.id, { state: "generating", progressPercent: progress });

        const request = requestByItemRef.current.get(item.id);
        let requestSettled = !request;
        let requestFailed = failed;
        let requestResults: GeneratedMediaItem[] | undefined;

        if (request) {
          const abort = new AbortController();
          abortByItemRef.current.set(item.id, abort);
          requestSettled = false;
          requestFailed = false;

          void (async () => {
            try {
              const results = await runGenerateMediaRequest(request, abort.signal);
              if (abort.signal.aborted) return;
              requestResults = results;
              requestSettled = true;
              // Coins debit when the job actually finishes — refresh the header.
              invalidateMe();
            } catch (error) {
              if (abort.signal.aborted) return;
              requestFailed = true;
              requestSettled = true;
              invalidateMe();
              if (
                isForbiddenError(error) &&
                (request.type === "edit-image" ||
                  request.type === "edit-video" ||
                  request.type === "extend-video")
              ) {
                onPremiumRequired?.();
                abortProcessingItem(item.id);
                clearProcessingTimers(item.id);
                requestByItemRef.current.delete(item.id);
                forgetProcessingItem(item.id);
                setProcessingItems((previous) => previous.filter((entry) => entry.id !== item.id));
                if (activeItemIdRef.current === item.id) {
                  activeItemIdRef.current = null;
                  promoteNextRef.current();
                }
                return;
              }
              completeProcessingItem(item, true, undefined, backendFailureMessage(error));
            }
          })();
        }

        const progressTimer = window.setInterval(() => {
          progress = Math.min(100, progress + 1);
          updateProcessingItem(item.id, { progressPercent: progress });

          if (progress < 100 || !requestSettled) return;
          // Real request errors already complete in the catch above.
          if (request && requestFailed) return;

          window.clearInterval(progressTimer);
          const doneTimer = window.setTimeout(() => {
            completeProcessingItem(item, request ? false : failed, requestResults);
          }, GENERATE_STAGE_RESULT_HOLD_MS);
          trackProcessingTimer(item.id, doneTimer);
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

      if (skipQueue) {
        startProcessingStage();
        return;
      }

      startQueuingStage();
    },
    [
      abortProcessingItem,
      clearProcessingTimers,
      completeProcessingItem,
      forgetProcessingItem,
      invalidateMe,
      onPremiumRequired,
      trackProcessingTimer,
      updateProcessingItem,
    ],
  );

  const promoteNext = React.useCallback(
    (options?: PromoteNextOptions) => {
      while (waitingIdsRef.current.length > 0) {
        const nextId = waitingIdsRef.current.shift();
        if (!nextId) break;
        const item = itemsByIdRef.current.get(nextId);
        if (!item) continue;

        activeItemIdRef.current = nextId;
        const skipQueue = options?.respectSkipQueue ? (item.payload.skipQueue ?? false) : true;
        updateProcessingItem(nextId, { waitingForTurn: false });
        runGenerateStageMachine(
          { ...item, waitingForTurn: false },
          { skipQueue, failed: item.willFail },
        );
        return;
      }

      activeItemIdRef.current = null;
    },
    [runGenerateStageMachine, updateProcessingItem],
  );

  React.useEffect(() => {
    promoteNextRef.current = promoteNext;
  }, [promoteNext]);

  const startGenerateProcessing = React.useCallback(
    (payload: GenerateCreatePayload) => {
      const count = Math.max(1, payload.count);
      const skipQueue = payload.skipQueue ?? false;
      const hasRequest = Boolean(payload.request);
      const queueWasIdle = activeItemIdRef.current === null && waitingIdsRef.current.length === 0;
      const created: GenerateProcessingItem[] = [];
      const createdAt = new Date().toISOString();

      for (let index = 0; index < count; index += 1) {
        processingIdRef.current += 1;
        const id = `processing-${processingIdRef.current}`;
        const itemPayload = toSingleGenerationPayload(payload);
        if (itemPayload.request) {
          requestByItemRef.current.set(id, itemPayload.request);
        }
        const nextItem: GenerateProcessingItem = {
          id,
          kind: payload.kind,
          state: "queuing",
          willFail: hasRequest ? false : processingIdRef.current % 3 === 0,
          prompt: payload.prompt,
          waitingForTurn: true,
          payload: skipQueue ? { ...itemPayload, skipQueue: true } : itemPayload,
          createdAt,
        };
        itemsByIdRef.current.set(id, nextItem);
        waitingIdsRef.current.push(id);
        created.push(nextItem);
      }

      setProcessingItems((previous) => [...created, ...previous]);
      if (queueWasIdle) {
        promoteNext({ respectSkipQueue: true });
      }
    },
    [promoteNext],
  );

  const handleCancelProcessing = React.useCallback(
    (itemId: string) => {
      const wasActive = activeItemIdRef.current === itemId;
      if (wasActive) {
        activeItemIdRef.current = null;
      }
      removeProcessingItem(itemId);
      if (wasActive) {
        promoteNext();
      }
    },
    [promoteNext, removeProcessingItem],
  );

  const handleSkipQueuedProcessing = React.useCallback(
    (item: GenerateProcessingItem) => {
      if (item.waitingForTurn) {
        waitingIdsRef.current = waitingIdsRef.current.filter((id) => id !== item.id);
        updateProcessingItem(item.id, { waitingForTurn: false });
      }
      runGenerateStageMachine(item, { skipQueue: true, failed: item.willFail ?? false });
    },
    [runGenerateStageMachine, updateProcessingItem],
  );

  const handleRetryProcessing = React.useCallback(
    (item: GenerateProcessingItem, options?: { skipQueue?: boolean }) => {
      const skipQueue = options?.skipQueue ?? false;

      if (skipQueue) {
        waitingIdsRef.current = waitingIdsRef.current.filter((id) => id !== item.id);
        runGenerateStageMachine(item, { skipQueue: true, failed: false });
        return;
      }

      if (!waitingIdsRef.current.includes(item.id)) {
        waitingIdsRef.current.push(item.id);
      }
      updateProcessingItem(item.id, {
        waitingForTurn: true,
        state: "queuing",
        willFail: false,
        progressPercent: undefined,
        failure: undefined,
      });

      if (activeItemIdRef.current === null) {
        promoteNext();
      }
    },
    [promoteNext, runGenerateStageMachine, updateProcessingItem],
  );

  const handleCopyProcessingPrompt = React.useCallback(async (item: GenerateProcessingItem) => {
    const text = item.prompt?.trim();
    if (!text || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast({ type: "success", text: GENERATE_COPY_PROMPT_TOAST });
    } catch {
      // Clipboard can fail without permission; leave the card as it is.
    }
  }, []);

  React.useEffect(() => {
    const timersByItem = processingTimersRef.current;
    const abortByItem = abortByItemRef.current;
    const requestByItem = requestByItemRef.current;
    const itemsById = itemsByIdRef.current;
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
      itemsById.clear();
      waitingIdsRef.current = [];
      activeItemIdRef.current = null;
    };
  }, []);

  return {
    processingItems,
    sectionProcessingItems,
    reservedTokenCost,
    startGenerateProcessing,
    handleCancelProcessing,
    handleSkipQueuedProcessing,
    handleRetryProcessing,
    handleCopyProcessingPrompt,
  };
}
