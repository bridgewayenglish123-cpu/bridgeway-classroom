import type { Lang } from '@/lib/types/report'

export function NextChallengeCard({ lang, challenge }: { lang: Lang; challenge: string }) {
  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8"
      style={{ borderLeft: '3px solid #B8973A' }}>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: '#B8973A' }}>
        {lang === 'zh' ? '✦ 下次試試看' : '✦ Your Next Challenge'}
      </div>
      <p className="text-[16px] leading-[1.85]" style={{ color: '#1A2236' }}>
        {challenge}
      </p>
    </section>
  )
}
