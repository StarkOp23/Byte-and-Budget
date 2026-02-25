// app/about/page.tsx
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
import { generateMetadata as genMeta } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'About Us',
  description: 'Learn about our mission to bring you the best content on personal finance, tech & AI, and travel.',
  url: '/about',
})

export default async function AboutPage() {
  const authors = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'AUTHOR'] } },
    select: { id: true, name: true, image: true, bio: true, twitter: true, website: true, role: true },
  }).catch(() => [])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 text-center border-b border-zinc-100 dark:border-dark-800">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-5xl font-black text-dark-900 dark:text-white mb-6">
              Built to inform,<br />
              <span className="gradient-text">built to earn.</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We write honest, practical content about personal finance, AI tools, and travel — 
              the three areas that have the biggest impact on how you earn, work, and live.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '',
                title: 'Personal Finance',
                desc: 'No fluff. Actionable advice on saving, investing, budgeting, and building wealth — regardless of where you\'re starting from.',
              },
              {
                emoji: '',
                title: 'Tech & AI',
                desc: 'Honest reviews of AI tools and tech products. We test everything ourselves and tell you exactly what\'s worth your time and money.',
              },
              {
                emoji: '',
                title: 'Travel',
                desc: 'Real budget breakdowns, destination guides, and travel hacks from people who actually travel — not just write about it.',
              },
            ].map(item => (
              <div key={item.title} className="p-6 rounded-2xl bg-zinc-50 dark:bg-dark-800 border border-zinc-100 dark:border-dark-700">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h3 className="font-display font-bold text-dark-900 dark:text-white text-lg mb-3">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        {authors.length > 0 && (
          <section className="py-20 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-dark-900 dark:text-white text-center mb-12">
                The Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authors.map(author => (
                  <div key={author.id} className="flex gap-5 p-6 rounded-2xl bg-zinc-50 dark:bg-dark-800 border border-zinc-100 dark:border-dark-700">
                    {author.image ? (
                      <Image src={author.image} alt={author.name || ''} width={64} height={64}
                        className="rounded-full ring-2 ring-brand-200 dark:ring-brand-800 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-2xl text-brand-500">
                          {author.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-display font-bold text-dark-900 dark:text-white">{author.name}</p>
                      <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mb-2">
                        {author.role === 'ADMIN' ? 'Editor in Chief' : 'Author'}
                      </p>
                      {author.bio && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{author.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
          <NewsletterSignup variant="hero" />
        </section>
      </main>
      <Footer />
    </div>
  )
}
