import { EmptyState } from '@/components/ui/EmptyState'
import type { SummaryVM } from '@/lib/types/home'

type TagVariant = 'word' | 'phrase' | 'win'

const tagClass: Record<TagVariant, string> = {
  word: 'bg-ivory border border-ivory-dim text-navy',
  phrase: 'bg-gold-pale border border-[rgba(184,151,58,0.20)] text-[#7a5f18]',
  win: 'bg-white border-l-[3px] border-l-gold border border-ivory-dim text-ink rounded-xl px-4 py-2.5 w-full text-left',
}

function TagGroup({
  label,
  tags,
  variant,
}: {
  label: string
  tags: string[]
  variant: TagVariant
}) {
  if (tags.length === 0) return null
  return (
    <div className="mb-[18px] last:mb-0">
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </div>
      {variant === 'win' ? (
        <div className="flex flex-col gap-2">
          {tags.map((t, i) => (
            <div
              key={`${t}-${i}`}
              className={`text-[13px] leading-[1.7] ${tagClass[variant]}`}
            >
              {t}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-[7px]">
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className={`rounded-[20px] px-3.5 py-[5px] text-[12px] leading-none ${tagClass[variant]}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function SummaryCard({ report }: { report: SummaryVM | null }) {
  if (!report) {
    return (
      <div className="rounded-card bg-white p-6 shadow-md sm:p-7">
        <EmptyState text="你的第一份學習報告將在上完第一堂課後出現。" />
      </div>
    )
  }

  return (
    <div className="rounded-card bg-white p-6 shadow-md sm:p-7">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="rounded-[20px] bg-ivory px-2.5 py-[3px] text-[11px] text-ink-muted">
          {report.dateLabel}
        </span>
        {report.teacherName ? (
          <span className="text-[11px] font-medium text-gold">
            {report.teacherName} 老師
          </span>
        ) : null}
      </div>

      {report.headline ? (
        <div className="mb-3 font-serif text-[20px] font-semibold leading-snug text-navy sm:text-[22px]">
          {report.headline}
        </div>
      ) : null}
      {report.body ? (
        <div className="mb-6 text-[15px] leading-[1.85] text-ink-mid">
          {report.body}
        </div>
      ) : null}

      <TagGroup label="本課單字" tags={report.words} variant="word" />
      <TagGroup label="本課片語" tags={report.phrases} variant="phrase" />
      <TagGroup label="✦ 你做得很好的地方" tags={report.strengths} variant="win" />
    </div>
  )
}
