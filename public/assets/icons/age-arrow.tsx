import type { SVGProps } from "react";

export const AgeArrowIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="19"
      height="15"
      viewBox="0 0 19 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.49123 12.7217L1.37658 4.16261C0.430901 2.83889 1.37713 1 3.00395 1H15.2312C16.8579 1 17.8041 2.83859 16.8588 4.16234L10.7462 12.7214C9.94862 13.8382 8.28896 13.8383 7.49123 12.7217Z"
        fill="#F6339A"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
