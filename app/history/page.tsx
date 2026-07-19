import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { formatLessonDateParts, formatFullLessonDate } from '@/lib/utils/date'
import { one } from '@/lib/utils/rel'
import type { ReportAnalysis, ReportVocabulary } from '@/lib/types/report'

export const dynamic = 'force-dynamic'

function firstSentence(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/^[^。！？!?]*[。！？!?]?/)
  return (match?.[0] ?? trimmed).trim()
}

export default async function HistoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: student } = await supabase
    .from('students')
    .select('id, en_name, zh_name')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!student) redirect('/home')

  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      id, date, time, duration, status,
      teacher:teachers!teacher_id ( teacher_name ),
      lesson_reports ( id, analysis_zh, vocabulary, milestone )
    `)
    .eq('student_id', student.id)
    .eq('status', 'completed')
    .eq('is_active', true)
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  const displayName = student.en_name ?? student.zh_name ?? ''
  const allLessons = (lessons ?? []).map(l => {
    const report = one(l.lesson_reports)
    const analysis = report?.analysis_zh as unknown as ReportAnalysis | null
    const vocab = (report?.vocabulary as unknown as ReportVocabulary[] | null) ?? []
    const teacherRel = one(l.teacher)
    const { month, day } = formatLessonDateParts(l.date)
    const bodyText = analysis?.body ?? analysis?.headline ?? ''
    return {
      id: l.id,
      date: l.date,
      month,
      day,
      fullDate: formatFullLessonDate(l.date),
      teacherName: teacherRel?.teacher_name ?? null,
      duration: l.duration ?? null,
      headline: analysis?.headline ?? null,
      summary: bodyText ? firstSentence(bodyText) : null,
      chips: vocab.map(v => v.word).filter(Boolean).slice(0, 4),
      milestone: report?.milestone ?? null,
      hasReport: Boolean(report),
      reportId: report?.id ?? null,
    }
  })

  return (
    <>
      <Nav name={displayName} />
      <main className="mx-auto max-w-[800px] px-5 pb-16 pt-8 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/home" className="mb-2 block text-[12px] text-gold/70 transition hover:text-gold">
              ← 返回首頁
            </Link>
            <h1 className="font-serif text-[32px] font-medium text-navy sm:text-[36px]">
              學習歷程
            </h1>
            <p className="mt-1 text-[14px] text-ink-muted">
              共 {allLessons.length} 堂完課記錄
            </p>
          </div>
        </div>

        {/* 課程列表 */}
        <div className="flex flex-col gap-3">
          {allLessons.map(l => (
            <div key={l.id}>
              {l.hasReport ? (
                <Link
                  href={`/report/${l.id}`}
                  className="flex items-start gap-5 rounded-2xl bg-white p-5 shadow-sm border-l-[3px] border-gold transition hover:-translate-y-px hover:shadow-md sm:p-6"
                >
                  <LessonCard lesson={l} />
                </Link>
              ) : (
                <div className="flex items-start gap-5 rounded-2xl bg-white p-5 shadow-sm border-l-[3px] border-transparent sm:p-6">
                  <LessonCard lesson={l} />
                </div>
              )}
            </div>
          ))}
        </div>

        {allLessons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ivory-dim bg-white/40 p-10 text-center">
            <p className="text-[14px] text-ink-muted">還沒有完課記錄。</p>
          </div>
        )}
      </main>
    </>
  )
}

function LessonCard({ lesson }: {
  lesson: {
    month: string
    day: string
    fullDate: string
    teacherName: string | null
    duration: number | null
    headline: string | null
    summary: string | null
    chips: string[]
    milestone: string | null
    hasReport: boolean
  }
}) {
  return (
    <>
      {/* 日期 */}
      <div className="w-12 flex-shrink-0 text-center">
        <span className="block text-[10px] uppercase tracking-[0.08em] text-ink-muted">
          {lesson.month}
        </span>
        <span className="block font-serif text-[28px] font-medium leading-none text-navy">
          {lesson.day}
        </span>
      </div>

      <div className="w-px flex-shrink-0 self-stretch bg-ivory-dim" />

      {/* 內容 */}
      <div className="min-w-0 flex-1">
        {lesson.milestone && (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">
            🏆 {lesson.milestone}
          </div>
        )}
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-semibold text-gold">
            {lesson.teacherName ?? '老師'} 老師
          </span>
          <span className="text-[12px] text-ink-muted">
            {lesson.duration ? `${lesson.duration} 分鐘` : ''}
          </span>
        </div>
        {lesson.headline && (
          <p className="mb-1 text-[15px] font-semibold leading-snug text-navy">
            {lesson.headline}
          </p>
        )}
        {lesson.summary && (
          <p className="mb-2.5 line-clamp-2 text-[13px] leading-[1.7] text-ink-mid">
            {lesson.summary}
          </p>
        )}
        {!lesson.hasReport && (
          <p className="mb-2.5 text-[13px] text-ink-muted">報告尚未產生。</p>
        )}
        {lesson.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lesson.chips.map((c, i) => (
              <span key={`${c}-${i}`}
                className="rounded-full bg-ivory border border-ivory-dim px-2.5 py-0.5 text-[11px] text-ink-muted">
                {c}
              </span>
            ))}
          </div>
        )}
        {lesson.hasReport && (
          <div className="mt-2 text-[12px] font-medium text-gold">
            查看完整報告 →
          </div>
        )}
      </div>
    </>
  )
}
