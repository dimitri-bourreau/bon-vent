interface Props {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M32 8C32 8 16 20 16 36C16 44.8366 23.1634 52 32 52C40.8366 52 48 44.8366 48 36C48 20 32 8 32 8Z"
        fill="url(#sailGradient)"
      />
      <path
        d="M32 56V12"
        stroke="url(#sailGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8 24C12 22 16 22 20 24"
        stroke="url(#windGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 32C10 30 14 30 18 32"
        stroke="url(#windGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 40C14 38 18 38 22 40"
        stroke="url(#windGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
