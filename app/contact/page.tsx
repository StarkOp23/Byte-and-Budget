'use client'
// app/contact/page.tsx
import { useState } from 'react'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import {
  Mail, MessageSquare, Briefcase, Newspaper,
  Users, ArrowRight, CheckCircle, AlertCircle,
  Twitter, Send, MapPin, Clock,
  Instagram
} from 'lucide-react'
import { cn } from '@/lib/utils'

const subjects = [
  { value: 'general', label: 'General Question', icon: MessageSquare, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
  { value: 'advertising', label: 'Advertising / Sponsorship', icon: Briefcase, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/30' },
  { value: 'partnership', label: 'Partnership', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { value: 'press', label: 'Press / Media', icon: Newspaper, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { value: 'other', label: 'Something Else', icon: Mail, color: 'text-zinc-400', bg: 'bg-zinc-500/10 border-zinc-500/30' },
]

const faqs = [
  {
    q: 'How do I advertise on this blog?',
    a: 'We offer sponsored posts, newsletter placements, and display ads. Select "Advertising / Sponsorship" in the form and tell us about your product. We\'ll send our media kit within 24 hours.',
  },
  {
    q: 'Do you accept guest posts?',
    a: 'Yes, but selectively. We only publish well-researched, original content that genuinely helps our readers. Pitch your idea via the contact form and we\'ll review it within 3–5 business days.',
  },
  {
    q: 'How long does it take to get a reply?',
    a: 'We reply to all messages within 24 hours on weekdays. Advertising and partnership inquiries are prioritised.',
  },
  {
    q: 'I found an error in one of your articles. How do I report it?',
    a: 'We take accuracy seriously. Select "General Question" and describe the issue. We\'ll review and correct it as soon as possible.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMsg, setResponseMsg] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject) {
      setStatus('error')
      setResponseMsg('Please select a subject.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setResponseMsg(data.message)
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setResponseMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setResponseMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />

      <main className="pt-24">

        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              Get in touch
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-black text-dark-900 dark:text-white mb-6 leading-tight">
              Let's talk about{' '}
              <span className="gradient-text">something great</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Whether you want to advertise, collaborate, or just say hello —
              we read and reply to every message.
            </p>
          </div>
        </section>

        {/* Quick contact cards */}
        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Mail,
                label: 'Email us directly',
                value: 'info.soumya23@gmail.com',
                href: 'mailto:info.soumya23@gmail.com',
                color: 'text-brand-400',
                bg: 'bg-brand-500/10',
              },
              {
                icon: Instagram,
                label: 'DM on Instagram',
                value: '@stark__here',
                href: 'https://instagram.com/stark__here',
                color: 'text-pink-400',
                bg: 'bg-pink-500/10',
              },
              {
                icon: Clock,
                label: 'Response time',
                value: 'Within 24 hours',
                href: null,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
            ].map(card => (
              <div key={card.label}
                className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-dark-800 border border-zinc-100 dark:border-dark-700">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">{card.label}</p>
                  {card.href ? (
                    <a href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className={`font-semibold text-sm ${card.color} hover:underline`}>
                      {card.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-sm text-dark-900 dark:text-white">{card.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main content: Form + FAQ */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Form — 3/5 */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-dark-800 rounded-3xl border border-zinc-100 dark:border-dark-700 shadow-xl shadow-black/5 dark:shadow-black/20 p-8">
                <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-2">
                  Send a message
                </h2>
                <p className="text-zinc-400 text-sm mb-8">
                  Fill in the form and we'll get back to you quickly.
                </p>

                {/* Success state */}
                {status === 'success' && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-6">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-400 text-sm">Message sent!</p>
                      <p className="text-emerald-500/80 text-sm mt-0.5">{responseMsg}</p>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{responseMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Your name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Jane Smith"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all placeholder-zinc-400 dark:placeholder-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Email address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="jane@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all placeholder-zinc-400 dark:placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Subject selector */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                      What's this about? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {subjects.map(s => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, subject: s.value }))}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left',
                            form.subject === s.value
                              ? `${s.bg} ${s.color} border-current`
                              : 'border-zinc-200 dark:border-dark-600 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-dark-500 bg-white dark:bg-dark-700'
                          )}
                        >
                          <s.icon className="w-4 h-4 shrink-0" />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what you have in mind..."
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all placeholder-zinc-400 dark:placeholder-zinc-600 resize-none"
                    />
                    <p className="text-xs text-zinc-400 mt-1.5 text-right">
                      {form.message.length} characters
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-zinc-400 text-center">
                    We respect your privacy. Your details are never shared with third parties.
                  </p>
                </form>
              </div>
            </div>

            {/* FAQ — 2/5 */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-6">
                Common questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i}
                    className="rounded-2xl border border-zinc-100 dark:border-dark-700 bg-white dark:bg-dark-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-zinc-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <span className="font-medium text-dark-900 dark:text-white text-sm leading-snug">
                        {faq.q}
                      </span>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-dark-500 flex items-center justify-center shrink-0 transition-all',
                        openFaq === i && 'border-brand-500 bg-brand-500'
                      )}>
                        <span className={cn(
                          'text-white text-xs font-bold leading-none transition-transform',
                          openFaq === i ? 'rotate-45' : ''
                        )}>+</span>
                      </div>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5">
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Advertising CTA */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">
                  Want to advertise?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  We offer sponsored posts, newsletter ads, and sidebar placements.
                  Reach a highly engaged audience of finance, tech, and travel enthusiasts.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(f => ({ ...f, subject: 'advertising' }))
                    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2 text-brand-400 text-sm font-semibold hover:text-brand-300 transition-colors"
                >
                  Get our media kit <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}