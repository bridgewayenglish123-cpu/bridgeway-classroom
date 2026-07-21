'use client'
import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'

type VocabItem = {
  id: string
  word: string
  type: 'word' | 'phrase'
  definitionZh: string | null
  definitionEn: string | null
  exampleEn: string | null
  exampleZh: string | null
  createdAt: string
  lessonId: string | null
  lessonDate: string | null
  teacherName: string | null
}

const PAGE_SIZE = 20

export function VocabCollectionClient({ items: initialItems }: { items: VocabItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'word' | 'phrase'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [confirmItem, setConfirmItem] = useState<VocabItem | null>(null)
  const [, startTransition] = useTransition()

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
        i.definitionEn?.toLowerCase().includes(q) ||
        i.definitionZh?.toLowerCase().includes(q) ||
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

  // 篩選改變時重設頁碼
  useMemo(() => { setPage(1) }, [search, filter, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const confirmRemove = () => {
    if (!confirmItem) return
    const id = confirmItem.id
    setItems(prev => prev.filter(i => i.id !== id))
    setConfirmItem(null)
    startTransition(async () => {
      await fetch('/api/vocab/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    })
  }

  return (
    <>
      <main className="mx-auto max-w-[800px] px-5 pb-24 pt-8 sm:px-8 sm:pb-12">
        {/* Header */}
        <div className="mb-6">
          <Link href="/home" className="mb-2 block text-[12px] text-gold/70 transition hover:text-gold">
            ← 返回首頁
          </Link>
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif text-[32px] font-medium text-navy sm:text-[36px]">我的單字本</h1>
            <span className="text-[13px] text-ink-muted">{items.length} 個收藏</span>
          </div>
        </div>

        {/* 統計卡 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: '單字', value: words.length, color: '#1A2236' },
            { label: '片語', value: phrases.length, color: '#B8973A' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <div className="font-serif text-[32px] font-medium" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[12px] mt-0.5 text-ink-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 搜尋 */}
        <input type="text" placeholder="搜尋單字、定義、或日期..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-ivory-dim bg-white px-4 py-3 text-[14px] outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 mb-3"
          style={{ color: '#1a2236' }} />

        {/* 篩選 + 排序 */}
        <div className="flex gap-2 flex-wrap mb-4">
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
            {([
              { v: 'all', l: `全部 (${items.length})` },
              { v: 'word', l: `單字 (${words.length})` },
              { v: 'phrase', l: `片語 (${phrases.length})` },
            ] as const).map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition"
                style={{ background: filter === f.v ? '#1a2236' : 'transparent', color: filter === f.v ? '#f7f4ee' : '#9a9080' }}>
                {f.l}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#EDE9E0' }}>
            {([
              { v: 'newest', l: '最新' },
              { v: 'oldest', l: '最舊' },
              { v: 'az', l: 'A–Z' },
              { v: 'za', l: 'Z–A' },
            ] as const).map(s => (
              <button key={s.v} onClick={() => setSort(s.v)}
                className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition"
                style={{ background: sort === s.v ? '#1a2236' : 'transparent', color: sort === s.v ? '#f7f4ee' : '#9a9080' }}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        {(search || filter !== 'all') && (
          <div className="text-[12px] text-ink-muted mb-3">找到 {filtered.length} 個</div>
        )}

        {/* 單字列表 */}
        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ivory-dim py-16 text-center">
            <p className="text-[15px] font-medium text-navy mb-1">
              {search || filter !== 'all' ? '找不到符合的單字' : '還沒有收藏任何單字'}
            </p>
            <p className="text-[13px] text-ink-muted">
              {!search && filter === 'all' && '在課堂報告中點擊 ★ 收藏單字。'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-6">
            {paginated.map(item => {
              const isExpanded = expanded.has(item.id)
              const hasExample = item.exampleEn || item.exampleZh
              const hasDef = item.definitionEn || item.definitionZh

              return (
                <div key={item.id} className="rounded-2xl bg-white shadow-sm overflow-hidden"
                  style={{ borderLeft: `3px solid ${item.type === 'word' ? '#1A2236' : '#B8973A'}` }}>
                  {/* 主行 */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[16px] text-navy">{item.word}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: item.type === 'word' ? '#EEF2FF' : '#F5F0FF', color: item.type === 'word' ? '#3730A3' : '#5A3A7C' }}>
                          {item.type === 'word' ? '單字' : '片語'}
                        </span>
                      </div>
                      {(hasDef || item.lessonDate) && (
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {(item.definitionZh || item.definitionEn) && (
                            <span className="text-[12px] text-ink-muted truncate">
                              {item.definitionZh ?? item.definitionEn}
                            </span>
                          )}
                          {item.lessonDate && (
                            <span className="text-[11px] text-ink-muted/60 flex-shrink-0">
                              · {item.lessonDate.slice(5)}
                              {item.teacherName && ` · ${item.teacherName}`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* 展開例句 */}
                      {hasExample && (
                        <button onClick={() => toggleExpand(item.id)}
                          className="text-[11px] px-2.5 py-1 rounded-full transition"
                          style={{ background: isExpanded ? '#1A2236' : '#F0EDE6', color: isExpanded ? '#F7F4EE' : '#6B7B8E' }}>
                          {isExpanded ? '收起' : '例句'}
                        </button>
                      )}
                      {/* 來源連結 */}
                      {item.lessonId && (
                        <Link href={`/report/${item.lessonId}`}
                          className="text-[11px] px-2.5 py-1 rounded-full transition hover:opacity-80"
                          style={{ background: '#F0EDE6', color: '#6B7B8E' }}>
                          查看課堂
                        </Link>
                      )}
                      {/* 移除 */}
                      <button onClick={() => setConfirmItem(item)}
                        className="text-[18px] leading-none transition hover:opacity-60"
                        style={{ color: '#D1C9BC' }}>
                        ×
                      </button>
                    </div>
                  </div>

                  {/* 展開例句 */}
                  {isExpanded && (item.exampleEn || item.exampleZh) && (
                    <div className="px-4 pb-3 pt-0 border-t" style={{ borderColor: 'rgba(26,34,54,0.06)', background: '#F7F4EE' }}>
                      <div className="space-y-1 pt-2">
                        {item.exampleEn && (
                          <p className="text-[13px] font-medium leading-relaxed text-navy">{item.exampleEn}</p>
                        )}
                        {item.exampleZh && (
                          <p className="text-[12px] leading-relaxed text-ink-muted">{item.exampleZh}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 分頁 */}
        {totalPages > 1 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0) }}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition disabled:opacity-40"
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
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition disabled:opacity-40"
                style={{ background: '#fff', color: '#1a2236', border: '1px solid rgba(26,34,54,0.1)' }}>
                下一頁 →
              </button>
            </div>
            <div className="text-center text-[12px] text-ink-muted mb-4">
              第 {page} 頁，共 {totalPages} 頁（每頁 {PAGE_SIZE} 筆）
            </div>
          </>
        )}
      </main>

      {/* 移除確認 Modal */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26,34,54,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setConfirmItem(null) }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-[18px] font-semibold text-navy">移除收藏？</h3>
            <p className="text-[14px] leading-[1.7] text-ink-mid">
              確定要從單字本移除「<strong>{confirmItem.word}</strong>」嗎？
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmItem(null)}
                className="px-4 py-2 rounded-field text-[13px] font-medium text-ink-mid border border-ivory-dim transition hover:border-navy">
                保留
              </button>
              <button onClick={confirmRemove}
                className="px-5 py-2 rounded-field bg-navy text-[13px] font-semibold text-ivory transition hover:opacity-90">
                確認移除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
