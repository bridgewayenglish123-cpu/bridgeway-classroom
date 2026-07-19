import type { Lang, ReportAnalysis } from '@/lib/types/report'

export function AnalysisCard({
  lang,
  zh,
  en,
  dateLabel,
  teacherName,
  hideHeader,
}: {
  lang: Lang
  zh: ReportAnalysis | null
  en: ReportAnalysis | null
  dateLabel: string
  teacherName: string | null
  hideHeader?: boolean
}) {
  const a = lang === 'zh' ? zh : en

  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8">
      {!hideHeader && (
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          {dateLabel ? (
            <span className="rounded-[20px] bg-ivory px-2.5 py-[3px] text-[11px] text-ink-muted">
              {dateLabel}
            </span>
          ) : null}
          {teacherName ? (
            <span className="text-[11px] font-medium text-gold">
              {teacherName}
              {lang === 'zh' ? ' 老師' : ''}
            </span>
          ) : null}
        </div>
      )}

      {!hideHeader && a?.headline ? (
        <h2 className="mb-3 font-serif text-[22px] font-medium leading-snug text-navy sm:text-[24px]">
          {a.headline}
        </h2>
      ) : null}
      {a?.body ? (
        <p className={`text-[16px] leading-[2] text-ink-mid ${hideHeader ? '' : 'mt-0'}`}>{a.body}</p>
      ) : null}
      {!a ? (
        <p className="text-[13px] text-ink-muted">
          {lang === 'zh' ? '尚無分析內容。' : 'No analysis available.'}
        </p>
      ) : null}
    </section>
  )
}
