import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <AuthShell title="歡迎回來" subtitle="登入你的學習空間。">
      <LoginForm />
    </AuthShell>
  )
}
