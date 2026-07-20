'use client'

import { useRef, useState } from 'react'

type Template = 'lesson' | 'milestone'

export function ShareCard({
  studentName, dateLabel, strengthZh, vocabCount, phraseCount,
  lessonId, completedCount, streakWeeks, totalVocabCount,
}: {
  studentName: string
  dateLabel: string
  strengthZh: string | null
  vocabCount: number
  phraseCount: number
  lessonId: string
  completedCount: number
  streakWeeks: number
  totalVocabCount: number
}) {
  const lessonCardRef = useRef<HTMLDivElement>(null)
  const milestoneCardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [template, setTemplate] = useState<Template>('lesson')

  const reportUrl = 'https://app.bridgewayenglish.net/report/' + lessonId
  const shareTextLesson = studentName + ' 今天在 Bridgeway Classroom 完成了一堂英文課！學了 ' + vocabCount + ' 個單字和 ' + phraseCount + ' 個片語。' + (strengthZh ? '\n\n「' + strengthZh + '」' : '') + '\n\n' + reportUrl
  const shareTextMilestone = streakWeeks >= 2
    ? studentName + ' 已經連續 ' + streakWeeks + ' 週在 Bridgeway Classroom 學英文！共完成 ' + completedCount + ' 堂課，累積學習 ' + totalVocabCount + ' 個單字。\n\n' + reportUrl
    : studentName + ' 在 Bridgeway Classroom 已完成 ' + completedCount + ' 堂英文課，累積學習 ' + totalVocabCount + ' 個單字！\n\n' + reportUrl
  const shareText = template === 'lesson' ? shareTextLesson : shareTextMilestone

  const generateImage = async () => {
    const ref = template === 'lesson' ? lessonCardRef : milestoneCardRef
    if (!ref.current) return null
    setBusy(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(ref.current, { backgroundColor: '#1a2236', scale: 2, useCORS: true })
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
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
    if (!showOptions) { await generateImage(); setShowOptions(true) }
    else setShowOptions(false)
  }

  const handleTemplateChange = async (t: Template) => {
    setTemplate(t)
    setImageBlob(null)
    setImageUrl(null)
    await new Promise(r => setTimeout(r, 50))
    await generateImage()
  }

  const handleDownload = () => {
    if (!imageBlob) return
    const url = imageUrl ?? URL.createObjectURL(imageBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bridgeway-achievement.png'
    a.click()
  }

  const handleLine = () => window.open('https://line.me/R/msg/text/?' + encodeURIComponent(shareText), '_blank')
  const handleFacebook = () => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(reportUrl) + '&quote=' + encodeURIComponent(shareText), '_blank')

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
      try { await nav.share({ files: [file], title: 'Bridgeway Classroom', text: shareText }) } catch {}
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!(navigator as any).share

  const cardStyle: React.CSSProperties = {
    position: 'absolute', left: '-9999px', top: 0,
    width: '400px', boxSizing: 'border-box',
    background: '#1a2236', color: '#f7f4ee',
    padding: '40px 36px',
    fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
  }

  return (
    <>
      <div className="rounded-card bg-white p-5 shadow-md sm:p-6">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          分享這堂課的成就
        </div>

        {!showOptions ? (
          <button type="button" onClick={handleOpen} disabled={busy}
            className="w-full rounded-field border border-ivory-dim bg-transparent py-3 text-[13px] tracking-[0.02em] text-ink-muted transition hover:border-gold hover:text-gold disabled:opacity-60">
            {busy ? '產生中…' : '✦ 分享這堂課的成就'}
          </button>
        ) : (
          <div className="space-y-4">
            {/* 模板切換 */}
            <div className="flex gap-1 rounded-xl p-1" style={{ background: '#F5F3EE' }}>
              {(['lesson', 'milestone'] as Template[]).map((t) => (
                <button key={t} onClick={() => handleTemplateChange(t)} disabled={busy}
                  className="flex-1 rounded-lg py-2 text-[12px] font-semibold transition"
                  style={{
                    background: template === t ? '#1a2236' : 'transparent',
                    color: template === t ? '#f7f4ee' : '#9a9080',
                  }}>
                  {t === 'lesson' ? '本堂課亮點' : '學習里程碑'}
                </button>
              ))}
            </div>

            {/* 預覽圖 */}
            {imageUrl && (
              <div className="overflow-hidden rounded-xl border border-ivory-dim">
                <img src={imageUrl} alt="成就卡預覽" className="w-full" />
              </div>
            )}
            {busy && (
              <div className="flex items-center justify-center gap-2 py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <span className="text-[13px] text-ink-muted">產生中…</span>
              </div>
            )}

            {/* 分享按鈕 */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleLine}
                className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                style={{ background: '#06C755' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.13 2 11.2c0 3.53 2.27 6.62 5.67 8.37-.08.29-.5 1.76-.57 2.02-.09.34.12.34.26.25.11-.07 1.74-1.15 2.44-1.62.73.1 1.47.16 2.2.16 5.52 0 10-4.13 10-9.18C22 6.13 17.52 2 12 2z"/>
                </svg>
                LINE
              </button>
              <button onClick={handleFacebook}
                className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                style={{ background: '#1877F2' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleDownload}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-ivory-dim py-2.5 text-[13px] font-medium transition hover:border-gold hover:text-gold active:scale-95"
                style={{ color: '#4a5568' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                下載圖片
              </button>
              <button onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-ivory-dim py-2.5 text-[13px] font-medium transition hover:border-gold active:scale-95"
                style={{ color: copied ? '#b8973a' : '#4a5568' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                {copied ? '已複製！' : '複製連結'}
              </button>
            </div>

            {hasNativeShare && (
              <button onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-ivory-dim py-2.5 text-[13px] font-medium transition hover:border-gold hover:text-gold active:scale-95"
                style={{ color: '#4a5568' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                更多分享選項
              </button>
            )}

            <button onClick={() => setShowOptions(false)}
              className="w-full text-center text-[12px] py-1 text-ink-muted transition hover:text-gold">
              收起
            </button>
          </div>
        )}
      </div>

      {/* 本堂課亮點圖卡 */}
      <div ref={lessonCardRef} aria-hidden style={cardStyle}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '24px' }}>
          Bridgeway <span style={{ color: '#d4af60' }}>Classroom</span>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(247,244,238,0.6)', marginBottom: '20px' }}>
          {studentName}{dateLabel ? ' · ' + dateLabel : ''}
        </div>
        {strengthZh && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#d4af60', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
              這堂課最大的進步
            </div>
            <div style={{ fontSize: '17px', lineHeight: 1.65, color: '#f7f4ee' }}>{strengthZh}</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '28px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontFamily: 'Georgia, serif', color: '#d4af60', fontWeight: 600 }}>{vocabCount}</div>
            <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.5)', marginTop: '4px' }}>單字</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontFamily: 'Georgia, serif', color: '#d4af60', fontWeight: 600 }}>{phraseCount}</div>
            <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.5)', marginTop: '4px' }}>片語</div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.35)', letterSpacing: '0.05em' }}>
          app.bridgewayenglish.net
        </div>
      </div>

      {/* 學習里程碑圖卡 */}
      <div ref={milestoneCardRef} aria-hidden style={cardStyle}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '24px' }}>
          Bridgeway <span style={{ color: '#d4af60' }}>Classroom</span>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(247,244,238,0.6)', marginBottom: '28px' }}>
          {studentName}
        </div>
        {streakWeeks >= 2 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#d4af60', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
              連續學習
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: 600, color: '#d4af60', lineHeight: 1 }}>
              {streakWeeks}
              <span style={{ fontSize: '20px', fontWeight: 400, marginLeft: '8px', color: 'rgba(247,244,238,0.7)' }}>週</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '32px', fontFamily: 'Georgia, serif', color: '#f7f4ee', fontWeight: 600 }}>{completedCount}</div>
            <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.5)', marginTop: '4px' }}>堂課完成</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontFamily: 'Georgia, serif', color: '#f7f4ee', fontWeight: 600 }}>{totalVocabCount}</div>
            <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.5)', marginTop: '4px' }}>個單字學習</div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(247,244,238,0.35)', letterSpacing: '0.05em' }}>
          app.bridgewayenglish.net
        </div>
      </div>
    </>
  )
}
