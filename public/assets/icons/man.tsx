import * as React from "react";

export const ManIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
          d="M8.54183 17.9167C12.1087 17.9167 15.0002 15.0252 15.0002 11.4583C15.0002 7.89149 12.1087 5 8.54183 5C4.97499 5 2.0835 7.89149 2.0835 11.4583C2.0835 15.0252 4.97499 17.9167 8.54183 17.9167Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.9168 2.08331L13.3335 6.66665"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 2.08331H17.9167V7.49998"
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
