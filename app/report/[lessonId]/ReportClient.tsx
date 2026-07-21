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

export function ReportClient({ report, initialSaved }: {
  report: ReportVM
  initialSaved: string[]
}) {
  const [lang, setLang] = useState<Lang>('zh')
  const lt = report.learnerType ?? 'Adult'

  const studentName = report.studentName
  const title = lang === 'zh' ? `${studentName}，你好！` : `Hi, ${studentName}!`
  const subtitle = lang === 'zh'
    ? `${report.dateLabel} 的課堂學習報告`
    : `Lesson Report · ${report.dateLabel}`

  const reflectionZh = report.reflectionZh
  const reflectionEn = report.reflectionEn


  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-navy px-5 sm:h-[56px] sm:px-8">
        <div className="font-serif text-[16px] font-medium text-ivory tracking-wide">
          Bridgeway
        </div>
        <button
          onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
          className="rounded-full px-3 py-1 text-[12px] font-medium transition"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#F7F4EE' }}>
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </header>

      {/* Hero — 輕量 ivory 風格 */}
      <div className="border-b px-5 py-6 sm:px-8 sm:py-8"
        style={{ background: '#F7F4EE', borderColor: 'rgba(26,34,54,0.08)' }}>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-1"
                style={{ color: '#B8973A' }}>
                {lang === 'zh' ? '學習報告' : 'Learning Report'}
              </p>
              <h1 className={`font-serif font-semibold leading-tight`}
                style={{ color: '#1A2236', fontSize: lt === 'Young Learner' ? '28px' : '24px' }}>
                {title}
              </h1>
              <p className="mt-1 text-[13px]" style={{ color: '#6B7B8E' }}>{subtitle}</p>
            </div>
            {/* 統計 */}
            <div className="flex gap-5">
              {[
                { n: report.vocabulary.length, label: lang === 'zh' ? '單字' : 'Words' },
                { n: report.phrases.length, label: lang === 'zh' ? '片語' : 'Phrases' },
                { n: report.completedCount, label: lang === 'zh' ? '累計堂數' : 'Lessons' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-serif text-[26px] font-bold" style={{ color: '#1A2236' }}>{s.n}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#6B7B8E' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 內容 */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">

        {/* ===== YOUNG LEARNER ===== */}
        {lt === 'Young Learner' && (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* 左欄 */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
          {report.hiddenGem && <HiddenGemCard lang={lang} gem={report.hiddenGem} />}
          {report.teacherNote && <TeacherNoteCard lang={lang} note={report.teacherNote} />}
          {(reflectionZh || reflectionEn) && (
            <ReflectionCard
              lang={lang} zh={reflectionZh} en={reflectionEn}
              reportId={report.reportId}
              initialResponse={report.reflectionFeedback ? '' : null}
              initialFeedback={report.reflectionFeedback}
              studentAge={report.studentAge}
            />
          )}
          {report.nextChallenge && <NextChallengeCard lang={lang} challenge={report.nextChallenge} />}
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
            {report.parentSummary && <ParentSummaryCard summary={report.parentSummary} />}
            </div>
            {/* 右欄 */}
            <div className="flex flex-col gap-4 sm:w-[320px] flex-shrink-0">
              {report.vocabulary.length > 0 && (
                <VocabCard lang={lang} kind="word" items={report.vocabulary}
                  reportId={report.reportId} initialSaved={initialSaved} largeFont />
              )}
            </div>
          </div>
        )}

        {/* ===== JUNIOR ===== */}
        {lt === 'Junior' && (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
          {report.hiddenGem && <HiddenGemCard lang={lang} gem={report.hiddenGem} cool />}
          {report.teacherNote && <TeacherNoteCard lang={lang} note={report.teacherNote} />}
          {report.strengths.length > 0 && <StrengthCard lang={lang} items={report.strengths} />}
          {report.errors.length > 0 && (
            <ErrorCard lang={lang} errors={report.errors.slice(0, 2)} juniorMode />
          )}
          {(reflectionZh || reflectionEn) && (
            <ReflectionCard
              lang={lang} zh={reflectionZh} en={reflectionEn}
              reportId={report.reportId}
              initialResponse={report.reflectionFeedback ? '' : null}
              initialFeedback={report.reflectionFeedback}
              studentAge={report.studentAge}
            />
          )}
              {report.nextChallenge && <NextChallengeCard lang={lang} challenge={report.nextChallenge} />}
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
            <div className="flex flex-col gap-4 sm:w-[320px] flex-shrink-0">
              {report.vocabulary.length > 0 && (
                <VocabCard lang={lang} kind="word" items={report.vocabulary}
                  reportId={report.reportId} initialSaved={initialSaved} />
              )}
              {report.phrases.length > 0 && (
                <VocabCard lang={lang} kind="phrase" items={report.phrases}
                  reportId={report.reportId} initialSaved={initialSaved} />
              )}
            </div>
          </div>
        )}

        {/* ===== ADULT ===== */}
        {lt === 'Adult' && (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
          {report.hiddenGem && <HiddenGemCard lang={lang} gem={report.hiddenGem} />}
          {report.teacherNote && <TeacherNoteCard lang={lang} note={report.teacherNote} />}
          {report.comparison && <ComparisonCard lang={lang} comparison={report.comparison} />}
          {report.strengths.length > 0 && <StrengthCard lang={lang} items={report.strengths} />}
          {report.errors.length > 0 && <ErrorCard lang={lang} errors={report.errors} />}

          {(reflectionZh || reflectionEn) && (
            <ReflectionCard
              lang={lang} zh={reflectionZh} en={reflectionEn}
              reportId={report.reportId}
              initialResponse={report.reflectionFeedback ? '' : null}
              initialFeedback={report.reflectionFeedback}
              studentAge={report.studentAge}
            />
          )}
              {report.nextChallenge && <NextChallengeCard lang={lang} challenge={report.nextChallenge} />}
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
            <div className="flex flex-col gap-4 sm:w-[320px] flex-shrink-0">
              {report.vocabulary.length > 0 && (
                <VocabCard lang={lang} kind="word" items={report.vocabulary}
                  reportId={report.reportId} initialSaved={initialSaved} />
              )}
              {report.phrases.length > 0 && (
                <VocabCard lang={lang} kind="phrase" items={report.phrases}
                  reportId={report.reportId} initialSaved={initialSaved} />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
