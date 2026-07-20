'use client'

import { useState } from 'react'

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
  const [showOptions, setShowOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [template, setTemplate] = useState<Template>('lesson')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const ogUrl = (t: Template) =>
    'https://app.bridgewayenglish.net/api/og/' + lessonId + '?t=' + t

  const reportUrl = 'https://app.bridgewayenglish.net/report/' + lessonId

  const shareTextLesson =
    studentName + ' 今天在 Bridgeway Classroom 完成了一堂英文課！' +
    '學了 ' + vocabCount + ' 個單字和 ' + phraseCount + ' 個片語。' +
    (strengthZh ? '\n\n「' + strengthZh + '」' : '') +
    '\n\n' + reportUrl

  const shareTextMilestone =
    studentName + ' 在 Bridgeway Classroom 已完成 ' + completedCount + ' 堂英文課！' +
    (streakWeeks >= 2 ? '連續學習 ' + streakWeeks + ' 週，' : '') +
    '累積學習 ' + totalVocabCount + ' 個單字。\n\n' + reportUrl

  const shareText = template === 'lesson' ? shareTextLesson : shareTextMilestone

  const handleLine = () =>
    window.open('https://line.me/R/msg/text/?' + encodeURIComponent(shareText), '_blank')

  const handleFacebook = () =>
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(reportUrl), '_blank')

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(reportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadImage = async () => {
    const url = ogUrl(template)
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'bridgeway-achievement.png'
    a.click()
  }

  const handleNativeShare = async () => {
    const nav = navigator as any
    if (nav.share) {
      try {
        await nav.share({ title: 'Bridgeway Classroom', text: shareText, url: reportUrl })
      } catch {}
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!(navigator as any).share

  return (
    <div className="rounded-card bg-white p-5 shadow-md sm:p-6">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        分享這堂課的成就
      </div>

      {!showOptions ? (
        <button type="button" onClick={() => setShowOptions(true)}
          className="w-full rounded-field border border-ivory-dim bg-transparent py-3 text-[13px] tracking-[0.02em] text-ink-muted transition hover:border-gold hover:text-gold">
          ✦ 分享這堂課的成就
        </button>
      ) : (
        <div className="space-y-4">
          {/* 模板切換 */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#F5F3EE' }}>
            {(['lesson', 'milestone'] as Template[]).map((t) => (
              <button key={t} onClick={() => setTemplate(t)}
                className="flex-1 rounded-lg py-2 text-[12px] font-semibold transition"
                style={{
                  background: template === t ? '#1a2236' : 'transparent',
                  color: template === t ? '#f7f4ee' : '#9a9080',
                }}>
                {t === 'lesson' ? '本堂課亮點' : '學習里程碑'}
              </button>
            ))}
          </div>

          {/* OG 圖片預覽 */}
          <div className="overflow-hidden rounded-xl border border-ivory-dim" style={{ aspectRatio: '1200/630', background: '#1A2236', position: 'relative' }}>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] text-ivory/50">預覽載入失敗</span>
              </div>
            )}
            <img
              src={ogUrl(template)}
              alt="成就卡預覽"
              className="w-full"
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
              onLoad={() => { setImageLoaded(true); setImageError(false) }}
              onError={() => { setImageError(true); setImageLoaded(false) }}
            />
          </div>

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
            <button onClick={handleDownloadImage}
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
  )
}
