/**
 * 收藏星形 icon。saved=true 實心金色、false 空心 muted。
 * S2-4 為靜態呈現（不可點）；S2-5 會加上點擊互動。
 */
export function StarIcon({ saved }: { saved: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill={saved ? 'currentColor' : 'none'}
      className={`flex-shrink-0 ${saved ? 'text-gold' : 'text-ink-muted'}`}
    >
      <path
        d="M9 2l1.9 3.85 4.25.62-3.08 3 .73 4.23L9 11.7l-3.8 2 .73-4.23-3.08-3 4.25-.62L9 2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}
