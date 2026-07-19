import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav'
import { Greeting } from '@/components/home/Greeting'
import { NextLesson } from '@/components/home/NextLesson'
import { SummaryCard } from '@/components/home/SummaryCard'
import { StatsStrip } from '@/components/home/StatsStrip'
import { HistoryList } from '@/components/home/HistoryList'
import {
  computeStreakWeeks,
  formatFullLessonDate,
  formatGreetingDate,
  formatLessonDateParts,
  getGreeting,
  taipeiToday,
} from '@/lib/utils/date'
import { getJourneyText } from '@/lib/utils/journey'
import { one } from '@/lib/utils/rel'
import type { HistoryItemVM, NextLessonVM, SummaryVM } from '@/lib/types/home'
import type {
  ReportAnalysis,
  ReportPhrase,
  ReportStrength,
  ReportVocabulary,
} from '@/lib/types/report'

export const dynamic = 'force-dynamic'

function firstSentence(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/^[^。！？!?]*[。！？!?]?/)
  return (match?.[0] ?? trimmed).trim()
}

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: student } = await supabase
    .from('students')
    .select('id, en_name, zh_name, learning_goal')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!student) {
    return (
      <>
        <Nav name="同學" />
        <main className="mx-auto max-w-[1100px] px-5 pt-10 sm:px-8 lg:px-12">
          <p className="text-[14px] leading-relaxed text-ink-mid">
            找不到你的學生資料，請聯絡 Bridgeway。
          </p>
        </main>
      </>
    )
  }

  if (!student.learning_goal) {
    redirect('/onboarding')
  }

  const today = taipeiToday()

  const [nextLessonRes, completedRes, vocabRes, historyRes, summaryRes] =
    await Promise.all([
      supabase
        .from('lessons')
        .select(
          'id, date, time, duration, status, teacher:teachers!teacher_id ( id, teacher_name, teacher_code )',
        )
        .eq('student_id', student.id)
        .eq('status', 'scheduled')
        .eq('is_active', true)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('lessons')
        .select('id, date', { count: 'exact' })
        .eq('student_id', student.id)
        .eq('status', 'completed')
        .eq('is_active', true),
      supabase
        .from('saved_vocabulary')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', student.id),
      supabase
        .from('lessons')
        .select(
          'id, date, duration, teacher:teachers!teacher_id ( teacher_name ), lesson_reports ( analysis_zh, vocabulary, milestone )',
        )
        .eq('student_id', student.id)
        .eq('status', 'completed')
        .eq('is_active', true)
        .order('date', { ascending: false })
        .order('time', { ascending: false })
        .limit(3),
      supabase
        .from('lesson_reports')
        .select(
          'lesson_id, analysis_zh, vocabulary, phrases, strengths, created_at, lesson:lesson_id ( date, teacher:teachers!teacher_id ( teacher_name ) )',
        )
        .eq('student_id', student.id)
        .not('analysis_zh', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  const completedRows = completedRes.data ?? []
  const completedCount = completedRes.count ?? completedRows.length
  const vocabCount = vocabRes.count ?? 0
  const streakWeeks = computeStreakWeeks(completedRows.map((l) => l.date))

  const nl = nextLessonRes.data
  const nextLesson: NextLessonVM | null = nl
    ? {
        date: nl.date,
        time: nl.time,
        duration: nl.duration ?? null,
        teacherName: one(nl.teacher)?.teacher_name ?? null,
      }
    : null

  const sr = summaryRes.data
  let summary: SummaryVM | null = null
  if (sr) {
    const analysis = sr.analysis_zh as unknown as ReportAnalysis | null
    const vocab = (sr.vocabulary as unknown as ReportVocabulary[] | null) ?? []
    const phrases = (sr.phrases as unknown as ReportPhrase[] | null) ?? []
    const strengths = (sr.strengths as unknown as ReportStrength[] | null) ?? []
    const lessonRel = one(sr.lesson)
    const teacherRel = one(lessonRel?.teacher)
    summary = {
      lessonId: sr.lesson_id,
      dateLabel: lessonRel?.date ? formatFullLessonDate(lessonRel.date) : '',
      teacherName: teacherRel?.teacher_name ?? null,
      headline: analysis?.headline ?? null,
      body: analysis?.body ?? null,
      words: vocab.map((v) => v.word).filter(Boolean).slice(0, 8),
      phrases: phrases.map((p) => p.phrase).filter(Boolean).slice(0, 6),
      strengths: strengths.map((s) => s.zh).filter(Boolean).slice(0, 6),
    }
  }

  const history: HistoryItemVM[] = (historyRes.data ?? []).map((l) => {
    const report = one(l.lesson_reports)
    const analysis = report
      ? (report.analysis_zh as unknown as ReportAnalysis | null)
      : null
    const vocab =
      (report?.vocabulary as unknown as ReportVocabulary[] | null) ?? []
    const teacherRel = one(l.teacher)
    const { month, day } = formatLessonDateParts(l.date)
    const bodyText = analysis?.body || analysis?.headline || ''
    return {
      id: l.id,
      month,
      day,
      teacherName: teacherRel?.teacher_name ?? null,
      duration: l.duration ?? null,
      summary: bodyText ? firstSentence(bodyText) : null,
      chips: vocab.map((v) => v.word).filter(Boolean).slice(0, 3),
      milestone: report?.milestone ?? null,
      hasReport: Boolean(report),
    }
  })

  const displayName = student.en_name ?? student.zh_name
  const firstName = displayName.trim().split(/\s+/)[0]

  return (
    <>
      <Nav name={displayName} />
      <main className="mx-auto max-w-[1100px] px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
      <main className="mx-auto max-w-[1100px] px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">

          {/* 左欄：問候 + 學習歷程 */}
          <div>
            <Greeting
              greeting={getGreeting()}
              dateLabel={formatGreetingDate()}
              name={firstName}
              journeyText={getJourneyText(completedCount)}
              goal={student.learning_goal}
              studentId={student.id}
            />

            <div className="mb-4 mt-10 flex items-baseline justify-between">
              <h2 className="font-serif text-[28px] font-medium text-navy">
                學習歷程
              </h2>
            </div>
            <StatsStrip
              completed={completedCount}
              vocab={vocabCount}
              weeks={streakWeeks}
            />
            <HistoryList items={history} totalCompleted={completedCount} />
          </div>

          {/* 右欄：下一堂課 + 上堂課摘要 */}
          <div className="mt-10 lg:sticky lg:top-6 lg:mt-0">
            <NextLesson lesson={nextLesson} />

            <div className="mb-4 mt-8 flex items-baseline justify-between">
              <h2 className="font-serif text-[28px] font-medium text-navy">
                上堂課的摘要
              </h2>
              {summary ? (
                
                  href={`/report/${summary.lessonId}`}
                  className="text-[12px] tracking-[0.04em] text-gold opacity-85 transition hover:opacity-100"
                >
                  完整報告 →
                </a>
              ) : null}
            </div>
            <SummaryCard report={summary} />
          </div>

        </div>
      </main>
    </>
  )
}
