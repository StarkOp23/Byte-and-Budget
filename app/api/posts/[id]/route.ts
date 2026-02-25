// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify, generateExcerpt } from '@/lib/utils'

interface Props { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Props) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: true, category: true, tags: { include: { tag: true } } },
  }).catch(() => null)

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { tags, ...rest } = body

  // Handle tags update
  let tagsUpdate = {}
  if (tags && Array.isArray(tags)) {
    // Delete existing tag connections
    await prisma.tagOnPost.deleteMany({ where: { postId: params.id } })

    // Create/upsert new tags and connect
    const tagRecords = await Promise.all(
      tags.map(async (name: string) => {
        const slug = slugify(name)
        return prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name, slug },
        })
      })
    )

    tagsUpdate = {
      tags: { create: tagRecords.map(tag => ({ tagId: tag.id })) },
    }
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: rest.title,
      slug: rest.slug || slugify(rest.title),
      content: rest.content,
      excerpt: rest.excerpt || generateExcerpt(rest.content || ''),
      coverImage: rest.coverImage || null,
      status: rest.status,
      featured: rest.featured,
      sponsored: rest.sponsored,
      categoryId: rest.categoryId || null,
      metaTitle: rest.metaTitle || null,
      metaDescription: rest.metaDescription || null,
      readingTime: rest.readingTime || null,
      publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
      ...tagsUpdate,
    },
    include: { author: true, category: true, tags: { include: { tag: true } } },
  }).catch((e) => {
    console.error(e)
    return null
  })

  if (!post) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any)?.role
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.tagOnPost.deleteMany({ where: { postId: params.id } })
  await prisma.post.delete({ where: { id: params.id } }).catch(() => null)

  return NextResponse.json({ ok: true })
}
