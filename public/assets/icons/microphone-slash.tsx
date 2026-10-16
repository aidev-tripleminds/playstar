import * as React from "react";

export const MicrophoneSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#microphone-slash-clip)">
      <mask
        id="microphone-slash-mask"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <path d="M24 0H0V24H24V0Z" fill="white" />
      </mask>

      <g mask="url(#microphone-slash-mask)">
        <path
          d="M16 6.3V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.04 14.19C9.77 15 10.83 15.5 12 15.5C14.21 15.5 16 13.71 16 11.5V11"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.78 16.95C8.15 18.23 9.97 19 12 19C15.87 19 19 15.87 19 12V11"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.35 9.65V12C4.35 12.8 4.5 13.56 4.77 14.26"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.07 2.84L3.93 19"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 3.05C11.32 3.02 11.66 3 12 3"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 19V22"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>

    <defs>
      <clipPath id="microphone-slash-clip">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
