import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const { lessonId } = params
  const { searchParams } = new URL(req.url)
  const template = searchParams.get('t') ?? 'lesson'

  const admin = createAdminClient()
  const path = `${lessonId}-${template}.png`

  // 從 Storage 讀取圖片
  const { data, error } = await admin.storage
    .from('og-images')
    .download(path)

  if (error || !data) {
    // 圖片還沒生成，回傳 404
    return new Response('Image not found', { status: 404 })
  }

  const buffer = Buffer.from(await data.arrayBuffer())

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
