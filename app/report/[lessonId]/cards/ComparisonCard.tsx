import type { Lang, ReportComparison } from '@/lib/types/report'

export function ComparisonCard({
  lang,
  comparison,
}: {
  lang: Lang
  comparison: ReportComparison | null
}) {
  const text = comparison
    ? lang === 'zh'
      ? comparison.summary_zh
      : comparison.summary_en
    : null
  if (!text) return null

  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-6">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {lang === 'zh' ? '跟上堂課比較' : 'Compared to Last Lesson'}
      </div>
      <p className="text-[13px] leading-[1.8] text-ink-mid">{text}</p>
    </section>
  )
}
