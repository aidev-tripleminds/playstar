import Image from "next/image";

import { cn } from "@/lib/utils";

export function VerifiedIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block size-5 shrink-0 md:size-6", className)}>
      <Image src="/assets/verified-badge.svg" alt="" fill className="object-contain" />
    </span>
  );
}
