import type { Lang, ReportError } from '@/lib/types/report'

export function ErrorCard({ lang, items }: { lang: Lang; items: ReportError[] }) {
  if (items.length === 0) return null

  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-6">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {lang === 'zh' ? '需要加強的地方' : 'Areas to Improve'}
      </div>
      <ul className="flex flex-col gap-5">
        {items.map((e, i) => {
          const tip = lang === 'zh' ? e.tip_zh : e.tip_en ?? e.tip_zh
          return (
            <li key={i} className="border-l-[3px] border-ivory-dim pl-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[12px] font-medium text-navy">{e.pattern}</span>
                {typeof e.count === 'number' ? (
                  <span className="text-[11px] text-ink-muted">× {e.count}</span>
                ) : null}
              </div>
              {e.example ? (
                <div className="text-[12px] leading-relaxed text-ink-muted line-through">
                  {e.example}
                </div>
              ) : null}
              {e.correction ? (
                <div className="text-[13px] font-medium leading-relaxed text-navy">
                  {e.correction}
                </div>
              ) : null}
              {tip ? (
                <div className="mt-1 text-[12px] leading-relaxed text-ink-mid">{tip}</div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
