import { cn } from "@/lib/utils";

/**
 * Shared visual surface for interactive Checkbox and presentational CheckboxMark.
 * Keep interactive concerns (focus rings, hit targets, peer) out of this token set.
 */
export const checkboxAppearanceClassName = cn(
  "inline-flex shrink-0 items-center justify-center rounded-[4px] border-2 bg-transparent transition-colors",
  "border-border-control text-text-inverse",
  "data-[state=checked]:border-brand-primary data-[state=checked]:bg-brand-primary",
);
