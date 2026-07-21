import type { Lang } from '@/lib/types/report'

export function HiddenGemCard({ lang, gem }: { lang: Lang; gem: string }) {
  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8 border-l-[3px]"
      style={{ borderColor: '#B8973A' }}>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: '#B8973A' }}>
        {lang === 'zh' ? '✦ 老師發現的事' : '✦ What Your Teacher Noticed'}
      </div>
      <p className="text-[16px] leading-[1.85] text-navy font-medium">{gem}</p>
    </section>
  )
}
