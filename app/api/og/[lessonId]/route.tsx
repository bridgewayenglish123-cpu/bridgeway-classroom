import { ImageResponse } from '@vercel/og'
import { createAdminClient } from '@/lib/supabase/admin'

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

    const student = Array.isArray(lesson?.student) ? (lesson.student as any[])[0] : lesson?.student as any
    const teacher = Array.isArray(lesson?.teacher) ? (lesson.teacher as any[])[0] : lesson?.teacher as any
    const vocab = (report?.vocabulary as any[]) ?? []
    const phrases = (report?.phrases as any[]) ?? []

    const studentName = student?.en_name ?? student?.zh_name ?? 'Student'
    const teacherName = teacher?.teacher_name ?? ''
    const date = lesson?.date ?? ''
    const vocabCount = vocab.length
    const phraseCount = phrases.length
    const dateFormatted = date ? date.slice(5).replace('-', '.') : ''
    const previewWords = vocab.slice(0, 4).map((v: any) => v.word).filter(Boolean)
    const extraWords = Math.max(0, vocabCount - 4)

    const lessonTagline = vocabCount > phraseCount * 2
      ? 'Heavy on vocabulary today.'
      : phraseCount > vocabCount * 2
        ? 'Phrases were the focus today.'
        : 'Words and phrases, all covered.'

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

      // 累計學習詞彙：撈所有報告的 vocabulary + phrases 總數
      const { data: allReports } = await admin
        .from('lesson_reports')
        .select('vocabulary, phrases')
        .in('lesson_id', (await admin
          .from('lessons')
          .select('id')
          .eq('student_id', (lesson as any)?.student_id)
          .eq('status', 'completed')
          .eq('is_active', true)
          .then(r => (r.data ?? []).map((l: any) => l.id))
        ))
      const totalVocab = (allReports ?? []).reduce((sum: number, r: any) => {
        return sum + ((r.vocabulary as any[])?.length ?? 0) + ((r.phrases as any[])?.length ?? 0)
      }, 0)

      const milestoneTagline = completedCount <= 5 ? 'Just getting started.'
        : completedCount <= 10 ? 'Building momentum.'
        : completedCount <= 20 ? 'Still going.'
        : completedCount <= 30 ? 'Consistency is everything.'
        : 'This is dedication.'

      return new ImageResponse(
        <div style={{ display:'flex', flexDirection:'column', width:'100%', height:'100%', background:ivory, fontFamily:'sans-serif' }}>
          <div style={{ display:'flex', width:'100%', height:'5px', background:gold }} />
          <div style={{ display:'flex', flex:1, padding:'44px 80px 0' }}>
            {/* 左側 */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1, paddingRight:'56px', borderRight:`1px solid ${dim}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', fontSize:'14px', letterSpacing:'3px', color:navy, opacity:0.55, fontWeight:600 }}>BRIDGEWAY · CLASSROOM</div>
                <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold, fontWeight:600 }}>LEARNING MILESTONE</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', fontSize:'180px', fontWeight:800, color:navy, lineHeight:1, letterSpacing:'-8px' }}>{String(completedCount)}</div>
                <div style={{ display:'flex', fontSize:'20px', color:navy, opacity:0.42, marginTop:'10px', fontWeight:600 }}>堂課完成</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <div style={{ display:'flex', fontSize:'24px', fontWeight:700, color:gold }}>{milestoneTagline}</div>
                <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.5 }}>{studentName} is on a roll.</div>
              </div>
            </div>
            {/* 右側 */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'56px', width:'320px' }}>
              <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold, fontWeight:600 }}>YOUR PROGRESS</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <div style={{ display:'flex', fontSize:'80px', fontWeight:800, color:navy, lineHeight:1 }}>{String(totalVocab)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.42 }}>累計學習詞彙</div>
                </div>
                <div style={{ display:'flex', width:'100%', height:'1px', background:dim }} />
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <div style={{ display:'flex', fontSize:'80px', fontWeight:800, color:gold, lineHeight:1 }}>{String(vocabCount + phraseCount)}</div>
                  <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.42 }}>本堂學習詞彙</div>
                </div>
              </div>
              <div style={{ display:'flex', fontSize:'13px', color:navy, opacity:0.25 }}>app.bridgewayenglish.net</div>
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
        <div style={{ display:'flex', flex:1, padding:'44px 80px 0' }}>
          {/* 左側 */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1, paddingRight:'56px', borderRight:`1px solid ${dim}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', fontSize:'14px', letterSpacing:'3px', color:navy, opacity:0.55, fontWeight:600 }}>BRIDGEWAY · CLASSROOM</div>
              <div style={{ display:'flex', fontSize:'12px', color:navy, opacity:0.28 }}>{dateFormatted}{teacherName ? ' · ' + teacherName : ''}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', fontSize:'13px', letterSpacing:'2px', color:gold, marginBottom:'16px', fontWeight:600 }}>{"TODAY'S LESSON"}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ display:'flex', fontSize:'160px', fontWeight:800, color:navy, lineHeight:1, letterSpacing:'-6px' }}>{String(vocabCount)}</div>
                  <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.38, marginTop:'8px' }}>單字</div>
                </div>
                <div style={{ display:'flex', fontSize:'36px', color:navy, opacity:0.1, paddingBottom:'32px' }}>+</div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ display:'flex', fontSize:'160px', fontWeight:800, color:gold, lineHeight:1, letterSpacing:'-6px' }}>{String(phraseCount)}</div>
                  <div style={{ display:'flex', fontSize:'16px', color:navy, opacity:0.38, marginTop:'8px' }}>片語</div>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <div style={{ display:'flex', fontSize:'22px', fontWeight:700, color:gold }}>{lessonTagline}</div>
              <div style={{ display:'flex', fontSize:'15px', color:navy, opacity:0.5 }}>{studentName} is getting better every time.</div>
            </div>
          </div>
          {/* 右側 */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'56px', width:'320px' }}>
            <div style={{ display:'flex', fontSize:'12px', letterSpacing:'2px', color:gold, fontWeight:600 }}>NEW VOCABULARY</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0', flex:1, justifyContent:'center' }}>
              {previewWords.map((word: string, i: number) => (
                <div key={i} style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', fontSize:'28px', fontWeight: i === 0 ? 700 : 500, color:navy, opacity:0.82, paddingTop: i === 0 ? '0' : '14px', paddingBottom:'14px' }}>{word}</div>
                  {i < previewWords.length - 1 && <div style={{ display:'flex', width:'100%', height:'1px', background:dim }} />}
                </div>
              ))}
              {extraWords > 0 && (
                <div style={{ display:'flex', fontSize:'15px', color:gold, opacity:0.65, marginTop:'8px' }}>+{extraWords} more</div>
              )}
            </div>
            <div style={{ display:'flex', fontSize:'13px', color:navy, opacity:0.25 }}>app.bridgewayenglish.net</div>
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
    console.error('OG error:', err)
    return new Response('Error', { status: 500 })
  }
}
