// app/api/newsletter/test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail, buildWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { email, siteName, siteUrl } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const result = await sendEmail({
    to: email,
    subject: `[TEST] Welcome to ${siteName || 'PremiumBlog'}!`,
    html: buildWelcomeEmail({
      name: 'Test User',
      siteName: siteName || 'PremiumBlog',
      siteUrl: siteUrl || 'http://localhost:3000',
      siteDescription: 'This is a test email to verify your Resend integration is working.',
    }),
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error || 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
