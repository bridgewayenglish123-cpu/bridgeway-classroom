import type { Lang, ReportStrength } from '@/lib/types/report'

export function StrengthCard({ lang, items }: { lang: Lang; items: ReportStrength[] }) {
  if (items.length === 0) return null
  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8">
      <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {lang === 'zh' ? '✦ 你做得很好的地方' : '✦ What You Did Well'}
      </h3>
      <ul className="flex flex-col gap-4">
        {items.map((s, i) => {
          const text = lang === 'zh' ? s.zh : s.en ?? s.zh
          return (
            <li key={i} className="border-l-[3px] border-gold pl-5 py-1">
              <span className="text-[16px] leading-[1.85] text-ink">{text}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
