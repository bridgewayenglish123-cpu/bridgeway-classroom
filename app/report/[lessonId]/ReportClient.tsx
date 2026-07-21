'use client'

import { useState } from 'react'
import type { Lang, ReportVM } from '@/lib/types/report'
import { HiddenGemCard } from './cards/HiddenGemCard'
import { NextChallengeCard } from './cards/NextChallengeCard'
import { ParentSummaryCard } from './cards/ParentSummaryCard'
import { VocabCard } from './cards/VocabCard'
import { ErrorCard } from './cards/ErrorCard'
import { ReflectionCard } from './cards/ReflectionCard'
import { ShareCard } from './cards/ShareCard'
import { TeacherNoteCard } from './cards/TeacherNoteCard'
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
    ? `${report.lessonDate} 的課堂學習報告`
    : `Lesson Report · ${report.lessonDate}`

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

      {/* Hero */}
      <div className="bg-navy px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
        <div className="mx-auto max-w-2xl">
          <p className="mb-1 text-[13px] font-medium tracking-[0.08em] text-gold opacity-80 uppercase">
            {lang === 'zh' ? '學習報告' : 'Learning Report'}
          </p>
          <h1 className={`font-serif font-semibold text-ivory leading-tight ${lt === 'Young Learner' ? 'text-[32px] sm:text-[38px]' : 'text-[26px] sm:text-[32px]'}`}>
            {title}
          </h1>
          <p className="mt-2 text-[14px] text-ivory opacity-50">{subtitle}</p>

          {/* 統計 */}
          <div className="mt-6 flex gap-4 flex-wrap">
            {[
              { n: report.vocabCount, label: lang === 'zh' ? '單字' : 'Words' },
              { n: report.phraseCount, label: lang === 'zh' ? '片語' : 'Phrases' },
              { n: report.completedCount, label: lang === 'zh' ? '累計堂數' : 'Lessons' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-[28px] font-bold text-ivory">{s.n}</div>
                <div className="text-[11px] text-ivory opacity-50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 內容 */}
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-8 space-y-4">

        {/* ===== YOUNG LEARNER 版面 ===== */}
        {lt === 'Young Learner' && (<>
          {/* Hidden Gem — 必要且最顯眼 */}
          {report.hiddenGem && (
            <HiddenGemCard lang={lang} gem={report.hiddenGem} />
          )}

          {/* 老師留言 */}
          {report.teacherNote && (
            <TeacherNoteCard lang={lang} note={report.teacherNote} />
          )}

          {/* 詞彙 — 只顯示單字，不顯示定義，大字體 */}
          {report.vocabulary.length > 0 && (
            <VocabCard
              lang={lang} kind="word"
              items={report.vocabulary}
              reportId={report.id}
              initialSaved={initialSaved}
              largeFont
            />
          )}

          {/* 簡單寫作練習 */}
          {report.reflectionQuestion && (
            <ReflectionCard
              lang={lang}
              question={report.reflectionQuestion}
              lessonReportId={report.id}
              existingResponse={report.reflectionResponse ?? null}
              existingFeedback={report.reflectionFeedback ?? null}
              simple
            />
          )}

          {/* Next Challenge — 簡單版 */}
          {report.nextChallenge && (
            <NextChallengeCard lang={lang} challenge={report.nextChallenge} />
          )}

          {/* 分享 */}
          <ShareCard lang={lang} report={report} />

          {/* 家長摘要 — 最底部 */}
          {report.parentSummary && (
            <ParentSummaryCard summary={report.parentSummary} />
          )}
        </>)}

        {/* ===== JUNIOR 版面 ===== */}
        {lt === 'Junior' && (<>
          {/* Hidden Gem — 酷感，放最前 */}
          {report.hiddenGem && (
            <HiddenGemCard lang={lang} gem={report.hiddenGem} cool />
          )}

          {/* 老師留言 */}
          {report.teacherNote && (
            <TeacherNoteCard lang={lang} note={report.teacherNote} />
          )}

          {/* 詞彙 + 片語 */}
          {report.vocabulary.length > 0 && (
            <VocabCard lang={lang} kind="word" items={report.vocabulary} reportId={report.id} initialSaved={initialSaved} />
          )}
          {report.phrases.length > 0 && (
            <VocabCard lang={lang} kind="phrase" items={report.phrases} reportId={report.id} initialSaved={initialSaved} />
          )}

          {/* 強項 */}
          {report.strengths.length > 0 && (
            <StrengthCard lang={lang} strengths={report.strengths} />
          )}

          {/* 錯誤 — 最多2個，用「升級挑戰」標題 */}
          {report.errors.length > 0 && (
            <ErrorCard lang={lang} errors={report.errors.slice(0, 2)} juniorMode />
          )}

          {/* 寫作練習 */}
          {report.reflectionQuestion && (
            <ReflectionCard
              lang={lang}
              question={report.reflectionQuestion}
              lessonReportId={report.id}
              existingResponse={report.reflectionResponse ?? null}
              existingFeedback={report.reflectionFeedback ?? null}
            />
          )}

          {/* Next Challenge */}
          {report.nextChallenge && (
            <NextChallengeCard lang={lang} challenge={report.nextChallenge} />
          )}

          {/* 分享 */}
          <ShareCard lang={lang} report={report} />
        </>)}

        {/* ===== ADULT 版面 ===== */}
        {lt === 'Adult' && (<>
          {/* Hidden Gem */}
          {report.hiddenGem && (
            <HiddenGemCard lang={lang} gem={report.hiddenGem} />
          )}

          {/* 老師留言 */}
          {report.teacherNote && (
            <TeacherNoteCard lang={lang} note={report.teacherNote} />
          )}

          {/* 比較上堂課 */}
          {(report.comparison_zh || report.comparison_en) && (
            <ComparisonCard lang={lang} zh={report.comparison_zh} en={report.comparison_en} />
          )}

          {/* 強項 */}
          {report.strengths.length > 0 && (
            <StrengthCard lang={lang} strengths={report.strengths} />
          )}

          {/* 錯誤分析 — 完整 */}
          {report.errors.length > 0 && (
            <ErrorCard lang={lang} errors={report.errors} />
          )}

          {/* 詞彙 + 片語 */}
          {report.vocabulary.length > 0 && (
            <VocabCard lang={lang} kind="word" items={report.vocabulary} reportId={report.id} initialSaved={initialSaved} />
          )}
          {report.phrases.length > 0 && (
            <VocabCard lang={lang} kind="phrase" items={report.phrases} reportId={report.id} initialSaved={initialSaved} />
          )}

          {/* 寫作練習 */}
          {report.reflectionQuestion && (
            <ReflectionCard
              lang={lang}
              question={report.reflectionQuestion}
              lessonReportId={report.id}
              existingResponse={report.reflectionResponse ?? null}
              existingFeedback={report.reflectionFeedback ?? null}
            />
          )}

          {/* Next Challenge */}
          {report.nextChallenge && (
            <NextChallengeCard lang={lang} challenge={report.nextChallenge} />
          )}

          {/* 分享 */}
          <ShareCard lang={lang} report={report} />
        </>)}

      </div>
    </div>
  )
}
