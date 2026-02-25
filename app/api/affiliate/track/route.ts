// app/api/affiliate/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { url, label, postId } = body

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  await prisma.affiliateClick.create({
    data: {
      url,
      label,
      postId: postId || null,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
    },
  }).catch(() => {}) // non-blocking

  return NextResponse.json({ ok: true })
}
