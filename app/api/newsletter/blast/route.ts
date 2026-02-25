// app/api/newsletter/blast/route.ts
// Called when a post is published — sends to all confirmed subscribers
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, buildNewPostEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'AUTHOR'].includes((session.user as any)?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true, category: true },
  })

  if (!post || post.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Post not found or not published' }, { status: 404 })
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { confirmed: true },
    select: { email: true, name: true },
  })

  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: 'No subscribers yet.' })
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'PremiumBlog'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const html = buildNewPostEmail({ post, siteName, siteUrl })

  // Resend free tier: 50 recipients per request, 100 emails/day
  const batchSize = 50
  let sent = 0
  let failed = 0

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize)
    const result = await sendEmail({
      to: batch.map(s => s.email),
      subject: `New: ${post.title}`,
      html,
    })
    if (result.ok) sent += batch.length
    else failed += batch.length
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    total: subscribers.length,
    message: `Email sent to ${sent} subscriber${sent !== 1 ? 's' : ''}.`,
  })
}
