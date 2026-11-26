export function CoinIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="var(--color-garden-coin)"
        stroke="var(--color-garden-coin-edge)"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r="10.5"
        fill="none"
        stroke="var(--color-garden-coin-edge)"
        strokeWidth="2.5"
        opacity=".7"
      />
      <path
        d="M14 13q3-3 6-3"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity=".8"
      />
    </svg>
  )
}

export function InventoryIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M10 11V9a6 6 0 0 1 12 0v2"
        fill="none"
        stroke="#a86f4a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M5 12h22l-1.6 15a3 3 0 0 1-3 2.6H9.6a3 3 0 0 1-3-2.6Z"
        fill="#f0a97a"
        stroke="#c9825a"
        strokeWidth="2"
      />
      <rect x="10" y="17" width="12" height="6" rx="3" fill="#fff4e4" />
    </svg>
  )
}

export function ExitIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M9 9l14 14M23 9L9 23"
        stroke="#d46a5a"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ShopIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect
        x="10"
        y="28"
        width="44"
        height="28"
        rx="4"
        fill="#fff"
        stroke="#e0b878"
        strokeWidth="3"
      />
      <path d="M6 28l4-14h44l4 14Z" fill="#ff9d94" />
      <path
        d="M6 28q5.3 7 10.6 0 5.3 7 10.7 0 5.3 7 10.7 0 5.3 7 10.7 0 5.3 7 10.7 0"
        fill="#fff4e4"
        stroke="none"
      />
      <path
        d="M10 14l-2 14M23 14l-4 14M36 14l0 14M45 14l4 14"
        stroke="#fff"
        strokeWidth="3"
        opacity=".7"
      />
      <rect x="25" y="38" width="14" height="18" rx="3" fill="#f0a97a" />
      <circle cx="18" cy="42" r="3.5" fill="#bde3c3" />
      <circle cx="46" cy="42" r="3.5" fill="#ffd66b" />
    </svg>
  )
}

export function WateringIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M44 30l14-12"
        stroke="#5fb0d6"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M54 12l10 6-4 10Z"
        fill="#8fcdea"
        stroke="#5fb0d6"
        strokeWidth="2"
        strokeLinejoin="round"
        transform="translate(-6 0)"
      />
      <path
        d="M14 26q-8 0-8 9t8 9"
        fill="none"
        stroke="#5fb0d6"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M12 24h32l-2 28a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4Z"
        fill="#8fcdea"
        stroke="#5fb0d6"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect
        x="16"
        y="30"
        width="26"
        height="5"
        rx="2.5"
        fill="#fff"
        opacity=".5"
      />
      <g fill="#8fcdea">
        <circle cx="58" cy="30" r="2.2" />
        <circle cx="54" cy="38" r="2.2" />
        <circle cx="60" cy="40" r="2.2" />
      </g>
    </svg>
  )
}
