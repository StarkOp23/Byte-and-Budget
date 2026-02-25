// // app/category/[slug]/page.tsx
// import { notFound } from 'next/navigation'
// import { prisma } from '@/lib/prisma'
// import { generateMetadata as genMeta } from '@/lib/seo'
// import { Header } from '@/components/blog/Header'
// import { Footer } from '@/components/blog/Footer'
// import { PostCard } from '@/components/blog/PostCard'
// import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
// import { AdSlot } from '@/components/monetization/AdSlot'
// import type { Metadata } from 'next'
// import type { PostWithRelations } from '@/types'

// interface Props {
//   params: { slug: string }
//   searchParams: { page?: string }
// }

// const POSTS_PER_PAGE = 12

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const category = await prisma.category.findUnique({ where: { slug: params.slug } }).catch(() => null)
//   if (!category) return {}
//   return genMeta({
//     title: `${category.name} Articles`,
//     description: category.description || `Browse all ${category.name} articles`,
//     url: `/category/${category.slug}`,
//   })
// }

// export default async function CategoryPage({ params, searchParams }: Props) {
//   const page = Number(searchParams.page) || 1
//   const skip = (page - 1) * POSTS_PER_PAGE

//   const category = await prisma.category.findUnique({ where: { slug: params.slug } }).catch(() => null)
//   if (!category) notFound()

//   const [posts, total] = await Promise.all([
//     prisma.post.findMany({
//       where: { categoryId: category.id, status: 'PUBLISHED' },
//       include: { author: true, category: true, tags: { include: { tag: true } } },
//       orderBy: { publishedAt: 'desc' },
//       skip,
//       take: POSTS_PER_PAGE,
//     }).catch(() => []),
//     prisma.post.count({ where: { categoryId: category.id, status: 'PUBLISHED' } }).catch(() => 0),
//   ])

//   const totalPages = Math.ceil(total / POSTS_PER_PAGE)

//   return (
//     <div className="min-h-screen bg-white dark:bg-dark-900">
//       <Header />
//       <main className="pt-20">
//         {/* Category Hero */}
//         <div className="py-20 px-4 sm:px-6 text-center border-b border-zinc-100 dark:border-dark-800">
//           <div className="max-w-2xl mx-auto">
//             <div
//               className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-6"
//               style={{ backgroundColor: (category.color || '#f59e0b') + '22' }}
//             >
//               {category.icon}
//             </div>
//             <h1 className="font-display text-4xl sm:text-5xl font-black text-dark-900 dark:text-white mb-4">
//               {category.name}
//             </h1>
//             {category.description && (
//               <p className="text-lg text-zinc-500 dark:text-zinc-400">{category.description}</p>
//             )}
//             <p className="text-sm text-zinc-400 mt-3">{total} articles</p>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
//           <AdSlot slot="header" className="flex justify-center mb-12" />

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {posts.map((post, i) => (
//               <>
//                 <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
//                 {/* In-grid ad after 6th post */}
//                 {i === 5 && (
//                   <div key="ad" className="flex items-center justify-center">
//                     <AdSlot slot="sidebar" />
//                   </div>
//                 )}
//               </>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-12">
//               {page > 1 && (
//                 <a href={`?page=${page - 1}`}
//                   className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-dark-700 text-sm font-medium hover:border-brand-400 transition-colors">
//                   ← Previous
//                 </a>
//               )}
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//                 <a key={p} href={`?page=${p}`}
//                   className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
//                     p === page
//                       ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
//                       : 'border border-zinc-200 dark:border-dark-700 hover:border-brand-400'
//                   }`}
//                 >
//                   {p}
//                 </a>
//               ))}
//               {page < totalPages && (
//                 <a href={`?page=${page + 1}`}
//                   className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-dark-700 text-sm font-medium hover:border-brand-400 transition-colors">
//                   Next →
//                 </a>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
//           <NewsletterSignup variant="hero" />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }



// app/category/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
import { AdSlot } from '@/components/monetization/AdSlot'
import type { Metadata } from 'next'
import type { PostWithRelations } from '@/types'


export const revalidate = 0

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

const POSTS_PER_PAGE = 12

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) return {}
  return genMeta({
    title: `${category.name} Articles`,
    description: category.description || `Browse all ${category.name} articles`,
    url: `/category/${category.slug}`,
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page) || 1
  const skip = (page - 1) * POSTS_PER_PAGE

  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) notFound()

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { categoryId: category.id, status: 'PUBLISHED' },
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { categoryId: category.id, status: 'PUBLISHED' } }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="pt-20">
        {/* Category Hero */}
        <div className="py-20 px-4 sm:px-6 text-center border-b border-zinc-100 dark:border-dark-800">
          <div className="max-w-2xl mx-auto">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-6"
              style={{ backgroundColor: (category.color || '#f59e0b') + '22' }}
            >
              {category.icon}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-dark-900 dark:text-white mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-zinc-500 dark:text-zinc-400">{category.description}</p>
            )}
            <p className="text-sm text-zinc-400 mt-3">{total} articles</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <AdSlot slot="header" className="flex justify-center mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <>
                <PostCard key={post.id} post={post as PostWithRelations} variant="default" />
                {/* In-grid ad after 6th post */}
                {i === 5 && (
                  <div key="ad" className="flex items-center justify-center">
                    <AdSlot slot="sidebar" />
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {page > 1 && (
                <a href={`?page=${page - 1}`}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-dark-700 text-sm font-medium hover:border-brand-400 transition-colors">
                  ← Previous
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <a key={p} href={`?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                      : 'border border-zinc-200 dark:border-dark-700 hover:border-brand-400'
                  }`}
                >
                  {p}
                </a>
              ))}
              {page < totalPages && (
                <a href={`?page=${page + 1}`}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-dark-700 text-sm font-medium hover:border-brand-400 transition-colors">
                  Next →
                </a>
              )}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <NewsletterSignup variant="hero" />
        </div>
      </main>
      <Footer />
    </div>
  )
}