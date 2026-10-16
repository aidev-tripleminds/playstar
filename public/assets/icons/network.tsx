import type { SVGProps } from "react";

/** Figma `iconsax-distributed-network` (781:9750). Stroke, not the filled mark. */
export const NetworkIcon = ({ color = "currentColor", size = 24, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M6.45 14.2598H4C2.89543 14.2598 2 15.1552 2 16.2598V18.7098C2 19.8143 2.89543 20.7098 4 20.7098H6.45C7.55457 20.7098 8.45 19.8143 8.45 18.7098V16.2598C8.45 15.1552 7.55457 14.2598 6.45 14.2598Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M19.9998 14.2598H17.5498C16.4452 14.2598 15.5498 15.1552 15.5498 16.2598V18.7098C15.5498 19.8143 16.4452 20.7098 17.5498 20.7098H19.9998C21.1044 20.7098 21.9998 19.8143 21.9998 18.7098V16.2598C21.9998 15.1552 21.1044 14.2598 19.9998 14.2598Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M12.9002 3.29004H10.4502C9.34563 3.29004 8.4502 4.18547 8.4502 5.29004V7.74004C8.4502 8.84461 9.34563 9.74004 10.4502 9.74004H12.9002C14.0048 9.74004 14.9002 8.84461 14.9002 7.74004V5.29004C14.9002 4.18547 14.0048 3.29004 12.9002 3.29004Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M9.10047 9.74023L5.23047 14.2602"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.2598 9.74023L18.1298 14.2602"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Figma `iconsax-distributed-network` bold (812:125799). Account dropdown. */
export function NetworkFilledIcon({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.9998 14.26H19.1198L14.5298 8.90004C14.7598 8.57004 14.9098 8.17004 14.9098 7.74004V5.29004C14.9098 4.19004 14.0098 3.29004 12.9098 3.29004H10.4598C9.35977 3.29004 8.45977 4.19004 8.45977 5.29004V7.74004C8.45977 8.17004 8.59977 8.57004 8.83977 8.90004L4.24977 14.26H4.00977C2.90977 14.26 2.00977 15.16 2.00977 16.26V18.71C2.00977 19.81 2.90977 20.71 4.00977 20.71H6.45977C7.55977 20.71 8.45977 19.81 8.45977 18.71V16.26C8.45977 15.16 7.55977 14.26 6.45977 14.26H6.21977L10.1198 9.71004C10.2298 9.73004 10.3398 9.74004 10.4598 9.74004H12.9098C13.0298 9.74004 13.1398 9.72004 13.2498 9.71004L17.1798 14.3C16.2598 14.48 15.5598 15.29 15.5598 16.26V18.71C15.5598 19.81 16.4598 20.71 17.5598 20.71H20.0098C21.1098 20.71 22.0098 19.81 22.0098 18.71V16.26C22.0098 15.16 21.1098 14.26 20.0098 14.26H19.9998Z"
        fill="currentColor"
      />
    </svg>
  );
}
