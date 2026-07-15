// 全站以 Asia/Taipei 作為業務時區（學生與課表皆在台灣）。
const TZ = 'Asia/Taipei'

const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
}

/** Taipei 當下的小時（0–23）。 */
export function taipeiHour(now: Date = new Date()): number {
  const h = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    hour12: false,
  }).format(now)
  return parseInt(h, 10) % 24
}

/** 時間段問候語（照規格 getGreeting）。 */
export function getGreeting(now: Date = new Date()): string {
  const hour = taipeiHour(now)
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** 問候區日期，如「週日，7月12日」。 */
export function formatGreetingDate(now: Date = new Date()): string {
  const weekday = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TZ,
    weekday: 'short',
  }).format(now)
  const monthDay = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TZ,
    month: 'long',
    day: 'numeric',
  }).format(now)
  return `${weekday}，${monthDay}`
}

/** Taipei 今天的 YYYY-MM-DD（用於 lessons.date 的 gte 查詢）。 */
export function taipeiToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** 由 'YYYY-MM-DD' 產生「週二，7月15日」樣式（下一堂課用）。 */
export function formatLessonDayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00+08:00`)
  const weekday = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TZ,
    weekday: 'short',
  }).format(d)
  const monthDay = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TZ,
    month: 'long',
    day: 'numeric',
  }).format(d)
  return `${weekday}，${monthDay}`
}

/** 由 'YYYY-MM-DD' 拆出歷程卡的月/日，如 { month: '7月', day: '3' }。 */
export function formatLessonDateParts(dateStr: string): {
  month: string
  day: string
} {
  const [, m, d] = dateStr.split('-').map(Number)
  return { month: `${m}月`, day: String(d) }
}

/** 由 'YYYY-MM-DD' 產生「7月10日 · 週四」（摘要卡 badge 用）。 */
export function formatFullLessonDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00+08:00`)
  const monthDay = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TZ,
    month: 'long',
    day: 'numeric',
  }).format(d)
  const weekday = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TZ,
    weekday: 'short',
  }).format(d)
  return `${monthDay} · ${weekday}`
}

/** 某個瞬間所屬 Taipei 週的週一，回傳 'YYYY-MM-DD' 作為 key。 */
function taipeiMondayKey(d: Date): string {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
  const [y, m, day] = ymd.split('-').map(Number)
  const weekdayShort = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
  }).format(d)
  const offset = WEEKDAY_INDEX[weekdayShort] ?? 0
  const monday = new Date(Date.UTC(y, m - 1, day) - offset * 86400000)
  return monday.toISOString().slice(0, 10)
}

function prevWeekKey(key: string): string {
  return new Date(new Date(`${key}T00:00:00Z`).getTime() - 7 * 86400000)
    .toISOString()
    .slice(0, 10)
}

/**
 * 連續上課週數：以 Taipei 週（週一起算）為單位，從本週往回數連續「有上課」的週。
 * 若本週尚未上課（進行中），允許從上一週起算，不因此中斷連續。
 * 註：此為對規格「找連續有上課的週」的一種解讀，計算口徑可再調整。
 */
export function computeStreakWeeks(
  dateStrs: string[],
  now: Date = new Date(),
): number {
  if (dateStrs.length === 0) return 0

  const weeks = new Set<string>()
  for (const ds of dateStrs) {
    weeks.add(taipeiMondayKey(new Date(`${ds}T00:00:00+08:00`)))
  }

  let cursor = taipeiMondayKey(now)
  if (!weeks.has(cursor)) {
    cursor = prevWeekKey(cursor) // 本週進行中、尚未上課的寬限
  }

  let streak = 0
  while (weeks.has(cursor)) {
    streak++
    cursor = prevWeekKey(cursor)
  }
  return streak
}
