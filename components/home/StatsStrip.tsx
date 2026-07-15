function Stat({
  num,
  unit,
  label,
}: {
  num: number
  unit?: string
  label: string
}) {
  return (
    <div className="flex-1 rounded-field bg-white px-3 py-4 text-center shadow-sm">
      <div className="mb-[3px] font-serif text-[28px] leading-none text-navy">
        {num}
        {unit ? <span className="text-[15px]">{unit}</span> : null}
      </div>
      <div className="text-[10px] uppercase tracking-[0.06em] text-ink-muted">
        {label}
      </div>
    </div>
  )
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
  return (
    <div className="mb-3.5 flex gap-2.5">
      <Stat num={completed} label="堂課完成" />
      <Stat num={vocab} label="學習單字" />
      <Stat num={weeks} unit="週" label="學習連續" />
    </div>
  )
}
