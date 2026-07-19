'use client'

import { useState, useTransition } from 'react'
import type { Lang } from '@/lib/types/report'
import { saveReflection } from '../actions'

export function ReflectionCard({
  lang,
  zh,
  en,
  reportId,
  initialResponse,
}: {
  lang: Lang
  zh: string | null
  en: string | null
  reportId: string
  initialResponse: string | null
}) {
  const question = lang === 'zh' ? zh : en
  const [text, setText] = useState(initialResponse ?? '')
  const [saved, setSaved] = useState(Boolean(initialResponse && initialResponse.trim()))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!question) return null

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const res = await saveReflection({ lessonReportId: reportId, response: text })
      if (res?.error) setError(res.error)
      else setSaved(true)
    })
  }

  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-7">
      <div className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {lang === 'zh' ? '今天的思考題' : "Today's Reflection"}
      </div>
      <p className="mb-4 text-[15px] leading-relaxed text-ink">{question}</p>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          if (saved) setSaved(false)
        }}
        placeholder={lang === 'zh' ? '寫下你的想法...' : 'Write your thoughts...'}
        rows={4}
        className="w-full resize-none rounded-field border border-ivory-dim bg-white px-4 py-3 text-[14px] leading-relaxed text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/25"
      />

      {error ? <p className="mt-2 text-[12px] text-[#b3261e]">{error}</p> : null}

      <div className="mt-3 flex items-center justify-end">
        {saved ? (
          <span className="text-[13px] font-medium text-gold">
            {lang === 'zh' ? '你的想法已記錄。' : 'Your thoughts are saved.'}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || text.trim() === ''}
            className="rounded-field bg-gold px-5 py-2 text-[13px] font-semibold text-navy shadow-[0_2px_12px_rgba(184,151,58,0.35)] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? lang === 'zh'
                ? '儲存中…'
                : 'Saving…'
              : lang === 'zh'
                ? '儲存'
                : 'Save'}
          </button>
        )}
      </div>
    </section>
  )
}
