'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { AuthSubmit } from '@/components/auth/AuthSubmit'
import {
  authErrorClass,
  authInputClass,
  authLabelClass,
} from '@/components/auth/authStyles'
import { login, type LoginState } from './actions'

const initialState: LoginState = { error: null }

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState)

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

      <div>
        <label htmlFor="password" className={authLabelClass}>
          密碼
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={authInputClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className={authErrorClass}>
          {state.error}
        </p>
      ) : null}

      <AuthSubmit label="登入" pendingLabel="登入中…" />

      <div className="mt-1 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-[12px] text-gold transition hover:text-gold-light"
        >
          忘記密碼？
        </Link>
      </div>
    </form>
  )
}
