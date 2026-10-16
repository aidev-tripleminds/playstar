import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type AccordionProps = {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string; // ✅ extra control (important)
  style?: React.CSSProperties; // ✅ allow background injection
};

export function Accordion({
  title,
  icon,
  children,
  defaultOpen = false,
  className,
  contentClassName,
  style,
}: AccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div style={style} className={cn("rounded-[1rem] border border-transparent p-3", className)}>
      {/* Header */}
      <div
        className={cn("flex items-center gap-3", "cursor-pointer select-none")}
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* Icon */}
        {icon && <div className="shrink-0">{icon}</div>}

        {/* Title */}
        <div className="flex-1">{title}</div>

        {/* Chevron */}
        <ChevronDown
          size={26}
          className={cn("text-white transition-transform duration-300", open && "rotate-180")}
        />
      </div>

      {/* Accordion Body */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className={cn("flex flex-wrap gap-1", contentClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
