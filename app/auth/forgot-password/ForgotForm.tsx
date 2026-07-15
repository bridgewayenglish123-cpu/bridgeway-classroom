'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { AuthSubmit } from '@/components/auth/AuthSubmit'
import {
  authErrorClass,
  authInputClass,
  authLabelClass,
} from '@/components/auth/authStyles'
import { requestReset, type ResetState } from './actions'

const initialState: ResetState = { sent: false, error: null }

export function ForgotForm() {
  const [state, formAction] = useFormState(requestReset, initialState)

  if (state.sent) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-[14px] leading-relaxed text-ink-mid">
          重設密碼的連結已寄到你的信箱。
        </p>
        <Link
          href="/auth/login"
          className="text-center text-[12px] text-gold transition hover:text-gold-light"
        >
          返回登入
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="email" className={authLabelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={authInputClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className={authErrorClass}>
          {state.error}
        </p>
      ) : null}

      <AuthSubmit label="寄送重設連結" pendingLabel="寄送中…" />

      <div className="mt-1 text-center">
        <Link
          href="/auth/login"
          className="text-[12px] text-gold transition hover:text-gold-light"
        >
          返回登入
        </Link>
      </div>
    </form>
  )
}
