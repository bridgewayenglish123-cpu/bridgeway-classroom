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

          // 支援新格式（examples 陣列）和舊格式（單一 example）
          const exampleList = e.examples && e.examples.length > 0
            ? e.examples
            : e.example
              ? [{ original: e.example, correction: e.correction ?? '' }]
              : []

          return (
            <li key={i} className="border-l-[3px] border-ivory-dim pl-5">
              {/* 標題 */}
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-[16px] font-semibold text-navy">{patternLabel}</span>
                {typeof e.count === 'number' && (
                  <span className="text-[13px] text-ink-muted">× {e.count}</span>
                )}
              </div>

              {/* 所有例句 */}
              {exampleList.length > 0 && (
                <ul className="mb-3 space-y-2.5">
                  {exampleList.map((ex, j) => (
                    <li key={j} className="rounded-xl bg-ivory p-3">
                      <div className="text-[13px] leading-relaxed text-ink-muted/60 line-through mb-1">
                        {ex.original}
                      </div>
                      <div className="text-[15px] font-semibold leading-relaxed text-navy">
                        {ex.correction}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* 說明 */}
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
