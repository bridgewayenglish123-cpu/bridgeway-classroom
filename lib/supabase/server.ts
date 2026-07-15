import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/types/database'

/**
 * Server-side Supabase client（Server Components / Route Handlers 使用）。
 * 使用 anon key + 使用者 session cookie，查詢一樣受 RLS 保護。
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // 從 Server Component 呼叫時 set 會被拒（唯讀 cookies），
            // 由 middleware 負責刷新 session，可安全忽略。
          }
        },
      },
    },
  )
}
