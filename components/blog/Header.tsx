'use client'
// components/blog/Header.tsx
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Menu, X, Sun, Moon, Rss } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/category/personal-finance', label: 'Personal Finance', emoji: '' },
  { href: '/category/tech-ai', label: 'Tech & AI', emoji: '' },
  { href: '/category/travel', label: 'Travel', emoji: '' },
  { href: '/about', label: 'About' },
]

export function Header({ siteName = 'Byte & Budget' }: { siteName?: string }) {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-dark-700/80 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
              <span className="text-white font-display font-black text-sm">B</span>
            </div>
            <span className="font-display font-bold text-xl text-dark-900 dark:text-white tracking-tight">
              {siteName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-dark-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-dark-700 transition-all"
              >
                {link.emoji && <span>{link.emoji}</span>}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-dark-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-dark-700 transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>
            <a
              href="/feed.xml"
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-dark-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-dark-700 transition-all"
              aria-label="RSS Feed"
            >
              <Rss className="w-4 h-4" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-dark-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-dark-700 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="#newsletter"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
            >
              Subscribe
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-dark-700 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-dark-900 border-t border-zinc-200 dark:border-dark-700 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-dark-800 transition-all"
            >
              {link.emoji && <span className="text-lg">{link.emoji}</span>}
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="#newsletter"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
