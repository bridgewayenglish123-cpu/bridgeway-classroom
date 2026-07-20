import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav'
import { formatLessonDateParts, formatFullLessonDate } from '@/lib/utils/date'
import { one } from '@/lib/utils/rel'
import type { ReportAnalysis, ReportVocabulary } from '@/lib/types/report'
import { HistoryClient } from './HistoryClient'

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
    }
  })

  return (
    <>
      <Nav name={displayName} />
      <HistoryClient
        lessons={allLessons}
        totalCompleted={allLessons.length}
        displayName={displayName}
      />
    </>
  )
}
