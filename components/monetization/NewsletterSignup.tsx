'use client'
// components/monetization/NewsletterSignup.tsx
import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterSignupProps {
  variant?: 'hero' | 'inline' | 'sidebar' | 'popup'
  className?: string
}

export function NewsletterSignup({ variant = 'inline', className }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'You\'re in! Check your inbox.')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (variant === 'hero') {
    return (
      <section id="newsletter" className={cn('relative overflow-hidden rounded-3xl', className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900" />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #f59e0b22 0%, transparent 60%), radial-gradient(circle at 70% 50%, #6366f122 0%, transparent 60%)' }}
        />
        <div className="relative px-8 py-16 sm:px-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium mb-6">
            <Mail className="w-4 h-4" />
            Newsletter         Comming Soon

          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
            Get the best insights, weekly.
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
            Join 10,000+ readers getting actionable advice on finance, AI tools, and travel every Tuesday.
          </p>

          {status === 'success' ? (
            <div className="flex items-center justify-center gap-3 text-emerald-400 text-lg font-medium">
              <CheckCircle className="w-6 h-6" />
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing...' : (
                  <>Subscribe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
          {status === 'error' && <p className="text-red-400 text-sm mt-3">{message}</p>}
          <p className="text-zinc-500 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={cn('bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6', className)}>
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4">
          <Mail className="w-5 h-5 text-brand-400" />
        </div>
        <h3 className="font-display font-bold text-white text-lg mb-2">Stay Updated</h3>
        <p className="text-zinc-400 text-sm mb-4">Weekly insights on finance, AI, and travel.</p>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form space-y-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required className="text-sm" />
            <button type="submit" disabled={status === 'loading'}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-red-400 text-xs mt-2">{message}</p>}
      </div>
    )
  }

  // inline (end of article)
  return (
    <div className={cn(
      'bg-gradient-to-r from-brand-50 to-amber-50 dark:from-dark-800 dark:to-dark-800 border border-brand-100 dark:border-dark-700 rounded-2xl p-8',
      className
    )}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1">
          <h3 className="font-display font-bold text-dark-900 dark:text-white text-xl mb-1">
            Enjoyed this article?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Get more like it in your inbox every week. Free.
          </p>
        </div>
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            You're subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button type="submit" disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all disabled:opacity-50 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
