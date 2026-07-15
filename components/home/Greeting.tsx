export function Greeting({
  greeting,
  dateLabel,
  name,
  journeyText,
  goal,
}: {
  greeting: string
  dateLabel: string
  name: string
  journeyText: string
  goal: string
}) {
  return (
    <div className="mb-8">
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
        {dateLabel}
      </div>
      <h1 className="mb-2.5 font-serif text-[30px] font-medium leading-[1.1] text-navy sm:text-[36px]">
        {greeting},
        <br />
        <em className="italic text-gold">{name}.</em>
      </h1>
      <p className="border-l-2 border-gold pl-3 text-[12px] italic leading-[1.7] tracking-[0.01em] text-ink-muted">
        {journeyText}
      </p>
      <p className="mt-2.5 pl-3 text-[12px] leading-relaxed text-ink-muted">
        你的目標：<span className="text-ink-mid">{goal}</span>
      </p>
    </div>
  )
}
