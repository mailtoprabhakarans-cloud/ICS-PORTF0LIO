import React from "react";

interface IcsLogoProps {
  className?: string;
  size?: number | string;
}

export default function IcsLogo({ className = "size-11", size }: IcsLogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="ICS Computer Store Logo"
    >
      <defs>
        {/* Red Top-Left Swoosh Gradient */}
        <linearGradient id="redGradientTop" x1="60" y1="80" x2="350" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DC1424" />
          <stop offset="100%" stopColor="#E92228" />
        </linearGradient>

        {/* Red Bottom Swoosh Gradient */}
        <linearGradient id="redGradientBottom" x1="100" y1="320" x2="380" y2="390" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DC1424" />
          <stop offset="100%" stopColor="#B30E1B" />
        </linearGradient>

        {/* Blue Top-Right Swoosh Gradient */}
        <linearGradient id="blueGradientTop" x1="120" y1="120" x2="390" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0077F5" />
          <stop offset="60%" stopColor="#009BF8" />
          <stop offset="100%" stopColor="#00C2FF" />
        </linearGradient>

        {/* Blue Bottom-Right Swoosh Gradient */}
        <linearGradient id="blueGradientBottom" x1="130" y1="410" x2="430" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#009BF8" />
          <stop offset="50%" stopColor="#0072EC" />
          <stop offset="100%" stopColor="#0055D4" />
        </linearGradient>
      </defs>

      {/* Top Red Outer Arc */}
      <path
        d="M 78 174 C 80 110, 160 78, 260 78 C 308 78, 338 88, 354 94 C 330 90, 240 86, 155 125 C 130 137, 105 158, 92 174 Z"
        fill="url(#redGradientTop)"
      />

      {/* Top Blue Inner Arc */}
      <path
        d="M 132 174 C 145 128, 205 106, 280 108 C 342 110, 372 140, 376 174 C 362 135, 305 124, 252 126 C 190 128, 152 152, 132 174 Z"
        fill="url(#blueGradientTop)"
      />

      {/* Bottom Red Inner Arc */}
      <path
        d="M 112 320 C 130 365, 192 388, 265 388 C 315 388, 350 355, 365 320 C 345 350, 288 370, 235 368 C 172 365, 130 342, 112 320 Z"
        fill="url(#redGradientBottom)"
      />

      {/* Bottom Blue Outer Arc */}
      <path
        d="M 140 354 C 185 398, 275 418, 350 415 C 395 412, 420 370, 422 320 C 420 380, 345 404, 255 400 C 195 396, 160 375, 140 354 Z"
        fill="url(#blueGradientBottom)"
      />

      {/* Central "ICS" Geometric Lettering */}
      <g className="fill-slate-900 dark:fill-white transition-colors duration-200">
        {/* Letter 'I' */}
        <path
          d="M 78 188 H 112 V 306 H 78 Z"
        />

        {/* Letter 'C' */}
        <path
          d="M 278 206 C 278 193 268 188 252 188 H 168 C 144 188 135 198 135 220 V 274 C 135 296 144 306 168 306 H 252 C 268 306 278 300 278 288 V 272 H 244 V 282 H 169 V 212 H 244 V 222 H 278 Z"
        />

        {/* Letter 'S' */}
        <path
          d="M 432 216 C 432 196 422 188 398 188 H 322 C 304 188 296 198 296 216 V 238 C 296 256 306 262 328 265 L 398 274 V 283 H 330 V 272 H 296 V 288 C 296 302 306 306 328 306 H 406 C 426 306 432 298 432 280 V 258 C 432 240 422 234 400 231 L 330 222 V 211 H 398 V 222 H 432 Z"
        />
      </g>
    </svg>
  );
}
