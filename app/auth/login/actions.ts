'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type LoginState = { error: string | null }

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: '請輸入 Email 和密碼。' }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  const user = data.user
  if (error || !user?.email) {
    return { error: 'Email 或密碼不正確，請再試一次。' }
  }
  const authedEmail = user.email

  // 1. 關聯 auth_user_id（若還是 null）——用 service-role client bypass RLS，
  //    因為此列 auth_user_id 為 null 時使用者自己的 session 受 RLS 限制無法更新。
  const admin = createAdminClient()
  await admin
    .from('students')
    .update({ auth_user_id: user.id })
    .eq('zoom_email', authedEmail)
    .is('auth_user_id', null)

  // 2. 讀 learning_goal 決定導向（走使用者 session + RLS，關聯後 auth.uid() 已對應該列）
  const { data: student } = await supabase
    .from('students')
    .select('learning_goal')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  // 3 / 4. learning_goal 為 null（或空字串）→ onboarding；否則 → home
  if (!student || !student.learning_goal) {
    redirect('/onboarding')
  }

  redirect('/home')
}
