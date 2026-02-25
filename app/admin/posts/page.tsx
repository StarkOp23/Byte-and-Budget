// app/admin/posts/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { formatDateShort } from '@/lib/utils'
import { PlusCircle, Edit, Eye, Trash2, Search } from 'lucide-react'
import { PostActionsButton } from '@/components/admin/PostActionsButton'

async function getPosts(search?: string, status?: string) {
  const where: any = {}
  if (status && status !== 'ALL') where.status = status
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ]
  }
  return prisma.post.findMany({
    where,
    include: { author: true, category: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  DRAFT: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  SCHEDULED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ARCHIVED: 'bg-red-500/20 text-red-400 border-red-500/30',
}

interface Props {
  searchParams: { search?: string; status?: string }
}

export default async function AdminPostsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'
  const posts = await getPosts(searchParams.search, searchParams.status)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">All Posts</h1>
          <p className="text-zinc-400 mt-1">{posts.length} total posts</p>
        </div>
        <Link href="/admin/new-post"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-500/20">
          <PlusCircle className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            name="search"
            defaultValue={searchParams.search}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <select name="status" defaultValue={searchParams.status || 'ALL'}
          className="px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm outline-none focus:border-brand-500 transition-colors cursor-pointer">
          <option value="ALL">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button type="submit"
          className="px-5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-white text-sm font-medium transition-colors">
          Filter
        </button>
      </form>

      {/* Posts table */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Title</th>
              <th className="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden lg:table-cell">Author</th>
              <th className="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Views</th>
              <th className="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden lg:table-cell">Date</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {posts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-zinc-500">
                  No posts found. <Link href="/admin/new-post" className="text-brand-400 hover:underline">Create your first post</Link>
                </td>
              </tr>
            )}
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-dark-700/50 transition-colors group">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-medium text-sm line-clamp-1 group-hover:text-brand-300 transition-colors">
                      {post.title}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">/blog/{post.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  {post.category ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: (post.category.color || '#f59e0b') + '22', color: post.category.color || '#f59e0b' }}>
                      {post.category.name}
                    </span>
                  ) : <span className="text-zinc-600 text-xs">—</span>}
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-zinc-400 text-sm">{post.author.name}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[post.status]}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="text-zinc-400 text-sm">{post.views.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-zinc-400 text-sm">{formatDateShort(post.createdAt)}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    {post.status === 'PUBLISHED' && (
                      <Link href={`/blog/${post.slug}`} target="_blank"
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-dark-600 transition-all" title="View post">
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.id}`}
                      className="p-2 rounded-lg text-zinc-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all" title="Edit post">
                      <Edit className="w-4 h-4" />
                    </Link>
                    {isAdmin && (
                      <PostActionsButton postId={post.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
