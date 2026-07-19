'use client'
import { useState, useTransition } from 'react'
import { updateLearningGoal } from '@/lib/actions/goal'

export function Greeting({
  greeting,
  dateLabel,
  name,
  journeyText,
  goal,
  studentId,
}: {
  greeting: string
  dateLabel: string
  name: string
  journeyText: string
  goal: string
  studentId: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(goal)
  const [current, setCurrent] = useState(goal)
  const [isPending, startTransition] = useTransition()

  const save = () => {
    if (!draft.trim() || draft === current) { setEditing(false); return }
    startTransition(async () => {
      await updateLearningGoal({ studentId, goal: draft.trim() })
      setCurrent(draft.trim())
      setEditing(false)
    })
  }

  return (
    <div className="mb-8">
      {/* 日期 */}
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
        {dateLabel}
      </div>

      {/* 問候 */}
      <h1 className="mb-2.5 font-serif text-[30px] font-medium leading-[1.1] text-navy sm:text-[36px]">
        {greeting},
        <br />
        <em className="italic text-gold">{name}.</em>
      </h1>

      {/* 旅程文字 */}
      <p className="border-l-2 border-gold pl-3 text-[12px] italic leading-[1.7] tracking-[0.01em] text-ink-muted">
        {journeyText}
      </p>

      {/* 目標卡片 */}
      <div className="mt-5 rounded-2xl border border-gold/20 bg-gradient-to-br from-[#FBF8EF] to-[#F5F0E0] px-5 py-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold/70">
            我的目標
          </span>
          {!editing && (
            <button
              onClick={() => { setDraft(current); setEditing(true) }}
              className="text-[10px] text-gold/50 transition hover:text-gold"
            >
              修改
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              className="w-full resize-none rounded-xl border border-gold/30 bg-white/70 px-3 py-2 text-[14px] leading-relaxed text-navy outline-none focus:border-gold/60"
              rows={2}
              autoFocus
              maxLength={100}
            />
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={isPending || !draft.trim()}
                className="rounded-lg bg-gold px-4 py-1.5 text-[12px] font-medium text-white transition hover:bg-gold/90 disabled:opacity-50"
              >
                {isPending ? '儲存中…' : '儲存'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg px-3 py-1.5 text-[12px] text-ink-muted transition hover:text-navy"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <p
            className="cursor-pointer text-[16px] font-medium leading-snug text-navy"
            onClick={() => { setDraft(current); setEditing(true) }}
          >
            {current}
          </p>
        )}
      </div>
    </div>
  )
}
