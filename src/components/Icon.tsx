import type { ReactNode } from 'react';
import type { IconName } from '../types';

const ICONS: Record<IconName, ReactNode> = {
  star: (
    <path
      d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z"
      fill="currentColor"
      stroke="none"
    />
  ),
  heart: (
    <path
      d="M12 20.4S4.8 16 3 11.7C1.6 8.3 3.7 5 7 5c2 0 3.7 1.1 5 2.8C13.3 6.1 15 5 17 5c3.3 0 5.4 3.3 4 6.7-1.8 4.3-9 8.7-9 8.7z"
      fill="currentColor"
      stroke="none"
    />
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.8" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8 13.8c.9 1.7 2.3 2.6 4 2.6s3.1-.9 4-2.6" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2z" fill="currentColor" stroke="none" />
      <path
        d="M18.5 14l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8v.3h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="12" rx="2" />
      <path d="M3.5 13.5h17" />
      <path d="M12 9v12" />
      <path d="M12 9S10.8 4.5 8.5 4.5a2.5 2.5 0 0 0 0 5" />
      <path d="M12 9s1.2-4.5 3.5-4.5a2.5 2.5 0 0 1 0 5" />
    </>
  ),
  cake: (
    <>
      <path d="M4 20h16" />
      <path d="M5 20v-6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V20" />
      <path d="M5 15.5c1.2-1.2 2.4-1.2 3.6 0s2.4 1.2 3.6 0 2.4-1.2 3.6 0 1.8 1.1 3.2.3" />
      <path d="M12 8.5V6" />
      <path
        d="M12 2.5c1.4 1.6 1.8 2.4 1.8 3.1a1.8 1.8 0 1 1-3.6 0c0-.7.4-1.5 1.8-3.1z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z" />
      <path d="M16 9.5l5 5" />
      <path d="M21 9.5l-5 5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6.5h16" />
      <path d="M4 12h16" />
      <path d="M4 17.5h16" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  reset: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M3.5 4.5v5h5" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.3 10.9l7.4-4.3" />
      <path d="M8.3 13.1l7.4 4.3" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11" />
      <path d="M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11" />
      <path d="M12 13v4" />
      <path d="M8.5 21h7" />
      <path d="M10 17h4l1 4H9l1-4z" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}
