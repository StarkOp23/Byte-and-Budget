// app/privacy-policy/page.tsx
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { generateMetadata as genMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Privacy Policy',
  description: 'Our privacy policy — how we collect, use, and protect your data.',
  url: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl font-black text-dark-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-zinc-400 text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly, such as your email address when you subscribe to our newsletter.</p>
            <p>We also automatically collect certain information when you visit our site, including your IP address, browser type, pages visited, and time spent on pages through analytics tools.</p>

            <h2>How We Use Your Information</h2>
            <p>We use your information to send our newsletter (only if you opted in), improve our content and user experience, and comply with legal obligations.</p>

            <h2>Cookies</h2>
            <p>We use essential cookies to keep you logged in (admin users only) and analytics cookies (Google Analytics) to understand how readers use our site. You can disable cookies in your browser settings.</p>

            <h2>Third-Party Services</h2>
            <p>We use Google AdSense for advertising. Google may use cookies to show you relevant ads based on your browsing history. You can opt out at <a href="https://adssettings.google.com">adssettings.google.com</a>.</p>
            <p>We use affiliate links. When you click these, the affiliate may set cookies to track your purchase.</p>

            <h2>Data Retention</h2>
            <p>Newsletter subscriber data is retained until you unsubscribe. You can unsubscribe at any time using the link at the bottom of any email.</p>

            <h2>Your Rights</h2>
            <p>You have the right to access, correct, or delete any personal data we hold about you. Contact us at hello@yourdomain.com to make a request.</p>

            <h2>Contact</h2>
            <p>For any privacy-related questions, email us at hello@yourdomain.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
