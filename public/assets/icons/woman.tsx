import * as React from "react";

export const WomanIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0)">
      <mask
        id="mask0"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <path d="M20 0H0V20H20V0Z" fill="white" />
      </mask>

      <g mask="url(#mask0)">
        <path
          d="M9.99935 13.3332C13.221 13.3332 15.8327 10.7215 15.8327 7.49984C15.8327 4.27818 13.221 1.6665 9.99935 1.6665C6.77769 1.6665 4.16602 4.27818 4.16602 7.49984C4.16602 10.7215 6.77769 13.3332 9.99935 13.3332Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 13.333V18.333"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 15.833H7.5"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>

    <defs>
      <clipPath id="clip0">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
