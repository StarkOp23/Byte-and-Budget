// app/api/pageview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, postId, referrer } = body

    // Detect device from user agent
    const ua = req.headers.get('user-agent') || ''
    const device = /mobile|android|iphone|ipad/i.test(ua)
      ? 'mobile'
      : /tablet/i.test(ua)
      ? 'tablet'
      : 'desktop'
      

    // Get country from Cloudflare header (works on Vercel/CF)
    const country = req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') || null

    await prisma.pageView.create({
      data: { path, postId: postId || null, device, country, referrer: referrer || null },
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Silent fail — don't break the page if tracking fails
    return NextResponse.json({ ok: false })
  }
}
