import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Onboarding } from './Onboarding'

export default async function OnboardingPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 已設定 learning_goal 者不再顯示 onboarding，直接導向首頁。
  const { data: student } = await supabase
    .from('students')
    .select('learning_goal')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (student?.learning_goal) {
    redirect('/home')
  }

  return <Onboarding />
}
