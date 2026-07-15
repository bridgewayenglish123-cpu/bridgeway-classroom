import { AuthShell } from '@/components/auth/AuthShell'
import { ForgotForm } from './ForgotForm'

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="忘記密碼"
      subtitle="輸入你的 Email，我們會寄送重設密碼的連結。"
    >
      <ForgotForm />
    </AuthShell>
  )
}
