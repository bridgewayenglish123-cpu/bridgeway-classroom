'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lang, ReportVM } from '@/lib/types/report'
import { TeacherNoteCard } from './cards/TeacherNoteCard'
import { AnalysisCard } from './cards/AnalysisCard'
import { VocabCard } from './cards/VocabCard'
import { StrengthCard } from './cards/StrengthCard'
import { ErrorCard } from './cards/ErrorCard'
import { ComparisonCard } from './cards/ComparisonCard'
import { ReflectionCard } from './cards/ReflectionCard'
import { ShareCard } from './ShareCard'

export function ReportClient({
  report,
  savedWords,
  initialResponse,
  initialFeedback,
  studentAge,
}: {
  report: ReportVM
  savedWords: string[]
  initialResponse: string | null
  initialFeedback: string | null
  studentAge?: number | null
}) {
  const [lang, setLang] = useState<Lang>('zh')

  return (
    <div className="min-h-[100dvh] bg-ivory">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-navy px-5 sm:h-[56px] sm:px-8">
        <Link href="/home" className="flex items-center gap-1.5 text-[13px] text-ivory/70 transition hover:text-ivory">
          <span className="text-[16px] leading-none">←</span>
          <span>{lang === 'zh' ? '返回首頁' : 'Home'}</span>
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1">
          {(['zh', 'en'] as Lang[]).map((l) => (
            <button key={l} type="button" onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-semibold tracking-wide transition-all ${
                lang === l ? 'bg-gold text-navy shadow-sm' : 'text-ivory/60 hover:text-ivory'
              }`}>
              {l === 'zh' ? '中文' : 'EN'}
            </button>
          ))}
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-navy px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-2 text-[12px] font-medium tracking-[0.06em] text-gold/70">
            {report.dateLabel}
            {report.teacherName ? ` · ${report.teacherName}${lang === 'zh' ? ' 老師' : ''}` : ''}
          </div>
          <h1 className="font-serif text-[26px] font-medium leading-[1.3] text-ivory sm:text-[32px]">
            {lang === 'zh' ? report.analysisZh?.headline : report.analysisEn?.headline}
          </h1>
          {report.milestone && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5">
              <span className="text-[13px] font-medium text-gold">🏆 {report.milestone}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 主內容 ── */}
      <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-10 lg:items-start">

          {/* 左欄：分析 + 強項 + 錯誤 + 比較 + 反思 + 分享 */}
          <div className="flex flex-col gap-5">
            <AnalysisCard
              lang={lang}
              zh={report.analysisZh}
              en={report.analysisEn}
              dateLabel={report.dateLabel}
              teacherName={report.teacherName}
              hideHeader
            />
            {report.teacherNote ? <TeacherNoteCard lang={lang} note={report.teacherNote} /> : null}
            <StrengthCard lang={lang} items={report.strengths} />
            <ErrorCard lang={lang} items={report.errors} />
            <ComparisonCard lang={lang} comparison={report.comparison} />
            <ReflectionCard
              lang={lang}
              zh={report.reflectionZh}
              en={report.reflectionEn}
              reportId={report.reportId}
              initialResponse={initialResponse}
              initialFeedback={initialFeedback}
              studentAge={studentAge}
            />
            <ShareCard
              studentName={report.studentName}
              dateLabel={report.dateLabel}
              strengthZh={report.strengths[0]?.zh ?? null}
              vocabCount={report.vocabulary.length}
              phraseCount={report.phrases.length}
              lessonId={report.lessonId}
              completedCount={report.completedCount}
              streakWeeks={report.streakWeeks}
              totalVocabCount={report.totalVocabCount}
            />
          </div>

          {/* 右欄：單字 + 片語（桌機 sticky） */}
          <div className="mt-5 flex flex-col gap-5 lg:mt-0">
            <VocabCard
              lang={lang}
              kind="word"
              items={report.vocabulary}
              reportId={report.reportId}
              initialSaved={savedWords}
            />
            <VocabCard
              lang={lang}
              kind="phrase"
              items={report.phrases}
              reportId={report.reportId}
              initialSaved={savedWords}
            />
          </div>

        </div>
      </main>
    </div>
  )
}
