import type { Lang, ReportError } from '@/lib/types/report'

export function ErrorCard({ lang, items }: { lang: Lang; items: ReportError[] }) {
  if (items.length === 0) return null
  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8">
      <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {lang === 'zh' ? '需要加強的地方' : 'Areas to Improve'}
      </h3>
      <ul className="flex flex-col gap-7">
        {items.map((e, i) => {
          const patternLabel = lang === 'zh'
            ? (e.pattern_zh ?? e.pattern ?? '')
            : (e.pattern_en ?? e.pattern ?? '')
          const tip = lang === 'zh' ? e.tip_zh : e.tip_en ?? e.tip_zh
          return (
            <li key={i} className="border-l-[3px] border-ivory-dim pl-5">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="text-[16px] font-semibold text-navy">{patternLabel}</span>
                {typeof e.count === 'number' && (
                  <span className="text-[13px] text-ink-muted">× {e.count}</span>
                )}
              </div>
              {e.example && (
                <div className="mb-1.5 text-[14px] leading-relaxed text-ink-muted/60 line-through">
                  {e.example}
                </div>
              )}
              {e.correction && (
                <div className="mb-2.5 text-[16px] font-semibold leading-relaxed text-navy">
                  {e.correction}
                </div>
              )}
              {tip && (
                <div className="text-[14px] leading-[1.8] text-ink-mid">{tip}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
