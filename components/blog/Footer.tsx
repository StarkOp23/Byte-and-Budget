// components/blog/Footer.tsx
import Link from 'next/link'
import { Twitter, Github, Rss, Mail, Instagram } from 'lucide-react'

const categories = [
  { href: '/category/personal-finance', label: ' Personal Finance' },
  { href: '/category/tech-ai', label: ' Tech & AI' },
  { href: '/category/travel', label: 'Travel' },
]

const links = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/advertise', label: 'Advertise' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
]

export function Footer({ siteName = 'Byte & Budget' }: { siteName?: string }) {
  return (
    <footer className="bg-dark-900 text-dark-200 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white font-display font-black text-sm">B</span>
              </div>
              <span className="font-display font-bold text-xl text-white">{siteName}</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Honest insights on personal finance, technology, and travel. Built to help you make better decisions and live better.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://instagram.com/stark__here" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-zinc-400 hover:text-brand-400 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="/feed.xml"
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-zinc-400 hover:text-brand-400 transition-all">
                <Rss className="w-4 h-4" />
              </a>
              <a href="mailto:info.soumya23@gmail.com"
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-zinc-400 hover:text-white transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Topics</h4>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.href}>
                  <Link href={cat.href}
                    className="text-zinc-400 hover:text-brand-400 text-sm transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-zinc-400 hover:text-brand-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs">
            This site contains affiliate links. See our{' '}
            <Link href="/affiliate-disclosure" className="hover:text-brand-400 transition-colors underline">
              Affiliate Disclosure
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  )
}
