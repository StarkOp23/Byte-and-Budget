// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '30' // days
  const days = parseInt(range)

  const since = new Date()
  since.setDate(since.getDate() - days)

  const prevSince = new Date()
  prevSince.setDate(prevSince.getDate() - days * 2)

  try {
    // ── Core counts ──────────────────────────────────────────
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalSubscribers,
      confirmedSubscribers,
      totalAffiliateClicks,
      totalAuthors,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
      prisma.affiliateClick.count(),
      prisma.user.count(),
    ])

    // ── Total views (sum of all post view counters) ──────────
    const viewsAgg = await prisma.post.aggregate({ _sum: { views: true } })
    const totalViews = viewsAgg._sum.views || 0

    // ── Top posts by views ───────────────────────────────────
    const topPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 10,
      include: { category: true, author: true },
    })

    // ── Views by category ────────────────────────────────────
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          where: { status: 'PUBLISHED' },
          select: { views: true },
        },
      },
    })
    const viewsByCategory = categories.map(cat => ({
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      views: cat.posts.reduce((s, p) => s + p.views, 0),
      posts: cat.posts.length,
    })).sort((a, b) => b.views - a.views)

    // ── Recent subscribers (last N days) ─────────────────────
    const recentSubscribers = await prisma.newsletterSubscriber.count({
      where: { createdAt: { gte: since } },
    })

    // ── Subscribers per day (last 30 days for chart) ─────────
    const subscribersRaw = await prisma.newsletterSubscriber.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    })

    // ── Affiliate clicks per day ─────────────────────────────
    const clicksRaw = await prisma.affiliateClick.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, label: true, url: true },
      orderBy: { createdAt: 'asc' },
    })

    // ── Top affiliate links ───────────────────────────────────
    const clicksByLabel: Record<string, number> = {}
    clicksRaw.forEach(c => {
      const key = c.label || c.url
      clicksByLabel[key] = (clicksByLabel[key] || 0) + 1
    })
    const topAffiliateLinks = Object.entries(clicksByLabel)
      .map(([label, clicks]) => ({ label, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    // ── Build daily time series (last N days) ─────────────────
    const dailyData: Record<string, { date: string; subscribers: number; clicks: number }> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dailyData[key] = { date: key, subscribers: 0, clicks: 0 }
    }
    subscribersRaw.forEach(s => {
      const key = s.createdAt.toISOString().split('T')[0]
      if (dailyData[key]) dailyData[key].subscribers++
    })
    clicksRaw.forEach(c => {
      const key = c.createdAt.toISOString().split('T')[0]
      if (dailyData[key]) dailyData[key].clicks++
    })
    const timeSeries = Object.values(dailyData)

    // ── Recent posts ─────────────────────────────────────────
    const recentPosts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true, author: true },
    })

    return NextResponse.json({
      overview: {
        totalPosts, publishedPosts, draftPosts,
        totalViews, totalSubscribers, confirmedSubscribers,
        recentSubscribers, totalAffiliateClicks, totalAuthors,
      },
      topPosts,
      viewsByCategory,
      timeSeries,
      topAffiliateLinks,
      recentPosts,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
