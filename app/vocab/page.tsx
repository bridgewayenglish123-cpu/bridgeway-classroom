import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav'
import { VocabCollectionClient } from './VocabCollectionClient'

export const dynamic = 'force-dynamic'

export default async function VocabPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: student } = await supabase
    .from('students')
    .select('id, en_name, zh_name')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!student) redirect('/home')

  const { data: savedItems } = await supabase
    .from('saved_vocabulary')
    .select(`
      id, word, type, created_at,
      definition_zh, definition_en, example_en, example_zh,
      lesson_report:lesson_report_id (
        id,
        lesson:lesson_id ( id, date, teacher:teachers!teacher_id ( teacher_name ) )
      )
    `)
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })

  const displayName = student.en_name ?? student.zh_name ?? ''

  const items = (savedItems ?? []).map((s: any) => {
    const report = Array.isArray(s.lesson_report) ? s.lesson_report[0] : s.lesson_report
    const lesson = report ? (Array.isArray(report.lesson) ? report.lesson[0] : report.lesson) : null
    const teacher = lesson ? (Array.isArray(lesson.teacher) ? lesson.teacher[0] : lesson.teacher) : null
    return {
      id: s.id,
      word: s.word,
      type: s.type as 'word' | 'phrase',
      definitionZh: s.definition_zh ?? null,
      definitionEn: s.definition_en ?? null,
      exampleEn: s.example_en ?? null,
      exampleZh: s.example_zh ?? null,
      createdAt: s.created_at,
      lessonId: lesson?.id ?? null,
      lessonDate: lesson?.date ?? null,
      teacherName: teacher?.teacher_name ?? null,
    }
  })

  return (
    <>
      <Nav name={displayName} />
      <VocabCollectionClient items={items} />
    </>
  )
}
