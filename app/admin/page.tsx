// app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FileText, Eye, Mail, TrendingUp, PlusCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDateShort } from '@/lib/utils'

async function getStats() {
  try {
    const [totalPosts, totalViews, totalSubscribers, recentPosts, topPosts] = await Promise.all([
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.aggregate({ _sum: { views: true }, where: { status: 'PUBLISHED' } }),
      prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
      prisma.post.findMany({
        where: { status: { in: ['DRAFT', 'PUBLISHED'] } },
        include: { author: true, category: true, tags: { include: { tag: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: 5,
        include: { category: true, author: true, tags: { include: { tag: true } } },
      }),
    ])
    return {
      totalPosts,
      totalViews: totalViews._sum.views || 0,
      totalSubscribers,
      recentPosts,
      topPosts,
    }
  } catch {
    return { totalPosts: 0, totalViews: 0, totalSubscribers: 0, recentPosts: [], topPosts: [] }
  }
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  DRAFT: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  SCHEDULED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ARCHIVED: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  const stats = await getStats()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const statCards = [
    { label: 'Published Posts', value: stats.totalPosts, icon: FileText, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Subscribers', value: stats.totalSubscribers.toLocaleString(), icon: Mail, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg Views/Post', value: stats.totalPosts ? Math.round(stats.totalViews / stats.totalPosts).toLocaleString() : '0', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, {session?.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Here's what's happening with your blog.</p>
        </div>
        <Link
          href="/admin/new-post"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-white font-display">{card.value}</p>
            <p className="text-zinc-400 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white">Recent Posts</h2>
            <Link href="/admin/posts" className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentPosts.map(post => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/posts/${post.id}`}
                    className="text-sm font-medium text-white hover:text-brand-400 transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[post.status]}`}>
                      {post.status}
                    </span>
                    {post.category && (
                      <span className="text-xs text-zinc-500">{post.category.name}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-zinc-500 shrink-0">
                  {formatDateShort(post.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white">Top Posts</h2>
            <span className="text-xs text-zinc-500">By views</span>
          </div>
          <div className="space-y-3">
            {stats.topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-700 transition-colors">
                <span className="text-2xl font-black text-dark-600 w-6 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/blog/${post.slug}`} target="_blank"
                    className="text-sm font-medium text-white hover:text-brand-400 transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                  {post.category && (
                    <p className="text-xs text-zinc-500 mt-0.5">{post.category.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0">
                  <Eye className="w-3 h-3" />
                  {post.views.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
