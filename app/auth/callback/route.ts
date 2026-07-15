import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Supabase Auth callback。
 * 交換 code 取得 session，並在首次登入時把 auth_user_id 關聯到對應的
 * students 記錄（以 zoom_email 比對、且原本 auth_user_id 為 null 者）。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.email) {
        // 首次登入關聯 auth_user_id：用 service-role client bypass RLS
        // （此列 auth_user_id 仍為 null，使用者自己的 session 受 RLS 限制無法更新）
        const admin = createAdminClient()
        await admin
          .from('students')
          .update({ auth_user_id: user.id })
          .eq('zoom_email', user.email)
          .is('auth_user_id', null)
      }
    }
  }

  return NextResponse.redirect(new URL('/home', request.url))
}
