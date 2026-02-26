// // app/page.tsx
// import { prisma } from '@/lib/prisma'
// import { generateMetadata as genMeta } from '@/lib/seo'
// import { Header } from '@/components/blog/Header'
// import { Footer } from '@/components/blog/Footer'
// import { PostCard } from '@/components/blog/PostCard'
// import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
// import { AdSlot } from '@/components/monetization/AdSlot'
// import Link from 'next/link'
// import { ArrowRight, TrendingUp, Cpu, Plane } from 'lucide-react'
// import type { Metadata } from 'next'
// import type { PostWithRelations } from '@/types'

// export const metadata: Metadata = genMeta({})

// async function getPosts() {
//   try {
//     const [featured, recent, byCategory] = await Promise.all([
//       prisma.post.findMany({
//         where: { status: 'PUBLISHED', featured: true },
//         include: { author: true, category: true, tags: { include: { tag: true } } },
//         orderBy: { publishedAt: 'desc' },
//         take: 3,
//       }),
//       prisma.post.findMany({
//         where: { status: 'PUBLISHED' },
//         include: { author: true, category: true, tags: { include: { tag: true } } },
//         orderBy: { publishedAt: 'desc' },
//         take: 9,
//       }),
//       prisma.category.findMany({
//         include: {
//           posts: {
//             where: { status: 'PUBLISHED' },
//             include: { author: true, category: true, tags: { include: { tag: true } } },
//             orderBy: { publishedAt: 'desc' },
//             take: 3,
//           },
//           _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
//         },
//       }),
//     ])
//     return { featured, recent, byCategory }
//   } catch {
//     return { featured: [], recent: [], byCategory: [] }
//   }
// }

// const categoryIcons: Record<string, React.ComponentType<any>> = {
//   'personal-finance': TrendingUp,
//   'tech-ai': Cpu,
//   'travel': Plane,
// }

// export default async function HomePage() {
//   const { featured, recent, byCategory } = await getPosts()

//   return (
//     <div className="min-h-screen bg-white dark:bg-dark-900">
//       <Header />

//       {/* Hero Section */}
//       <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
//             <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
//             New articles every week
//           </div>
//           <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-dark-900 dark:text-white leading-tight tracking-tight mb-6 text-balance">
//             Smarter takes on{' '}
//             <span className="gradient-text">money, tech,</span>
//             <br />
//             and the world.
//           </h1>
//           <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
//             Practical insights on personal finance, AI tools, and travel — written for people who want to actually do something with the information.
//           </p>
//         </div>

//         {/* Header Ad */}
//         <div className="flex justify-center mb-12">
//           <AdSlot slot="header" className="max-w-3xl w-full" />
//         </div>

//         {/* Featured Posts Grid */}
//         {featured.length > 0 && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
//             <div className="lg:col-span-2">
//               <PostCard post={featured[0] as PostWithRelations} variant="featured" />
//             </div>
//             <div className="flex flex-col gap-6">
//               {featured.slice(1, 3).map(post => (
//                 <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
//               ))}
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Category Sections */}
//       {byCategory.map(category => {
//         const Icon = categoryIcons[category.slug] || TrendingUp
//         if (!category.posts.length) return null
//         return (
//           <section key={category.id} className="py-16 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
//             <div className="max-w-7xl mx-auto">
//               <div className="flex items-center justify-between mb-10">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className="w-10 h-10 rounded-xl flex items-center justify-center"
//                     style={{ backgroundColor: (category.color || '#f59e0b') + '22' }}
//                   >
//                     <Icon className="w-5 h-5" style={{ color: category.color || '#f59e0b' }} />
//                   </div>
//                   <div>
//                     <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white">
//                       {category.name}
//                     </h2>
//                     <p className="text-sm text-zinc-500">{category._count.posts} articles</p>
//                   </div>
//                 </div>
//                 <Link
//                   href={`/category/${category.slug}`}
//                   className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
//                 >
//                   View all <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {category.posts.map(post => (
//                   <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
//                 ))}
//               </div>
//             </div>
//           </section>
//         )
//       })}

//       {/* Newsletter */}
//       <section className="py-16 px-4 sm:px-6">
//         <div className="max-w-4xl mx-auto">
//           <NewsletterSignup variant="hero" />
//         </div>
//       </section>

//       {/* Recent Posts */}
//       {recent.length > 3 && (
//         <section className="py-16 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex items-center justify-between mb-10">
//               <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Latest Articles</h2>
//               <Link href="/search" className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
//                 Browse all <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recent.slice(3).map(post => (
//                 <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Footer Ad */}
//       <div className="flex justify-center py-8 border-t border-zinc-100 dark:border-dark-800">
//         <AdSlot slot="footer" className="max-w-3xl w-full px-4" />
//       </div>

//       <Footer />
//     </div>
//   )
// }


//app/page.tsx
import { prisma } from '@/lib/prisma'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
import { AdSlot } from '@/components/monetization/AdSlot'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Cpu, Plane } from 'lucide-react'
import type { Metadata } from 'next'
import type { PostWithRelations } from '@/types'

export const revalidate = 0 // always fetch fresh data — no caching

export const metadata: Metadata = genMeta({})

async function getPosts() {
  const [featured, recent, byCategory] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED', featured: true },
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 9,
    }),
    prisma.category.findMany({
      include: {
        posts: {
          where: { status: 'PUBLISHED' },
          include: { author: true, category: true, tags: { include: { tag: true } } },
          orderBy: { publishedAt: 'desc' },
          take: 3,
        },
        _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
      },
    }),
  ])
  return { featured, recent, byCategory }
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  'personal-finance': TrendingUp,
  'tech-ai': Cpu,
  'travel': Plane,
}

export default async function HomePage() {
  const { featured, recent, byCategory } = await getPosts()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
            New articles every week
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-dark-900 dark:text-white leading-tight tracking-tight mb-6 text-balance">
            Smarter takes on{' '}
            <span className="gradient-text">money, tech,</span>
            <br />
            and the world.
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Practical insights on personal finance, AI tools, and travel — written for people who want to actually do something with the information.
          </p>
        </div>

        {/* Header Ad */}
        <div className="flex justify-center mb-12">
          <AdSlot slot="header" className="max-w-3xl w-full" />
        </div>

        {/* Featured Posts Grid */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
            <div className="lg:col-span-2">
              <PostCard post={featured[0] as PostWithRelations} variant="featured" />
            </div>
            <div className="flex flex-col gap-6">
              {featured.slice(1, 3).map(post => (
                <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Category Sections */}
      {byCategory.map(category => {
        const Icon = categoryIcons[category.slug] || TrendingUp
        if (!category.posts.length) return null
        return (
          <section key={category.id} className="py-16 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: (category.color || '#f59e0b') + '22' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: category.color || '#f59e0b' }} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white">
                      {category.name}
                    </h2>
                    <p className="text-sm text-zinc-500">{category._count.posts} articles</p>
                  </div>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.posts.map(post => (
                  <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup variant="hero" />
        </div>
      </section>

      {/* Recent Posts */}
      {recent.length > 3 && (
        <section className="py-16 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Latest Articles</h2>
              <Link href="/search" className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
                Browse all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.slice(3).map(post => (
                <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Ad */}
      <div className="flex justify-center py-8 border-t border-zinc-100 dark:border-dark-800">
        <AdSlot slot="footer" className="max-w-3xl w-full px-4" />
      </div>

      <Footer />
    </div>
  )
}