import * as React from "react";

export const ExploreIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
          d="M8.61016 5.85006L7.71016 6.06006C7.07016 6.21006 6.56016 6.71006 6.41016 7.36006L6.20016 8.26006C6.18016 8.36006 6.04016 8.36006 6.02016 8.26006L5.81016 7.36006C5.66016 6.72006 5.16016 6.21006 4.51016 6.06006L3.61016 5.85006C3.51016 5.83006 3.51016 5.69006 3.61016 5.67006L4.51016 5.46006C5.15016 5.31006 5.66016 4.81006 5.81016 4.16006L6.02016 3.26006C6.04016 3.16006 6.18016 3.16006 6.20016 3.26006L6.41016 4.16006C6.56016 4.80006 7.06016 5.31006 7.71016 5.46006L8.61016 5.67006C8.71016 5.69006 8.71016 5.83006 8.61016 5.85006Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeMiterlimit={10}
        />
        <path
          d="M3.68053 12.3401L2.35053 17.6601C1.62053 20.5801 3.41053 22.3901 6.35053 21.6601L16.0305 19.2401C17.4305 18.8901 18.8805 17.4501 19.2305 16.0401L21.6605 6.35011C22.3905 3.43011 20.5905 1.62011 17.6605 2.35011L12.5805 3.62011"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.0012 15.0502C13.6912 15.0502 15.0512 13.6802 15.0512 12.0002C15.0512 10.3202 13.6812 8.9502 12.0012 8.9502C10.3212 8.9502 8.95117 10.3202 8.95117 12.0002C8.95117 13.6802 10.3212 15.0502 12.0012 15.0502Z"
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
