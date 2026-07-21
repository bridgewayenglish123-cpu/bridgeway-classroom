import type { Lang } from '@/lib/types/report'

export function HiddenGemCard({ lang, gem, cool }: {
  lang: Lang
  gem: string
  cool?: boolean
}) {
  if (cool) {
    // Junior 版：更有個性
    return (
      <section className="rounded-card bg-white p-6 shadow-md sm:p-8"
        style={{ borderLeft: '3px solid #1A2236' }}>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: '#1A2236' }}>
          {lang === 'zh' ? '✦ 老師注意到了' : '✦ Noticed'}
        </div>
        <p className="text-[16px] leading-[1.85] font-medium" style={{ color: '#1A2236' }}>{gem}</p>
      </section>
    )
  }

  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8"
      style={{ borderLeft: '3px solid #B8973A' }}>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: '#B8973A' }}>
        {lang === 'zh' ? '✦ 老師發現的事' : '✦ What Your Teacher Noticed'}
      </div>
      <p className="text-[16px] leading-[1.85]" style={{ color: '#1A2236' }}>{gem}</p>
    </section>
  )
}
