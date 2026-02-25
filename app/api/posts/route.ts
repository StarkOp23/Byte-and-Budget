// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify, generateExcerpt } from '@/lib/utils'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1, 'Title required'),
  slug: z.string().min(1, 'Slug required'),
  content: z.string().min(1, 'Content required'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  sponsored: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  readingTime: z.number().optional(),
  publishedAt: z.string().optional().nullable(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const status = searchParams.get('status')
  const categorySlug = searchParams.get('category')
  const search = searchParams.get('search')

  const where: any = {}
  if (status) where.status = status
  else where.status = 'PUBLISHED'

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (cat) where.categoryId = cat.id
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const data = parsed.data
  const userId = (session.user as any).id

  // Ensure unique slug
  let slug = data.slug || slugify(data.title)
  const existing = await prisma.post.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`

  // Create or find tags
  const tagRecords = await Promise.all(
    data.tags.map(async (name) => {
      const tagSlug = slugify(name)
      return prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name, slug: tagSlug },
      })
    })
  )

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || generateExcerpt(data.content),
      coverImage: data.coverImage || null,
      status: data.status,
      featured: data.featured,
      sponsored: data.sponsored,
      categoryId: data.categoryId || null,
      authorId: userId,
      readingTime: data.readingTime,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      tags: {
        create: tagRecords.map(tag => ({ tagId: tag.id })),
      },
    },
    include: { author: true, category: true, tags: { include: { tag: true } } },
  })

  return NextResponse.json(post, { status: 201 })
}
