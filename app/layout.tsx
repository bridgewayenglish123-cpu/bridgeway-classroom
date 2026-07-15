import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Noto_Sans_TC } from 'next/font/google'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  weight: ['300', '400', '500'],
  variable: '--font-noto-tc',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Bridgeway Classroom',
  description: 'Bridgeway English 學生學習平台',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a2236',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="zh-TW"
      className={`${cormorant.variable} ${inter.variable} ${notoSansTC.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
