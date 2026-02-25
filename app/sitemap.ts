// app/sitemap.ts
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    }).catch(() => []),
    prisma.category.findMany({
      select: { slug: true, createdAt: true },
    }).catch(() => []),
  ])

  const postUrls: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: cat.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
  ]

  return [...staticUrls, ...categoryUrls, ...postUrls]
}
