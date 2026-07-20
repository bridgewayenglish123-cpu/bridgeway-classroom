import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ReportAnalysis, ReportStrength, ReportVocabulary } from '@/lib/types/report'

export const runtime = 'edge'

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const { lessonId } = params
  const { searchParams } = new URL(req.url)
  const template = searchParams.get('t') ?? 'lesson'

  const admin = createAdminClient()

  const { data: lesson } = await admin
    .from('lessons')
    .select('id, date, duration, student:students!student_id(en_name, zh_name), teacher:teachers!teacher_id(teacher_name)')
    .eq('id', lessonId)
    .single()

  const { data: report } = await admin
    .from('lesson_reports')
    .select('analysis_zh, strengths, vocabulary, phrases')
    .eq('lesson_id', lessonId)
    .single()

  const student = Array.isArray(lesson?.student) ? lesson.student[0] : lesson?.student
  const teacher = Array.isArray(lesson?.teacher) ? lesson.teacher[0] : lesson?.teacher
  const analysis = report?.analysis_zh as unknown as ReportAnalysis | null
  const strengths = (report?.strengths as unknown as ReportStrength[] | null) ?? []
  const vocab = (report?.vocabulary as unknown as ReportVocabulary[] | null) ?? []
  const phrases = (report?.phrases as any[]) ?? []

  const studentName = student?.en_name ?? student?.zh_name ?? 'Student'
  const teacherName = teacher?.teacher_name ?? ''
  const date = lesson?.date ?? ''
  const strength = strengths[0]?.zh ?? ''
  const vocabCount = vocab.length
  const phraseCount = phrases.length
  const headline = analysis?.headline ?? ''

  const gold = '#C2991F'
  const navy = '#1A2236'
  const ivory = '#F7F4EE'

  if (template === 'milestone') {
    const { count: completedCount } = await admin
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', (lesson as any)?.student_id)
      .eq('status', 'completed')
      .eq('is_active', true)

    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%',
        background: navy,
        display: 'flex', flexDirection: 'column',
        padding: '60px',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ color: gold, fontSize: '16px', letterSpacing: '0.15em', marginBottom: '40px' }}>
          BRIDGEWAY · CLASSROOM
        </div>
        <div style={{ color: ivory, fontSize: '18px', marginBottom: '48px', opacity: 0.7 }}>
          {studentName}
        </div>
        <div style={{ display: 'flex', gap: '60px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: gold, fontSize: '72px', fontWeight: 700, lineHeight: 1 }}>{completedCount ?? 0}</div>
            <div style={{ color: ivory, fontSize: '14px', opacity: 0.5, marginTop: '8px', letterSpacing: '0.08em' }}>堂課完成</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: gold, fontSize: '72px', fontWeight: 700, lineHeight: 1 }}>{vocabCount + phraseCount}</div>
            <div style={{ color: ivory, fontSize: '14px', opacity: 0.5, marginTop: '8px', letterSpacing: '0.08em' }}>個詞彙學習</div>
          </div>
        </div>
        <div style={{ color: ivory, fontSize: '13px', opacity: 0.3, letterSpacing: '0.05em' }}>
          app.bridgewayenglish.net
        </div>
      </div>,
      { width: 1200, height: 630 }
    )
  }

  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: navy,
      display: 'flex', flexDirection: 'column',
      padding: '60px',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ color: gold, fontSize: '16px', letterSpacing: '0.15em', marginBottom: '32px' }}>
        BRIDGEWAY · CLASSROOM
      </div>
      <div style={{ color: ivory, fontSize: '16px', opacity: 0.6, marginBottom: '20px' }}>
        {studentName}{date ? ' · ' + date.slice(5).replace('-', '/') : ''}{teacherName ? ' · ' + teacherName : ''}
      </div>
      {headline && (
        <div style={{ color: ivory, fontSize: '32px', fontWeight: 600, lineHeight: 1.4, marginBottom: '36px', maxWidth: '900px' }}>
          {headline}
        </div>
      )}
      {strength && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{ color: gold, fontSize: '13px', letterSpacing: '0.12em', marginBottom: '12px' }}>
            這堂課最大的進步
          </div>
          <div style={{ color: ivory, fontSize: '22px', lineHeight: 1.6, opacity: 0.9, maxWidth: '900px' }}>
            {strength}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: gold, fontSize: '48px', fontWeight: 700 }}>{vocabCount}</div>
          <div style={{ color: ivory, fontSize: '13px', opacity: 0.5 }}>單字</div>
        </div>
        <div style={{ color: ivory, opacity: 0.2, fontSize: '48px', alignSelf: 'center' }}>·</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: gold, fontSize: '48px', fontWeight: 700 }}>{phraseCount}</div>
          <div style={{ color: ivory, fontSize: '13px', opacity: 0.5 }}>片語</div>
        </div>
      </div>
      <div style={{ color: ivory, fontSize: '13px', opacity: 0.3, letterSpacing: '0.05em' }}>
        app.bridgewayenglish.net
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
