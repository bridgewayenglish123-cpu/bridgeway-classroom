'use client'

import { useRef, useState } from 'react'

/**
 * 分享成就卡（CD5）。離屏渲染一張 navy 圖卡，用 html2canvas 截圖，
 * 優先走 Web Share API（navigator.share），不支援則 fallback 下載。
 */
export function ShareCard({
  studentName,
  dateLabel,
  strengthZh,
  vocabCount,
  phraseCount,
}: {
  studentName: string
  dateLabel: string
  strengthZh: string | null
  vocabCount: number
  phraseCount: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  const handleShare = async () => {
    if (!cardRef.current || busy) return
    setBusy(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a2236',
        scale: 2,
      })
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png'),
      )
      if (!blob) return

      const file = new File([blob], 'bridgeway-achievement.png', {
        type: 'image/png',
      })

      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean
      }

      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await nav.share?.({ files: [file], title: 'Bridgeway Classroom' })
        } catch {
          // 使用者取消分享，不做 fallback
        }
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'bridgeway-achievement.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // 產生圖片失敗，靜默處理
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        disabled={busy}
        className="w-full rounded-field border border-ivory-dim bg-transparent py-3 text-[13px] tracking-[0.02em] text-ink-muted transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? '產生中…' : '分享這堂課的成就'}
      </button>

      {/* 離屏渲染的成就圖卡（截圖用，不顯示在版面上） */}
      <div
        ref={cardRef}
        aria-hidden
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '400px',
          boxSizing: 'border-box',
          background: '#1a2236',
          color: '#f7f4ee',
          padding: '40px 36px',
          fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            marginBottom: '28px',
          }}
        >
          Bridgeway <span style={{ color: '#d4af60' }}>Classroom</span>
        </div>

        <div
          style={{
            fontSize: '14px',
            color: 'rgba(247,244,238,0.7)',
            marginBottom: '24px',
          }}
        >
          {studentName}
          {dateLabel ? ` · ${dateLabel}` : ''}
        </div>

        {strengthZh ? (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#d4af60',
                letterSpacing: '0.08em',
                marginBottom: '8px',
              }}
            >
              這堂課最大的進步
            </div>
            <div style={{ fontSize: '18px', lineHeight: 1.6, color: '#f7f4ee' }}>
              {strengthZh}
            </div>
          </div>
        ) : null}

        <div
          style={{
            fontSize: '13px',
            color: 'rgba(247,244,238,0.6)',
            marginBottom: '32px',
          }}
        >
          學了 {vocabCount} 個單字 · {phraseCount} 個片語
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'rgba(247,244,238,0.4)',
            letterSpacing: '0.05em',
          }}
        >
          app.bridgewayenglish.net
        </div>
      </div>
    </>
  )
}
