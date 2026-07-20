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

    const lessonPersonal = (() => {
      if (vocabCount >= 8) return `${studentName} is building a serious vocabulary.`
      if (phraseCount >= 6) return `${studentName} speaks more naturally every lesson.`
      return `${studentName} is getting better every time.`
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

      const milestonePersonal = (() => {
        if (completedCount <= 5) return `${studentName} is on the right path.`
        if (completedCount <= 10) return `${studentName} doesn't quit.`
        if (completedCount <= 20) return `${studentName} keeps showing up.`
        if (completedCount <= 30) return `${studentName} is the real deal.`
        return `${studentName} is unstoppable.`
      })()

      return new ImageResponse(
        <div style={{ display:'flex', flexDirection:'column', width:'100%', height:'100%', background:ivory, fontFamily:'sans-serif' }}>
          <div style={{ display:'flex', width:'100%', height:'5px', background:gold }} />

          <div style={{ display:'flex', flex:1, padding:'44px 80px 0' }}>
            {/* 左側 */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1, paddingRight:'56px', borderRight:'1px solid ' + dim }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', fontSize:'13px', letterSpacing:'3px', color:navy, opacity:0.38 }}>BRIDGEWAY · CLASSROOM</div>
                <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold }}>LEARNING MILESTONE</div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'center' }}>
                <div style={{ display:'flex', fontSize:'220px', fontWeight:800, color:navy, lineHeight:1, letterSpacing:'-10px' }}>{String(completedCount)}</div>
                <div style={{ display:'flex', fontSize:'20px', color:navy, opacity:0.38, marginTop:'12px' }}>堂課完成</div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <div style={{ display:'flex', fontSize:'24px', fontWeight:700, color:gold }}>{milestoneTagline}</div>
                <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.5 }}>{milestonePersonal}</div>
              </div>
            </div>

            {/* 右側 */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'56px', width:'320px' }}>
              <div style={{ display:'flex', fontSize:'11px', letterSpacing:'2px', color:gold }}>YOUR PROGRESS</div>

              <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <div style={{ display:'flex', fontSize:'80px', fontWeight:800, color:navy, lineHeight:1 }}>{String(totalVocab)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.38 }}>個詞彙收藏</div>
                </div>
                <div style={{ display:'flex', width:'100%', height:'1px', background:dim }} />
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <div style={{ display:'flex', fontSize:'80px', fontWeight:800, color:gold, lineHeight:1 }}>{String(vocabCount + phraseCount)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.38 }}>本堂學習詞彙</div>
                </div>
              </div>

              <div style={{ display:'flex', fontSize:'14px', color:navy, opacity:0.3 }}>app.bridgewayenglish.net</div>
            </div>
          </div>

          <div style={{ display:'flex', width:'100%', height:'1px', background:dim, marginTop:'32px' }} />
          <div style={{ display:'flex', alignItems:'center', padding:'14px 80px' }}>
            <div style={{ display:'flex', fontSize:'22px', fontWeight:700, color:navy }}>{studentName}</div>
          </div>
        </div>,
        { width: 1200, height: 630 }
      )
    }

    // Lesson template
    return new ImageResponse(
      <div style={{ display:'flex', flexDirection:'column', width:'100%', height:'100%', background:ivory, fontFamily:'sans-serif' }}>
        <div style={{ display:'flex', width:'100%', height:'5px', background:gold }} />

        <div style={{ display:'flex', flex:1, padding:'44px 80px 0' }}>
          {/* 左側 */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1, paddingRight:'56px', borderRight:'1px solid ' + dim }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', fontSize:'13px', letterSpacing:'3px', color:navy, opacity:0.38 }}>BRIDGEWAY · CLASSROOM</div>
              <div style={{ display:'flex', fontSize:'12px', color:navy, opacity:0.25 }}>{dateFormatted}{teacherName ? ' · ' + teacherName : ''}</div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'center' }}>
              <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold, marginBottom:'20px' }}>{"TODAY'S LESSON"}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ display:'flex', fontSize:'200px', fontWeight:800, color:navy, lineHeight:1, letterSpacing:'-8px' }}>{String(vocabCount)}</div>
                  <div style={{ display:'flex', fontSize:'18px', color:navy, opacity:0.38, marginTop:'10px' }}>單字</div>
                </div>
                <div style={{ display:'flex', fontSize:'40px', color:navy, opacity:0.1, paddingBottom:'40px' }}>+</div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ display:'flex', fontSize:'200px', fontWeight:800, color:gold, lineHeight:1, letterSpacing:'-8px' }}>{String(phraseCount)}</div>
                  <div style={{ display:'flex', fontSize:'18px', color:navy, opacity:0.38, marginTop:'10px' }}>片語</div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <div style={{ display:'flex', fontSize:'22px', fontWeight:700, color:gold }}>{lessonTagline}</div>
              <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.5 }}>{lessonPersonal}</div>
            </div>
          </div>

          {/* 右側 */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'56px', width:'320px' }}>
            <div style={{ display:'flex', fontSize:'11px', letterSpacing:'2px', color:gold }}>NEW VOCABULARY</div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0', flex:1, justifyContent:'center' }}>
              {previewWords.map((word: string, i: number) => (
                <div key={i} style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', fontSize:'30px', fontWeight: i === 0 ? 700 : 500, color:navy, opacity:0.82, paddingTop: i === 0 ? '0' : '16px', paddingBottom:'16px' }}>{word}</div>
                  {i < previewWords.length - 1 && <div style={{ display:'flex', width:'100%', height:'1px', background:dim }} />}
                </div>
              ))}
              {extraWords > 0 && (
                <div style={{ display:'flex', fontSize:'16px', color:gold, opacity:0.65, marginTop:'8px' }}>+{extraWords} more</div>
              )}
            </div>

            <div style={{ display:'flex', fontSize:'14px', color:navy, opacity:0.3 }}>app.bridgewayenglish.net</div>
          </div>
        </div>

        <div style={{ display:'flex', width:'100%', height:'1px', background:dim, marginTop:'32px' }} />
        <div style={{ display:'flex', alignItems:'center', padding:'14px 80px' }}>
          <div style={{ display:'flex', fontSize:'22px', fontWeight:700, color:navy }}>{studentName}</div>
        </div>
      </div>,
      { width: 1200, height: 630 }
    )
  } catch (err) {
    console.error('OG image error:', err)
    return new Response('Error: ' + String(err), { status: 500 })
  }
}
