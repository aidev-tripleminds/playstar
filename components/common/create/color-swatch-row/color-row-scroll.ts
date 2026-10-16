/**
 * Horizontal scroller. `overflow-y` computes to hidden beside `overflow-x: auto`,
 * which keeps this row from becoming a vertical scroller. `overscroll-x-contain`
 * only contains the horizontal axis, so a vertical pan still reaches the page.
 */
export const CREATE_AI_GF_COLOR_SWATCH_ROW_CLASS =
  "scrollbar-hidden w-full min-w-0 overflow-x-auto overflow-y-clip overscroll-x-contain";

/** Centers the swatches when they fit, and scrolls from the start when they do not. */
export const CREATE_AI_GF_COLOR_SWATCH_TRACK_CLASS =
  "mx-auto flex w-max min-w-full items-center justify-center gap-0";

/**
 * Mobile edge fade, matching the age selector: 270deg, transparent to `#0E0E0E`.
 * Desktop shows the whole row, so the fade stays off there.
 */
export const CREATE_AI_GF_COLOR_SWATCH_FADE_CLASS =
  "bg-[linear-gradient(270deg,rgba(14,14,14,0),#0e0e0e)] pointer-events-none absolute inset-y-0 z-10 w-20 md:hidden";

export const COLOR_ROW_EDGE_SLOP_PX = 48;

/** Keeps a revealed swatch off the clip edge so its border is not shaved off. */
export const COLOR_ROW_REVEAL_GUTTER_PX = 4;

export type ColorRowBox = {
  left: number;
  right: number;
};

/**
 * How far a settled horizontal scroll should move so a swatch cut off at the
 * edge the user was traveling toward is fully revealed.
 * Positive moves toward the right end of the row.
 */
export function colorRowScrollDelta({
  scrollLeft,
  clientWidth,
  scrollWidth,
  direction,
  rowLeft,
  rowRight,
  children,
  edgeSlop = COLOR_ROW_EDGE_SLOP_PX,
}: {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
  direction: 1 | -1;
  rowLeft: number;
  rowRight: number;
  children: readonly ColorRowBox[];
  edgeSlop?: number;
}): number {
  const max = scrollWidth - clientWidth;
  if (max <= 1) {
    return 0;
  }

  const clamp = (delta: number) => {
    const next = Math.min(max, Math.max(0, scrollLeft + delta));
    const applied = next - scrollLeft;
    return Math.abs(applied) <= 1 ? 0 : applied;
  };

  if (direction > 0 && max - scrollLeft <= edgeSlop) {
    return clamp(max - scrollLeft);
  }

  if (direction < 0 && scrollLeft <= edgeSlop) {
    return clamp(-scrollLeft);
  }

  if (direction > 0) {
    const partial = children.find(
      (child) => child.left < rowRight - 1 && child.right > rowRight + 1,
    );
    if (!partial) {
      return 0;
    }
    return clamp(partial.right - rowRight);
  }

  const partial = [...children]
    .reverse()
    .find((child) => child.right > rowLeft + 1 && child.left < rowLeft - 1);
  if (!partial) {
    return 0;
  }
  return clamp(partial.left - rowLeft);
}

/** Scroll delta that places `child` fully inside the row. Zero when it already fits. */
export function colorRowRevealDelta({
  scrollLeft,
  clientWidth,
  scrollWidth,
  rowLeft,
  rowRight,
  child,
}: {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
  rowLeft: number;
  rowRight: number;
  child: ColorRowBox;
}): number {
  const max = Math.max(0, scrollWidth - clientWidth);
  const rightOverflow = child.right - rowRight;
  const leftOverflow = rowLeft - child.left;
  let delta = 0;

  if (rightOverflow > 1 && leftOverflow > 1) {
    const childWidth = child.right - child.left;
    const rowWidth = rowRight - rowLeft;
    delta = child.left + childWidth / 2 - (rowLeft + rowWidth / 2);
  } else if (rightOverflow > 1) {
    delta = rightOverflow + COLOR_ROW_REVEAL_GUTTER_PX;
  } else if (leftOverflow > 1) {
    delta = -(leftOverflow + COLOR_ROW_REVEAL_GUTTER_PX);
  }

  const next = Math.min(max, Math.max(0, scrollLeft + delta));
  const applied = next - scrollLeft;
  return Math.abs(applied) <= 1 ? 0 : applied;
}
