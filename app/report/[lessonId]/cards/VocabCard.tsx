'use client'

import { useState, useTransition } from 'react'
import type { Lang, ReportPhrase, ReportVocabulary } from '@/lib/types/report'
import { StarIcon } from './StarIcon'
import { toggleVocabulary } from '../actions'

export function VocabCard({
  lang, kind, items, reportId, initialSaved,
}: {
  lang: Lang
  kind: 'word' | 'phrase'
  items: (ReportVocabulary | ReportPhrase)[]
  reportId: string
  initialSaved: string[]
}) {
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initialSaved))
  const [, startTransition] = useTransition()
  const [confirmTerm, setConfirmTerm] = useState<{
    term: string; defZh: string | null; defEn: string | null
  } | null>(null)

  if (items.length === 0) return null

  const label = kind === 'word'
    ? lang === 'zh' ? '本課單字' : 'Vocabulary'
    : lang === 'zh' ? '本課片語' : 'Phrases'

  const doToggle = (term: string, defZh: string | null, defEn: string | null, isSaved: boolean) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (isSaved) next.delete(term)
      else next.add(term)
      return next
    })
    startTransition(async () => {
      const res = await toggleVocabulary({
        lessonReportId: reportId, word: term, type: kind,
        definitionZh: defZh, definitionEn: defEn, isSaved,
      })
      if (res?.error) {
        setSaved((prev) => {
          const next = new Set(prev)
          if (isSaved) next.add(term)
          else next.delete(term)
          return next
        })
      }
    })
  }

  const handleClick = (term: string, defZh: string | null, defEn: string | null) => {
    const isSaved = saved.has(term)
    if (isSaved) {
      // 取消收藏 → 二次確認
      setConfirmTerm({ term, defZh, defEn })
    } else {
      // 新增收藏 → 直接執行
      doToggle(term, defZh, defEn, false)
    }
  }

  const handleConfirmRemove = () => {
    if (!confirmTerm) return
    doToggle(confirmTerm.term, confirmTerm.defZh, confirmTerm.defEn, true)
    setConfirmTerm(null)
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
            const def = lang === 'zh' ? defZh : defEn
            const isSaved = saved.has(term)
            return (
              <li key={`${term}-${i}`} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-bold text-navy tracking-[-0.01em]">{term}</div>
                  {def && (
                    <div className="mt-1.5 text-[14px] leading-[1.75] text-ink-mid">{def}</div>
                  )}
                </div>
                <button type="button"
                  onClick={() => handleClick(term, defZh, defEn)}
                  aria-label={isSaved ? '取消收藏' : '收藏'}
                  aria-pressed={isSaved}
                  className="mt-0.5 flex-shrink-0 rounded p-0.5 transition-transform active:scale-90">
                  <StarIcon saved={isSaved} />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 取消收藏二次確認 Modal */}
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
              <button onClick={handleConfirmRemove}
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
