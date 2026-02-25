'use client'
// components/blog/SocialShare.tsx
import { Twitter, Linkedin, Link2, Facebook } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SocialShareProps {
  title: string
  url: string
  className?: string
}

export function SocialShare({ title, url, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      label: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30',
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30',
    },
    {
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-600/30',
    },
  ]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mr-1">Share:</span>
      {shareLinks.map(share => (
        <a
          key={share.label}
          href={share.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${share.label}`}
          className={cn(
            'p-2 rounded-lg border border-zinc-200 dark:border-dark-700 text-zinc-400 transition-all',
            share.color
          )}
        >
          <share.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className={cn(
          'p-2 rounded-lg border border-zinc-200 dark:border-dark-700 text-zinc-400 transition-all',
          copied
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'hover:bg-zinc-100 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
        )}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
