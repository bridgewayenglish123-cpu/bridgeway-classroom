'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

type VocabItem = {
  id: string
  word: string
  type: 'word' | 'phrase'
  createdAt: string
  lessonId: string | null
  lessonDate: string | null
  teacherName: string | null
}

export function VocabCollectionClient({ items }: { items: VocabItem[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'word' | 'phrase'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest')

  const words = items.filter(i => i.type === 'word')
  const phrases = items.filter(i => i.type === 'phrase')

  const filtered = useMemo(() => {
    let list = [...items]
    if (filter === 'word') list = list.filter(i => i.type === 'word')
    if (filter === 'phrase') list = list.filter(i => i.type === 'phrase')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i =>
        i.word.toLowerCase().includes(q) ||
        i.teacherName?.toLowerCase().includes(q) ||
        i.lessonDate?.includes(q)
      )
    }
    list.sort((a, b) => {
      if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
      if (sort === 'oldest') return a.createdAt.localeCompare(b.createdAt)
      if (sort === 'az') return a.word.localeCompare(b.word)
      if (sort === 'za') return b.word.localeCompare(a.word)
      return 0
    })
    return list
  }, [items, search, filter, sort])

  return (
    <main className="mx-auto max-w-[800px] px-5 pb-16 pt-8 sm:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/home" className="mb-2 block text-[12px] text-gold/70 transition hover:text-gold">
          ← 返回首頁
        </Link>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-[32px] font-medium text-navy sm:text-[36px]">
            我的單字本
          </h1>
          <span className="text-[13px] text-ink-muted">{items.length} 個收藏</span>
        </div>

        {/* 統計 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
            <div className="font-serif text-[32px] font-medium text-navy">{words.length}</div>
            <div className="text-[11px] mt-1 uppercase tracking-[0.08em] text-ink-muted">單字</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
            <div className="font-serif text-[32px] font-medium text-navy">{phrases.length}</div>
            <div className="text-[11px] mt-1 uppercase tracking-[0.08em] text-ink-muted">片語</div>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className="mb-5 space-y-3">
        <input type="text" placeholder="搜尋單字、片語..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-ivory-dim bg-white px-4 py-3 text-[14px] outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
          style={{ color: '#1a2236' }} />

        <div className="flex gap-2 flex-wrap">
          {/* 篩選 */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
            {([
              { value: 'all', label: '全部' },
              { value: 'word', label: '單字' },
              { value: 'phrase', label: '片語' },
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
              { value: 'az', label: 'A–Z' },
              { value: 'za', label: 'Z–A' },
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

        {(search || filter !== 'all') && (
          <div className="text-[12px] text-ink-muted">找到 {filtered.length} 個</div>
        )}
      </div>

      {/* 單字列表 */}
      <div className="flex flex-col gap-2">
        {filtered.map(item => (
          <div key={item.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border-l-[3px]"
            style={{ borderColor: item.type === 'word' ? '#b8973a' : '#7C5CBF' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[16px] text-navy">{item.word}</span>
                <span className="text-[10px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                  style={{
                    background: item.type === 'word' ? 'rgba(184,151,58,0.1)' : 'rgba(124,92,191,0.1)',
                    color: item.type === 'word' ? '#b8973a' : '#7C5CBF',
                  }}>
                  {item.type === 'word' ? '單字' : '片語'}
                </span>
              </div>
              {item.lessonDate && (
                <div className="mt-1 text-[12px] text-ink-muted">
                  {item.lessonDate.slice(5).replace('-', '/')}
                  {item.teacherName ? ` · ${item.teacherName} 老師` : ''}
                </div>
              )}
            </div>
            {item.lessonId && (
              <Link href={`/report/${item.lessonId}`}
                className="flex-shrink-0 text-[12px] font-medium text-gold/70 transition hover:text-gold">
                查看報告 →
              </Link>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ivory-dim py-12 text-center">
            <p className="text-[14px] text-ink-muted">
              {search || filter !== 'all' ? '找不到符合的收藏' : '還沒有收藏任何單字，去報告頁按星號收藏吧！'}
            </p>
            {!search && filter === 'all' && (
              <Link href="/history" className="mt-3 inline-block text-[13px] text-gold/70 hover:text-gold">
                查看學習歷程 →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
