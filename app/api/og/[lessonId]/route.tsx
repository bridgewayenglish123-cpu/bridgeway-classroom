import { ImageResponse } from '@vercel/og'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ReportAnalysis, ReportStrength, ReportVocabulary } from '@/lib/types/report'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params
    const { searchParams } = new URL(req.url)
    const template = searchParams.get('t') ?? 'lesson'

    const admin = createAdminClient()

    const { data: lesson } = await admin
      .from('lessons')
      .select('id, date, student_id, student:students!student_id(en_name, zh_name), teacher:teachers!teacher_id(teacher_name)')
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
    const flex = { display: 'flex' } as const

    if (template === 'milestone') {
      const { count: completedCount } = await admin
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', (lesson as any)?.student_id)
        .eq('status', 'completed')
        .eq('is_active', true)

      return new ImageResponse(
        <div style={{ ...flex, flexDirection: 'column', width: '100%', height: '100%', background: navy, padding: '60px', fontFamily: 'sans-serif' }}>
          <div style={{ ...flex, color: gold, fontSize: '16px', letterSpacing: '0.15em', marginBottom: '40px' }}>
            BRIDGEWAY · CLASSROOM
          </div>
          <div style={{ ...flex, color: ivory, fontSize: '18px', marginBottom: '48px', opacity: 0.7 }}>
            {studentName}
          </div>
          <div style={{ ...flex, flexDirection: 'row', gap: '60px', marginBottom: '48px' }}>
            <div style={{ ...flex, flexDirection: 'column' }}>
              <div style={{ ...flex, color: gold, fontSize: '72px', fontWeight: 700, lineHeight: 1 }}>{completedCount ?? 0}</div>
              <div style={{ ...flex, color: ivory, fontSize: '14px', opacity: 0.5, marginTop: '8px' }}>堂課完成</div>
            </div>
            <div style={{ ...flex, flexDirection: 'column' }}>
              <div style={{ ...flex, color: gold, fontSize: '72px', fontWeight: 700, lineHeight: 1 }}>{vocabCount + phraseCount}</div>
              <div style={{ ...flex, color: ivory, fontSize: '14px', opacity: 0.5, marginTop: '8px' }}>個詞彙學習</div>
            </div>
          </div>
          <div style={{ ...flex, color: ivory, fontSize: '13px', opacity: 0.3 }}>
            app.bridgewayenglish.net
          </div>
        </div>,
        { width: 1200, height: 630 }
      )
    }

    return new ImageResponse(
      <div style={{ ...flex, flexDirection: 'column', width: '100%', height: '100%', background: navy, padding: '60px', fontFamily: 'sans-serif' }}>
        <div style={{ ...flex, color: gold, fontSize: '16px', letterSpacing: '0.15em', marginBottom: '32px' }}>
          BRIDGEWAY · CLASSROOM
        </div>
        <div style={{ ...flex, color: ivory, fontSize: '16px', opacity: 0.6, marginBottom: '20px' }}>
          {studentName}{date ? ' · ' + date.slice(5).replace('-', '/') : ''}{teacherName ? ' · ' + teacherName : ''}
        </div>
        <div style={{ ...flex, color: ivory, fontSize: '26px', fontWeight: 600, lineHeight: 1.4, marginBottom: '28px', maxWidth: '900px' }}>
          {headline || studentName + ' 的學習報告'}
        </div>
        <div style={{ ...flex, flexDirection: 'column', marginBottom: '28px' }}>
          <div style={{ ...flex, color: gold, fontSize: '13px', letterSpacing: '0.12em', marginBottom: '10px' }}>
            {strength ? '這堂課最大的進步' : ''}
          </div>
          <div style={{ ...flex, color: ivory, fontSize: '18px', lineHeight: 1.6, opacity: 0.9, maxWidth: '900px' }}>
            {strength}
          </div>
        </div>
        <div style={{ ...flex, flexDirection: 'row', gap: '40px', marginBottom: '40px' }}>
          <div style={{ ...flex, flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...flex, color: gold, fontSize: '48px', fontWeight: 700 }}>{String(vocabCount)}</div>
            <div style={{ ...flex, color: ivory, fontSize: '13px', opacity: 0.5 }}>單字</div>
          </div>
          <div style={{ ...flex, color: ivory, opacity: 0.2, fontSize: '48px', alignSelf: 'center' }}>·</div>
          <div style={{ ...flex, flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...flex, color: gold, fontSize: '48px', fontWeight: 700 }}>{String(phraseCount)}</div>
            <div style={{ ...flex, color: ivory, fontSize: '13px', opacity: 0.5 }}>片語</div>
          </div>
        </div>
        <div style={{ ...flex, color: ivory, fontSize: '13px', opacity: 0.3 }}>
          app.bridgewayenglish.net
        </div>
      </div>,
      { width: 1200, height: 630 }
    )
  } catch (err) {
    console.error('OG image error:', err)
    return new Response('Error: ' + String(err), { status: 500 })
  }
}
