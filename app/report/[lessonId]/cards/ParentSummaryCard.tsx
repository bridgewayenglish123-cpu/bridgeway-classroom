import type { Lang } from '@/lib/types/report'

export function ParentSummaryCard({ summary }: { summary: string }) {
  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8 mt-6"
      style={{ borderTop: '2px solid #B8973A' }}>
      <div className="mb-3 flex items-center gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: '#B8973A' }}>
          給家長的話
        </div>
        <div className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: '#F0EDE6', color: '#6B7B8E' }}>
          Parents
        </div>
      </div>
      <p className="text-[15px] leading-[1.9]" style={{ color: '#1A2236' }}>
        {summary}
      </p>
    </section>
  )
}
