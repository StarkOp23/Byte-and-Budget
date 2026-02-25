'use client'
// components/monetization/AffiliateLink.tsx
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AffiliateLinkProps {
  href: string
  label: string
  postId?: string
  variant?: 'inline' | 'button' | 'card'
  description?: string
  className?: string
}

export function AffiliateLink({
  href,
  label,
  postId,
  variant = 'inline',
  description,
  className,
}: AffiliateLinkProps) {
  const handleClick = async () => {
    try {
      await fetch('/api/affiliate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: href, label, postId }),
      })
    } catch {}
  }

  if (variant === 'button') {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener sponsored"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5',
          className
        )}
      >
        {label}
        <ExternalLink className="w-4 h-4" />
      </a>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('border border-brand-200 dark:border-brand-900 rounded-2xl p-5 bg-brand-50/50 dark:bg-brand-950/30', className)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">{label}</p>
            {description && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>}
          </div>
          <a
            href={href}
            target="_blank"
            rel="nofollow noopener sponsored"
            onClick={handleClick}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all"
          >
            Visit <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-[10px] text-zinc-400 mt-3">⚠️ Affiliate link — we may earn a commission at no cost to you.</p>
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener sponsored"
      onClick={handleClick}
      className={cn('affiliate-link', className)}
    >
      {label} <ExternalLink className="w-3 h-3" />
    </a>
  )
}
