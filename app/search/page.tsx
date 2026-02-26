// 'use client'
// // app/search/page.tsx
// import { useState } from 'react'
// import { Header } from '@/components/blog/Header'
// import { Footer } from '@/components/blog/Footer'
// import { PostCard } from '@/components/blog/PostCard'
// import { Search, Loader2 } from 'lucide-react'
// import type { PostWithRelations } from '@/types'

// export default function SearchPage() {
//   const [query, setQuery] = useState('')
//   const [results, setResults] = useState<PostWithRelations[]>([])
//   const [loading, setLoading] = useState(false)
//   const [searched, setSearched] = useState(false)

//   const search = async (q: string) => {
//     if (!q.trim()) return
//     setLoading(true)
//     setSearched(true)
//     try {
//       const res = await fetch(`/api/posts?search=${encodeURIComponent(q)}&limit=20`)
//       const data = await res.json()
//       setResults(data.posts || [])
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-dark-900">
//       <Header />
//       <main className="pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="font-display text-4xl font-black text-dark-900 dark:text-white mb-4">Search Articles</h1>
//           <p className="text-zinc-500">Find articles on finance, AI, travel, and more.</p>
//         </div>

//         <form onSubmit={e => { e.preventDefault(); search(query) }} className="relative max-w-2xl mx-auto mb-12">
//           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
//           <input
//             type="search"
//             value={query}
//             onChange={e => setQuery(e.target.value)}
//             placeholder="Search articles..."
//             className="w-full pl-14 pr-32 py-4 rounded-2xl border border-zinc-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-lg outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500 transition-all shadow-lg"
//             autoFocus
//           />
//           <button type="submit"
//             className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all">
//             Search
//           </button>
//         </form>

//         {loading && (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
//           </div>
//         )}

//         {!loading && searched && (
//           <div>
//             <p className="text-sm text-zinc-500 mb-6">
//               {results.length > 0
//                 ? `Found ${results.length} article${results.length !== 1 ? 's' : ''} for "${query}"`
//                 : `No results for "${query}"`}
//             </p>
//             {results.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {results.map(post => (
//                   <PostCard key={post.id} post={post} variant="default" />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-20">
//                 <p className="text-zinc-400 text-lg mb-2">No articles found</p>
//                 <p className="text-zinc-500 text-sm">Try different keywords or browse categories</p>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   )
// }



'use client'
// app/search/page.tsx
import { useState } from 'react'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { Search, Loader2 } from 'lucide-react'
import type { PostWithRelations } from '@/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PostWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/posts?search=${encodeURIComponent(q)}&limit=20`)
      const data = await res.json()
      setResults(data.posts || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-black text-dark-900 dark:text-white mb-4">Search Articles</h1>
          <p className="text-zinc-500">Find articles on finance, AI, travel, and more.</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); search(query) }} className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-14 pr-32 py-4 rounded-2xl border border-zinc-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-lg outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500 transition-all shadow-lg"
            autoFocus
          />
          <button type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all">
            Search
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        )}

        {!loading && searched && (
          <div>
            <p className="text-sm text-zinc-500 mb-6">
              {results.length > 0
                ? `Found ${results.length} article${results.length !== 1 ? 's' : ''} for "${query}"`
                : `No results for "${query}"`}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(post => (
                  <PostCard key={post.id} post={post} variant="default" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-zinc-400 text-lg mb-2">No articles found</p>
                <p className="text-zinc-500 text-sm">Try different keywords or browse categories</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}