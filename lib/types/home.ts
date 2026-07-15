// 首頁元件用的 view-model 型別（由 app/home/page.tsx 從 Supabase 查詢整理而成）。

export type NextLessonVM = {
  date: string
  time: string
  duration: number | null
  teacherName: string | null
}

export type SummaryVM = {
  lessonId: string
  dateLabel: string
  teacherName: string | null
  headline: string | null
  body: string | null
  words: string[]
  phrases: string[]
  strengths: string[]
}

export type HistoryItemVM = {
  id: string
  month: string
  day: string
  teacherName: string | null
  duration: number | null
  summary: string | null
  chips: string[]
  milestone: string | null
  hasReport: boolean
}
