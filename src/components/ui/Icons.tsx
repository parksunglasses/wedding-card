import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6.5 9 5.5 5.5L17.5 9" />
    </IconBase>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
    </IconBase>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </IconBase>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7.4 3.5 9.2 7a1.6 1.6 0 0 1-.4 1.9l-1.1 1a14.2 14.2 0 0 0 6.4 6.4l1-1.1a1.6 1.6 0 0 1 1.9-.4l3.5 1.8a1.6 1.6 0 0 1 .8 1.8l-.4 1.7a2 2 0 0 1-2 1.5A16.5 16.5 0 0 1 2.4 5.1a2 2 0 0 1 1.5-2l1.7-.4a1.6 1.6 0 0 1 1.8.8Z" />
    </IconBase>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  )
}

export function TrainIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="3" width="12" height="15" rx="3" />
      <path d="M8.5 7h7M6 12h12M8.5 21l2-3M15.5 21l-2-3" />
      <circle cx="9" cy="15" r=".6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r=".6" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

export function BusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="3" width="14" height="16" rx="3" />
      <path d="M7.5 7h9M5 12h14M8 19v2M16 19v2" />
      <circle cx="8.5" cy="15.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r=".7" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

export function CarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 11 1.7-4.1A3 3 0 0 1 9.5 5h5a3 3 0 0 1 2.8 1.9L19 11" />
      <path d="M4 11h16v7H4zM7 18v2M17 18v2" />
      <circle cx="7.5" cy="14.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="14.5" r=".7" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

export function BankIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 9 9-5 9 5H3ZM5 19h14M3 22h18M6 9v10M10 9v10M14 9v10M18 9v10" />
    </IconBase>
  )
}

export function PenIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" />
      <path d="m14.7 6.5 2.8 2.8" />
    </IconBase>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </IconBase>
  )
}

export function UploadIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4M8 8l4-4 4 4M5 13a4 4 0 0 0 0 8h14a4 4 0 0 0 0-8" />
    </IconBase>
  )
}

export function MessageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 11.5a8 8 0 0 1-8.5 8A9.5 9.5 0 0 1 8 18.4L3 20l1.6-4.3A8 8 0 1 1 21 11.5Z" />
    </IconBase>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  )
}

export function LinkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9.5 14.5 5-5M7.2 17.8l-1 .9a3.5 3.5 0 0 1-5-5l3.5-3.5a3.5 3.5 0 0 1 5 0M16.8 6.2l1-.9a3.5 3.5 0 1 1 5 5l-3.5 3.5a3.5 3.5 0 0 1-5 0" />
    </IconBase>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
    </IconBase>
  )
}

export function MusicIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 18V5l10-2v13M9 8l10-2" />
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </IconBase>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  )
}

export function BotanicalLineIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 80 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M39 154c-2-30 2-57 10-82 5-17 8-31 6-44" />
      <path d="M43 119c-12-7-21-6-29-2 6 7 14 11 27 10M48 91c10-7 18-7 25-4-4 8-12 12-27 12" />
      <path d="M53 57c-9-7-14-14-14-23 7 2 13 8 16 18M58 49c8-7 11-16 8-25-7 4-12 11-12 22" />
      <path d="M55 29c-4-10-2-18 5-24 7 6 8 15 3 25-2 4-7 4-8-1Z" />
      <path d="M39 118c-3-10-8-16-16-20-2 9 2 16 13 23M50 86c-1-9 2-16 9-21 4 8 2 15-7 23" />
      <circle cx="14" cy="117" r="2" />
      <circle cx="72" cy="87" r="2" />
    </svg>
  )
}
