function Stat({
  num,
  unit,
  label,
  highlight,
}: {
  num: number
  unit?: string
  label: string
  highlight?: boolean
}) {
  return (
    <div className={`flex-1 rounded-2xl px-4 py-5 text-center shadow-sm transition-all sm:py-6 ${
      highlight
        ? 'bg-gradient-to-b from-[#FBF8EF] to-white border border-gold/25'
        : 'bg-white border border-ivory-dim'
    }`}>
      <div className={`mb-1 font-serif text-[36px] leading-none sm:text-[42px] ${
        highlight ? 'text-gold' : 'text-navy'
      }`}>
        {num}
        {unit ? <span className="text-[20px]">{unit}</span> : null}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </div>
    </div>
  )
}

function getMilestoneMessage(completed: number): string | null {
  if (completed === 1) return '🎉 完成第一堂課！旅程開始了。'
  if (completed === 5) return '✨ 五堂課！習慣正在養成。'
  if (completed === 10) return '🏆 十堂課里程碑！你做到了。'
  if (completed === 20) return '🌟 二十堂課！你的英文已經不一樣了。'
  if (completed === 30) return '👑 三十堂課！你是真正的學習者。'
  if (completed === 50) return '🚀 五十堂課！卓越的堅持。'
  return null
}

export function StatsStrip({
  completed,
  vocab,
  weeks,
}: {
  completed: number
  vocab: number
  weeks: number
}) {
  const milestone = getMilestoneMessage(completed)
  const nextMilestone = [1, 5, 10, 20, 30, 50].find(n => n > completed)
  const remaining = nextMilestone ? nextMilestone - completed : null

  return (
    <div className="mb-4">
      {milestone && (
        <div className="mb-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-[#FBF8EF] to-[#F5F0E0] px-5 py-4 text-center">
          <p className="text-[14px] font-medium text-navy">{milestone}</p>
        </div>
      )}
      <div className="flex gap-3">
        <Stat num={completed} label="堂課完成" highlight={completed > 0 && completed % 5 === 0} />
        <Stat num={vocab} label="學習單字" />
        <Stat num={weeks} unit="週" label="學習連續" highlight={weeks >= 4} />
      </div>
      {remaining && remaining <= 3 && (
        <p className="mt-3 text-center text-[13px] font-medium text-gold">
          再 {remaining} 堂就達到新里程碑 ✦
        </p>
      )}
    </div>
  )
}
