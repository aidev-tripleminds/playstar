"use client";

import "./selectors-audio.css";

import Image from "next/image";
import * as React from "react";

import { useSimpleAudioPlayback } from "@/hooks/use-simple-audio-playback";
import { cn } from "@/lib/utils";
import MagicIcon from "@/public/assets/icons/magin-pen";

/** Fake bar heights. Playback animates these; they are not read from the file. */
const SELECTOR_AUDIO_BAR_HEIGHTS = [
  8, 14, 22, 10, 28, 16, 12, 24, 18, 9, 20, 13, 26, 11, 17, 23, 8, 19, 15, 27, 12, 21, 9, 16, 25,
  14, 10, 22, 18, 8, 24, 13, 19, 11, 28, 15, 9, 21, 17, 12,
] as const;

/** Slow crawl so a clipped label stays readable. */
export const SELECTOR_LABEL_SCROLL_PX_PER_SECOND = 40;
/** Pause at each end of a clipped label so it can be read before scrolling on. */
export const SELECTOR_LABEL_SCROLL_END_HOLD_MS = 2000;

const DESKTOP_HOVER_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function SelectorMarqueeText({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = React.useState(0);

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const probe = measureRef.current;
    if (!container || !probe) {
      return;
    }

    const overflow = probe.scrollWidth - container.clientWidth;
    const next = overflow > 1 ? Math.ceil(overflow) : 0;
    setDistance((current) => (current === next ? current : next));
  }, []);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, text]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  const animating = active && distance > 0;

  React.useEffect(() => {
    const node = textRef.current;
    if (!node || !animating || typeof node.animate !== "function") {
      return;
    }

    const scrollMs = (distance / SELECTOR_LABEL_SCROLL_PX_PER_SECOND) * 1000;
    const holdMs = SELECTOR_LABEL_SCROLL_END_HOLD_MS;
    // Out, hold, back, hold. The first and last frames match so the loop
    // scrolls home instead of snapping the start of the label back into view.
    const duration = scrollMs * 2 + holdMs * 2;
    const shift = `translateX(-${distance}px)`;
    const rest = "translateX(0px)";
    const animation = node.animate(
      [
        { transform: rest, offset: 0 },
        { transform: shift, offset: scrollMs / duration },
        { transform: shift, offset: (scrollMs + holdMs) / duration },
        { transform: rest, offset: (scrollMs * 2 + holdMs) / duration },
        { transform: rest, offset: 1 },
      ],
      { duration, easing: "linear", iterations: Infinity },
    );

    return () => animation.cancel();
  }, [animating, distance]);

  return (
    <span
      ref={containerRef}
      className={cn("relative block max-w-full min-w-0 overflow-hidden text-left", className)}
    >
      <span
        ref={measureRef}
        className="pointer-events-none absolute top-0 left-0 w-max whitespace-nowrap opacity-0"
        aria-hidden
      >
        {text}
      </span>
      <span
        ref={textRef}
        data-marquee={animating ? "running" : "idle"}
        className={cn("block whitespace-nowrap", animating ? "w-max" : "truncate")}
      >
        {text}
      </span>
    </span>
  );
}

export type SelectorStatus = "selected" | "unselected";
export type SelectorType =
  | "icon"
  | "modal"
  | "autofill"
  | "edit"
  | "no-picture"
  | "custom"
  | "dropdown"
  | "audio";

export type SelectorsProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  status?: SelectorStatus;
  defaultStatus?: SelectorStatus;
  type?: SelectorType;
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  expanded?: boolean;
  /**
   * FRONT-891 audio variation. When set, the play control plays this clip and
   * the spectrum animates for the duration. A fake waveform — the bars are not
   * decoded from the file.
   */
  audioSrc?: string;
  /** Visual playback state. Set this to drive the spectrum without a clip. */
  playing?: boolean;
  onPlayClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  playLabel?: string;
  pauseLabel?: string;
  /**
   * Scroll a clipped label on desktop hover, and while selected (including touch).
   * Modal chips (occupation, hobby, fetish, personality, relationship) do this by
   * default. Bio, physical details, and the other rows stay ellipsized.
   */
  scrollClippedLabel?: boolean;
  /** Trailing note, rendered in Neutral 400 (`text-divider-label`). */
  titleNote?: string;
  onStatusChange?: (nextStatus: SelectorStatus) => void;
};

function AudioSelector({
  isSelected,
  title,
  subtitle,
  audioSrc,
  playing,
  onPlayClick,
  playLabel,
  pauseLabel,
  revealLabel,
  className,
  ariaLabel,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  isSelected: boolean;
  title: string;
  subtitle: string;
  audioSrc?: string;
  playing?: boolean;
  onPlayClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  playLabel: string;
  pauseLabel: string;
  /** Scroll the voice name when it is clipped, same as an occupation chip. */
  revealLabel: boolean;
  className?: string;
  ariaLabel?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const playback = useSimpleAudioPlayback({ src: audioSrc });
  const isPlaying = playing ?? playback.isPlaying;
  const playEnabled = Boolean(audioSrc) || playing !== undefined || onPlayClick !== undefined;

  return (
    <div
      data-slot="selector"
      data-type="audio"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "inline-flex max-w-full min-w-0",
        isSelected
          ? "rounded-[18px] bg-[image:var(--gradient-rose)] p-[2px]"
          : "rounded-[17px] bg-[image:var(--card-border)] p-px",
        className,
      )}
    >
      <span
        data-slot="selector-audio-face"
        className={cn(
          "inline-flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-[16px] p-4",
          isSelected && "border-dialog-bg border-2",
        )}
      >
        <button
          type="button"
          aria-pressed={isSelected}
          aria-label={ariaLabel}
          onClick={onClick}
          style={{ flex: "0 1 auto" }}
          className="flex max-w-full min-w-[70px] cursor-pointer flex-col overflow-hidden border-0 bg-transparent p-0 text-left"
        >
          <span className="text-divider-label truncate text-[12px] leading-4 font-medium">
            {title}
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <span
              data-slot="selector-audio-dot"
              className="selector-audio-dot size-1.5 shrink-0 rounded-full bg-[#fb2c84] shadow-[0_0_4px_1px_rgba(251,44,132,0.8)]"
              aria-hidden
            />
            <SelectorMarqueeText
              text={subtitle}
              active={revealLabel}
              className="text-tooltip-text min-w-0 flex-1 text-[14px] leading-5 font-medium"
            />
          </span>
        </button>

        <span
          data-slot="selector-audio-spectrum"
          data-playing={isPlaying ? "true" : "false"}
          style={{ flex: "1 1000 20px" }}
          className="hidden h-8 min-w-5 items-center gap-0.5 overflow-hidden py-1 md:flex"
          aria-hidden
        >
          {SELECTOR_AUDIO_BAR_HEIGHTS.map((height, index) => (
            <span
              key={index}
              data-slot="selector-audio-bar"
              className="w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,#f5f5f5,#e5e5e5)]"
              style={{
                height: `${height}px`,
                ["--selector-audio-bar-delay" as string]: `${(index % 8) * 90}ms`,
              }}
            />
          ))}
        </span>

        <button
          type="button"
          data-slot="selector-audio-play"
          aria-label={isPlaying ? pauseLabel : playLabel}
          aria-pressed={isPlaying}
          disabled={!playEnabled || playback.isLoading}
          onClick={(event) => {
            event.stopPropagation();
            onPlayClick?.(event);
            if (playing !== undefined) {
              return;
            }
            if (audioSrc) {
              playback.togglePlayPause();
            }
          }}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[image:var(--gradient-rose)] p-2.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Image
            src={isPlaying ? "/assets/pause.svg" : "/assets/play.svg"}
            alt=""
            width={16}
            height={16}
            className="size-4 object-contain"
          />
        </button>
      </span>
    </div>
  );
}

export function Selectors({
  status,
  defaultStatus = "unselected",
  type = "icon",
  title = "Lorem",
  subtitle = "Lorem",
  rightSlot,
  expanded = false,
  scrollClippedLabel,
  titleNote,
  audioSrc,
  playing,
  onPlayClick,
  playLabel = "Play audio",
  pauseLabel = "Pause audio",
  className,
  onStatusChange,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: SelectorsProps) {
  const [internalStatus, setInternalStatus] = React.useState<SelectorStatus>(defaultStatus);
  const [hovered, setHovered] = React.useState(false);
  const canHover = useMediaQuery(DESKTOP_HOVER_QUERY);
  const reduceMotion = useMediaQuery(REDUCE_MOTION_QUERY);
  const currentStatus = status ?? internalStatus;
  const isSelected = currentStatus === "selected";

  if (type === "audio") {
    // Same reveal as a clipped occupation chip: desktop hover, and while
    // selected. Touch does not keep a hover scroll after the pointer leaves.
    const revealLabel =
      (scrollClippedLabel ?? true) && !reduceMotion && (isSelected || (canHover && hovered));
    return (
      <AudioSelector
        isSelected={isSelected}
        title={title}
        subtitle={subtitle}
        audioSrc={audioSrc}
        playing={playing}
        onPlayClick={onPlayClick}
        playLabel={playLabel}
        pauseLabel={pauseLabel}
        revealLabel={revealLabel}
        className={className}
        ariaLabel={props["aria-label"]}
        onMouseEnter={(event) => {
          // The shell is a div; the public handler is typed for the button variants.
          onMouseEnter?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
          setHovered(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
          setHovered(false);
        }}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }
          const nextStatus: SelectorStatus = isSelected ? "unselected" : "selected";
          if (status === undefined) {
            setInternalStatus(nextStatus);
          }
          onStatusChange?.(nextStatus);
        }}
      />
    );
  }

  // Icon and edit rows stay on the neutral border; the rose ring is for the other variants.
  const showsSelectionBorder = isSelected && type !== "icon" && type !== "edit";
  const isCompact = type === "modal" || type === "custom" || type === "dropdown";
  const isTwoLine = type !== "modal" && type !== "custom" && type !== "dropdown";
  const secondaryBright = isSelected || type === "icon";
  const scrollsClippedLabel = scrollClippedLabel ?? type === "modal";
  // FRONT-881: the advanced-settings row keeps its padding and drops the chip fill.
  const isBorderless = type === "dropdown";
  // Desktop reveals a clipped label on hover or selection. Touch only reveals
  // the selected chip, so a tap does not leave a stuck hover scroll.
  const revealLabel = scrollsClippedLabel && !reduceMotion && (isSelected || (canHover && hovered));
  // FRONT-860: the caption above a value is 12px. The value, and a chip that
  // only has one line, is 14px.
  const titleClassName = cn(
    "font-normal",
    isCompact
      ? "text-[14px] leading-5 text-tooltip-text"
      : "text-[12px] leading-4 text-divider-label",
  );
  const subtitleClassName = cn(
    "text-[14px] leading-5",
    secondaryBright ? "text-tooltip-text font-medium" : "text-handle-bg font-normal",
  );

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={props["aria-label"]}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        setHovered(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setHovered(false);
      }}
      onClick={(event) => {
        onClick?.(event);
        const nextStatus: SelectorStatus = isSelected ? "unselected" : "selected";
        if (status === undefined) {
          setInternalStatus(nextStatus);
        }
        onStatusChange?.(nextStatus);
      }}
      className={cn(
        "inline-flex cursor-pointer",
        // Let a grid track shrink this chip so a long label clips inside it
        // and the hover scroll can measure the overflow.
        scrollsClippedLabel && "max-w-full min-w-0",
        // Face radius is 16px. Unselected stroke is 1px of --card-border
        // (white 0% → 10%). The selected ring stays 2px outside that face.
        // The dropdown row is only the label and chevron, so it has neither.
        isBorderless
          ? "bg-transparent"
          : showsSelectionBorder
            ? "rounded-[18px] bg-[image:var(--gradient-rose)] p-[2px]"
            : "rounded-[17px] bg-[image:var(--card-border)] p-px",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-flex w-full",
          isBorderless ? "bg-transparent" : "bg-[image:var(--background-neutral-gradient)]",
          showsSelectionBorder && "border-dialog-bg border-2",
          isCompact ? "gap-2 rounded-[16px] px-4 py-3" : "rounded-[16px] p-4",
          type === "custom" && "justify-center",
          type === "edit" ? "items-start justify-between px-5 py-4" : "items-center",
          type === "autofill" && "justify-between px-5 py-4",
          type === "dropdown" && "justify-between px-5 py-4",
          (type === "icon" || type === "modal") && "justify-between",
        )}
      >
        <span
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            type === "custom" && "items-center",
            isCompact && "min-w-[104px]",
            type === "autofill" && "min-w-0",
            type === "modal" && "min-w-0",
            type === "edit" && "min-w-0",
            type === "no-picture" && "min-w-0",
            type === "custom" && "min-w-0",
            type === "icon" && "min-w-0",
            scrollsClippedLabel && "overflow-hidden",
          )}
        >
          {scrollsClippedLabel ? (
            <SelectorMarqueeText text={title} active={revealLabel} className={titleClassName} />
          ) : (
            <span className={cn("truncate text-left", titleClassName)}>
              {title}
              {titleNote ? (
                <>
                  {" "}
                  <span className="text-divider-label">{titleNote}</span>
                </>
              ) : null}
            </span>
          )}
          {isTwoLine ? (
            scrollsClippedLabel ? (
              <SelectorMarqueeText
                text={subtitle}
                active={revealLabel}
                className={subtitleClassName}
              />
            ) : (
              <span className={cn("truncate text-left", subtitleClassName)}>{subtitle}</span>
            )
          ) : null}
        </span>

        {type === "icon" || type === "modal"
          ? (rightSlot ?? (
              <span className="relative inline-block h-[2em] w-[2em] shrink-0">
                <Image src="/assets/spice-coin.png" alt="" fill className="object-contain" />
              </span>
            ))
          : null}

        {type === "edit" ? (
          <span className="cursor-pointer">
            <Image src={"/assets/edit-lite.svg"} alt="" height={20} width={20} />
          </span>
        ) : null}

        {type === "dropdown" ? (
          <span className="cursor-pointer">
            <Image
              src={"/assets/chevron-down.svg"}
              alt=""
              height={20}
              width={20}
              className={cn(
                "transition-transform duration-300 ease-in-out",
                expanded && "rotate-180",
              )}
            />
          </span>
        ) : null}

        {type === "autofill" ? (
          <span
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
              isSelected ? "bg-[image:var(--gradient-rose)]" : "bg-surface-strong",
            )}
            aria-hidden
          >
            <MagicIcon disabled={!isSelected} />
          </span>
        ) : null}
      </span>
    </button>
  );
}
