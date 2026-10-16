import * as React from "react";

import { cn } from "@/lib/utils";

export type HandleProps = React.ComponentProps<"div">;

export function Handle({ className, ...props }: HandleProps) {
  return (
    <div
      data-slot="handle"
      className={cn("bg-handle-bg h-[3px] w-[35px] rounded-[50px]", className)}
      {...props}
    />
  );
}
