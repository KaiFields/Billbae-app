export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <svg width="38" height="40" viewBox="0 0 42 44" fill="none" aria-hidden="true">
        <path d="m9 12-4-8 11 5 5-8 5 8 11-5-4 8H9Z" fill="currentColor" />
        <path
          d="M21 39S4 29 4 20c0-9 12-11 17-3 5-8 17-6 17 3 0 9-17 19-17 19Z"
          fill="currentColor"
        />
        <path
          d="m15 23 4 4 9-9"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && (
        <span>
          BillBae<span className="brand-dot">.</span>
        </span>
      )}
    </span>
  );
}
