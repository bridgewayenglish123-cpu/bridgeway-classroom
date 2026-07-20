'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

type Lesson = {
  id: string
  date: string
  month: string
  day: string
  fullDate: string
  teacherName: string | null
  duration: number | null
  headline: string | null
  summary: string | null
  chips: string[]
  milestone: string | null
  hasReport: boolean
}

export function HistoryClient({
  lessons,
  totalCompleted,
  displayName,
}: {
  lessons: Lesson[]
  totalCompleted: number
  displayName: string
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'report' | 'no-report'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  const filtered = useMemo(() => {
    let list = [...lessons]

    // 篩選
    if (filter === 'report') list = list.filter(l => l.hasReport)
    if (filter === 'no-report') list = list.filter(l => !l.hasReport)

    // 搜尋
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(l =>
        l.teacherName?.toLowerCase().includes(q) ||
        l.headline?.toLowerCase().includes(q) ||
        l.summary?.toLowerCase().includes(q) ||
        l.chips.some(c => c.toLowerCase().includes(q)) ||
        l.fullDate.includes(q)
      )
    }

    // 排序
    list.sort((a, b) => {
      if (sort === 'newest') return b.date.localeCompare(a.date)
      return a.date.localeCompare(b.date)
    })

    return list
  }, [lessons, search, filter, sort])

  return (
    <main className="mx-auto max-w-[800px] px-5 pb-16 pt-8 sm:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/home" className="mb-2 block text-[12px] text-gold/70 transition hover:text-gold">
          ← 返回首頁
        </Link>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-[32px] font-medium text-navy sm:text-[36px]">
            學習歷程
          </h1>
          <span className="text-[13px] text-ink-muted">共 {totalCompleted} 堂</span>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className="mb-5 space-y-3">
        <input
          type="text"
          placeholder="搜尋老師、單字、或日期..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-ivory-dim bg-white px-4 py-3 text-[14px] outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
          style={{ color: '#1a2236' }}
        />
        <div className="flex gap-2 flex-wrap">
          {/* 篩選 */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
            {([
              { value: 'all', label: '全部' },
              { value: 'report', label: '有報告' },
              { value: 'no-report', label: '無報告' },
            ] as const).map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition"
                style={{
                  background: filter === f.value ? '#1a2236' : 'transparent',
                  color: filter === f.value ? '#f7f4ee' : '#9a9080',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* 排序 */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
            {([
              { value: 'newest', label: '最新' },
              { value: 'oldest', label: '最舊' },
            ] as const).map(s => (
              <button key={s.value} onClick={() => setSort(s.value)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition"
                style={{
                  background: sort === s.value ? '#1a2236' : 'transparent',
                  color: sort === s.value ? '#f7f4ee' : '#9a9080',
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 搜尋結果數 */}
        {(search || filter !== 'all') && (
          <div className="text-[12px] text-ink-muted">
            找到 {filtered.length} 筆記錄
          </div>
        )}
      </div>

      {/* 課程列表 */}
      <div className="flex flex-col gap-3">
        {filtered.map(l => (
          l.hasReport ? (
            <Link key={l.id} href={`/report/${l.id}`}
              className="flex items-start gap-4 sm:gap-5 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border-l-[3px] border-gold transition hover:-translate-y-px hover:shadow-md">
              <LessonCard lesson={l} />
            </Link>
          ) : (
            <div key={l.id} className="flex items-start gap-4 sm:gap-5 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border-l-[3px] border-transparent">
              <LessonCard lesson={l} />
            </div>
          )
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ivory-dim py-12 text-center">
            <p className="text-[14px] text-ink-muted">
              {search ? '找不到符合的記錄' : '還沒有完課記錄。'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <>
      {/* 日期 */}
      <div className="w-10 sm:w-12 flex-shrink-0 text-center pt-0.5">
        <span className="block text-[10px] uppercase tracking-[0.08em] text-ink-muted">
          {lesson.month}
        </span>
        <span className="block font-serif text-[24px] sm:text-[28px] font-medium leading-none text-navy">
          {lesson.day}
        </span>
      </div>

      <div className="w-px flex-shrink-0 self-stretch bg-ivory-dim" />

      {/* 內容 */}
      <div className="min-w-0 flex-1">
        {lesson.milestone && (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">
            🏆 {lesson.milestone}
          </div>
        )}
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-semibold text-gold">
            {lesson.teacherName ?? '老師'} 老師
          </span>
          <span className="text-[12px] text-ink-muted flex-shrink-0">
            {lesson.duration ? `${lesson.duration} 分鐘` : ''}
          </span>
        </div>
        {lesson.headline && (
          <p className="mb-1 text-[15px] font-semibold leading-snug text-navy">
            {lesson.headline}
          </p>
        )}
        {lesson.summary && (
          <p className="mb-2.5 line-clamp-2 text-[13px] leading-[1.7] text-ink-mid">
            {lesson.summary}
          </p>
        )}
        {!lesson.hasReport && (
          <p className="mb-2.5 text-[13px] text-ink-muted">報告尚未產生。</p>
        )}
        {lesson.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lesson.chips.map((c, i) => (
              <span key={i} className="rounded-full bg-ivory border border-ivory-dim px-2.5 py-0.5 text-[11px] text-ink-muted">
                {c}
              </span>
            ))}
          </div>
        )}
        {lesson.hasReport && (
          <div className="mt-2 text-[12px] font-medium text-gold">
            查看完整報告 →
          </div>
        )}
      </div>
    </>
  )
}
