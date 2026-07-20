import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { response, question, reportId, studentAge } = await req.json()
  if (!response || !reportId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const prompt = `你是一位專業的英文寫作教學老師，正在批改一位學生的英文寫作練習。

學生年齡：${studentAge || '不詳'}歲
練習題目：${question}
學生的回答：${response}

請根據以下規則批改：
1. 找出文法錯誤（主詞動詞一致、時態、冠詞等）
2. 找出單字或片語用錯的地方
3. 找出句子結構不自然的地方
4. 最多提出 3 個重點錯誤，其餘在修正版本中改掉但不逐一說明
5. 保留學生原本的想法和語氣，不要改得面目全非
6. 如果學生寫得很好，說「幾乎沒有需要修正的地方」
7. 根據學生年齡調整說明難易度和語氣（年齡小→更簡單鼓勵，年齡大→更詳細）
8. 說明用繁體中文，修正版本用英文

嚴格回傳以下 JSON 格式，不加任何其他文字：
{
  "strength": "具體說一件學生寫得好的事",
  "corrected": "完整修正後的英文版本",
  "points": [
    {
      "original": "學生原句或原詞",
      "fixed": "正確版本",
      "reason": "繁體中文說明原因"
    }
  ],
  "encouragement": "一句繁體中文鼓勵語"
}`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const block = message.content[0]
    if (!block || block.type !== 'text') throw new Error('Invalid response')

    const jsonText = block.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const feedback = JSON.parse(jsonText)

    // 存到資料庫
    const { error } = await supabase
      .from('reflection_responses')
      .update({
        feedback: JSON.stringify(feedback),
        feedback_at: new Date().toISOString(),
      })
      .eq('lesson_report_id', reportId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ feedback })
  } catch (err) {
    console.error('grade-reflection error:', err)
    return NextResponse.json({ error: '批改失敗，請再試一次' }, { status: 500 })
  }
}
