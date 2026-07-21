'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navy = '#1A2236'
const gold = '#B8973A'
const ivory = '#F7F4EE'
const line = 'rgba(26,34,54,0.08)'
const muted = '#6B7B8E'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase()
}

export function Nav({ name }: { name: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const links = [
    { href: '/home', label: '首頁' },
    { href: '/history', label: '學習歷程' },
    { href: '/vocab', label: '單字本' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b"
      style={{ background: ivory, borderColor: line }}>
      <div className="mx-auto max-w-[1100px] flex h-[56px] items-center justify-between px-4 sm:px-8">

        {/* Logo */}
        <Link href="/home" className="flex items-center gap-1 flex-shrink-0">
          <span className="font-serif text-[20px] font-semibold tracking-tight"
            style={{ color: navy }}>
            Bridgeway
          </span>
          <span className="font-serif text-[20px] font-medium ml-1"
            style={{ color: gold }}>
            Classroom
          </span>
        </Link>

        {/* 桌機導航連結 */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map(l => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link key={l.href} href={l.href}
                className="px-3 py-1.5 rounded-xl text-[13px] font-medium transition"
                style={{
                  background: active ? navy : 'transparent',
                  color: active ? ivory : muted,
                }}>
                {l.label}
              </Link>
            )
          })}
        </div>

        {/* 右側：學生名 + 頭像 + 登出 */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[13px] font-medium" style={{ color: navy }}>{name}</span>
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full font-semibold text-[12px]"
            style={{ background: gold, color: '#fff' }}>
            {initials(name)}
          </div>
          <button onClick={handleSignOut}
            className="text-[12px] transition hover:opacity-80"
            style={{ color: muted }}>
            登出
          </button>
        </div>

      </div>

      {/* 手機底部 Tab Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
        style={{ background: ivory, borderColor: line }}>
        {links.map(l => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/')
          const icons: Record<string, string> = {
            '/home': '⊟',
            '/history': '◫',
            '/vocab': '◈',
          }
          return (
            <Link key={l.href} href={l.href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition"
              style={{ color: active ? navy : muted }}>
              <span className="text-[16px]">{icons[l.href]}</span>
              <span className="text-[10px] font-medium">{l.label}</span>
              {active && (
                <span className="absolute bottom-0 w-6 h-[2px] rounded-full"
                  style={{ background: gold }} />
              )}
            </Link>
          )
        })}
      </div>
      <div className="sm:hidden h-[60px]" />
    </nav>
  )
}

// 報告頁專用 Header（有返回按鈕）
export function ReportHeader({
  lang, onToggleLang,
}: {
  lang: 'zh' | 'en'
  onToggleLang: () => void
}) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: ivory, borderColor: line }}>
      <div className="mx-auto max-w-[1100px] flex h-[56px] items-center justify-between px-4 sm:px-8">

        {/* 左：返回 + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] font-medium transition hover:opacity-70"
            style={{ color: muted }}>
            <span className="text-[16px]">←</span>
            <span className="hidden sm:block">返回</span>
          </button>
          <div className="w-px h-4" style={{ background: line }} />
          <Link href="/home" className="flex items-center">
            <span className="font-serif text-[18px] font-semibold" style={{ color: navy }}>
              Bridgeway
            </span>
            <span className="font-serif text-[18px] font-medium ml-1" style={{ color: gold }}>
              Classroom
            </span>
          </Link>
        </div>

        {/* 右：中英文切換 */}
        <button
          onClick={onToggleLang}
          className="rounded-full px-3 py-1.5 text-[12px] font-medium border transition hover:opacity-80"
          style={{ borderColor: line, color: muted, background: '#fff' }}>
          {lang === 'zh' ? 'EN' : '中文'}
        </button>

      </div>
    </header>
  )
}
