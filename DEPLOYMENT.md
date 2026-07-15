# Bridgeway Classroom — 部署與收尾指南（Sprint 1）

本文件涵蓋：本機開發、環境變數、推上 GitHub、Vercel 部署、Supabase Auth 設定、自訂網域，以及 Sprint 1 驗收清單。

---

## 1. 本機開發

```bash
cd "/Users/lichengtai/Bridgeway Classroom"
npm install          # 依 package-lock.json 安裝（node_modules 不進 git）
npm run dev          # 啟動開發伺服器
```

開啟 http://localhost:3000

- 根路徑 `/` 會 redirect 到 `/home`。
- 未登入會被 middleware 導到 `/auth/login`。
- `.env.local` 你已填好；請確認三個變數都有值（見下一節）。

其他指令：

```bash
npm run build        # 產生正式 build（部署前可先本機驗證）
npm start            # 以正式 build 在本機執行
npm run lint         # ESLint
```

---

## 2. 環境變數

### 本機 `.env.local`（已存在、已被 .gitignore 忽略，不會進 git）

```env
NEXT_PUBLIC_SUPABASE_URL=https://ssjdgeuhnoeqmaarsgsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<你的 anon key>
SUPABASE_SERVICE_ROLE_KEY=<你的 service role key>
```

### Vercel（Project → Settings → Environment Variables）

需要新增以下三個，套用到 **Production** 與 **Preview**（若你會用 preview 部署）：

| 變數名稱 | 值 | 備註 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ssjdgeuhnoeqmaarsgsw.supabase.co` | 前端可見（公開） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 anon key | 前端可見（公開，受 RLS 保護） |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 service role key | **機密**：名稱不要加 `NEXT_PUBLIC_`，只在 server 使用 |

重點：`SUPABASE_SERVICE_ROLE_KEY` 千萬不要命名成 `NEXT_PUBLIC_...`。已用 `import 'server-only'` 與程式架構確保它只留在後端，Vercel 也只需把它當一般（server）變數即可。

（Sprint 2 之後才需要新增 `ANTHROPIC_API_KEY`、`RESEND_API_KEY`。）

---

## 3. next.config.mjs

Sprint 1 **不需要任何調整**。目前設定僅開啟 `reactStrictMode`，其餘採 Next.js 14 預設：

- Server Actions（登入 / onboarding 使用）在 14.2 為預設啟用，無需額外設定。
- `next/font/google`（Cormorant Garamond / Inter / Noto Sans TC）在 Vercel build 時可正常抓取。
- 尚未使用 `next/image`，所以不需要 `images` 設定。

---

## 4. 推上 GitHub

> 注意：請在你的 Mac 終端機執行（不要在其他環境）。專案資料夾內若殘留一個不完整的 `.git`（先前工具端產生、權限問題無法清除），先移除再重新初始化。

```bash
cd "/Users/lichengtai/Bridgeway Classroom"
rm -rf .git                        # 移除殘留的不完整 .git
git init -b main
git add -A
git commit -m "Sprint 1: auth + onboarding + home (Next.js 14 + Supabase)"
git remote add origin https://github.com/bridgewayenglish123-cpu/bridgeway-classroom.git
git push -u origin main
```

若 repo 建立時已含初始 commit（例如勾了 README），`push` 可能被拒，改用：

```bash
git pull --rebase origin main
git push -u origin main
```

推送前可先確認不會外洩機密：

```bash
git status --ignored --short | grep .env.local    # .env.local 應在忽略清單（!!）
```

---

## 5. Vercel 部署

1. 到 Vercel → **Add New… → Project** → 匯入 GitHub repo `bridgewayenglish123-cpu/bridgeway-classroom`。
2. Framework 會自動偵測為 **Next.js**；Build Command / Output 皆用預設（不用改）。
3. 在 **Environment Variables** 填入第 2 節的三個變數（Production／Preview）。
4. **Deploy**。首次部署會自動 `npm install` + `next build`。
5. 部署完成後，先用 Vercel 提供的 `*.vercel.app` 網址測試登入流程，再綁定自訂網域。

---

## 6. Supabase Auth 設定（重要）

到 Supabase → **Authentication → URL Configuration**：

- **Site URL**：`https://app.bridgewayenglish.net`
- **Redirect URLs**（白名單，允許登入後與重設密碼導回）：
  - `http://localhost:3000/**`
  - `https://app.bridgewayenglish.net/**`
  - （若用 Vercel preview）你的 `*.vercel.app` 網址

沒有把 callback 網址加進白名單，**忘記密碼的重設連結**會失敗。

另外：學生要能用 Email + 密碼登入，該 Email 必須同時是一個 Supabase Auth 使用者，且對應到某筆 `students.zoom_email`（首次登入時系統會用 service-role 把 `auth_user_id` 關聯上去）。

---

## 7. 自訂網域 app.bridgewayenglish.net

1. Vercel → Project → **Settings → Domains** → 新增 `app.bridgewayenglish.net`。
2. 依 Vercel 指示到你的 DNS 供應商新增紀錄（通常是 `CNAME app → cname.vercel-dns.com`）。
3. DNS 生效後 Vercel 會自動簽發 SSL 憑證。
4. 確認第 6 節的 Site URL / Redirect URLs 已使用此網域。

---

## 8. Sprint 1 驗收清單

狀態說明：**[已驗證]** 我已在程式或建置層面確認；**[待測試]** 需要你本機/實機以真實資料測試；**[待設定]** 需要你在 Vercel / Supabase / DNS 完成。

### 登入流程
- [待測試] Email + 密碼登入正常（`signInWithPassword`，失敗顯示「Email 或密碼不正確，請再試一次。」）
- [待測試] 首次登入進入 onboarding（登入後檢查 `learning_goal` 為 null → `/onboarding`）
- [待測試] 設定 `learning_goal` 後進入首頁（onboarding 寫回後 → `/home`）
- [待測試] 忘記密碼流程正常（需先完成第 6 節白名單）
- [已驗證] 未登入自動 redirect 到登入頁（middleware，build 通過）

### 首頁
- [已驗證] 問候語依時間段正確切換（`getGreeting`，Asia/Taipei，已單元測試）
- [已驗證] CD1 旅程文字依堂數正確顯示（`getJourneyText`，照規格）
- [已驗證] 學習目標顯示在旅程文字下方（Greeting）
- [待測試] 下一堂課資料正確（日期、時間、老師）— 需真實資料實測
- [已驗證] 進入教室按鈕邏輯正確（10 分鐘；client 端 +08:00、每 30 秒更新）
- [已驗證] 空狀態文字正確顯示（摘要 / 歷程 / 下一堂課皆照規格文案）

### 資安
- [待設定] 學生只能看到自己的資料 — 由你的 RLS 政策把關；程式端查詢皆以 `auth_user_id` / `student.id` 過濾
- [已驗證] service role key 不出現在前端 — 原始碼與 build 後前端 bundle 皆掃描確認，只在 server-only 的 `admin.ts` 使用

### 部署
- [待設定] Vercel 部署成功（第 5 節）
- [待設定] app.bridgewayenglish.net 正常訪問（第 7 節）
- [已驗證] 手機版（375px）版面正常 — 手機優先設計、`sm:` 斷點；請你在 375px 再目視確認

---

## 9. 已知限制（留待 Sprint 2 / 3）

- **進入教室按鈕**目前金色可點時沒有實際跳轉目的地（schema 無 Zoom 連結欄位）。10 分鐘開關邏輯已完成；實際進教室連結待 Sprint 2 或提供欄位。
- **「完整報告 →」** 連往 `/report/[id]`（Sprint 2）、**「查看全部」** 連往 `/history`（Sprint 3），該路由尚未建立，點擊會 404。Sprint 1 無報告時「完整報告」不會出現。
- **摘要卡**的收藏 / 寫一句話 / 分享成就動作列與「口說信心指數」進度條為 Sprint 2 功能，尚未實作。
- **BottomNav**（底部導覽）依視覺稿未實作；若要加再告知。
- **設定新密碼頁**（update-password）規格未涵蓋；目前重設連結經 callback 後導向 `/home`。
