'use client'
// app/admin/analytics/page.tsx
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  Eye, FileText, Users, MousePointerClick,
  TrendingUp, Mail, BookOpen, ArrowUp, ArrowDown,
  Minus, RefreshCw, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Analytics {
  overview: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    totalSubscribers: number
    confirmedSubscribers: number
    recentSubscribers: number
    totalAffiliateClicks: number
    totalAuthors: number
  }
  topPosts: any[]
  viewsByCategory: any[]
  timeSeries: { date: string; subscribers: number; clicks: number }[]
  topAffiliateLinks: { label: string; clicks: number }[]
  recentPosts: any[]
}

const RANGE_OPTIONS = [
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
]

const PIE_COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4', '#8b5cf6']

function StatCard({
  label, value, icon: Icon, color, subtext, trend
}: {
  label: string
  value: string | number
  icon: any
  color: string
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            trend === 'up' && 'bg-emerald-500/10 text-emerald-400',
            trend === 'down' && 'bg-red-500/10 text-red-400',
            trend === 'neutral' && 'bg-zinc-500/10 text-zinc-400',
          )}>
            {trend === 'up' && <ArrowUp className="w-3 h-3" />}
            {trend === 'down' && <ArrowDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
          </span>
        )}
      </div>
      <p className="text-3xl font-display font-black text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-zinc-400 text-sm">{label}</p>
      {subtext && <p className="text-zinc-500 text-xs mt-1">{subtext}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-700 border border-dark-600 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-zinc-400 mb-2 text-xs">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')
  const [error, setError] = useState('')

  const fetchData = async (r: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/analytics?range=${r}`)
      if (!res.ok) throw new Error('Failed')
      setData(await res.json())
    } catch {
      setError('Failed to load analytics. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(range) }, [range])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-80 gap-4">
      <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-400 text-sm">Loading analytics...</p>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-80 gap-4">
      <p className="text-red-400">{error}</p>
      <button onClick={() => fetchData(range)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 text-white text-sm hover:bg-dark-600 transition-colors">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  )

  if (!data) return null
  const { overview, topPosts, viewsByCategory, timeSeries, topAffiliateLinks } = data

  // Format date labels for chart
  const chartData = timeSeries.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Analytics</h1>
          <p className="text-zinc-400 mt-1">Overview of your blog's performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
            {RANGE_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setRange(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  range === opt.value
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
          <button onClick={() => fetchData(range)}
            className="p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={overview.totalViews}
          icon={Eye} color="bg-brand-500/10 text-brand-400" trend="up"
          subtext="All time across all posts" />
        <StatCard label="Published Posts" value={overview.publishedPosts}
          icon={FileText} color="bg-emerald-500/10 text-emerald-400"
          subtext={`${overview.draftPosts} drafts`} />
        <StatCard label="Subscribers" value={overview.totalSubscribers}
          icon={Mail} color="bg-sky-500/10 text-sky-400"
          subtext={`${overview.confirmedSubscribers} confirmed · +${overview.recentSubscribers} this period`}
          trend={overview.recentSubscribers > 0 ? 'up' : 'neutral'} />
        <StatCard label="Affiliate Clicks" value={overview.totalAffiliateClicks}
          icon={MousePointerClick} color="bg-purple-500/10 text-purple-400" trend="up"
          subtext="Total tracked clicks" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Time series chart - 2/3 */}
        <div className="xl:col-span-2 bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-1">Growth Over Time</h2>
          <p className="text-zinc-500 text-xs mb-6">Subscribers and affiliate clicks per day</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false} tickLine={false}
                interval={Math.floor(chartData.length / 6)} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="subscribers" name="Subscribers"
                stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="clicks" name="Affiliate Clicks"
                stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#8b5cf6' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                formatter={v => <span style={{ color: '#a1a1aa' }}>{v}</span>} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views by category - 1/3 */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-white">
          <h2 className="font-display font-bold text-white mb-1">Views by Category</h2>
          <p className="text-zinc-500 text-xs mb-6">Total views per niche</p>
          {viewsByCategory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={viewsByCategory} dataKey="views" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    paddingAngle={3}>
                    {viewsByCategory.map((entry, i) => (
                      <Cell key={entry.name}
                        fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {viewsByCategory.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color || PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-zinc-300 text-xs">{cat.icon} {cat.name}</span>
                    </div>
                    <span className="text-zinc-400 text-xs font-mono">{cat.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-zinc-500 text-sm text-center py-12">No category data yet</p>
          )}
        </div>
      </div>

      {/* Top posts + Affiliate links */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Top posts */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-dark-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <h2 className="font-display font-bold text-white">Top Posts by Views</h2>
          </div>
          <div className="divide-y divide-dark-700">
            {topPosts.length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-12">No posts yet</p>
            )}
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-dark-700/50 transition-colors">
                <span className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0',
                  i === 0 ? 'bg-brand-500 text-white' :
                  i === 1 ? 'bg-zinc-700 text-zinc-300' :
                  i === 2 ? 'bg-amber-900/50 text-amber-400' :
                  'bg-dark-700 text-zinc-500'
                )}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{post.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {post.category?.icon} {post.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-bold text-sm font-mono">{post.views.toLocaleString()}</p>
                  <p className="text-zinc-500 text-[10px]">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate links + bar chart */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-dark-700 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-bold text-white">Top Affiliate Links</h2>
          </div>
          {topAffiliateLinks.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-16">
              No affiliate clicks tracked yet.<br />
              <span className="text-xs">Use the AffiliateLink component in your posts.</span>
            </p>
          ) : (
            <div className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topAffiliateLinks.slice(0, 7)} layout="vertical"
                  margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" width={100}
                    tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v.length > 15 ? v.slice(0, 14) + '…' : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="clicks" name="Clicks" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Subscriber breakdown */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <h2 className="font-display font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          Subscriber Health
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: overview.totalSubscribers, color: 'text-white' },
            { label: 'Confirmed', value: overview.confirmedSubscribers, color: 'text-emerald-400' },
            { label: 'Pending', value: overview.totalSubscribers - overview.confirmedSubscribers, color: 'text-yellow-400' },
            { label: `New (${range}d)`, value: overview.recentSubscribers, color: 'text-brand-400' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 rounded-xl bg-dark-700">
              <p className={`font-display text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-zinc-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Confirmation rate bar */}
        {overview.totalSubscribers > 0 && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-zinc-400 mb-2">
              <span>Confirmation rate</span>
              <span className="font-semibold text-white">
                {Math.round((overview.confirmedSubscribers / overview.totalSubscribers) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(overview.confirmedSubscribers / overview.totalSubscribers) * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
