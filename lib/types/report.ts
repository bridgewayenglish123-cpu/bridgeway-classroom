/**
 * lesson_reports 內 Json 欄位的內容形狀（由 Sprint 2 的 Claude 分析產生）。
 * 這些欄位在 database.ts 型別為 Json，讀取時以下列型別安全解讀。
 */
export type ReportAnalysis = {
  headline: string
  body: string
}

export type ReportVocabulary = {
  word: string
  type?: string
  definition_zh?: string
  definition_en?: string
}

export type ReportPhrase = {
  phrase: string
  type?: string
  usage_zh?: string
  usage_en?: string
}

export type ReportStrength = {
  zh: string
  en?: string
}

export type ReportError = {
  pattern?: string
  pattern_zh?: string
  pattern_en?: string
  count?: number
  example?: string
  correction?: string
  tip_zh?: string
  tip_en?: string
}

export type ReportComparison = {
  summary_zh?: string
  summary_en?: string
}

export type Lang = 'zh' | 'en'

// 報告頁 view-model（由 app/report/[lessonId]/page.tsx 從 Supabase 整理而成）
export type ReportVM = {
  lessonId: string
  reportId: string
  studentName: string
  dateLabel: string
  teacherName: string | null
  teacherNote: string | null
  milestone: string | null
  analysisZh: ReportAnalysis | null
  analysisEn: ReportAnalysis | null
  vocabulary: ReportVocabulary[]
  phrases: ReportPhrase[]
  strengths: ReportStrength[]
  errors: ReportError[]
  comparison: ReportComparison | null
  reflectionZh: string | null
  reflectionEn: string | null
  reflectionFeedback: string | null
  studentAge: number | null
}
