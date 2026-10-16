import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export const AVAILABLE_FLAGS = [
  "Arabia",
  "China",
  "France",
  "Germany",
  "Italy",
  "Japan",
  "Netherlands",
  "Poland",
  "Portugal",
  "Russia",
  "South-Korea",
  "Spain",
  "United-States",
] as const;

export type FlagName = (typeof AVAILABLE_FLAGS)[number];

export type FlagProps = Omit<React.ComponentProps<"div">, "children"> & {
  flags?: FlagName[];
  size?: number;
  rounded?: boolean;
};

export function Flag({
  flags = ["United-States"],
  size = 20,
  rounded = true,
  className,
  ...props
}: FlagProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {flags.map((flag) => (
        <Image
          key={flag}
          src={`/assets/flags/${flag}.svg`}
          alt={`${flag} flag`}
          width={size}
          height={size}
          className={cn("shrink-0 object-cover", rounded && "rounded-full")}
        />
      ))}
    </div>
  );
}
