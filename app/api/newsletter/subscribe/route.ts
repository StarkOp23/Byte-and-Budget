// app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { email, name } = parsed.data

  // Check existing
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
  if (existing) {
    if (existing.confirmed) {
      return NextResponse.json({ message: "You're already subscribed!" })
    }
    return NextResponse.json({ message: "Check your email to confirm your subscription." })
  }

  // Create subscriber
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36)

  await prisma.newsletterSubscriber.create({
    data: { email, name, token, confirmed: true }, // Set confirmed: false and send confirmation email in production
  })

  // TODO: Send welcome email via Resend
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Welcome to the newsletter!',
    html: `<p>Hi ${name || 'there'}! You're subscribed.</p>`,
  })

  return NextResponse.json({ message: "You're subscribed! Welcome aboard 🎉" }, { status: 201 })
}
