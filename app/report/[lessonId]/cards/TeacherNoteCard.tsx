import type { Lang } from '@/lib/types/report'

export function TeacherNoteCard({ lang, note }: { lang: Lang; note: string }) {
  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-6">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {lang === 'zh' ? '老師手記' : "Teacher's Note"}
      </div>
      <p className="text-[14px] leading-relaxed text-ink">{note}</p>
    </section>
  )
}
