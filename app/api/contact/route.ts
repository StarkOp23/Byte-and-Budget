// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['general', 'advertising', 'partnership', 'press', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { name, email, subject, message } = parsed.data

  // ── Option A: Send via Resend (uncomment when you have RESEND_API_KEY) ──
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: 'hello@yourdomain.com',
    reply_to: email,
    subject: `[Contact] ${subject} — from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  })

  // ── Option B: Log to console (works immediately, no setup needed) ──
  console.log('📬 New contact form submission:')
  console.log(`  Name:    ${name}`)
  console.log(`  Email:   ${email}`)
  console.log(`  Subject: ${subject}`)
  console.log(`  Message: ${message}`)

  return NextResponse.json(
    { message: 'Message sent! We\'ll get back to you within 24 hours.' },
    { status: 200 }
  )
}
