'use client'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.trim().slice(0, 2).toUpperCase()
}

export function Nav({ name }: { name: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-navy px-[18px] sm:h-[56px] sm:px-7">
      <div className="font-serif text-[19px] font-medium tracking-[0.05em] text-ivory">
        Bridgeway <span className="text-gold-light">Classroom</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Link href="/vocab"
          className="hidden sm:block text-[12px] text-ivory/60 transition hover:text-ivory/90 mr-1">
          單字本
        </Link>
        <span className="text-[12px] text-ivory/50">{name}</span>
        <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-semibold tracking-[0.03em] text-white">
          {initials(name)}
        </div>
        <button
          onClick={handleSignOut}
          className="text-[11px] text-ivory/40 hover:text-ivory/70 transition-colors ml-1"
        >
          登出
        </button>
      </div>
    </nav>
  )
}
