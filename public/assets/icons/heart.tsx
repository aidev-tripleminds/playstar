type HeartIconProps = React.SVGProps<SVGSVGElement> & {
  filled?: boolean;
  fillColor?: string;
  strokeColor?: string;
};

export function HeartIcon({
  filled = false,
  fillColor = "#FAFAFA",
  strokeColor = "#FAFAFA",
  ...props
}: HeartIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 5.01035C12.77 4.11035 14.09 3.11035 16.11 3.11035C19.64 3.11035 22 6.42035 22 9.50035C22 15.9504 12 20.8803 12 20.8803C12 20.8803 2 15.9404 2 9.50035C2 6.42035 4.37 3.11035 7.89 3.11035C9.91 3.11035 11.23 4.12035 12 5.01035Z"
        fill={filled ? fillColor : "none"}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
