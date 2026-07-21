'use client'

import { useState } from 'react'
import type { Lang, ReportVM } from '@/lib/types/report'
import { HiddenGemCard } from './cards/HiddenGemCard'
import { NextChallengeCard } from './cards/NextChallengeCard'
import { ParentSummaryCard } from './cards/ParentSummaryCard'
import { VocabCard } from './cards/VocabCard'
import { ErrorCard } from './cards/ErrorCard'
import { ReflectionCard } from './cards/ReflectionCard'
import { TeacherNoteCard } from './cards/TeacherNoteCard'
import { ShareCard } from './ShareCard'
import { ComparisonCard } from './cards/ComparisonCard'
import { StrengthCard } from './cards/StrengthCard'

const navy = '#1A2236'
const gold = '#B8973A'
const ivory = '#F7F4EE'
const muted = '#6B7B8E'
const line = 'rgba(26,34,54,0.08)'

export function ReportClient({ report, initialSaved }: {
  report: ReportVM
  initialSaved: string[]
}) {
  const [lang, setLang] = useState<Lang>('zh')
  const lt = report.learnerType ?? 'Adult'
  const reflectionZh = report.reflectionZh
  const reflectionEn = report.reflectionEn

  const title = lang === 'zh' ? `${report.studentName}，你好！` : `Hi, ${report.studentName}!`
  const subtitle = lang === 'zh'
    ? `${report.dateLabel} 的課堂學習報告`
    : `Lesson Report · ${report.dateLabel}`

  // 共用的 ShareCard props
  const shareProps = {
    studentName: report.studentName,
    dateLabel: report.dateLabel,
    strengthZh: report.strengths[0]?.zh ?? null,
    vocabCount: report.vocabulary.length,
    phraseCount: report.phrases.length,
    lessonId: report.lessonId,
    completedCount: report.completedCount,
    streakWeeks: report.streakWeeks,
    totalVocabCount: report.totalVocabCount,
  }

  // 共用的 ReflectionCard
  const reflectionCard = (reflectionZh || reflectionEn) ? (
    <ReflectionCard
      lang={lang}
      zh={reflectionZh}
      en={reflectionEn}
      reportId={report.reportId}
      initialResponse={report.reflectionFeedback ? '' : null}
      initialFeedback={report.reflectionFeedback}
      studentAge={report.studentAge}
    />
  ) : null

  return (
    <div className="min-h-screen" style={{ background: ivory }}>

      {/* ── Header ── ivory 底，輕量 */}
      <header className="sticky top-0 z-50 border-b"
        style={{ background: ivory, borderColor: line }}>
        <div className="mx-auto max-w-[1100px] flex h-[52px] items-center justify-between px-4 sm:px-8">
          <div className="font-serif text-[17px] font-medium" style={{ color: navy }}>
            Bridgeway <span style={{ color: gold }}>Classroom</span>
          </div>
          <button
            onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
            className="rounded-full px-3 py-1 text-[12px] font-medium border transition hover:opacity-80"
            style={{ borderColor: line, color: muted }}>
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </header>

      {/* ── Hero ── 緊湊，不浪費空間 */}
      <div className="border-b" style={{ background: ivory, borderColor: line }}>
        <div className="mx-auto max-w-[1100px] px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-1.5"
                style={{ color: gold }}>
                {lang === 'zh' ? '學習報告' : 'Learning Report'}
              </p>
              <h1 className="font-serif font-semibold leading-tight"
                style={{
                  color: navy,
                  fontSize: lt === 'Young Learner' ? '30px' : '26px',
                }}>
                {title}
              </h1>
              <p className="mt-1 text-[13px]" style={{ color: muted }}>{subtitle}</p>
            </div>
            {/* 統計數字 */}
            <div className="flex gap-6 pb-1">
              {[
                { n: report.vocabulary.length, label: lang === 'zh' ? '單字' : 'Words' },
                { n: report.phrases.length, label: lang === 'zh' ? '片語' : 'Phrases' },
                { n: report.completedCount, label: lang === 'zh' ? '堂課' : 'Lessons' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-serif text-[28px] font-bold leading-none" style={{ color: navy }}>{s.n}</div>
                  <div className="text-[10px] mt-1 uppercase tracking-wide" style={{ color: muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 內容區 ── */}
      <div className="mx-auto max-w-[1100px] px-4 sm:px-8 py-6 sm:py-8">

        {/* ════ YOUNG LEARNER ════
            手機：單欄，大字，寬鬆
            桌機：單欄置中，max-w-680px（內容簡單不需要分欄）
        */}
        {lt === 'Young Learner' && (
          <div className="mx-auto max-w-[680px] flex flex-col gap-5">
            {report.hiddenGem && <HiddenGemCard lang={lang} gem={report.hiddenGem} />}
            {report.teacherNote && <TeacherNoteCard lang={lang} note={report.teacherNote} />}
            {/* 詞彙 — 大字，收藏功能 */}
            {report.vocabulary.length > 0 && (
              <VocabCard lang={lang} kind="word"
                items={report.vocabulary}
                reportId={report.reportId}
                initialSaved={initialSaved}
                largeFont />
            )}
            {reflectionCard}
            {report.nextChallenge && <NextChallengeCard lang={lang} challenge={report.nextChallenge} />}
            <ShareCard {...shareProps} />
            {/* 家長摘要 — 最底部，視覺上分開 */}
            {report.parentSummary && (
              <div className="mt-4">
                <ParentSummaryCard summary={report.parentSummary} />
              </div>
            )}
          </div>
        )}

        {/* ════ JUNIOR ════
            手機：單欄
            桌機：左欄（分析）+ 右欄（詞彙）sticky
            max-w 無限制，用滿 1100px
        */}
        {lt === 'Junior' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* 左欄：分析內容 */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              {report.hiddenGem && <HiddenGemCard lang={lang} gem={report.hiddenGem} cool />}
              {report.teacherNote && <TeacherNoteCard lang={lang} note={report.teacherNote} />}
              {report.strengths.length > 0 && <StrengthCard lang={lang} items={report.strengths} />}
              {report.errors.length > 0 && (
                <ErrorCard lang={lang} errors={report.errors.slice(0, 2)} juniorMode />
              )}
              {reflectionCard}
              {report.nextChallenge && <NextChallengeCard lang={lang} challenge={report.nextChallenge} />}
              <ShareCard {...shareProps} />
            </div>
            {/* 右欄：詞彙（桌機 sticky） */}
            <div className="flex flex-col gap-4 w-full lg:w-[340px] flex-shrink-0 lg:sticky lg:top-[68px]">
              {report.vocabulary.length > 0 && (
                <VocabCard lang={lang} kind="word"
                  items={report.vocabulary}
                  reportId={report.reportId}
                  initialSaved={initialSaved} />
              )}
              {report.phrases.length > 0 && (
                <VocabCard lang={lang} kind="phrase"
                  items={report.phrases}
                  reportId={report.reportId}
                  initialSaved={initialSaved} />
              )}
            </div>
          </div>
        )}

        {/* ════ ADULT ════
            手機：單欄
            桌機：左欄（分析）+ 右欄（詞彙）sticky
            max-w 無限制，用滿 1100px
        */}
        {lt === 'Adult' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* 左欄：完整分析 */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              {report.hiddenGem && <HiddenGemCard lang={lang} gem={report.hiddenGem} />}
              {report.teacherNote && <TeacherNoteCard lang={lang} note={report.teacherNote} />}
              {report.comparison && <ComparisonCard lang={lang} comparison={report.comparison} />}
              {report.strengths.length > 0 && <StrengthCard lang={lang} items={report.strengths} />}
              {report.errors.length > 0 && <ErrorCard lang={lang} errors={report.errors} />}
              {reflectionCard}
              {report.nextChallenge && <NextChallengeCard lang={lang} challenge={report.nextChallenge} />}
              <ShareCard {...shareProps} />
            </div>
            {/* 右欄：詞彙（桌機 sticky） */}
            <div className="flex flex-col gap-4 w-full lg:w-[340px] flex-shrink-0 lg:sticky lg:top-[68px]">
              {report.vocabulary.length > 0 && (
                <VocabCard lang={lang} kind="word"
                  items={report.vocabulary}
                  reportId={report.reportId}
                  initialSaved={initialSaved} />
              )}
              {report.phrases.length > 0 && (
                <VocabCard lang={lang} kind="phrase"
                  items={report.phrases}
                  reportId={report.reportId}
                  initialSaved={initialSaved} />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
