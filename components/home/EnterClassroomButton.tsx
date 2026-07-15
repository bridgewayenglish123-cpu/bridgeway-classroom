'use client'

import { useEffect, useState } from 'react'

/**
 * 進入教室按鈕。上課前 10 分鐘內、到下課後 60 分鐘內視為開放（金色可點），
 * 其餘時間灰色不可點。以明確 +08:00 offset 建構課堂時間，與絕對時間比較，
 * 每 30 秒更新，讓按鈕到點自動變金色。
 */
function isOpen(date: string, time: string): boolean {
  const t = time.length === 5 ? `${time}:00` : time
  const lesson = new Date(`${date}T${t}+08:00`)
  const diffMinutes = (lesson.getTime() - Date.now()) / 1000 / 60
  return diffMinutes <= 10 && diffMinutes >= -60
}

export function EnterClassroomButton({
  date,
  time,
}: {
  date: string
  time: string
}) {
  // 初始 false，與伺服器輸出一致，避免 hydration 不匹配；掛載後再計算。
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => setOpen(isOpen(date, time))
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [date, time])

  if (open) {
    return (
      <button
        type="button"
        className="w-full whitespace-nowrap rounded-field bg-gold px-[22px] py-3 text-[13px] font-semibold text-navy shadow-[0_2px_12px_rgba(184,151,58,0.35)] transition hover:bg-gold-light sm:w-auto"
      >
        進入教室
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled
      className="w-full cursor-default whitespace-nowrap rounded-field bg-white/[0.07] px-[22px] py-3 text-[13px] font-semibold text-[rgba(247,244,238,0.28)] sm:w-auto"
    >
      尚未開放
    </button>
  )
}
