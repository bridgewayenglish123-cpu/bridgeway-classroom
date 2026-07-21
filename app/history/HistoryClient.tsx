'use client'
import { useState, useMemo, useEffect } from 'react'
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
  reportCreatedAt: string | null
}

const PAGE_SIZE = 10
const STORAGE_KEY = 'bw_read_reports'

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function markRead(id: string) {
  if (typeof window === 'undefined') return
  try {
    const ids = getReadIds()
    ids.add(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {}
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
  const [filterReport, setFilterReport] = useState<'all' | 'report' | 'no-report'>('all')
  const [filterUnread, setFilterUnread] = useState(false)
  const [filterTeacher, setFilterTeacher] = useState<string>('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(1)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [groupByMonth, setGroupByMonth] = useState(true)

  useEffect(() => { setReadIds(getReadIds()) }, [])

  // 老師列表
  const teachers = useMemo(() => {
    const set = new Set<string>()
    lessons.forEach(l => { if (l.teacherName) set.add(l.teacherName) })
    return Array.from(set).sort()
  }, [lessons])

  const filtered = useMemo(() => {
    let list = [...lessons]
    if (filterReport === 'report') list = list.filter(l => l.hasReport)
    if (filterReport === 'no-report') list = list.filter(l => !l.hasReport)
    if (filterUnread) list = list.filter(l => l.hasReport && !readIds.has(l.id))
    if (filterTeacher !== 'all') list = list.filter(l => l.teacherName === filterTeacher)
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
    list.sort((a, b) =>
      sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    )
    return list
  }, [lessons, search, filterReport, filterUnread, filterTeacher, sort, readIds])

  useEffect(() => { setPage(1) }, [search, filterReport, filterUnread, filterTeacher, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 按月份分組
  const grouped = useMemo(() => {
    if (!groupByMonth) return null
    const map = new Map<string, Lesson[]>()
    paginated.forEach(l => {
      const ym = l.date.slice(0, 7) // 2025-07
      if (!map.has(ym)) map.set(ym, [])
      map.get(ym)!.push(l)
    })
    return Array.from(map.entries()).map(([ym, items]) => {
      const [y, m] = ym.split('-')
      const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleString('zh-TW', { year: 'numeric', month: 'long' })
      return { ym, monthLabel, items }
    })
  }, [paginated, groupByMonth])

  const unreadCount = lessons.filter(l => l.hasReport && !readIds.has(l.id)).length

  const handleRead = (id: string) => {
    markRead(id)
    setReadIds(prev => { const next = new Set(prev); next.add(id); return next })
  }

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const isUnread = lesson.hasReport && !readIds.has(lesson.id)
    const card = (
      <div className="flex items-start gap-4 sm:gap-5 relative"
        style={{ borderLeft: `3px solid ${isUnread ? '#B8973A' : lesson.hasReport ? 'rgba(184,151,58,0.3)' : 'transparent'}` }}>
        {isUnread && (
          <div className="absolute top-0 right-0 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#B8973A' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#B8973A' }}>New</span>
          </div>
        )}
        {/* 日期 */}
        <div className="w-10 sm:w-12 flex-shrink-0 text-center pt-0.5 pl-3">
          <span className="block text-[10px] uppercase tracking-[0.08em] text-ink-muted">{lesson.month}</span>
          <span className="block font-serif text-[24px] sm:text-[28px] font-medium leading-none text-navy">{lesson.day}</span>
        </div>
        <div className="w-px flex-shrink-0 self-stretch bg-ivory-dim" />
        {/* 內容 */}
        <div className="min-w-0 flex-1 pr-2">
          {lesson.milestone && (
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">
              🏆 {lesson.milestone}
            </div>
          )}
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-semibold text-gold">{lesson.teacherName ?? '老師'}</span>
            <span className="text-[12px] text-ink-muted flex-shrink-0">{lesson.duration ? `${lesson.duration} 分鐘` : ''}</span>
          </div>
          {lesson.headline && (
            <p className={`mb-1 text-[15px] leading-snug ${isUnread ? 'font-bold text-navy' : 'font-semibold text-navy'}`}>{lesson.headline}</p>
          )}
          {lesson.summary && (
            <p className="mb-2.5 line-clamp-2 text-[13px] leading-[1.7] text-ink-mid">{lesson.summary}</p>
          )}
          {!lesson.hasReport && (
            <p className="mb-2.5 text-[13px] text-ink-muted">報告尚未產生。</p>
          )}
          {lesson.chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lesson.chips.map((c, i) => (
                <span key={i} className="rounded-full bg-ivory border border-ivory-dim px-2.5 py-0.5 text-[11px] text-ink-muted">{c}</span>
              ))}
            </div>
          )}
          {lesson.hasReport && (
            <div className={`mt-2 text-[12px] font-medium ${isUnread ? 'text-gold' : 'text-gold/60'}`}>
              {isUnread ? '查看新報告 →' : '查看完整報告 →'}
            </div>
          )}
        </div>
      </div>
    )

    return lesson.hasReport ? (
      <Link href={`/report/${lesson.id}`} onClick={() => handleRead(lesson.id)}
        className="block rounded-2xl bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-px hover:shadow-md overflow-hidden">
        {card}
      </Link>
    ) : (
      <div className="block rounded-2xl bg-white p-4 sm:p-5 shadow-sm overflow-hidden">{card}</div>
    )
  }

  return (
    <main className="mx-auto max-w-[800px] px-5 pb-24 pt-8 sm:px-8 sm:pb-12">
      {/* Header */}
      <div className="mb-6">
        <Link href="/home" className="mb-2 block text-[12px] text-gold/70 transition hover:text-gold">← 返回首頁</Link>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-[32px] font-medium text-navy sm:text-[36px]">學習歷程</h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="text-[12px] font-medium px-2.5 py-1 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>{unreadCount} 未讀</span>
            )}
            <span className="text-[13px] text-ink-muted">共 {totalCompleted} 堂</span>
          </div>
        </div>
      </div>

      {/* 搜尋 */}
      <input type="text" placeholder="搜尋老師、單字、標題..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-ivory-dim bg-white px-4 py-3 text-[14px] outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 mb-3"
        style={{ color: '#1a2236' }} />

      {/* 篩選列 */}
      <div className="flex gap-2 flex-wrap mb-2">
        {/* 報告狀態 */}
        <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
          {([
            { v: 'all', l: '全部' },
            { v: 'report', l: '有報告' },
            { v: 'no-report', l: '無報告' },
          ] as const).map(f => (
            <button key={f.v} onClick={() => setFilterReport(f.v)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition"
              style={{ background: filterReport === f.v ? '#1a2236' : 'transparent', color: filterReport === f.v ? '#f7f4ee' : '#9a9080' }}>
              {f.l}
            </button>
          ))}
        </div>

        {/* 未讀篩選 */}
        {unreadCount > 0 && (
          <button onClick={() => setFilterUnread(v => !v)}
            className="rounded-xl px-3 py-1.5 text-[12px] font-medium border transition"
            style={{ background: filterUnread ? '#FEF3C7' : '#fff', color: filterUnread ? '#92400E' : '#9a9080', borderColor: filterUnread ? '#FDE68A' : 'rgba(26,34,54,0.1)' }}>
            未讀 ({unreadCount})
          </button>
        )}

        {/* 老師篩選 */}
        {teachers.length > 1 && (
          <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)}
            className="rounded-xl border px-3 py-1.5 text-[12px] outline-none"
            style={{ borderColor: 'rgba(26,34,54,0.1)', color: filterTeacher !== 'all' ? '#1a2236' : '#9a9080' }}>
            <option value="all">所有老師</option>
            {teachers.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {/* 排序 */}
        <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
          {([{ v: 'newest', l: '最新' }, { v: 'oldest', l: '最舊' }] as const).map(s => (
            <button key={s.v} onClick={() => setSort(s.v)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition"
              style={{ background: sort === s.v ? '#1a2236' : 'transparent', color: sort === s.v ? '#f7f4ee' : '#9a9080' }}>
              {s.l}
            </button>
          ))}
        </div>

        {/* 月份分組切換 */}
        <button onClick={() => setGroupByMonth(v => !v)}
          className="rounded-xl px-3 py-1.5 text-[12px] font-medium border transition"
          style={{ background: groupByMonth ? '#1a2236' : '#fff', color: groupByMonth ? '#f7f4ee' : '#9a9080', borderColor: 'rgba(26,34,54,0.1)' }}>
          {groupByMonth ? '📅 按月份' : '📋 列表'}
        </button>
      </div>

      {(search || filterReport !== 'all' || filterUnread || filterTeacher !== 'all') && (
        <div className="text-[12px] text-ink-muted mb-3">找到 {filtered.length} 筆記錄</div>
      )}

      {/* 課程列表 */}
      <div className="flex flex-col gap-3 mb-6">
        {grouped ? (
          grouped.map(({ ym, monthLabel, items }) => (
            <div key={ym}>
              {/* 月份標題 */}
              <div className="flex items-center gap-3 mb-3 mt-2">
                <div className="font-serif text-[15px] font-medium" style={{ color: '#1a2236' }}>{monthLabel}</div>
                <div className="flex-1 h-px" style={{ background: 'rgba(26,34,54,0.08)' }} />
                <div className="text-[12px]" style={{ color: '#9a9080' }}>{items.length} 堂</div>
              </div>
              <div className="flex flex-col gap-3">
                {items.map(l => <LessonCard key={l.id} lesson={l} />)}
              </div>
            </div>
          ))
        ) : (
          paginated.map(l => <LessonCard key={l.id} lesson={l} />)
        )}

        {paginated.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ivory-dim py-12 text-center">
            <p className="text-[14px] text-ink-muted">
              {search || filterReport !== 'all' || filterUnread || filterTeacher !== 'all'
                ? '找不到符合的記錄' : '還沒有完課記錄。'}
            </p>
          </div>
        )}
      </div>

      {/* 分頁 */}
      {totalPages > 1 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0) }}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition disabled:opacity-40"
              style={{ background: '#fff', color: '#1a2236', border: '1px solid rgba(26,34,54,0.1)' }}>
              ← 上一頁
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) => p === '...'
                  ? <span key={`e${i}`} className="text-[13px] text-ink-muted">…</span>
                  : <button key={p} onClick={() => { setPage(p as number); window.scrollTo(0, 0) }}
                      className="w-8 h-8 rounded-lg text-[13px] font-medium transition"
                      style={{ background: page === p ? '#1a2236' : '#fff', color: page === p ? '#fff' : '#1a2236', border: `1px solid ${page === p ? '#1a2236' : 'rgba(26,34,54,0.1)'}` }}>{p}</button>
                )}
            </div>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0) }}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition disabled:opacity-40"
              style={{ background: '#fff', color: '#1a2236', border: '1px solid rgba(26,34,54,0.1)' }}>
              下一頁 →
            </button>
          </div>
          <div className="text-center text-[12px] text-ink-muted mb-4">
            第 {page} 頁，共 {totalPages} 頁（每頁 {PAGE_SIZE} 筆）
          </div>
        </>
      )}

      {/* 單字本入口 */}
      <Link href="/vocab"
        className="flex items-center justify-between rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-ivory-dim transition hover:border-gold hover:shadow-md">
        <div>
          <div className="font-semibold text-[15px] text-navy">我的單字本</div>
          <div className="text-[12px] mt-0.5 text-ink-muted">查看所有收藏的單字和片語</div>
        </div>
        <span className="text-gold text-[18px]">★</span>
      </Link>
    </main>
  )
}
