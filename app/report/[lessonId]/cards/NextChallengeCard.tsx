import type { Lang } from '@/lib/types/report'

export function NextChallengeCard({ lang, challenge }: { lang: Lang; challenge: string }) {
  return (
    <section className="rounded-card bg-navy p-6 shadow-md sm:p-8">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: '#B8973A' }}>
        {lang === 'zh' ? '✦ 下次的挑戰' : '✦ Your Next Challenge'}
      </div>
      <p className="text-[16px] leading-[1.85] font-medium" style={{ color: '#F7F4EE' }}>
        {challenge}
      </p>
    </section>
  )
}
