// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { name, slug, description, icon, color } = body
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const category = await prisma.category.create({
    data: { name, slug: slug || slugify(name), description: description || null, icon: icon || null, color: color || '#6366F1' },
  }).catch((e) => {
    if (e.code === 'P2002') return null
    throw e
  })

  if (!category) return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
  return NextResponse.json(category, { status: 201 })
}
