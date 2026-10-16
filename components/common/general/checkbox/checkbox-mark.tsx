import * as React from "react";

import { cn } from "@/lib/utils";
import { TickOnlyIcon } from "@/public/assets/icons/tick-only";

import { checkboxAppearanceClassName } from "./checkbox-appearance";

export type CheckboxMarkProps = Omit<React.ComponentProps<"span">, "children"> & {
  checked?: boolean;
};

/**
 * Presentational checkbox chrome for use inside buttons/links/tabs.
 * Renders a non-interactive <span> so it never nests a <button> in a <button>.
 */
export function CheckboxMark({ checked = false, className, ...props }: CheckboxMarkProps) {
  return (
    <span
      aria-hidden
      data-slot="checkbox-mark"
      data-state={checked ? "checked" : "unchecked"}
      className={cn(checkboxAppearanceClassName, "size-4", className)}
      {...props}
    >
      {checked ? <TickOnlyIcon className="size-3" /> : null}
    </span>
  );
}
