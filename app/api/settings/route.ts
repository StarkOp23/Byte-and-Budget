// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get or create singleton settings row
async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 'singleton',
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'PremiumBlog',
        siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    })
  }
  return settings
}


export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const settings = await getSettings()
    // Never expose the raw API keys in full — mask them
    return NextResponse.json({
      ...settings,
      resendApiKey: settings.resendApiKey ? '••••••••' + settings.resendApiKey.slice(-4) : '',
      adsenseClientId: settings.adsenseClientId || '',
      googleAnalyticsId: settings.googleAnalyticsId || '',
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  // Don't overwrite masked key values
  const updateData: any = { ...body }
  if (updateData.resendApiKey?.startsWith('••••')) {
    delete updateData.resendApiKey
  }
  // Remove id from update payload
  delete updateData.id
  delete updateData.updatedAt

  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: updateData,
      create: { id: 'singleton', ...updateData },
    })
    return NextResponse.json({ ok: true, settings })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
