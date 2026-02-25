// app/not-found.tsx
import Link from 'next/link'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center">
          <p className="font-display text-9xl font-black text-brand-500 opacity-20 select-none leading-none">
            404
          </p>
          <h1 className="font-display text-4xl font-bold text-dark-900 dark:text-white mt-4 mb-4">
            Page not found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20"
            >
              Go Home
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-dark-700 text-dark-900 dark:text-white font-semibold text-sm hover:border-brand-400 transition-all"
            >
              Search
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
