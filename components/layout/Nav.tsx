function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.trim().slice(0, 2).toUpperCase()
}

export function Nav({ name }: { name: string }) {
  return (
    <nav className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-navy px-[18px] sm:h-[56px] sm:px-7">
      <div className="font-serif text-[19px] font-medium tracking-[0.05em] text-ivory">
        Bridgeway <span className="text-gold-light">Classroom</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[12px] text-ivory/50">{name}</span>
        <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-semibold tracking-[0.03em] text-white">
          {initials(name)}
        </div>
      </div>
    </nav>
  )
}
