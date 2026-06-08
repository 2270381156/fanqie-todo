interface IconProps {
  name: string
  size?: number
  className?: string
  color?: string
}

export function Icon({ name, size = 16, className = '', color = 'currentColor' }: IconProps) {
  const icons: Record<string, React.ReactElement> = {
    tomato: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 3C7.58 3 4 6.58 4 11c0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.42-3.58-8-8-8z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M12 2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1z"
          fill={color}
          opacity="0.7"
        />
        <path
          d="M9 2c-.55 0-1 .45-1 1v.5c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1zM15 2c-.55 0-1 .45-1 1v.5c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1z"
          fill={color}
          opacity="0.5"
        />
      </svg>
    ),
    play: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 5v14l11-7z" fill={color} />
      </svg>
    ),
    pause: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="6" y="4" width="4" height="16" rx="1" fill={color} />
        <rect x="14" y="4" width="4" height="16" rx="1" fill={color} />
      </svg>
    ),
    skip: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" fill={color} />
      </svg>
    ),
    reset: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
          fill={color}
        />
      </svg>
    ),
    task: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <path d="M9 11l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    stats: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="4" y="14" width="4" height="6" rx="1" fill={color} />
        <rect x="10" y="10" width="4" height="10" rx="1" fill={color} />
        <rect x="16" y="6" width="4" height="14" rx="1" fill={color} />
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="3" fill={color} opacity="0.8" />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          fill={color}
          opacity="0.6"
        />
      </svg>
    ),
    music: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
          fill={color}
        />
      </svg>
    ),
    close: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          fill={color}
        />
      </svg>
    ),
    minimize: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="6" y="11" width="12" height="2" rx="1" fill={color} />
      </svg>
    ),
    pin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" fill={color} />
      </svg>
    ),
    expand: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
          fill={color}
        />
      </svg>
    ),
    compress: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M5 5h6v2H7v4H5V5zm14 0v6h-2V7h-4V5h6zM5 19v-6h2v4h4v2H5zm14-4v4h-4v2h6v-6h-2z"
          fill={color}
        />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={color} />
      </svg>
    ),
    delete: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
          fill={color}
        />
      </svg>
    ),
    fire: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M13.5 0.5C13.5 0.5 8.5 5.5 8.5 10.5C8.5 13.26 10.74 15.5 13.5 15.5C16.26 15.5 18.5 13.26 18.5 10.5C18.5 5.5 13.5 0.5 13.5 0.5Z"
          fill={color}
          transform="translate(1 4) scale(0.8)"
        />
      </svg>
    ),
    trophy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"
          fill={color}
        />
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
        <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    palette: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.92 0 1.67-.75 1.67-1.67 0-.43-.16-.83-.43-1.13-.27-.3-.43-.7-.43-1.13 0-.92.75-1.67 1.67-1.67h1.97C19.15 18.4 22 15.55 22 12 22 6.48 17.52 2 12 2zM7.5 13c-.83 0-1.5-.67-1.5-1.5S6.67 10 7.5 10s1.5.67 1.5 1.5S8.33 13 7.5 13zm3-5c-.83 0-1.5-.67-1.5-1.5S9.67 5 10.5 5s1.5.67 1.5 1.5S11.33 8 10.5 8zm3 0c-.83 0-1.5-.67-1.5-1.5S12.67 5 13.5 5s1.5.67 1.5 1.5S14.33 8 13.5 8zm3 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
          fill={color}
        />
      </svg>
    ),
    volume: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
          fill={color}
        />
      </svg>
    ),
    add: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill={color} />
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
        <path d="M12 16v-4m0-4h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    keyboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" fill="none" />
        <rect x="6" y="13" width="12" height="2" rx="1" fill={color} />
        <circle cx="6" cy="10" r="1" fill={color} />
        <circle cx="9" cy="10" r="1" fill={color} />
        <circle cx="12" cy="10" r="1" fill={color} />
        <circle cx="15" cy="10" r="1" fill={color} />
        <circle cx="18" cy="10" r="1" fill={color} />
      </svg>
    ),
  }

  return icons[name] || null
}
