'use client'
// components/monetization/AdSlot.tsx
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AdSlotProps {
  slot: 'header' | 'sidebar' | 'in-article' | 'footer'
  className?: string
}

const adConfig = {
  header: { style: { width: '728px', height: '90px' }, label: 'Advertisement' },
  sidebar: { style: { width: '300px', height: '250px' }, label: 'Advertisement' },
  'in-article': { style: { width: '100%', height: '250px' }, label: 'Advertisement' },
  footer: { style: { width: '728px', height: '90px' }, label: 'Advertisement' },
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

// Placeholder shown when AdSense not yet configured
function AdPlaceholder({ slot, className }: { slot: string; className?: string }) {
  return (
    <div className={cn(
      'flex items-center justify-center bg-zinc-50 dark:bg-dark-800 border border-dashed border-zinc-200 dark:border-dark-700 rounded-xl',
      className
    )}>
      <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium uppercase tracking-wider">
        Ad — {slot}
      </span>
    </div>
  )
}

export function AdSlot({ slot, className }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const config = adConfig[slot]

  useEffect(() => {
    // Only push ads if AdSense client is configured
    if (ADSENSE_CLIENT && typeof window !== 'undefined') {
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch {}
    }
  }, [])

  if (!ADSENSE_CLIENT) {
    return (
      <AdPlaceholder
        slot={slot}
        className={cn(
          slot === 'header' && 'w-full h-20',
          slot === 'sidebar' && 'w-full h-64',
          slot === 'in-article' && 'w-full h-32',
          slot === 'footer' && 'w-full h-20',
          className
        )}
      />
    )
  }

  return (
    <div className={cn('text-center', className)} ref={adRef}>
      <p className="text-xs text-zinc-400 mb-1">{config.label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...config.style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={`ad-${slot}`}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
