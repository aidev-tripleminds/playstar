import * as React from "react";

export const VideoCameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
          d="M2 7.79008C2 4.63008 3.05 3.58008 6.21 3.58008H12.53C15.69 3.58008 16.74 4.63008 16.74 7.79008V16.2101C16.74 19.3701 15.69 20.4201 12.53 20.4201H6.21C3.05 20.4201 2 18.3201 2 16.2101V12.1201"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M19.5202 17.1001L16.7402 15.1501V8.84013L19.5202 6.89013C20.8802 5.94013 22.0002 6.52013 22.0002 8.19013V15.8101C22.0002 17.4801 20.8802 18.0601 19.5202 17.1001Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M13 9.5C13 8.67 12.33 8 11.5 8C10.67 8 10 8.67 10 9.5C10 10.33 10.67 11 11.5 11"
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
