import Link from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'
import type { HistoryItemVM } from '@/lib/types/home'

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
      <path
        d="M5 1l1.03 2.09L8.5 3.45l-1.75 1.7.41 2.41L5 6.5 2.84 7.56l.41-2.41L1.5 3.45l2.47-.36L5 1z"
        stroke="currentColor" strokeWidth="1" strokeLinejoin="round"
      />
    </svg>
  )
}

function CardInner({ item }: { item: HistoryItemVM }) {
  return (
    <>
      {/* 日期欄 */}
      <div className="w-10 flex-shrink-0 pt-0.5 text-center sm:w-12">
        <span className="mb-0.5 block text-[10px] uppercase leading-none tracking-[0.08em] text-ink-muted">
          {item.month}
        </span>
        <span className="block font-serif text-[22px] font-medium leading-none text-navy sm:text-[26px]">
          {item.day}
        </span>
      </div>

      <div className="w-px flex-shrink-0 self-stretch bg-ivory-dim" />

      <div className="min-w-0 flex-1">
        {item.milestone ? (
          <div className="mb-2 inline-flex items-center gap-[5px] rounded-[10px] border border-gold-mid bg-gold-pale px-2.5 py-0.5 text-[11px] font-medium text-gold">
            <StarIcon />
            {item.milestone}
          </div>
        ) : null}
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-semibold text-gold">
            {item.teacherName ?? '老師'} 老師
          </span>
          {item.duration ? (
            <span className="text-[12px] text-ink-muted">{item.duration} 分鐘</span>
          ) : null}
        </div>
        {item.summary ? (
          <div className="mb-2 line-clamp-2 text-[14px] leading-[1.7] text-ink-mid">
            {item.summary}
          </div>
        ) : (
          <div className="mb-2 text-[13px] leading-[1.7] text-ink-muted">
            報告尚未產生。
          </div>
        )}
        {item.chips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {item.chips.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="rounded-full bg-ivory border border-ivory-dim px-3 py-0.5 text-[11px] text-ink-muted"
              >
                {c}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}

function HistoryCard({ item }: { item: HistoryItemVM }) {
  const base = `flex items-start gap-4 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border-l-[3px] ${
    item.milestone ? 'border-gold' : 'border-transparent'
  }`

  if (item.hasReport) {
    return (
      <Link
        href={`/report/${item.id}`}
        className={`${base} transition duration-200 hover:-translate-y-px hover:border-gold hover:shadow-md`}
      >
        <CardInner item={item} />
      </Link>
    )
  }
  return (
    <div className={base}>
      <CardInner item={item} />
    </div>
  )
}

export function HistoryList({
  items,
  totalCompleted,
}: {
  items: HistoryItemVM[]
  totalCompleted: number
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ivory-dim bg-white/40 p-6">
        <EmptyState text="你的學習歷程將從第一堂課開始記錄。" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-3 w-full rounded-2xl border border-dashed border-ivory-dim py-4 text-center text-[12px] tracking-[0.04em] text-ink-muted">
        共 {totalCompleted} 堂完課記錄 · 報告從正式上線後開始累積
      </div>
    </div>
  )
}
