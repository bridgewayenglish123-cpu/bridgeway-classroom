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
