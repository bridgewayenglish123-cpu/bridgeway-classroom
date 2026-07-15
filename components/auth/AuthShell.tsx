/**
 * Auth 頁面共用外框：置中的品牌卡片（登入 / 忘記密碼共用）。
 * Server Component，內容區 children 可放 Client 表單。
 */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-ivory px-5 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center font-serif text-[22px] font-medium tracking-[0.05em] text-navy">
          Bridgeway <span className="text-gold">Classroom</span>
        </div>

        <div className="rounded-card bg-white p-7 shadow-md sm:p-8">
          <h1 className="font-serif text-[28px] font-medium leading-tight text-navy">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-[13px] leading-relaxed text-ink-mid">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  )
}
