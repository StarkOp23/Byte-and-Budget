// app/affiliate-disclosure/page.tsx
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { generateMetadata as genMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Affiliate Disclosure',
  description: 'Our affiliate disclosure policy — how we earn money on this site.',
  url: '/affiliate-disclosure',
})

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl font-black text-dark-900 dark:text-white mb-8">
            Affiliate Disclosure
          </h1>
          <div className="prose prose-lg dark:prose-invert">
            <p>This website participates in various affiliate marketing programs. This means we may earn a commission when you click on certain links and make a purchase, at no additional cost to you.</p>
            <h2>How It Works</h2>
            <p>When you click an affiliate link on this site and complete a purchase, we may receive a small commission from the retailer or service provider. These commissions help us keep this site running and continue producing free content for you.</p>
            <h2>Our Commitment</h2>
            <p>We only recommend products and services we genuinely believe in. Our editorial opinions are never influenced by affiliate relationships. If we think a product isn't worth your money, we'll say so — even if we have an affiliate arrangement with that company.</p>
            <h2>Which Links Are Affiliate Links?</h2>
            <p>Affiliate links are clearly marked with a special styling and/or the label "affiliate link." Sponsored posts are clearly labeled as "Sponsored" at the top of the article.</p>
            <p>If you have any questions about our affiliate relationships, please contact us at hello@yourdomain.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
