'use client'
// components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, PlusCircle, Tag, Users,
  Mail, BarChart2, Settings, LogOut, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'All Posts', icon: FileText },
  { href: '/admin/new-post', label: 'New Post', icon: PlusCircle },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/authors', label: 'Authors', icon: Users },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-dark-700 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span className="text-white font-display font-black text-sm">B</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">Byte and Budget</p>
            <p className="text-zinc-500 text-xs">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-dark-800'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-brand-400' : '')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + actions */}
      <div className="p-4 border-t border-dark-700 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-dark-800 transition-all"
        >
          <Eye className="w-4 h-4" />
          View Site
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          {user.image ? (
            <Image src={user.image} alt={user.name || ''} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center">
              <span className="text-brand-300 text-sm font-bold">{user.name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
