'use client'

import { useState, useTransition } from 'react'
import type { Lang } from '@/lib/types/report'
import { saveReflection } from '../actions'

type FeedbackPoint = {
  original: string
  fixed: string
  reason: string
}

type Feedback = {
  strength: string
  corrected: string
  points: FeedbackPoint[]
  encouragement: string
}

export function ReflectionCard({
  lang,
  zh,
  en,
  reportId,
  initialResponse,
  initialFeedback,
  studentAge,
}: {
  lang: Lang
  zh: string | null
  en: string | null
  reportId: string
  initialResponse: string | null
  initialFeedback: string | null
  studentAge?: number | null
}) {
  const question = lang === 'zh' ? zh : en
  const [text, setText] = useState(initialResponse ?? '')
  const [submitted, setSubmitted] = useState(Boolean(initialResponse && initialResponse.trim()))
  const [feedback, setFeedback] = useState<Feedback | null>(
    initialFeedback ? JSON.parse(initialFeedback) : null
  )
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGrading, setIsGrading] = useState(false)

  if (!question) return null

  const handleSubmitClick = () => {
    if (text.trim() === '') return
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    setError(null)
    startTransition(async () => {
      // 1. 存回答
      const res = await saveReflection({ lessonReportId: reportId, response: text })
      if (res?.error) { setError(res.error); return }
      setSubmitted(true)

      // 2. 呼叫 Claude 批改
      setIsGrading(true)
      try {
        const gradeRes = await fetch('/api/grade-reflection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            response: text,
            question: lang === 'zh' ? zh : en,
            reportId,
            studentAge: studentAge ?? null,
          }),
        })
        const data = await gradeRes.json()
        if (data.feedback) setFeedback(data.feedback)
        else setError(data.error ?? '批改失敗')
      } catch {
        setError('批改失敗，請聯絡 Bridgeway。')
      } finally {
        setIsGrading(false)
      }
    })
  }

  return (
    <section className="rounded-card bg-white p-6 shadow-md sm:p-8">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {lang === 'zh' ? '今天的思考題' : "Today's Reflection"}
      </div>
      <p className="mb-5 font-serif text-[22px] font-semibold leading-[1.6] text-navy">{question}</p>

      {!submitted ? (
        <>
          {/* 提示說明 */}
          <div className="mb-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
            <p className="text-[13px] leading-[1.7] text-ink-mid">
              {lang === 'zh'
                ? '📝 寫完後系統會幫你批改一次，提交後就不能再修改了。請確認內容後再送出。'
                : '📝 After you submit, the system will review your writing once. You cannot edit after submitting. Please review before sending.'}
            </p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={lang === 'zh' ? '用英文寫下你的回答...' : 'Write your answer in English...'}
            rows={5}
            className="w-full resize-none rounded-field border border-ivory-dim bg-white px-4 py-3 text-[15px] leading-[1.8] text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/25"
          />

          {error && <p className="mt-2 text-[12px] text-[#b3261e]">{error}</p>}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={isPending || text.trim() === ''}
              className="rounded-field bg-gold px-5 py-2 text-[13px] font-semibold text-navy shadow-[0_2px_12px_rgba(184,151,58,0.35)] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {lang === 'zh' ? '提交批改' : 'Submit for Review'}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 學生原始回答 */}
          <div className="mb-5 rounded-xl bg-ivory p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              {lang === 'zh' ? '你的回答' : 'Your Answer'}
            </div>
            <p className="text-[14px] leading-[1.8] text-ink">{text}</p>
          </div>

          {/* 批改結果 */}
          {isGrading ? (
            <div className="flex items-center gap-3 py-6 text-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <span className="text-[13px] text-ink-muted">
                {lang === 'zh' ? 'AI 正在批改中…' : 'AI is reviewing your writing…'}
              </span>
            </div>
          ) : feedback ? (
            <div className="space-y-4">
              {/* 強項 */}
              <div className="rounded-xl border-l-[3px] border-gold pl-4 py-2">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
                  {lang === 'zh' ? '✦ 你做得好的地方' : '✦ What You Did Well'}
                </div>
                <p className="text-[14px] leading-[1.75] text-ink">{feedback.strength}</p>
              </div>

              {/* 修正版本 */}
              <div className="rounded-xl bg-navy/5 p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  {lang === 'zh' ? '✦ 修正版本' : '✦ Corrected Version'}
                </div>
                <p className="text-[14px] leading-[1.85] text-navy font-medium">{feedback.corrected}</p>
              </div>

              {/* 重點說明 */}
              {feedback.points.length > 0 && (
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    {lang === 'zh' ? '✦ 重點說明' : '✦ Key Points'}
                  </div>
                  <ul className="space-y-3">
                    {feedback.points.map((p, i) => (
                      <li key={i} className="rounded-xl border border-ivory-dim p-3.5">
                        <div className="flex items-start gap-2 mb-1.5">
                          <span className="text-[12px] line-through text-ink-muted/60">{p.original}</span>
                          <span className="text-[12px] text-ink-muted">→</span>
                          <span className="text-[13px] font-semibold text-navy">{p.fixed}</span>
                        </div>
                        <p className="text-[13px] leading-[1.7] text-ink-mid">{p.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 鼓勵 */}
              <div className="rounded-xl bg-gold/10 px-4 py-3 text-center">
                <p className="text-[14px] font-medium text-navy">{feedback.encouragement}</p>
              </div>
            </div>
          ) : error ? (
            <p className="text-[13px] text-[#b3261e]">{error}</p>
          ) : null}
        </>
      )}

      {/* 二次確認 Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26,34,54,0.55)' }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-[18px] font-semibold text-navy">
              {lang === 'zh' ? '確認提交？' : 'Ready to Submit?'}
            </h3>
            <p className="text-[13px] leading-[1.7] text-ink-mid">
              {lang === 'zh'
                ? '提交後系統會立即批改你的回答，且無法再修改。確定要送出嗎？'
                : 'Once submitted, the AI will review your writing and you cannot make changes. Are you sure?'}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-field text-[13px] font-medium text-ink-mid border border-ivory-dim transition hover:border-navy"
              >
                {lang === 'zh' ? '再想想' : 'Go Back'}
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-field bg-gold text-[13px] font-semibold text-navy shadow-[0_2px_12px_rgba(184,151,58,0.35)] transition hover:bg-gold-light"
              >
                {lang === 'zh' ? '確認提交' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
