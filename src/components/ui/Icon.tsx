import type { SVGProps } from 'react'

export type IconName =
  | 'compass'
  | 'route'
  | 'sparkles'
  | 'sparkle'
  | 'calendar'
  | 'wallet'
  | 'users'
  | 'search'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'plane'
  | 'bed'
  | 'cup'
  | 'camera'
  | 'mountain'
  | 'museum'
  | 'walk'
  | 'sun'
  | 'bag'
  | 'ticket'
  | 'spa'
  | 'check'
  | 'plus'
  | 'minus'
  | 'close'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'print'
  | 'refresh'
  | 'bookmark'
  | 'trash'
  | 'map-pin'
  | 'clock'
  | 'star'
  | 'shield'
  | 'info'
  | 'menu'
  | 'download'
  | 'share'
  | 'heart'
  | 'quote'
  | 'globe'
  | 'train'
  | 'car'
  | 'utensils'
  | 'check-circle'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number | string
  strokeWidth?: number
}

const paths: Record<IconName, JSX.Element> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h5.5a3.5 3.5 0 0 0 0-7h-3a3.5 3.5 0 0 1 0-7H16" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" />
      <path d="M19 16c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3Z" />
    </>
  ),
  sparkle: <path d="M12 3c.8 5.4 3.6 8.2 9 9-5.4.8-8.2 3.6-9 9-.8-5.4-3.6-8.2-9-9 5.4-.8 8.2-3.6 9-9Z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  wallet: (
    <>
      <path d="M20 7V5.5A1.5 1.5 0 0 0 18.5 4h-13A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="M21 9h-6a3 3 0 0 0 0 6h6V9Z" />
      <circle cx="16" cy="12" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.4-3.4 2.2-5.2 5.5-5.2s5.1 1.8 5.5 5.2" />
      <path d="M16 5.2a3 3 0 0 1 0 5.7M17.2 14.9c2 .5 3.1 2.2 3.3 5.1" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M20 12H4" />
      <path d="m10 6-6 6 6 6" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 17 17 7M8 7h9v9" />
    </>
  ),
  plane: <path d="M10.2 13.8 3 11.5l1.2-1.7 5.8.8 4.3-4.3c.5-.5 1.4-.6 1.9-.2.5.4.4 1.3-.1 1.8l-4.3 4.3.9 5.8-1.7 1.2-2.2-7.2-1.8 1.8.1 3.5-1.5 1.5-1-4.6 4.6 1Z" />,
  bed: (
    <>
      <path d="M3 19V7M3 16h18v3M3 12h18v4" />
      <path d="M6.5 12V9.5h4V12M12.5 12V9.5h5V12" />
    </>
  ),
  cup: (
    <>
      <path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M16 10h2a3 3 0 0 1 0 6h-2M7 2v3M11 2v3M15 2v3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10H3V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  mountain: (
    <>
      <path d="m3 20 6.5-12 4 7 2.5-4L21 20H3Z" />
      <path d="m7.5 12.5 2 1.5 2-1" />
    </>
  ),
  museum: (
    <>
      <path d="M3 9 12 4l9 5H3Z" />
      <path d="M5 9v8M9 9v8M15 9v8M19 9v8M3 20h18M3 17h18" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.5" r="1.7" />
      <path d="m11 9 2-1 2 3 3 1M8 21l2.5-6 1.5-2 2 3 1 5M10.5 15 8 12l1-4 3-1 2 2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9 6.4 6.4M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9a2 2 0 0 0 0 6v4h18v-4a2 2 0 0 0 0-6V5H3v4Z" />
      <path d="M13 8v8" strokeDasharray="2 2" />
    </>
  ),
  spa: (
    <>
      <path d="M12 20c-5 0-8-3-8-7 3 0 6 1 8 4 2-3 5-4 8-4 0 4-3 7-8 7Z" />
      <path d="M12 17c0-4 2-7 6-9 1 4-1 8-6 9ZM12 17c0-4-2-7-6-9-1 4 1 8 6 9Z" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 6.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16.5 9" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  print: (
    <>
      <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2" />
      <path d="M6 14h12v7H6z" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M19 12a7 7 0 1 1-2-5" />
    </>
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" fill="currentColor" stroke="none" />,
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3 7.7 7.5 9.5 4.5-1.8 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.5 12 2.4 2.4 4.6-5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  download: (
    <>
      <path d="M12 3v12M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.3 10.8 7.4-4.3M8.3 13.2l7.4 4.3" />
    </>
  ),
  heart: <path d="M12 20s-8-4.7-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.3-8 10-8 10Z" />,
  quote: <path d="M9 6c-3 1.5-4.5 4-4.5 7.5V18H10v-6H7c0-2 .7-3.3 2.5-4.5L9 6Zm9 0c-3 1.5-4.5 4-4.5 7.5V18H19v-6h-3c0-2 .7-3.3 2.5-4.5L18 6Z" fill="currentColor" stroke="none" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.7 5.5 3.7 9S14.5 18.5 12 21c-2.5-2.5-3.7-5.5-3.7-9S9.5 5.5 12 3Z" />
    </>
  ),
  train: (
    <>
      <rect x="5" y="3" width="14" height="13" rx="3" />
      <path d="M5 10h14M9 16l-2 4M15 16l2 4M8 20h8" />
      <circle cx="9" cy="13" r=".7" fill="currentColor" />
      <circle cx="15" cy="13" r=".7" fill="currentColor" />
    </>
  ),
  car: (
    <>
      <path d="M4 16v-3l2-5h12l2 5v3M3 16h18v3h-2M5 19H3v-3" />
      <circle cx="7" cy="16" r="1.6" />
      <circle cx="17" cy="16" r="1.6" />
    </>
  ),
  utensils: (
    <>
      <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10" />
      <path d="M16 3c-1.5 2-2 4-2 6s.7 3 2 3 2-1 2-3-.5-4-2-6ZM16 12v9" />
    </>
  ),
}

export const Icon = ({ name, size = 20, strokeWidth = 1.6, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {paths[name]}
  </svg>
)
