import { useId } from 'react';

interface MascotProps {
  size?: number;
  className?: string;
}

/** Cupcake mascotte disegnata a mano: niente immagini da scaricare. */
export function Mascot({ size = 120, className }: MascotProps) {
  const clipId = `cupcake-${useId().replaceAll(':', '')}`;

  return (
    <svg
      viewBox="0 0 200 230"
      width={size}
      height={(size * 230) / 200}
      className={['mascot', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="100" cy="216" rx="56" ry="8" fill="#3c3c3c" opacity="0.1" />

      {/* candelina */}
      <rect x="94" y="32" width="12" height="38" rx="6" fill="#ffffff" stroke="#ecc7d5" strokeWidth="2" />
      <path d="M96 42h8M96 52h8M96 62h8" stroke="#ff8fb1" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 8c6 8 8 11 8 15a8 8 0 0 1-16 0c0-4 2-7 8-15z" fill="#ffb020" />
      <path d="M100 14c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8z" fill="#ffe08a" />

      {/* pirottino */}
      <path d="M40 126h120l-15 70c-1 7-20 13-45 13s-44-6-45-13z" fill="#ffc93c" />
      <defs>
        <clipPath id={clipId}>
          <path d="M40 126h120l-15 70c-1 7-20 13-45 13s-44-6-45-13z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} stroke="#f0b200" strokeWidth="5" strokeLinecap="round" opacity="0.6">
        <path d="M54 130l-4 58" />
        <path d="M78 130l-2 66" />
        <path d="M102 130v68" />
        <path d="M126 130l2 66" />
        <path d="M148 130l4 58" />
      </g>
      <path
        d="M40 126h120l-15 70c-1 7-20 13-45 13s-44-6-45-13z"
        fill="none"
        stroke="#e6a700"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="36" y="116" width="128" height="18" rx="9" fill="#ffdd66" stroke="#e6a700" strokeWidth="3" />

      {/* glassa */}
      <g fill="#ffd7e6">
        <circle cx="60" cy="92" r="28" />
        <circle cx="100" cy="76" r="34" />
        <circle cx="140" cy="92" r="28" />
        <rect x="32" y="92" width="136" height="34" rx="17" />
        <circle cx="48" cy="126" r="13" />
        <circle cx="78" cy="130" r="16" />
        <circle cx="108" cy="132" r="18" />
        <circle cx="138" cy="130" r="16" />
        <circle cx="158" cy="124" r="12" />
      </g>

      {/* faccina */}
      <g className="mascot__eyes" fill="#3b2b33">
        <ellipse cx="82" cy="96" rx="5.2" ry="6.8" />
        <ellipse cx="118" cy="96" rx="5.2" ry="6.8" />
      </g>
      <circle cx="80.2" cy="93.8" r="1.7" fill="#ffffff" />
      <circle cx="116.2" cy="93.8" r="1.7" fill="#ffffff" />
      <ellipse cx="63" cy="108" rx="9" ry="5" fill="#ff9fbe" opacity="0.7" />
      <ellipse cx="137" cy="108" rx="9" ry="5" fill="#ff9fbe" opacity="0.7" />
      <path
        d="M92 106c2.5 5 5.5 7.5 8 7.5s5.5-2.5 8-7.5c-5 2-11 2-16 0z"
        fill="#8c3b52"
      />

      {/* codette colorate */}
      <g strokeLinecap="round" strokeWidth="4">
        <path d="M62 70l9-4" stroke="#58cc02" />
        <path d="M124 62l9 3" stroke="#1cb0f6" />
        <path d="M92 58l7-5" stroke="#ff9600" />
        <path d="M146 102l8 3" stroke="#c77dff" />
        <path d="M54 108l9-2" stroke="#1cb0f6" />
      </g>
    </svg>
  );
}
