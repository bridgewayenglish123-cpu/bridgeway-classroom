'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type ResetState = { sent: boolean; error: string | null }

export async function requestReset(
  _prevState: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return { sent: false, error: '請輸入 Email。' }
  }

  const host = headers().get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const redirectTo = `${protocol}://${host}/auth/callback`

  const supabase = createClient()
  await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  // 資安原則：不論 Email 是否存在，一律回報已寄出，不透露帳號是否存在。
  return { sent: true, error: null }
}
