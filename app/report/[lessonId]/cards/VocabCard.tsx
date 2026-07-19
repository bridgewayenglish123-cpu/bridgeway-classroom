'use client'

import { useState, useTransition } from 'react'
import type { Lang, ReportPhrase, ReportVocabulary } from '@/lib/types/report'
import { StarIcon } from './StarIcon'
import { toggleVocabulary } from '../actions'

export function VocabCard({
  lang,
  kind,
  items,
  reportId,
  initialSaved,
}: {
  lang: Lang
  kind: 'word' | 'phrase'
  items: (ReportVocabulary | ReportPhrase)[]
  reportId: string
  initialSaved: string[]
}) {
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initialSaved))
  const [, startTransition] = useTransition()

  if (items.length === 0) return null

  const label =
    kind === 'word'
      ? lang === 'zh'
        ? '本課單字'
        : 'Vocabulary'
      : lang === 'zh'
        ? '本課片語'
        : 'Phrases'

  const toggle = (term: string, defZh: string | null, defEn: string | null) => {
    const isSaved = saved.has(term)
    // optimistic update
    setSaved((prev) => {
      const next = new Set(prev)
      if (isSaved) next.delete(term)
      else next.add(term)
      return next
    })
    startTransition(async () => {
      const res = await toggleVocabulary({
        lessonReportId: reportId,
        word: term,
        type: kind,
        definitionZh: defZh,
        definitionEn: defEn,
        isSaved,
      })
      if (res?.error) {
        // 失敗時還原
        setSaved((prev) => {
          const next = new Set(prev)
          if (isSaved) next.add(term)
          else next.delete(term)
          return next
        })
      }
    })
  }

  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-7">
      <div className="mb-4 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </div>
      <ul className="flex flex-col divide-y divide-ivory-dim">
        {items.map((it, i) => {
          const term =
            kind === 'word'
              ? (it as ReportVocabulary).word
              : (it as ReportPhrase).phrase
          const defZh =
            kind === 'word'
              ? (it as ReportVocabulary).definition_zh ?? null
              : (it as ReportPhrase).usage_zh ?? null
          const defEn =
            kind === 'word'
              ? (it as ReportVocabulary).definition_en ?? null
              : (it as ReportPhrase).usage_en ?? null
          const def = lang === 'zh' ? defZh : defEn
          const isSaved = saved.has(term)
          return (
            <li
              key={`${term}-${i}`}
              className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium text-navy">{term}</div>
                {def ? (
                  <div className="mt-1 text-[13px] leading-relaxed text-ink-mid">
                    {def}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => toggle(term, defZh, defEn)}
                aria-label={isSaved ? '取消收藏' : '收藏'}
                aria-pressed={isSaved}
                className="mt-0.5 flex-shrink-0 rounded p-0.5 transition-transform active:scale-90"
              >
                <StarIcon saved={isSaved} />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
