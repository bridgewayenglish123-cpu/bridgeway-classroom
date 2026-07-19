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
}: {
  report: ReportVM
  savedWords: string[]
  initialResponse: string | null
}) {
  const [lang, setLang] = useState<Lang>('zh')

  return (
    <div className="min-h-[100dvh] bg-ivory">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-navy px-4 sm:h-[56px] sm:px-8">
        <Link
          href="/home"
          className="flex items-center gap-1.5 text-[13px] text-ivory/70 transition hover:text-ivory"
        >
          <span className="text-[16px] leading-none">←</span>
          <span>{lang === 'zh' ? '返回首頁' : 'Home'}</span>
        </Link>

        {/* 中英切換 — 更明顯 */}
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1">
          {(['zh', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-semibold tracking-wide transition-all ${
                lang === l
                  ? 'bg-gold text-navy shadow-sm'
                  : 'text-ivory/60 hover:text-ivory'
              }`}
            >
              {l === 'zh' ? '中文' : 'EN'}
            </button>
          ))}
        </div>
      </header>

      {/* ── Hero header ── */}
      <div className="bg-navy px-4 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-1 text-[12px] font-medium text-gold/80">
            {report.dateLabel}
            {report.teacherName
              ? ` · ${report.teacherName}${lang === 'zh' ? ' 老師' : ''}`
              : ''}
          </div>
          <h1 className="font-serif text-[20px] font-medium leading-snug text-ivory sm:text-[24px]">
            {lang === 'zh'
              ? report.analysisZh?.headline
              : report.analysisEn?.headline}
          </h1>
          {report.milestone && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1">
              <span className="text-[13px] font-medium text-gold">
                🏆 {report.milestone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── 主內容：桌機兩欄，手機單欄 ── */}
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-8 sm:py-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:items-start">

        {/* 左欄：主要內容 */}
        <div className="flex flex-col gap-4">
          {/* 分析 */}
          <AnalysisCard
            lang={lang}
            zh={report.analysisZh}
            en={report.analysisEn}
            dateLabel={report.dateLabel}
            teacherName={report.teacherName}
            hideHeader
          />

          {/* 老師留言 */}
          {report.teacherNote ? (
            <TeacherNoteCard lang={lang} note={report.teacherNote} />
          ) : null}

          {/* 錯誤分析 */}
          <ErrorCard lang={lang} items={report.errors} />

          {/* 比較 */}
          <ComparisonCard lang={lang} comparison={report.comparison} />

          {/* 反思 */}
          <ReflectionCard
            lang={lang}
            zh={report.reflectionZh}
            en={report.reflectionEn}
            reportId={report.reportId}
            initialResponse={initialResponse}
          />

          {/* 分享卡 */}
          <ShareCard
            studentName={report.studentName}
            dateLabel={report.dateLabel}
            strengthZh={report.strengths[0]?.zh ?? null}
            vocabCount={report.vocabulary.length}
            phraseCount={report.phrases.length}
          />
        </div>

        {/* 右欄（桌機固定）：詞彙 + 強項 */}
        <div className="mt-4 flex flex-col gap-4 lg:mt-0">
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
          <StrengthCard lang={lang} items={report.strengths} />
        </div>
      </main>
    </div>
  )
}
