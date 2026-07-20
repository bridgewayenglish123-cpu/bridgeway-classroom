'use client'

import { useRef, useState } from 'react'

export function ShareCard({
  studentName,
  dateLabel,
  strengthZh,
  vocabCount,
  phraseCount,
  lessonId,
}: {
  studentName: string
  dateLabel: string
  strengthZh: string | null
  vocabCount: number
  phraseCount: number
  lessonId: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const reportUrl = `https://app.bridgewayenglish.net/report/${lessonId}`
  const shareText = `${studentName} 今天在 Bridgeway Classroom 完成了一堂課！學了 ${vocabCount} 個單字和 ${phraseCount} 個片語。${strengthZh ? `\n\n「${strengthZh}」` : ''}\n\n${reportUrl}`

  const generateImage = async () => {
    if (!cardRef.current) return null
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
      if (blob) {
        setImageBlob(blob)
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
        return blob
      }
    } catch {}
    finally { setBusy(false) }
    return null
  }

  const handleOpen = async () => {
    if (!showOptions) {
      await generateImage()
      setShowOptions(true)
    } else {
      setShowOptions(false)
    }
  }

  const handleDownload = () => {
    if (!imageBlob) return
    const url = imageUrl ?? URL.createObjectURL(imageBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bridgeway-achievement.png'
    a.click()
  }

  const handleLine = () => {
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reportUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(reportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = async () => {
    if (!imageBlob) return
    const file = new File([imageBlob], 'bridgeway-achievement.png', { type: 'image/png' })
    const nav = navigator as any
    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: 'Bridgeway Classroom', text: shareText })
      } catch {}
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!(navigator as any).share

  return (
    <>
      <div className="rounded-card bg-white p-5 shadow-md sm:p-6">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          分享這堂課的成就
        </div>

        {imageUrl && showOptions && (
          <div className="mb-4 overflow-hidden rounded-xl border border-ivory-dim">
            <img src={imageUrl} alt="成就卡預覽" className="w-full" />
          </div>
        )}

        {!showOptions ? (
          <button
            type="button"
            onClick={handleOpen}
            disabled={busy}
            className="w-full rounded-field border border-ivory-dim bg-transparent py-3 text-[13px] tracking-[0.02em] text-ink-muted transition hover:border-gold hover:text-gold disabled:opacity-60"
          >
            {busy ? '產生中…' : '✦ 分享這堂課的成就'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleLine}
                className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#06C755' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.13 2 11.2c0 3.53 2.27 6.62 5.67 8.37-.08.29-.5 1.76-.57 2.02-.09.34.12.34.26.25.11-.07 1.74-1.15 2.44-1.62.73.1 1.47.16 2.2.16 5.52 0 10-4.13 10-9.18C22 6.13 17.52 2 12 2z"/>
                </svg>
                LINE
              </button>
              <button onClick={handleFacebook}
                className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#1877F2' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-xl border border-ivory-dim py-2.5 text-sm font-medium transition hover:border-gold hover:text-gold"
                style={{ color: '#4a5568' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                下載圖片
              </button>
              <button onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 rounded-xl border border-ivory-dim py-2.5 text-sm font-medium transition hover:border-gold hover:text-gold"
                style={{ color: copied ? '#b8973a' : '#4a5568' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                {copied ? '已複製！' : '複製連結'}
              </button>
            </div>
            {hasNativeShare && (
              <button onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-ivory-dim py-2.5 text-sm font-medium transition hover:border-gold hover:text-gold"
                style={{ color: '#4a5568' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                更多分享選項
              </button>
            )}
            <button onClick={() => setShowOptions(false)}
              className="w-full text-center text-[12px] py-1 transition"
              style={{ color: '#9a9080' }}>
              收起
            </button>
          </div>
        )}
      </div>

      <div ref={cardRef} aria-hidden
        style={{
          position: 'absolute', left: '-9999px', top: 0,
          width: '400px', boxSizing: 'border-box',
          background: '#1a2236', color: '#f7f4ee',
          padding: '40px 36px',
          fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
        }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '28px' }}>
          Bridgeway <span style={{ color: '#d4af60' }}>Classroom</span>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(247,244,238,0.7)', marginBottom: '24px' }}>
          {studentName}{dateLabel ? ` · ${dateLabel}` : ''}
        </div>
        {strengthZh && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#d4af60', letterSpacing: '0.08em', marginBottom: '8px' }}>這堂課最大的進步</div>
            <div style={{ fontSize: '18px', lineHeight: 1.6, color: '#f7f4ee' }}>{strengthZh}</div>
          </div>
        )}
        <div style={{ fontSize: '13px', color: 'rgba(247,244,238,0.6)', marginBottom: '32px' }}>
          學了 {vocabCount} 個單字 · {phraseCount} 個片語
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.4)', letterSpacing: '0.05em' }}>
          app.bridgewayenglish.net
        </div>
      </div>
    </>
  )
}
