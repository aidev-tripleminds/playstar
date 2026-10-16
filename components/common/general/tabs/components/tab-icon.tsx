import { CircleHelp } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as React from "react";

import type { Tab } from "../tabs.types";

function isStaticImageData(value: unknown): value is StaticImageData {
  return (
    typeof value === "object" &&
    value !== null &&
    "src" in value &&
    "height" in value &&
    "width" in value
  );
}

export function TabIcon({ tab }: { tab: Tab }) {
  const icon = tab.leftIconSrc;

  if (!icon) {
    return <CircleHelp className="z-0 size-5 shrink-0 text-current" />;
  }

  if (React.isValidElement(icon)) {
    return (
      <span
        aria-hidden
        className="relative z-1 inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-5"
      >
        {icon}
      </span>
    );
  }

  if (typeof icon === "string" || isStaticImageData(icon)) {
    return (
      <Image
        src={icon}
        alt=""
        aria-hidden
        width={20}
        height={20}
        className="relative z-1 size-5 shrink-0 object-contain"
      />
    );
  }

  return <CircleHelp className="z-0 size-5 shrink-0 text-current" />;
}
