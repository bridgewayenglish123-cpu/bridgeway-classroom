'use client'

import { useState, useTransition } from 'react'
import type { Lang, ReportPhrase, ReportVocabulary } from '@/lib/types/report'
import { StarIcon } from './StarIcon'
import { toggleVocabulary } from '../actions'

type PendingTerm = {
  term: string
  defZh: string | null
  defEn: string | null
  exEn: string | null
  exZh: string | null
}

export function VocabCard({
  lang, kind, items, reportId, initialSaved, largeFont = false,
}: {
  lang: Lang
  kind: 'word' | 'phrase'
  items: (ReportVocabulary | ReportPhrase)[]
  reportId: string
  initialSaved: string[]
  largeFont?: boolean
}) {
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initialSaved))
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [, startTransition] = useTransition()
  const [confirmTerm, setConfirmTerm] = useState<PendingTerm | null>(null)

  if (items.length === 0) return null

  const label = kind === 'word'
    ? lang === 'zh' ? '本課單字' : 'Vocabulary'
    : lang === 'zh' ? '本課片語' : 'Phrases'

  const doToggle = (t: PendingTerm, isSaved: boolean) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (isSaved) next.delete(t.term)
      else next.add(t.term)
      return next
    })
    startTransition(async () => {
      const res = await toggleVocabulary({
        lessonReportId: reportId,
        word: t.term,
        type: kind,
        definitionZh: t.defZh,
        definitionEn: t.defEn,
        exampleEn: t.exEn,
        exampleZh: t.exZh,
        isSaved,
      })
      if (res?.error) {
        setSaved((prev) => {
          const next = new Set(prev)
          if (isSaved) next.add(t.term)
          else next.delete(t.term)
          return next
        })
      }
    })
  }

  const handleClick = (t: PendingTerm) => {
    const isSaved = saved.has(t.term)
    if (isSaved) setConfirmTerm(t)
    else doToggle(t, false)
  }

  const toggleExpand = (term: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(term)) next.delete(term)
      else next.add(term)
      return next
    })
  }

  return (
    <>
      <section className="rounded-card bg-white p-5 shadow-md sm:p-7">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          {label}
        </div>
        <ul className="flex flex-col divide-y divide-ivory-dim">
          {items.map((it, i) => {
            const term = kind === 'word'
              ? (it as ReportVocabulary).word
              : (it as ReportPhrase).phrase
            const defZh = kind === 'word'
              ? (it as ReportVocabulary).definition_zh ?? null
              : (it as ReportPhrase).usage_zh ?? null
            const defEn = kind === 'word'
              ? (it as ReportVocabulary).definition_en ?? null
              : (it as ReportPhrase).usage_en ?? null
            const exampleEn = (it as any).example_en ?? null
            const exampleZh = (it as any).example_zh ?? null
            const def = lang === 'zh' ? defZh : defEn
            const isSaved = saved.has(term)
            const isExpanded = expanded.has(term)
            const hasExample = exampleEn || exampleZh
            const payload: PendingTerm = {
              term, defZh, defEn, exEn: exampleEn, exZh: exampleZh,
            }

            return (
              <li key={`${term}-${i}`} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    {/* 單字 + 點擊展開 */}
                    <div className="flex items-center gap-2">
                      <div className={`font-bold text-navy tracking-[-0.01em] ${largeFont ? 'text-[22px]' : 'text-[16px]'}`}>{term}</div>
                      {hasExample && (
                        <button
                          onClick={() => toggleExpand(term)}
                          className="text-[11px] px-2 py-0.5 rounded-full transition"
                          style={{
                            background: isExpanded ? '#1A2236' : '#F0EDE6',
                            color: isExpanded ? '#F7F4EE' : '#6B7B8E',
                          }}>
                          {isExpanded
                            ? (lang === 'zh' ? '收起' : 'less')
                            : (lang === 'zh' ? '例句' : 'example')}
                        </button>
                      )}
                    </div>

                    {/* 定義 */}
                    {def && (
                      <div className="mt-1.5 text-[14px] leading-[1.75] text-ink-mid">{def}</div>
                    )}

                    {/* 展開的例句 */}
                    {isExpanded && (exampleEn || exampleZh) && (
                      <div className="mt-3 rounded-xl px-4 py-3 space-y-1"
                        style={{ background: '#F0EDE6' }}>
                        {exampleEn && (
                          <div className="text-[13px] font-medium leading-relaxed" style={{ color: '#1A2236' }}>
                            {exampleEn}
                          </div>
                        )}
                        {exampleZh && (
                          <div className="text-[12px] leading-relaxed" style={{ color: '#6B7B8E' }}>
                            {exampleZh}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 星號收藏 */}
                  <button
                    type="button"
                    onClick={() => handleClick(payload)}
                    aria-label={isSaved ? '取消收藏' : '收藏'}
                    aria-pressed={isSaved}
                    className="mt-0.5 flex-shrink-0 rounded p-0.5 transition-transform active:scale-90">
                    <StarIcon saved={isSaved} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 取消收藏二次確認 */}
      {confirmTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26,34,54,0.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmTerm(null) }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-[18px] font-semibold text-navy">
              {lang === 'zh' ? '取消收藏？' : 'Remove from saved?'}
            </h3>
            <p className="text-[14px] leading-[1.7] text-ink-mid">
              {lang === 'zh'
                ? `確定要從單字本移除「${confirmTerm.term}」嗎？`
                : `Remove "${confirmTerm.term}" from your vocabulary book?`}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmTerm(null)}
                className="px-4 py-2 rounded-field text-[13px] font-medium text-ink-mid border border-ivory-dim transition hover:border-navy">
                {lang === 'zh' ? '保留' : 'Keep'}
              </button>
              <button onClick={() => { doToggle(confirmTerm, true); setConfirmTerm(null) }}
                className="px-5 py-2 rounded-field bg-navy text-[13px] font-semibold text-ivory transition hover:opacity-90">
                {lang === 'zh' ? '確認移除' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
