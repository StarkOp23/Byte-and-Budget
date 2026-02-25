// // app/blog/[slug]/page.tsx
// import { notFound } from 'next/navigation'

// import Link from 'next/link'
// import { prisma } from '@/lib/prisma'
// import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo'
// import { formatDate, calculateReadingTime } from '@/lib/utils'
// import { Header } from '@/components/blog/Header'
// import { Footer } from '@/components/blog/Footer'
// import { PostCard } from '@/components/blog/PostCard'
// import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
// import { AdSlot } from '@/components/monetization/AdSlot'
// import { SocialShare } from '@/components/blog/SocialShare'
// import { ReadingProgress } from '@/components/blog/ReadingProgress'
// import { Clock, Eye, Calendar, Tag, ChevronRight } from 'lucide-react'
// import type { Metadata } from 'next'
// import type { PostWithRelations } from '@/types'

// interface Props {
//   params: { slug: string }
// }

// async function getPost(slug: string) {
//   try {
//     const post = await prisma.post.findUnique({
//       where: { slug, status: 'PUBLISHED' },
//       include: {
//         author: true,
//         category: true,
//         tags: { include: { tag: true } },
//       },
//     })
//     return post
//   } catch {
//     return null
//   }
// }

// async function getRelatedPosts(postId: string, categoryId: string | null) {
//   try {
//     return await prisma.post.findMany({
//       where: {
//         status: 'PUBLISHED',
//         id: { not: postId },
//         ...(categoryId ? { categoryId } : {}),
//       },
//       include: { author: true, category: true, tags: { include: { tag: true } } },
//       orderBy: { publishedAt: 'desc' },
//       take: 3,
//     })
//   } catch {
//     return []
//   }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const post = await getPost(params.slug)
//   if (!post) return {}

//   return genMeta({
//     title: post.metaTitle || post.title,
//     description: post.metaDescription || post.excerpt || undefined,
//     image: post.coverImage || undefined,
//     url: `/blog/${post.slug}`,
//     type: 'article',
//     publishedTime: post.publishedAt?.toISOString(),
//     authors: [post.author.name || ''],
//   })
// }

// export async function generateStaticParams() {
//   try {
//     const posts = await prisma.post.findMany({
//       where: { status: 'PUBLISHED' },
//       select: { slug: true },
//     })
//     return posts.map(p => ({ slug: p.slug }))
//   } catch {
//     return []
//   }
// }

// export default async function BlogPostPage({ params }: Props) {
//   const post = await getPost(params.slug)
//   if (!post) notFound()

//   const related = await getRelatedPosts(post.id, post.categoryId)
//   const readingTime = post.readingTime || calculateReadingTime(post.content)

//   // Increment views (fire and forget)
//   prisma.post.update({
//     where: { id: post.id },
//     data: { views: { increment: 1 } },
//   }).catch(() => {})

//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
//   const postUrl = `${siteUrl}/blog/${post.slug}`

//   const articleSchema = generateArticleSchema({
//     title: post.title,
//     excerpt: post.excerpt,
//     coverImage: post.coverImage,
//     publishedAt: post.publishedAt,
//     updatedAt: post.updatedAt,
//     slug: post.slug,
//     author: post.author,
//     category: post.category,
//   })

//   const breadcrumbSchema = generateBreadcrumbSchema([
//     { name: 'Home', url: '/' },
//     ...(post.category ? [{ name: post.category.name, url: `/category/${post.category.slug}` }] : []),
//     { name: post.title, url: `/blog/${post.slug}` },
//   ])

//   return (
//     <div className="min-h-screen bg-white dark:bg-dark-900">
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

//       <ReadingProgress />
//       <Header />

//       <main className="pt-20">
//         {/* Hero */}
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
//           {/* Breadcrumb */}
//           <nav className="flex items-center gap-1.5 text-sm text-zinc-400 mb-8">
//             <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
//             <ChevronRight className="w-3.5 h-3.5" />
//             {post.category && (
//               <>
//                 <Link href={`/category/${post.category.slug}`} className="hover:text-brand-500 transition-colors">
//                   {post.category.name}
//                 </Link>
//                 <ChevronRight className="w-3.5 h-3.5" />
//               </>
//             )}
//             <span className="text-zinc-600 dark:text-zinc-300 line-clamp-1">{post.title}</span>
//           </nav>

//           {/* Category + Sponsored badge */}
//           <div className="flex flex-wrap items-center gap-3 mb-6">
//             {post.category && (
//               <Link href={`/category/${post.category.slug}`}>
//                 <span
//                   className="category-pill text-white text-sm"
//                   style={{ backgroundColor: (post.category.color || '#f59e0b') + 'cc' }}
//                 >
//                   {post.category.icon} {post.category.name}
//                 </span>
//               </Link>
//             )}
//             {post.sponsored && (
//               <span className="category-pill bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
//                 Sponsored
//               </span>
//             )}
//           </div>

//           {/* Title */}
//           <h1 className="font-display text-4xl sm:text-5xl font-black text-dark-900 dark:text-white leading-tight mb-6 text-balance">
//             {post.title}
//           </h1>

//           {post.excerpt && (
//             <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
//               {post.excerpt}
//             </p>
//           )}

//           {/* Meta */}
//           <div className="flex flex-wrap items-center gap-5 pb-8 border-b border-zinc-100 dark:border-dark-700">
//             <div className="flex items-center gap-3">
//               {post.author.image && (
//                 <img src={post.author.image} alt={post.author.name || ''}
//                   className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800" />
//               )}
//               <div>
//                 <Link href={`/author/${post.author.id}`}
//                   className="font-semibold text-dark-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm">
//                   {post.author.name}
//                 </Link>
//                 <p className="text-xs text-zinc-400">{post.author.role === 'ADMIN' ? 'Editor in Chief' : 'Author'}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
//               {post.publishedAt && (
//                 <span className="flex items-center gap-1.5">
//                   <Calendar className="w-4 h-4" />
//                   {formatDate(post.publishedAt)}
//                 </span>
//               )}
//               <span className="flex items-center gap-1.5">
//                 <Clock className="w-4 h-4" />
//                 {readingTime} min read
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <Eye className="w-4 h-4" />
//                 {post.views.toLocaleString()} views
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Cover image */}
//         {post.coverImage && (
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
//             <div className="rounded-2xl overflow-hidden" style={{ height: '480px' }}>
//               <img
//                 src={post.coverImage}
//                 alt={post.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         )}

//         {/* Content + Sidebar */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
//           <div className="flex gap-12 justify-center">
//             {/* Article content */}
//             <article className="w-full max-w-2xl">
//               {/* Affiliate disclosure if sponsored */}
//               {post.sponsored && (
//                 <div className="callout callout-warning mb-8">
//                   <span>⚠️</span>
//                   <div>
//                     <strong>Disclosure:</strong> This is a sponsored post. We were compensated to publish this content.
//                     All opinions remain our own.
//                   </div>
//                 </div>
//               )}

//               {/* In-article ad */}
//               <div className="mb-8">
//                 <AdSlot slot="in-article" />
//               </div>

//               {/* Article body */}
//               <div
//                 className="prose prose-blog dark:prose-dark prose-lg max-w-none
//                   prose-headings:font-display prose-headings:font-bold
//                   prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
//                   prose-img:rounded-2xl prose-img:shadow-xl
//                   prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50/50 dark:prose-blockquote:bg-brand-950/20 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
//                   prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:bg-brand-50 dark:prose-code:bg-brand-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
//                   prose-pre:bg-dark-900 prose-pre:rounded-2xl"
//                 dangerouslySetInnerHTML={{ __html: post.content }}
//               />

//               {/* Tags */}
//               {post.tags.length > 0 && (
//                 <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-zinc-100 dark:border-dark-700">
//                   <Tag className="w-4 h-4 text-zinc-400" />
//                   {post.tags.map(({ tag }) => (
//                     <span key={tag.id}
//                       className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-dark-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
//                       {tag.name}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               {/* Share */}
//               <div className="mt-8">
//                 <SocialShare title={post.title} url={postUrl} />
//               </div>

//               {/* Newsletter */}
//               <div className="mt-12">
//                 <NewsletterSignup variant="inline" />
//               </div>

//               {/* Author bio */}
//               <div className="mt-12 p-6 rounded-2xl bg-zinc-50 dark:bg-dark-800 border border-zinc-100 dark:border-dark-700">
//                 <div className="flex items-start gap-4">
//                   {post.author.image && (
//                     <img src={post.author.image} alt={post.author.name || ''}
//                       className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800 shrink-0" />
//                   )}
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Written by</p>
//                     <Link href={`/author/${post.author.id}`}
//                       className="font-display font-bold text-lg text-dark-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
//                       {post.author.name}
//                     </Link>
//                     {post.author.bio && (
//                       <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
//                         {post.author.bio}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </article>

//             {/* Sidebar */}
//             <aside className="hidden lg:block w-80 shrink-0">
//               <div className="sticky top-24 space-y-6">
//                 <AdSlot slot="sidebar" />
//                 <NewsletterSignup variant="sidebar" />

//                 {/* Related in sidebar */}
//                 {related.length > 0 && (
//                   <div className="bg-zinc-50 dark:bg-dark-800 rounded-2xl p-5">
//                     <h3 className="font-display font-bold text-dark-900 dark:text-white mb-4">More to Read</h3>
//                     <div className="space-y-1">
//                       {related.map(r => (
//                         <PostCard key={r.id} post={r as PostWithRelations} variant="horizontal" />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </aside>
//           </div>
//         </div>

//         {/* Related Posts */}
//         {related.length > 0 && (
//           <section className="py-16 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
//             <div className="max-w-7xl mx-auto">
//               <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-8">Related Articles</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {related.map(r => (
//                   <PostCard key={r.id} post={r as PostWithRelations} variant="default" />
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}
//       </main>

//       <Footer />
//     </div>
//   )
// }


// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { NewsletterSignup } from '@/components/monetization/NewsletterSignup'
import { AdSlot } from '@/components/monetization/AdSlot'
import { SocialShare } from '@/components/blog/SocialShare'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { Clock, Eye, Calendar, Tag, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import type { PostWithRelations } from '@/types'


export const revalidate = 0

interface Props {
  params: { slug: string }
}

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    })
    return post
  } catch {
    return null
  }
}

async function getRelatedPosts(postId: string, categoryId: string | null) {
  try {
    return await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: postId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}

  return genMeta({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    image: post.coverImage || undefined,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt?.toISOString(),
    authors: [post.author.name || ''],
  })
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    })
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.id, post.categoryId)
  const readingTime = post.readingTime || calculateReadingTime(post.content)

  // Increment views (fire and forget)
  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => {})

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  const articleSchema = generateArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    slug: post.slug,
    author: post.author,
    category: post.category,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...(post.category ? [{ name: post.category.name, url: `/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ReadingProgress />
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-zinc-400 mb-8">
            <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {post.category && (
              <>
                <Link href={`/category/${post.category.slug}`} className="hover:text-brand-500 transition-colors">
                  {post.category.name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span className="text-zinc-600 dark:text-zinc-300 line-clamp-1">{post.title}</span>
          </nav>

          {/* Category + Sponsored badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.category && (
              <Link href={`/category/${post.category.slug}`}>
                <span
                  className="category-pill text-white text-sm"
                  style={{ backgroundColor: (post.category.color || '#f59e0b') + 'cc' }}
                >
                  {post.category.icon} {post.category.name}
                </span>
              </Link>
            )}
            {post.sponsored && (
              <span className="category-pill bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                Sponsored
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl font-black text-dark-900 dark:text-white leading-tight mb-6 text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 pb-8 border-b border-zinc-100 dark:border-dark-700">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img src={post.author.image} alt={post.author.name || ''}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800" />
              )}
              <div>
                <Link href={`/author/${post.author.id}`}
                  className="font-semibold text-dark-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm">
                  {post.author.name}
                </Link>
                <p className="text-xs text-zinc-400">{post.author.role === 'ADMIN' ? 'Editor in Chief' : 'Author'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {post.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
            <div className="rounded-2xl overflow-hidden" style={{ height: '480px' }}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex gap-12 justify-center">
            {/* Article content */}
            <article className="w-full max-w-2xl">
              {/* Affiliate disclosure if sponsored */}
              {post.sponsored && (
                <div className="callout callout-warning mb-8">
                  <span>⚠️</span>
                  <div>
                    <strong>Disclosure:</strong> This is a sponsored post. We were compensated to publish this content.
                    All opinions remain our own.
                  </div>
                </div>
              )}

              {/* In-article ad */}
              <div className="mb-8">
                <AdSlot slot="in-article" />
              </div>

              {/* Article body */}
              <div
                className="prose prose-blog dark:prose-dark prose-lg max-w-none
                  prose-headings:font-display prose-headings:font-bold
                  prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-xl
                  prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50/50 dark:prose-blockquote:bg-brand-950/20 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
                  prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:bg-brand-50 dark:prose-code:bg-brand-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-dark-900 prose-pre:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-zinc-100 dark:border-dark-700">
                  <Tag className="w-4 h-4 text-zinc-400" />
                  {post.tags.map(({ tag }) => (
                    <span key={tag.id}
                      className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-dark-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8">
                <SocialShare title={post.title} url={postUrl} />
              </div>

              {/* Newsletter */}
              <div className="mt-12">
                <NewsletterSignup variant="inline" />
              </div>

              {/* Author bio */}
              <div className="mt-12 p-6 rounded-2xl bg-zinc-50 dark:bg-dark-800 border border-zinc-100 dark:border-dark-700">
                <div className="flex items-start gap-4">
                  {post.author.image && (
                    <img src={post.author.image} alt={post.author.name || ''}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Written by</p>
                    <Link href={`/author/${post.author.id}`}
                      className="font-display font-bold text-lg text-dark-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      {post.author.name}
                    </Link>
                    {post.author.bio && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                <AdSlot slot="sidebar" />
                <NewsletterSignup variant="sidebar" />

                {/* Related in sidebar */}
                {related.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-dark-800 rounded-2xl p-5">
                    <h3 className="font-display font-bold text-dark-900 dark:text-white mb-4">More to Read</h3>
                    <div className="space-y-1">
                      {related.map(r => (
                        <PostCard key={r.id} post={r as PostWithRelations} variant="horizontal" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="py-16 px-4 sm:px-6 border-t border-zinc-100 dark:border-dark-800">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(r => (
                  <PostCard key={r.id} post={r as PostWithRelations} variant="default" />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}