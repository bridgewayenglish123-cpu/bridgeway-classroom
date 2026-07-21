import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { one } from '@/lib/utils/rel'
import { formatFullLessonDate } from '@/lib/utils/date'
import { ReportClient } from './ReportClient'
import type {
  ReportAnalysis,
  ReportComparison,
  ReportError,
  ReportPhrase,
  ReportStrength,
  ReportVM,
  ReportVocabulary,
} from '@/lib/types/report'


export async function generateMetadata({ params }: { params: { lessonId: string } }) {
  const ogUrl = `https://app.bridgewayenglish.net/api/og/${params.lessonId}`
  const reportUrl = `https://app.bridgewayenglish.net/report/${params.lessonId}`
  return {
    openGraph: {
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      url: reportUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    },
  }
}

export const dynamic = 'force-dynamic'

function NotFound({ message }: { message: string }) {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[640px] flex-col items-center justify-center px-6 text-center">
      <p className="mb-6 text-[14px] leading-relaxed text-ink-mid">{message}</p>
      <Link href="/home" className="text-[13px] text-gold transition hover:text-gold-light">
        ← 返回首頁
      </Link>
    </main>
  )
}

export default async function ReportPage({
  params,
}: {
  params: { lessonId: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: student } = await supabase
    .from('students')
    .select('id, en_name, zh_name, age')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!student) {
    return <NotFound message="找不到你的學生資料，請聯絡 Bridgeway。" />
  }

  // 以 lesson_id 查報告（URL 參數是 lesson id，不是 report id）+ student_id 二次確認
  const { data: report } = await supabase
    .from('lesson_reports')
    .select(
      `id, lesson_id, teacher_note, milestone, hidden_gem,
       analysis_zh, analysis_en, vocabulary, phrases, strengths, errors, comparison,
       lesson:lesson_id ( date, time, duration, teacher:teachers!teacher_id ( teacher_name ) )`,
    )
    .eq('lesson_id', params.lessonId)
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!report) {
    return <NotFound message="這堂課的報告還沒生成，或你沒有權限查看。" />
  }

  const reflectionQuery = await (supabase as any)
    .from('reflection_responses')
    .select('question_zh, question_en, response, feedback')
    .eq('lesson_report_id', report.id)
    .eq('student_id', student.id)
    .maybeSingle()
  const reflection = reflectionQuery.data


  // 該報告已收藏的單字/片語（key = word 欄位值）
  const { data: saved } = await supabase
    .from('saved_vocabulary')
    .select('word')
    .eq('student_id', student.id)
    .eq('lesson_report_id', report.id)
  const savedWords = (saved ?? []).map((r) => r.word)

  // 學習統計
  const { count: completedCount } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', student.id)
    .eq('status', 'completed')
    .eq('is_active', true)

  const { count: totalVocabCount } = await supabase
    .from('saved_vocabulary')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', student.id)

  // 計算連續週數
  const { data: recentLessons } = await supabase
    .from('lessons')
    .select('date')
    .eq('student_id', student.id)
    .eq('status', 'completed')
    .eq('is_active', true)
    .order('date', { ascending: false })
    .limit(52)

  let streakWeeks = 0
  if (recentLessons && recentLessons.length > 0) {
    const weeks = new Set(recentLessons.map(l => {
      const d = new Date(l.date + 'T00:00:00')
      const startOfWeek = new Date(d)
      startOfWeek.setDate(d.getDate() - d.getDay())
      return startOfWeek.toISOString().slice(0, 10)
    }))
    const sortedWeeks = Array.from(weeks).sort().reverse()
    const now = new Date()
    const thisWeekStart = new Date(now)
    thisWeekStart.setDate(now.getDate() - now.getDay())
    const thisWeekStr = thisWeekStart.toISOString().slice(0, 10)
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(thisWeekStart.getDate() - 7)
    const lastWeekStr = lastWeekStart.toISOString().slice(0, 10)
    if (sortedWeeks[0] === thisWeekStr || sortedWeeks[0] === lastWeekStr) {
      for (let i = 0; i < sortedWeeks.length; i++) {
        const expected = new Date(thisWeekStart)
        expected.setDate(thisWeekStart.getDate() - i * 7)
        if (sortedWeeks[i] === expected.toISOString().slice(0, 10)) streakWeeks++
        else break
      }
    }
  }

  const lessonRel = one(report.lesson)
  const teacherRel = one(lessonRel?.teacher)

  const vm: ReportVM = {
    lessonId: report.lesson_id,
    reportId: report.id,
    studentName: student.en_name ?? student.zh_name ?? '',
    dateLabel: lessonRel?.date ? formatFullLessonDate(lessonRel.date) : '',
    teacherName: teacherRel?.teacher_name ?? null,
    teacherNote: report.teacher_note,
    milestone: report.milestone,
    analysisZh: report.analysis_zh as unknown as ReportAnalysis | null,
    analysisEn: report.analysis_en as unknown as ReportAnalysis | null,
    vocabulary: (report.vocabulary as unknown as ReportVocabulary[] | null) ?? [],
    phrases: (report.phrases as unknown as ReportPhrase[] | null) ?? [],
    strengths: (report.strengths as unknown as ReportStrength[] | null) ?? [],
    errors: (report.errors as unknown as ReportError[] | null) ?? [],
    comparison: report.comparison as unknown as ReportComparison | null,
    reflectionZh: reflection?.question_zh ?? null,
    reflectionEn: reflection?.question_en ?? null,
    reflectionFeedback: reflection?.feedback ?? null,
    studentAge: (student as any)?.age ?? null,
    completedCount: completedCount ?? 0,
    streakWeeks,
    totalVocabCount: totalVocabCount ?? 0,
    hiddenGem: (report as any).hidden_gem ?? null,
  }

  return (
    <ReportClient
      report={vm}
      savedWords={savedWords}
      initialResponse={reflection?.response ?? null}
      initialFeedback={reflection?.feedback ?? null}
      studentAge={(student as any)?.age ?? null}
    />
  )
}
