'use server'

import { createClient } from '@/lib/supabase/server'
import { id } from '@/lib/utils/id'

/**
 * 收藏 / 取消收藏單字或片語（CD4）。
 * 走使用者 session + RLS；saved_vocabulary.word 同時存單字與片語的文字。
 */
export async function toggleVocabulary(input: {
  lessonReportId: string
  word: string
  type: 'word' | 'phrase'
  definitionZh: string | null
  definitionEn: string | null
  isSaved: boolean
}): Promise<{ error?: string }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (!student) return { error: '找不到學生資料' }

  if (input.isSaved) {
    // 取消收藏
    const { error } = await supabase
      .from('saved_vocabulary')
      .delete()
      .eq('student_id', student.id)
      .eq('lesson_report_id', input.lessonReportId)
      .eq('word', input.word)
    if (error) return { error: error.message }
  } else {
    // 新增收藏
    const { error } = await supabase.from('saved_vocabulary').insert({
      id: id('sv'),
      student_id: student.id,
      lesson_report_id: input.lessonReportId,
      word: input.word,
      type: input.type,
      definition_zh: input.definitionZh,
      definition_en: input.definitionEn,
    })
    if (error) return { error: error.message }
  }

  return {}
}

/**
 * 儲存思考題作答（CD3）。UPDATE 既有的 reflection_responses（由 generate-report 預建）。
 */
export async function saveReflection(input: {
  lessonReportId: string
  response: string
}): Promise<{ error?: string }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (!student) return { error: '找不到學生資料' }

  const { error } = await supabase
    .from('reflection_responses')
    .update({ response: input.response })
    .eq('student_id', student.id)
    .eq('lesson_report_id', input.lessonReportId)
  if (error) return { error: error.message }

  return {}
}
