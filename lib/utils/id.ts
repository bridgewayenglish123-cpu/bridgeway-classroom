import { nanoid } from 'nanoid'

/**
 * 統一 ID 生成：`${prefix}_${nanoid(12)}`（照規格文件）。
 * 例：id('sv') → sv_Uakgb_J5m9g
 */
export const id = (prefix: string): string => `${prefix}_${nanoid(12)}`
