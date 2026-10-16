import * as React from "react";

export const PersonaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
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
        width="24"
        height="24"
      >
        <path d="M24 0H0V24H24V0Z" fill="white" />
      </mask>

      <g mask="url(#mask0)">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M8.84998 17.53V14.58C7.52998 13.71 6.72998 12.24 6.72998 10.66C6.72998 8.05996 8.83998 5.95996 11.43 5.95996C14.17 5.95996 16.39 8.17996 16.39 10.92V11.13L17.05 12.02C17.24 12.27 17.3 12.59 17.22 12.9C17.14 13.21 16.94 13.46 16.65 13.59L15.91 13.95H15.9V14.86C15.9 15.66 15.25 16.3 14.46 16.3H13.55V17.53"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>

    <defs>
      <clipPath id="clip0">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
