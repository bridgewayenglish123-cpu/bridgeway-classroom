import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

/**
 * Service-role Supabase client —— 只能在 server-side（Route Handlers / API routes）使用。
 * 使用 SUPABASE_SERVICE_ROLE_KEY，會 bypass RLS，絕對不能出現在前端或 NEXT_PUBLIC_ 變數。
 *
 * 頂部的 `import 'server-only'` 是 build-time 保護：一旦這個模組被任何 Client
 * Component 匯入，Next.js 會直接編譯失敗，確保 service role key 永遠不會進到前端 bundle。
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
