'use client'

import { useFormStatus } from 'react-dom'

/**
 * Auth 表單送出按鈕（金色）。用 useFormStatus 顯示 pending 狀態。
 * 必須被放在 <form> 內部才能取得 pending。
 */
export function AuthSubmit({
  label,
  pendingLabel,
}: {
  label: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-field bg-gold px-4 py-3 text-[14px] font-semibold text-navy shadow-[0_2px_12px_rgba(184,151,58,0.35)] transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
