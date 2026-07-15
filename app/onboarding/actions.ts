'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type OnboardingState = { error: string | null }

export async function saveGoal(
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const goal = String(formData.get('goal') ?? '').trim()

  if (!goal) {
    return { error: '請寫下你想達成的一件事。' }
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 學生更新自己的 learning_goal——走使用者 session + RLS（auth_user_id 已於登入時關聯）。
  const { error } = await supabase
    .from('students')
    .update({ learning_goal: goal })
    .eq('auth_user_id', user.id)

  if (error) {
    return { error: '儲存時發生問題，請再試一次。' }
  }

  redirect('/home')
}
