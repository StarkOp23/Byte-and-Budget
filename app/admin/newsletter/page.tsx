// app/admin/newsletter/page.tsx
import { prisma } from '@/lib/prisma'
import { formatDateShort } from '@/lib/utils'
import { Mail, Users, CheckCircle, Download } from 'lucide-react'

export default async function AdminNewsletterPage() {
  const [total, confirmed, recent] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]).catch(() => [0, 0, []])

  const stats = [
    { label: 'Total Subscribers', value: total, icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending', value: (total as number) - (confirmed as number), icon: Mail, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Newsletter</h1>
          <p className="text-zinc-400 mt-1">Manage your subscribers</p>
        </div>
        <a
          href="/api/newsletter/export"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-600 text-zinc-300 hover:border-zinc-500 text-sm font-medium transition-all"
        >
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
            <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Subscribers table */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-700">
          <h2 className="font-display font-bold text-white">Recent Subscribers</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {(recent as any[]).map((sub: any) => (
              <tr key={sub.id} className="hover:bg-dark-700/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-white text-sm font-medium">{sub.email}</span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-zinc-400 text-sm">{sub.name || '—'}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    sub.confirmed
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                  }`}>
                    {sub.confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="text-zinc-400 text-sm">{formatDateShort(sub.createdAt)}</span>
                </td>
              </tr>
            ))}
            {(recent as any[]).length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-16 text-zinc-500">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
