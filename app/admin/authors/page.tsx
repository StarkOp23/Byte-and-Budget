// app/admin/authors/page.tsx
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CreateAuthorForm } from '@/components/admin/CreateAuthorForm'
import { formatDateShort } from '@/lib/utils'
import Image from 'next/image'
import { Shield, PenLine } from 'lucide-react'

export default async function AdminAuthorsPage() {
  const session = await getServerSession(authOptions)
  // Only ADMIN can manage authors
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/admin')

  const authors = await prisma.user.findMany({
    select: { id: true, name: true, email: true, image: true, role: true, bio: true, createdAt: true,
      _count: { select: { posts: true } } },
    orderBy: { createdAt: 'asc' },
  }).catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Authors</h1>
        <p className="text-zinc-400 mt-1">Manage admin and author accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create new author */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-5">Create New Account</h2>
          <CreateAuthorForm />
        </div>

        {/* Existing authors */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-5">Team ({authors.length})</h2>
          <div className="space-y-3">
            {authors.map(author => (
              <div key={author.id} className="flex items-center gap-4 p-4 rounded-xl bg-dark-700 border border-dark-600">
                {author.image ? (
                  <Image src={author.image} alt={author.name || ''} width={44} height={44} className="rounded-full" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                    <span className="font-display font-bold text-brand-400">{author.name?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm truncate">{author.name}</p>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      author.role === 'ADMIN'
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {author.role === 'ADMIN' ? <Shield className="w-2.5 h-2.5" /> : <PenLine className="w-2.5 h-2.5" />}
                      {author.role}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs truncate">{author.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-sm font-bold">{author._count.posts}</p>
                  <p className="text-zinc-500 text-[10px]">posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
