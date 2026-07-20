import { NextResponse } from 'next/server'
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

    let completedCount = 0
    let totalVocab = 0

    if (template === 'milestone') {
      const { count: cc } = await admin
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', (lesson as any)?.student_id)
        .eq('status', 'completed')
        .eq('is_active', true)
      completedCount = cc ?? 0

      const { count: tv } = await admin
        .from('saved_vocabulary')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', (lesson as any)?.student_id)
      totalVocab = tv ?? vocabCount + phraseCount
    }

    const satori = (await import('satori')).default
    const { Resvg } = await import('@resvg/resvg-js')

    const navy = '#1A2236'
    const gold = '#B8973A'
    const ivory = '#F7F4EE'
    const ivoryLine = 'rgba(26,34,54,0.08)'

    let element: any

    if (template === 'milestone') {
      element = {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '630px',
            background: ivory,
            fontFamily: 'sans-serif',
          },
          children: [
            // 頂部金線
            { type: 'div', props: { style: { width: '100%', height: '5px', background: gold, flexShrink: 0 } } },
            // 主內容
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', flex: 1, padding: '48px 80px 0' },
                children: [
                  // 品牌列
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
                      children: [
                        { type: 'div', props: { style: { fontSize: '14px', letterSpacing: '3px', color: navy, opacity: 0.4 }, children: 'BRIDGEWAY · CLASSROOM' } },
                        { type: 'div', props: { style: { fontSize: '12px', letterSpacing: '2px', color: gold }, children: 'LEARNING MILESTONE' } },
                      ]
                    }
                  },
                  // 大數字
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' },
                      children: [
                        { type: 'div', props: { style: { fontSize: '220px', fontWeight: 800, color: navy, lineHeight: 1, letterSpacing: '-10px' }, children: String(completedCount) } },
                        { type: 'div', props: { style: { fontSize: '24px', color: navy, opacity: 0.4, marginTop: '8px', letterSpacing: '2px' }, children: '堂課完成' } },
                      ]
                    }
                  },
                ]
              }
            },
            // 分隔線
            { type: 'div', props: { style: { width: '100%', height: '1px', background: ivoryLine } } },
            // 下半三格
            {
              type: 'div',
              props: {
                style: { display: 'flex', height: '160px', padding: '0 80px' },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' },
                      children: [
                        { type: 'div', props: { style: { fontSize: '64px', fontWeight: 800, color: navy, lineHeight: 1 }, children: String(totalVocab) } },
                        { type: 'div', props: { style: { fontSize: '16px', color: navy, opacity: 0.4, letterSpacing: '1px' }, children: '個詞彙收藏' } },
                      ]
                    }
                  },
                  { type: 'div', props: { style: { width: '1px', background: ivoryLine, margin: '28px 0' } } },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' },
                      children: [
                        { type: 'div', props: { style: { fontSize: '64px', fontWeight: 800, color: gold, lineHeight: 1 }, children: String(vocabCount + phraseCount) } },
                        { type: 'div', props: { style: { fontSize: '16px', color: navy, opacity: 0.4, letterSpacing: '1px' }, children: '本堂學習詞彙' } },
                      ]
                    }
                  },
                  { type: 'div', props: { style: { width: '1px', background: ivoryLine, margin: '28px 0' } } },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' },
                      children: [
                        { type: 'div', props: { style: { fontSize: '24px', fontWeight: 600, color: navy, opacity: 0.65 }, children: 'Keep up the' } },
                        { type: 'div', props: { style: { fontSize: '24px', fontWeight: 700, color: gold }, children: 'great work!' } },
                      ]
                    }
                  },
                ]
              }
            },
            // 底部
            { type: 'div', props: { style: { width: '100%', height: '1px', background: ivoryLine } } },
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 80px' },
                children: [
                  { type: 'div', props: { style: { fontSize: '20px', fontWeight: 600, color: navy }, children: studentName } },
                  { type: 'div', props: { style: { fontSize: '12px', color: navy, opacity: 0.18, letterSpacing: '1px' }, children: 'app.bridgewayenglish.net' } },
                ]
              }
            },
          ]
        }
      }
    } else {
      element = {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', background: ivory, fontFamily: 'sans-serif' },
          children: [
            // 頂部金線
            { type: 'div', props: { style: { width: '100%', height: '5px', background: gold } } },
            // 主內容
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', flex: 1, padding: '48px 80px 0' },
                children: [
                  // 品牌列
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' },
                      children: [
                        { type: 'div', props: { style: { fontSize: '14px', letterSpacing: '3px', color: navy, opacity: 0.4 }, children: 'BRIDGEWAY · CLASSROOM' } },
                        { type: 'div', props: { style: { fontSize: '12px', color: navy, opacity: 0.3 }, children: dateFormatted + (teacherName ? '  ·  ' + teacherName : '') } },
                      ]
                    }
                  },
                  // TODAY'S LESSON
                  { type: 'div', props: { style: { fontSize: '13px', letterSpacing: '2px', color: gold, marginBottom: '20px' }, children: "TODAY'S LESSON" } },
                  // 數字並排置中
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '40px' },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                            children: [
                              { type: 'div', props: { style: { fontSize: '180px', fontWeight: 800, color: navy, lineHeight: 1, letterSpacing: '-8px' }, children: String(vocabCount) } },
                              { type: 'div', props: { style: { fontSize: '18px', color: navy, opacity: 0.42, marginTop: '10px', letterSpacing: '2px' }, children: '單字' } },
                            ]
                          }
                        },
                        { type: 'div', props: { style: { fontSize: '56px', color: navy, opacity: 0.12, marginBottom: '40px' }, children: '+' } },
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                            children: [
                              { type: 'div', props: { style: { fontSize: '180px', fontWeight: 800, color: gold, lineHeight: 1, letterSpacing: '-8px' }, children: String(phraseCount) } },
                              { type: 'div', props: { style: { fontSize: '18px', color: navy, opacity: 0.42, marginTop: '10px', letterSpacing: '2px' }, children: '片語' } },
                            ]
                          }
                        },
                      ]
                    }
                  },
                ]
              }
            },
            // 分隔線
            { type: 'div', props: { style: { width: '100%', height: '1px', background: ivoryLine } } },
            // 單字列
            {
              type: 'div',
              props: {
                style: { display: 'flex', alignItems: 'center', height: '120px', padding: '0 80px', gap: '32px' },
                children: [
                  { type: 'div', props: { style: { fontSize: '12px', letterSpacing: '2px', color: gold, flexShrink: 0 }, children: 'NEW VOCABULARY' } },
                  { type: 'div', props: { style: { width: '1px', height: '36px', background: ivoryLine } } },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center', gap: '28px', flex: 1 },
                      children: [
                        ...previewWords.map((word: string, i: number) => ({
                          type: 'div',
                          props: {
                            style: { fontSize: '28px', fontWeight: i === 0 ? 600 : 400, color: navy, opacity: 0.72, flexShrink: 0 },
                            children: word
                          }
                        })),
                        ...(extraWords > 0 ? [{
                          type: 'div',
                          props: { style: { fontSize: '16px', color: navy, opacity: 0.25 }, children: `+${extraWords} more` }
                        }] : [])
                      ]
                    }
                  },
                ]
              }
            },
            // 底部
            { type: 'div', props: { style: { width: '100%', height: '1px', background: ivoryLine } } },
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 80px' },
                children: [
                  { type: 'div', props: { style: { fontSize: '20px', fontWeight: 600, color: navy }, children: studentName } },
                  { type: 'div', props: { style: { fontSize: '12px', color: navy, opacity: 0.18, letterSpacing: '1px' }, children: 'app.bridgewayenglish.net' } },
                ]
              }
            },
          ]
        }
      }
    }

    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [],
    })

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    const png = resvg.render().asPng()
    const buffer = Buffer.from(png)

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      }
    })
  } catch (err) {
    console.error('OG image error:', err)
    return new Response('Error: ' + String(err), { status: 500 })
  }
}
