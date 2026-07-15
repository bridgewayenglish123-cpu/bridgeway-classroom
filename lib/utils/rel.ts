/**
 * Supabase 巢狀關聯（embedded relation）正規化：
 * 依關係推斷，to-one 有時型別會是物件、有時是陣列，這裡統一取單一物件。
 */
export function one<T>(rel: T | T[] | null | undefined): T | null {
  if (rel == null) return null
  return Array.isArray(rel) ? (rel[0] ?? null) : rel
}
