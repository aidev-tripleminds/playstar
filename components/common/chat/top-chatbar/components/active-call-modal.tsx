"use client";

import * as React from "react";

import { Avatar } from "@/components/common/chat/avatar/avatar";
import { GradientGrid } from "@/components/common/general/gradient-grid/gradient-grid";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { GetTokensModal } from "@/components/common/token-modals/get-tokens-modal";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";
import { Microphone2Icon, PhoneRedIcon } from "@/public/assets/icons";
import { MicrophoneSlashIcon } from "@/public/assets/icons/microphone-slash";

const DEFAULT_TRANSCRIPT =
  "Hey, how are you doing honey? I’ve been waiting for you all day... What are you up to? Let’s have a chat, I’m getting bored. Tell me about your day! How was it? Hey, how are you doing honey? What are you up to? Let’s have a chat, I’m getting bored. Tell me about your day! How was it? Hey, how are you doing honey?";

/** Mock connect delay so both calling + active variants can be reviewed. */
const CALLING_PHASE_MS = 5000;

/** After connect, hold listening (pink grid) before switching to speaking. */
const LISTENING_PHASE_MS = 5000;

/** After the call connects, prompt for tokens so the user can resume. */
const TOKEN_PROMPT_DELAY_MS = 15_000;

/** After dismissing Get Tokens, show the final hang-up warning. */
const END_CALL_WARNING_DELAY_MS = 5_000;

const RESUME_CALL_TOKENS_TITLE = "Get tokens to resume the call!";

/** Figma call end warning (node 13214-188546). */
const END_CALL_WARNING_TITLE = "You call will end!";
const END_CALL_WARNING_DESCRIPTION =
  "Are you sure you wan’t to hang up? If you close this modal, your call will end now.";
const END_CALL_WARNING_GET_TOKENS_LABEL = "Get tokens";
const END_CALL_WARNING_HANG_UP_LABEL = "Hang up";

const LISTENING_PROMPT = "Listening...";
const SPEAKING_PROMPT = "Speaking...";

/** Word cadence for the mock live transcript (slide-up demo). */
const TRANSCRIPT_WORD_INTERVAL_MS = 120;

export type ActiveCallVoicePhase = "listening" | "speaking";

/**
 * Live caption stack: newest text sits at the bottom; older lines slide up
 * into a top fade (transparent → opaque) as content grows.
 */
function CallTranscript({ text }: { text: string }) {
  const contentRef = React.useRef<HTMLParagraphElement>(null);
  const prevHeightRef = React.useRef(0);

  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }

    const nextHeight = el.offsetHeight;
    const delta = nextHeight - prevHeightRef.current;

    // FLIP: keep prior paint position, then ease into the new bottom-anchored layout.
    if (delta > 0 && prevHeightRef.current > 0) {
      el.style.transition = "none";
      el.style.transform = `translateY(${delta}px)`;
      // Force reflow so the browser commits the pre-slide offset before animating.
      void el.offsetHeight;
      el.style.transition = "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "translateY(0)";
    }

    prevHeightRef.current = nextHeight;
  }, [text]);

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full max-w-180 flex-col justify-end overflow-hidden",
        // Fade the top ~few lines into the dark card so scrolled-away text dissolves.
        "mask-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.35)_28%,#000_55%)]",
      )}
    >
      <p
        ref={contentRef}
        className="w-full text-xl leading-7 wrap-break-word text-[#e5e5e5] will-change-transform sm:text-2xl sm:leading-9"
      >
        {text}
      </p>
    </div>
  );
}

/** Remount with `key` per call to restart the mock stream cleanly. */
function StreamingCallTranscript({ source }: { source: string }) {
  const [liveText, setLiveText] = React.useState("");

  React.useEffect(() => {
    const tokens = source.split(/(\s+)/).filter((token) => token.length > 0);
    let index = 0;

    const intervalId = window.setInterval(() => {
      index += 1;
      setLiveText(tokens.slice(0, index).join(""));
      if (index >= tokens.length) {
        window.clearInterval(intervalId);
      }
    }, TRANSCRIPT_WORD_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [source]);

  return <CallTranscript text={liveText} />;
}

export type ActiveCallModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  avatarSrc?: string;
  frameSrc?: string;
  transcript?: string;
  /**
   * Active-call voice UI variant.
   * - `listening` — default pink GradientGrid + "Listening..."
   * - `speaking` — cyan GradientGrid + "Speaking..." (Figma 11088:77668)
   * Omit to demo both: listening first, then speaking.
   */
  voicePhase?: ActiveCallVoicePhase;
  /** Overrides the default prompt for the current voice phase. */
  promptText?: string;
  onEndCall?: () => void;
  onMuteChange?: (muted: boolean) => void;
};

function formatCallDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "contact";
}

export function ActiveCallModal({
  open = false,
  onOpenChange,
  name = "Cassy Anderson",
  avatarSrc = resolveAsset("demo_pics_profile2").image ?? "",
  frameSrc,
  transcript = DEFAULT_TRANSCRIPT,
  voicePhase: voicePhaseProp,
  promptText,
  onEndCall,
  onMuteChange,
}: ActiveCallModalProps) {
  // Controlled `voicePhase` skips the calling mock so listening/speaking can be reviewed immediately.
  const [isCalling, setIsCalling] = React.useState(() => voicePhaseProp === undefined);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isTokensModalOpen, setIsTokensModalOpen] = React.useState(false);
  const [hasDismissedTokensModal, setHasDismissedTokensModal] = React.useState(false);
  const [isEndCallWarningOpen, setIsEndCallWarningOpen] = React.useState(false);
  const [demoVoicePhase, setDemoVoicePhase] = React.useState<ActiveCallVoicePhase>("listening");
  const [callEpoch, setCallEpoch] = React.useState(0);
  const [wasOpen, setWasOpen] = React.useState(open);
  const firstName = getFirstName(name);
  const voicePhase = voicePhaseProp ?? demoVoicePhase;
  const isSpeaking = !isCalling && voicePhase === "speaking";
  const resolvedPrompt =
    promptText ?? (voicePhase === "speaking" ? SPEAKING_PROMPT : LISTENING_PROMPT);
  const gradientRadial = isSpeaking ? "var(--gradient-cyan-radial)" : "var(--gradient-pink-radial)";

  // Reset local call UI whenever a new outgoing call opens.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setIsCalling(voicePhaseProp === undefined);
      setElapsedSeconds(0);
      setIsMuted(false);
      setIsTokensModalOpen(false);
      setHasDismissedTokensModal(false);
      setIsEndCallWarningOpen(false);
      setDemoVoicePhase("listening");
      setCallEpoch((epoch) => epoch + 1);
    } else {
      setIsTokensModalOpen(false);
      setHasDismissedTokensModal(false);
      setIsEndCallWarningOpen(false);
    }
  }

  React.useEffect(() => {
    if (!open || voicePhaseProp !== undefined) {
      return;
    }

    const connectTimeoutId = window.setTimeout(() => {
      setIsCalling(false);
    }, CALLING_PHASE_MS);

    return () => {
      window.clearTimeout(connectTimeoutId);
    };
  }, [open, callEpoch, voicePhaseProp]);

  // Demo: after connect, show listening (pink) then switch to speaking (cyan).
  React.useEffect(() => {
    if (!open || isCalling || voicePhaseProp) {
      return;
    }

    const listeningTimeoutId = window.setTimeout(() => {
      setDemoVoicePhase("speaking");
    }, LISTENING_PHASE_MS);

    return () => {
      window.clearTimeout(listeningTimeoutId);
    };
  }, [open, isCalling, callEpoch, voicePhaseProp]);

  React.useEffect(() => {
    if (!open || isCalling) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [open, isCalling]);

  React.useEffect(() => {
    // Skip token/warning demo when voicePhase is pinned for review.
    if (!open || isCalling || hasDismissedTokensModal || voicePhaseProp !== undefined) {
      return;
    }

    const tokenPromptTimeoutId = window.setTimeout(() => {
      setIsTokensModalOpen(true);
    }, TOKEN_PROMPT_DELAY_MS);

    return () => {
      window.clearTimeout(tokenPromptTimeoutId);
    };
  }, [open, isCalling, callEpoch, hasDismissedTokensModal, voicePhaseProp]);

  React.useEffect(() => {
    if (
      !open ||
      isCalling ||
      isTokensModalOpen ||
      isEndCallWarningOpen ||
      !hasDismissedTokensModal ||
      voicePhaseProp !== undefined
    ) {
      return;
    }

    const warningTimeoutId = window.setTimeout(() => {
      setIsEndCallWarningOpen(true);
    }, END_CALL_WARNING_DELAY_MS);

    return () => {
      window.clearTimeout(warningTimeoutId);
    };
  }, [
    open,
    isCalling,
    isTokensModalOpen,
    isEndCallWarningOpen,
    hasDismissedTokensModal,
    callEpoch,
    voicePhaseProp,
  ]);

  function handleEndCall() {
    setIsTokensModalOpen(false);
    setIsEndCallWarningOpen(false);
    onEndCall?.();
    onOpenChange?.(false);
  }

  function handleTokensModalOpenChange(nextOpen: boolean) {
    setIsTokensModalOpen(nextOpen);
    if (!nextOpen) {
      setHasDismissedTokensModal(true);
    }
  }

  function handleGetTokensFromWarning() {
    setIsEndCallWarningOpen(false);
    setIsTokensModalOpen(true);
  }

  function handleEndCallWarningOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setIsEndCallWarningOpen(true);
      return;
    }

    // Closing the warning (X / outside) ends the call — matches Figma copy.
    handleEndCall();
  }

  function handleMuteToggle() {
    setIsMuted((prev) => {
      const next = !prev;
      onMuteChange?.(next);
      return next;
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} forceDialog>
        <DialogContent
          showCloseButton={false}
          // Figma 11088:94671 — blurred chat behind the call card (image 44, blur 30px).
          overlayClassName="bg-[#0e0e0e]/05 supports-backdrop-filter:backdrop-blur-[20px]"
          className={cn(
            "text-tooltip-text fixed inset-0 z-50 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 items-stretch justify-center overflow-hidden rounded-none border-0 bg-transparent p-0 text-left text-2xl shadow-none ring-0",
            "data-open:zoom-in-100 data-closed:zoom-out-100 sm:max-w-none sm:items-start sm:rounded-[24px]",
            "isolate font-[Onest]",
          )}
        >
          <div
            data-slot="active-call-modal"
            data-call-phase={isCalling ? "calling" : "active"}
            data-voice-phase={isCalling ? undefined : voicePhase}
            className="relative isolate flex h-full min-h-0 w-full items-stretch justify-center sm:items-start"
          >
            <DialogTitle className="sr-only">
              {isCalling ? `Calling ${firstName}` : `Active call with ${name}`}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isCalling
                ? "Outgoing call in progress."
                : "Ongoing call controls and live transcript."}
            </DialogDescription>

            {/* Mobile: full-bleed. Desktop: centered 960×800 card (Figma 11088:94671). */}
            <div
              className={cn(
                "scrollbar-hidden relative isolate z-0 flex h-full min-h-0 w-full shrink-0 flex-col items-center justify-between gap-2.5 overflow-hidden px-6 py-6",
                "pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
                "bg-tooltip-default-bg rounded-none border-0 shadow-none",
                // Figma card: 960×800, padding 84/48, gap 64, radius 64, border #262626.
                // Clamp padding/gap to viewport height so the transcript keeps room on short screens.
                // overflow-x visible on sm so the full-bleed GradientGrid can span the viewport.
                "sm:absolute sm:top-1/2 sm:left-1/2 sm:h-[min(800px,calc(100dvh-64px))] sm:w-[min(960px,calc(100%-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-[clamp(1rem,4dvh,4rem)] sm:overflow-x-visible sm:overflow-y-hidden sm:px-12 sm:py-[clamp(1.5rem,8dvh,5.25rem)]",
                "sm:border-border-strong sm:rounded-[64px] sm:border sm:shadow-[0px_6px_20px_rgba(0,0,0,0.35)]",
              )}
            >
              {/* Same desktop size on mobile (fixed 960×300); clip overflow instead of shrinking with the viewport. */}
              <GradientGrid
                className="pointer-events-none absolute top-60! left-1/2 z-0 h-[739px] w-[1460px] max-w-none -translate-x-1/2"
                radialGradient={gradientRadial}
                maxOpacity={0.05}
                minOpacity={0.25}
              />

              {/* Transcript stays above the centered avatar on mobile; grows into free space on desktop. */}
              <div
                className={cn(
                  "relative z-[1] flex min-h-0 w-full flex-col items-center overflow-hidden",
                  // Keep ~3 lines visible above the absolute avatar on short mobile viewports.
                  "max-h-[30%] min-h-18 shrink-0",
                  "sm:max-h-none sm:min-h-27 sm:flex-1 sm:shrink",
                )}
              >
                {isCalling ? (
                  // Desktop only — on mobile, Calling sits with the centered avatar (Figma 11088:94839).
                  <p className="text-cookie-bg hidden w-full shrink-0 text-center text-2xl leading-9 font-normal sm:block">
                    Calling {firstName}...
                  </p>
                ) : (
                  <StreamingCallTranscript key={callEpoch} source={transcript} />
                )}
              </div>

              {/* Mobile: Calling + avatar centered as one stack. Desktop: avatar in-flow.
                  Keep the Calling label slot (invisible when active) so the avatar
                  stays fixed when the transcript appears. */}
              <div
                className={cn(
                  "z-[2] flex shrink-0 flex-col items-center gap-16",
                  "absolute top-1/2 left-1/2 w-auto -translate-x-1/2 -translate-y-1/2",
                  "sm:relative sm:top-auto sm:left-auto sm:w-full sm:translate-x-0 sm:translate-y-0 sm:gap-0",
                )}
              >
                <p
                  className={cn(
                    "text-cookie-bg mb-20 w-full text-center text-2xl leading-8 font-medium sm:hidden",
                    !isCalling && "invisible",
                  )}
                  aria-hidden={!isCalling}
                >
                  Calling {firstName}...
                </p>
                <Avatar
                  src={avatarSrc}
                  frameSrc={frameSrc}
                  alt={name}
                  showFrame={!isCalling}
                  frameVariant={isSpeaking ? "speaking" : "listening"}
                  className={cn("w-auto sm:w-full", isCalling && "opacity-70")}
                />
              </div>

              <div className="relative z-[3] flex w-full max-w-[342px] shrink-0 flex-col items-stretch gap-6 text-center text-xl">
                {/* Keep prompt height while calling so the avatar doesn't jump. */}
                <p
                  className={cn(
                    "active-call-prompt-shimmer w-full text-lg leading-7 font-medium sm:text-xl",
                    "[background-image:linear-gradient(90deg,rgba(250,250,250,0.3)_0%,#fafafa_50%,rgba(250,250,250,0.3)_100%)]",
                    "bg-clip-text text-transparent",
                    isCalling && "invisible",
                  )}
                  aria-hidden={isCalling}
                >
                  {resolvedPrompt}
                </p>

                <div className="flex w-full items-center justify-between gap-2.5 px-6 sm:gap-2.5 sm:px-0">
                  <button
                    type="button"
                    aria-label="End call"
                    onClick={handleEndCall}
                    className={cn(
                      "border-border-focus relative box-border flex size-[72px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[136px] border p-3",
                      // Neutral 900 → 700 top-to-bottom + subtle white wash (Figma button CSS).
                      "bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.1)),linear-gradient(180deg,#171717_0%,#262626_100%)]",
                      "text-tooltip-text font-[Onest] text-xs transition-opacity hover:opacity-90",
                    )}
                  >
                    <PhoneRedIcon
                      className="text-state-error-border size-7 rotate-135"
                      aria-hidden
                    />
                  </button>

                  {/* Reserve timer width while calling so controls stay aligned. */}
                  <span
                    className={cn(
                      "text-tooltip-text relative text-xl leading-7 tabular-nums sm:text-2xl sm:leading-7",
                      isCalling && "invisible",
                    )}
                    aria-hidden={isCalling}
                  >
                    {formatCallDuration(elapsedSeconds)}
                  </span>

                  <button
                    type="button"
                    aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                    aria-pressed={isMuted}
                    onClick={handleMuteToggle}
                    className={cn(
                      "relative box-border flex size-[72px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[136px] p-3",
                      "text-tooltip-text font-[Onest] text-xs transition-opacity hover:opacity-90",
                      isMuted
                        ? "border-0 bg-[linear-gradient(180deg,#f43f5e_0%,#e11d48_20%,#be123c_100%)]"
                        : "border-border-focus border bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.1)),linear-gradient(180deg,#171717_0%,#262626_100%)]",
                    )}
                  >
                    {isMuted ? (
                      <MicrophoneSlashIcon
                        className="text-tooltip-text size-7 shrink-0"
                        aria-hidden
                      />
                    ) : (
                      <Microphone2Icon className="text-tooltip-text size-7 shrink-0" aria-hidden />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <GetTokensModal
        open={isTokensModalOpen}
        onOpenChange={handleTokensModalOpenChange}
        title={RESUME_CALL_TOKENS_TITLE}
        showUpgrade={false}
        defaultOpen={false}
      />

      <ModalLayout
        open={isEndCallWarningOpen}
        onOpenChange={handleEndCallWarningOpenChange}
        title={END_CALL_WARNING_TITLE}
        description={END_CALL_WARNING_DESCRIPTION}
        generateLabel={END_CALL_WARNING_GET_TOKENS_LABEL}
        cancelLabel={END_CALL_WARNING_HANG_UP_LABEL}
        onGenerate={handleGetTokensFromWarning}
        onCancel={handleEndCall}
        onClose={handleEndCall}
        closeLabel="Close"
        closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
        defaultOpen={false}
      />
    </>
  );
}
