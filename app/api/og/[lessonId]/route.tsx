import { ImageResponse } from '@vercel/og'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ReportVocabulary } from '@/lib/types/report'

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
      .select('vocabulary, phrases')
      .eq('lesson_id', lessonId)
      .single()

    const student = Array.isArray(lesson?.student) ? lesson.student[0] : lesson?.student
    const teacher = Array.isArray(lesson?.teacher) ? lesson.teacher[0] : lesson?.teacher
    const vocab = (report?.vocabulary as unknown as ReportVocabulary[] | null) ?? []
    const phrases = (report?.phrases as any[]) ?? []

    const studentName = student?.en_name ?? student?.zh_name ?? 'Student'
    const teacherName = teacher?.teacher_name ?? ''
    const date = lesson?.date ?? ''
    const vocabCount = vocab.length
    const phraseCount = phrases.length
    const dateFormatted = date ? date.slice(5).replace('-', '.') : ''
    const previewWords = vocab.slice(0, 4).map((v: any) => v.word).filter(Boolean)
    const extraWords = Math.max(0, vocabCount - 4)

    const lessonTagline = (() => {
      if (vocabCount > phraseCount * 2) return 'Heavy on vocabulary today.'
      if (phraseCount > vocabCount * 2) return 'Phrases were the focus today.'
      return 'Words and phrases, all covered.'
    })()

    const navy = '#1A2236'
    const gold = '#B8973A'
    const ivory = '#F7F4EE'
    const dim = 'rgba(26,34,54,0.07)'

    if (template === 'milestone') {
      const { count: cc } = await admin
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', (lesson as any)?.student_id)
        .eq('status', 'completed')
        .eq('is_active', true)
      const completedCount = cc ?? 0

      const { count: tv } = await admin
        .from('saved_vocabulary')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', (lesson as any)?.student_id)
      const totalVocab = tv ?? vocabCount + phraseCount

      const milestoneTagline = (() => {
        if (completedCount <= 5) return 'Just getting started.'
        if (completedCount <= 10) return 'Building momentum.'
        if (completedCount <= 20) return 'Still going.'
        if (completedCount <= 30) return 'Consistency is everything.'
        return 'This is dedication.'
      })()

      return new ImageResponse(
        <div style={{ display:'flex', flexDirection:'column', width:'100%', height:'100%', background:ivory, fontFamily:'sans-serif' }}>
          <div style={{ display:'flex', width:'100%', height:'5px', background:gold }} />

          {/* 上半：大數字區 */}
          <div style={{ display:'flex', flex:1, padding:'44px 80px 0' }}>
            {/* 左側：大數字 */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1, paddingRight:'60px', borderRight:'1px solid ' + dim }}>
              <div style={{ display:'flex', fontSize:'13px', letterSpacing:'3px', color:navy, opacity:0.38 }}>BRIDGEWAY · CLASSROOM</div>
              <div style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', fontSize:'160px', fontWeight:800, color:navy, lineHeight:1, letterSpacing:'-6px' }}>{String(completedCount)}</div>
                <div style={{ display:'flex', fontSize:'18px', color:navy, opacity:0.38, marginTop:'12px' }}>堂課完成</div>
              </div>
              <div style={{ display:'flex', fontSize:'22px', fontWeight:600, color:gold }}>{milestoneTagline}</div>
            </div>

            {/* 右側：統計 */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'60px', width:'360px' }}>
              <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold }}>LEARNING MILESTONE</div>

              <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', fontSize:'72px', fontWeight:800, color:navy, lineHeight:1 }}>{String(totalVocab)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.38, marginTop:'8px' }}>個詞彙收藏</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', fontSize:'72px', fontWeight:800, color:gold, lineHeight:1 }}>{String(vocabCount + phraseCount)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.38, marginTop:'8px' }}>本堂學習詞彙</div>
                </div>
              </div>

              <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.55 }}>{studentName} is on a roll.</div>
            </div>
          </div>

          <div style={{ display:'flex', width:'100%', height:'1px', background:dim, marginTop:'32px' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 80px' }}>
            <div style={{ display:'flex', fontSize:'22px', fontWeight:700, color:navy }}>{studentName}</div>
            <div style={{ display:'flex', fontSize:'11px', color:navy, opacity:0.18, letterSpacing:'1px' }}>app.bridgewayenglish.net</div>
          </div>
        </div>,
        { width: 1200, height: 630 }
      )
    }

    // Lesson template
    return new ImageResponse(
      <div style={{ display:'flex', flexDirection:'column', width:'100%', height:'100%', background:ivory, fontFamily:'sans-serif' }}>
        <div style={{ display:'flex', width:'100%', height:'5px', background:gold }} />

        {/* 上半：數字 + 單字 左右分欄 */}
        <div style={{ display:'flex', flex:1, padding:'44px 80px 0' }}>
          {/* 左側：數字 */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1, paddingRight:'60px', borderRight:'1px solid ' + dim }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', fontSize:'13px', letterSpacing:'3px', color:navy, opacity:0.38 }}>BRIDGEWAY · CLASSROOM</div>
              <div style={{ display:'flex', fontSize:'12px', color:navy, opacity:0.25 }}>{dateFormatted}{teacherName ? ' · ' + teacherName : ''}</div>
            </div>

            <div style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold, marginBottom:'20px' }}>{"TODAY'S LESSON"}</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:'20px' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ display:'flex', fontSize:'140px', fontWeight:800, color:navy, lineHeight:1, letterSpacing:'-6px' }}>{String(vocabCount)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.38, marginTop:'8px' }}>單字</div>
                </div>
                <div style={{ display:'flex', fontSize:'40px', color:navy, opacity:0.12, paddingBottom:'32px' }}>+</div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ display:'flex', fontSize:'140px', fontWeight:800, color:gold, lineHeight:1, letterSpacing:'-6px' }}>{String(phraseCount)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.38, marginTop:'8px' }}>片語</div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', fontSize:'22px', fontWeight:600, color:gold }}>{lessonTagline}</div>
          </div>

          {/* 右側：單字列表 */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'60px', width:'340px' }}>
            <div style={{ display:'flex', fontSize:'11px', letterSpacing:'2px', color:gold }}>NEW VOCABULARY</div>

            <div style={{ display:'flex', flexDirection:'column', gap:'20px', flex:1, justifyContent:'center' }}>
              {previewWords.map((word: string, i: number) => (
                <div key={i} style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', fontSize:'28px', fontWeight: i === 0 ? 700 : 500, color:navy, opacity:0.82 }}>{word}</div>
                  {i < previewWords.length - 1 && (
                    <div style={{ display:'flex', width:'100%', height:'1px', background:dim, marginTop:'20px' }} />
                  )}
                </div>
              ))}
              {extraWords > 0 && (
                <div style={{ display:'flex', fontSize:'16px', color:gold, opacity:0.6 }}>+{extraWords} more</div>
              )}
            </div>

            <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.55 }}>{studentName} showed up today.</div>
          </div>
        </div>

        <div style={{ display:'flex', width:'100%', height:'1px', background:dim, marginTop:'32px' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 80px' }}>
          <div style={{ display:'flex', fontSize:'22px', fontWeight:700, color:navy }}>{studentName}</div>
          <div style={{ display:'flex', fontSize:'11px', color:navy, opacity:0.18, letterSpacing:'1px' }}>app.bridgewayenglish.net</div>
        </div>
      </div>,
      { width: 1200, height: 630 }
    )
  } catch (err) {
    console.error('OG image error:', err)
    return new Response('Error: ' + String(err), { status: 500 })
  }
}
