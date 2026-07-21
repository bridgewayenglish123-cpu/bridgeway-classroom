'use client'
import { useState } from 'react'
import type { Lang, ReportError } from '@/lib/types/report'

export function ErrorCard({ lang, errors }: { lang: Lang; errors: ReportError[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  if (!errors || errors.length === 0) return null

  const toggle = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const label = lang === 'zh' ? '值得注意的地方' : 'Points to Note'
  const thinkLabel = lang === 'zh' ? '你覺得哪裡怪怪的？點擊看答案 →' : 'Spot the error? Tap to reveal →'
  const answerLabel = lang === 'zh' ? '正確版本' : 'Correction'
  const tipLabel = lang === 'zh' ? '小提示' : 'Tip'

  return (
    <section className="rounded-card bg-white p-5 shadow-md sm:p-7">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </div>
      <ul className="flex flex-col gap-4">
        {errors.map((err, i) => {
          const isOpen = expanded.has(i)
          const pattern = lang === 'zh' ? (err.pattern_zh ?? err.pattern) : (err.pattern_en ?? err.pattern)
          const tip = lang === 'zh' ? err.tip_zh : err.tip_en
          const examples = err.examples ?? (err.example ? [{ original: err.example, correction: err.correction ?? '' }] : [])

          return (
            <li key={i} className="rounded-2xl overflow-hidden border"
              style={{ borderColor: 'rgba(26,34,54,0.08)' }}>

              {/* 問題展示區 — 永遠顯示 */}
              <div className="p-4 sm:p-5">
                <div className="text-[13px] font-semibold mb-2" style={{ color: '#1A2236' }}>
                  {pattern}
                  {err.count > 1 && (
                    <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full"
                      style={{ background: '#FEF3C7', color: '#92400E' }}>
                      ×{err.count}
                    </span>
                  )}
                </div>

                {/* 原句 — 讓學生先想 */}
                {examples.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {examples.map((ex, j) => (
                      <div key={j} className="text-[13px] px-3 py-2 rounded-xl font-mono"
                        style={{ background: '#FEF2F2', color: '#991B1B' }}>
                        ✗ {ex.original}
                      </div>
                    ))}
                  </div>
                )}

                {/* 展開按鈕 */}
                <button onClick={() => toggle(i)}
                  className="mt-3 text-[12px] font-medium px-3 py-1.5 rounded-xl transition w-full text-left"
                  style={{ background: isOpen ? '#1A2236' : '#F0EDE6', color: isOpen ? '#F7F4EE' : '#6B7B8E' }}>
                  {isOpen ? (lang === 'zh' ? '收起答案 ↑' : 'Hide answer ↑') : thinkLabel}
                </button>
              </div>

              {/* 答案區 — 展開才顯示 */}
              {isOpen && (
                <div className="border-t px-4 py-4 sm:px-5 space-y-3"
                  style={{ borderColor: 'rgba(26,34,54,0.06)', background: '#F7F4EE' }}>
                  {/* 正確版本 */}
                  {examples.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                        style={{ color: '#6B7B8E' }}>{answerLabel}</div>
                      {examples.map((ex, j) => (
                        ex.correction && (
                          <div key={j} className="text-[13px] px-3 py-2 rounded-xl font-mono"
                            style={{ background: '#F0FDF4', color: '#166534' }}>
                            ✓ {ex.correction}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* 小提示 */}
                  {tip && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide mb-1"
                        style={{ color: '#6B7B8E' }}>{tipLabel}</div>
                      <p className="text-[13px] leading-relaxed" style={{ color: '#1A2236' }}>{tip}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
