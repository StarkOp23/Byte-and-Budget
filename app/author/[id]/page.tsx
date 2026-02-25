// app/author/[id]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { PostCard } from '@/components/blog/PostCard'
import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Globe } from 'lucide-react'
import type { Metadata } from 'next'
import type { PostWithRelations } from '@/types'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await prisma.user.findUnique({ where: { id: params.id } }).catch(() => null)
  if (!author) return {}
  return genMeta({ title: author.name || 'Author', description: author.bio || undefined, url: `/author/${author.id}` })
}

export default async function AuthorPage({ params }: Props) {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, image: true, bio: true, twitter: true, website: true, role: true, createdAt: true },
  }).catch(() => null)

  if (!author) notFound()

  const posts = await prisma.post.findMany({
    where: { authorId: author.id, status: 'PUBLISHED' },
    include: { author: true, category: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: 'desc' },
  }).catch(() => [])

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0)

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="pt-24">
        {/* Author hero */}
        <div className="py-16 px-4 sm:px-6 border-b border-zinc-100 dark:border-dark-800">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {author.image ? (
              <Image src={author.image} alt={author.name || ''} width={100} height={100}
                className="rounded-full ring-4 ring-brand-200 dark:ring-brand-800 shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                <span className="font-display font-black text-4xl text-brand-500">{author.name?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">
                {author.role === 'ADMIN' ? 'Editor in Chief' : 'Author'}
              </p>
              <h1 className="font-display text-4xl font-black text-dark-900 dark:text-white mb-3">{author.name}</h1>
              {author.bio && <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 max-w-lg">{author.bio}</p>}

              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                {author.twitter && (
                  <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-colors">
                    <Twitter className="w-4 h-4" />@{author.twitter}
                  </a>
                )}
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-dark-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-dark-700 transition-colors">
                    <Globe className="w-4 h-4" />Website
                  </a>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-6 text-sm text-zinc-400">
                <span><strong className="text-dark-900 dark:text-white font-bold">{posts.length}</strong> articles</span>
                <span><strong className="text-dark-900 dark:text-white font-bold">{totalViews.toLocaleString()}</strong> total views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-8">
            Articles by {author.name}
          </h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">No published articles yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
