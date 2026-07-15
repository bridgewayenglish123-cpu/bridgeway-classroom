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
      <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-navy px-4 sm:h-[56px] sm:px-6">
        <Link
          href="/home"
          className="text-[13px] text-ivory/70 transition hover:text-ivory"
        >
          {lang === 'zh' ? '← 返回首頁' : '← Home'}
        </Link>

        <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
          {(['zh', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${
                lang === l ? 'bg-gold text-navy' : 'text-ivory/70 hover:text-ivory'
              }`}
            >
              {l === 'zh' ? '中' : 'EN'}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-[640px] space-y-3 px-4 py-6 sm:px-5">
        {report.teacherNote ? (
          <TeacherNoteCard lang={lang} note={report.teacherNote} />
        ) : null}

        <AnalysisCard
          lang={lang}
          zh={report.analysisZh}
          en={report.analysisEn}
          dateLabel={report.dateLabel}
          teacherName={report.teacherName}
        />

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
        <ErrorCard lang={lang} items={report.errors} />
        <ComparisonCard lang={lang} comparison={report.comparison} />
        <ReflectionCard
          lang={lang}
          zh={report.reflectionZh}
          en={report.reflectionEn}
          reportId={report.reportId}
          initialResponse={initialResponse}
        />

        <ShareCard
          studentName={report.studentName}
          dateLabel={report.dateLabel}
          strengthZh={report.strengths[0]?.zh ?? null}
          vocabCount={report.vocabulary.length}
          phraseCount={report.phrases.length}
        />
      </main>
    </div>
  )
}
