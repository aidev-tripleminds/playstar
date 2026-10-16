const CROWN_FILLED_PATH =
  "M12.0009 5.00098C11.8087 5.00092 11.6197 5.05011 11.4519 5.14386C11.2841 5.2376 11.1431 5.37277 11.0424 5.53648L8.25089 12L3.97889 7.52698C3.79659 7.41099 3.58475 7.34996 3.36869 7.35117C3.15263 7.35239 2.94149 7.41579 2.7605 7.53381C2.57951 7.65183 2.43634 7.81947 2.3481 8.0167C2.25986 8.21392 2.23028 8.43239 2.26289 8.64598L3.70139 18.0435C3.74194 18.3095 3.87654 18.5523 4.08075 18.7276C4.28496 18.9029 4.54525 18.9992 4.81439 18.999H19.1874C19.4565 18.9992 19.7168 18.9029 19.921 18.7276C20.1252 18.5523 20.2598 18.3095 20.3004 18.0435L21.7404 8.64598C21.7733 8.43216 21.7438 8.21341 21.6555 8.01592C21.5672 7.81844 21.4238 7.65059 21.2426 7.53251C21.0613 7.41442 20.8499 7.35109 20.6335 7.35011C20.4172 7.34913 20.2052 7.41054 20.0229 7.52698L15.7509 12L12.9594 5.53648C12.8587 5.37277 12.7177 5.2376 12.5499 5.14386C12.3821 5.05011 12.1931 5.00092 12.0009 5.00098Z";

export const CrownFilledIcon = ({
  size = 24,
  className = "",
  tone = "gold",
}: {
  size?: number;
  className?: string;
  /** Gold premium mark, or a fill that follows the label (infinite yearly My Plan). */
  tone?: "gold" | "solid";
}) =>
  tone === "solid" ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d={CROWN_FILLED_PATH} fill="currentColor" />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d={CROWN_FILLED_PATH} fill="#0A0A0A" />
      <path d={CROWN_FILLED_PATH} fill="url(#crown-filled-gradient-0)" />
      <path d={CROWN_FILLED_PATH} fill="url(#crown-filled-gradient-1)" fillOpacity="0.8" />
      <path d={CROWN_FILLED_PATH} fill="url(#crown-filled-gradient-2)" />
      <path d={CROWN_FILLED_PATH} fill="url(#crown-filled-gradient-3)" fillOpacity="0.4" />
      <defs>
        <radialGradient
          id="crown-filled-gradient-0"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-17.952 27.996 -9.59176 -23.9602 20.7561 -13.5901)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.67589" stopColor="#FFD500" />
          <stop offset="1" stopColor="#FFDF20" stopOpacity="0.38" />
        </radialGradient>
        <radialGradient
          id="crown-filled-gradient-1"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(4.87586 16.1852 -13.9927 16.4213 8.67727 5.00098)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.212469" stopColor="#FFD900" stopOpacity="0.92" />
          <stop offset="0.886241" stopColor="#FFDF20" />
        </radialGradient>
        <radialGradient
          id="crown-filled-gradient-2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(7.64624 -5.46797 4.6509 25.3357 3.35815 18.999)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF085" stopOpacity="0.51" />
          <stop offset="1" stopColor="#FF9E45" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="crown-filled-gradient-3"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-6.09483 4.37437 -6.09482 -33.0812 21.0886 9.37535)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
