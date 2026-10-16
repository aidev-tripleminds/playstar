import * as React from "react";

export function NoneIcon(props: React.SVGProps<SVGSVGElement>) {
  const gradientId = React.useId().replace(/:/g, "");

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="4" fill={`url(#${gradientId})`} />

      <defs>
        <linearGradient
          id={gradientId}
          x1="16"
          y1="0"
          x2="16"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FAFAFA" />
          <stop offset="0.2" stopColor="#E5E5E5" />
          <stop offset="1" stopColor="#D4D4D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
