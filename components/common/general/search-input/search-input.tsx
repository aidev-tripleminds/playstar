"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Close } from "../close/close";

export type SearchInputProps = Omit<React.ComponentProps<typeof Input>, "className" | "type"> & {
  collapsed?: boolean;
  disableAutoFocus?: boolean;
  onClear?: () => void;
  onExpand?: () => void;
  wrapperClassName?: string;
  className?: string;
  showClose?: boolean;
};

export function SearchInput({
  collapsed = false,
  disableAutoFocus = false,
  showClose = true,
  onClear,
  onExpand,
  value,
  defaultValue,
  onChange,
  placeholder = "Search…",
  wrapperClassName,
  className,
  ...props
}: SearchInputProps) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState<string>(() =>
    typeof defaultValue === "string" ? defaultValue : "",
  );

  const [isExpanded, setIsExpanded] = React.useState(() => !collapsed);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentValue = isControlled ? value : internalValue;

  const isCollapsed = collapsed && !isExpanded;

  React.useEffect(() => {
    if (disableAutoFocus) return;

    if (!isCollapsed) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [disableAutoFocus, isCollapsed]);

  const handleExpand = () => {
    setIsExpanded(true);
    onExpand?.();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(event);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isControlled) {
      setInternalValue("");
    }

    onClear?.();

    if (collapsed) {
      setIsExpanded(false);
    }
  };

  const hasValue = typeof currentValue === "string" && currentValue.length > 0;

  return (
    <div
      className={cn(
        "relative transition-[width] duration-500 ease-in-out",
        isCollapsed ? "w-11" : "w-full",
        wrapperClassName,
      )}
    >
      <div
        onClick={() => {
          if (isCollapsed) {
            handleExpand();
          } else {
            inputRef.current?.focus();
          }
        }}
        className={cn(
          "group/search-input",
          "border-border-strong bg-tooltip-default-bg focus-within:border-border-focus",
          "inline-flex w-full items-center overflow-hidden rounded-full border",
          "h-11",
          "transition-[padding,gap] duration-500 ease-in-out",
          isCollapsed ? "justify-center p-0" : "gap-2 px-3 py-3",
        )}
      >
        <Search
          className={cn("text-text-muted-strong size-5 shrink-0 transition-all duration-300")}
        />

        <Input
          ref={inputRef}
          type="search"
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "h-auto min-w-0 border-0 bg-transparent py-0.5 pr-0 pl-0.75",
            "text-[14px]! leading-[20px]!",
            "shadow-none",
            "focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none",
            "[&::-webkit-search-cancel-button]:hidden",
            "[&::-webkit-search-decoration]:hidden",
            "transition-all delay-100 duration-500 ease-in-out",
            isCollapsed ? "pointer-events-none w-0 px-0 opacity-0" : "w-full opacity-100",
            "text-text-inverse",
            "placeholder:text-text-muted-strong",
            className,
          )}
          {...props}
        />

        {showClose && (hasValue || (collapsed && isExpanded)) && (
          <Close
            type="button"
            onClick={handleClear}
            disabled={!hasValue && !collapsed}
            size={"small"}
            className={cn(
              "flex items-center justify-center rounded-full",
              "bg-white/5 hover:bg-white/10",
              "transition-all duration-300",
              isCollapsed ? "w-0 overflow-hidden opacity-0" : "h-5 w-[21px] opacity-100",
              hasValue ? "text-text-inverse hover:text-text-inverse-hover" : "text-text-disabled",
            )}
          />
        )}
      </div>
    </div>
  );
}
