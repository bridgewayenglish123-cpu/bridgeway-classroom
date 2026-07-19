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
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8">
      <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {lang === 'zh' ? '跟上堂課比較' : 'Compared to Last Lesson'}
      </h3>
      <p className="text-[16px] leading-[1.9] text-ink-mid">{text}</p>
    </section>
  )
}
