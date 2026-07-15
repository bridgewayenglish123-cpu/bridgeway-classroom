import type { Lang, ReportStrength } from '@/lib/types/report'

export function StrengthCard({
  lang,
  items,
}: {
  lang: Lang
  items: ReportStrength[]
}) {
  if (items.length === 0) return null

  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-6">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {lang === 'zh' ? '你做得好的地方' : 'What You Did Well'}
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((s, i) => {
          const text = lang === 'zh' ? s.zh : s.en ?? s.zh
          return (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
              <span className="text-[13px] leading-relaxed text-ink-mid">{text}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
