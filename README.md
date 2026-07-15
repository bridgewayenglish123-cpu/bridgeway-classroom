# Bridgeway Classroom

Bridgeway English 的學生學習平台。學生登入後可查看課表、AI 課堂分析報告、學習歷程與個人單字本。

與 Bridgeway Admin 共用同一個 Supabase 專案，但為獨立的 Next.js repo 與獨立的 Vercel 部署。

## 技術棧

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS（utility classes）
- Supabase（`@supabase/ssr`）
- 部署：Vercel · `app.bridgewayenglish.net`

## 開始開發

```bash
npm install
cp .env.local.example .env.local   # 填入 Supabase 金鑰
npm run dev
```

開啟 http://localhost:3000

## 環境變數

見 `.env.local.example`。`SUPABASE_SERVICE_ROLE_KEY` 與（Sprint 2）`ANTHROPIC_API_KEY` 只能在 server-side 使用，絕不可出現在前端或 `NEXT_PUBLIC_` 變數。

## 開發進度

- **Sprint 1** — 地基：登入 / onboarding / 首頁（進行中）
- Sprint 2 — 核心 AI 功能：VTT 上傳、Claude 分析報告、Email 通知
- Sprint 3 — 完整體驗：單字本、學習歷程、里程碑、深度報告
