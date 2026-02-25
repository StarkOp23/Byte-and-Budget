// components/blog/PostCard.tsx
import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'
import { formatDateShort, cn } from '@/lib/utils'
import type { PostWithRelations } from '@/types'

interface PostCardProps {
  post: PostWithRelations
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
  className?: string
}

export function PostCard({ post, variant = 'default', className }: PostCardProps) {

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group block', className)}>
        <article className="relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: '520px' }}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-700 to-brand-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {post.sponsored && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-500/90 text-white text-xs font-bold uppercase tracking-wider">
              Sponsored
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {post.category && (
              <span
                className="category-pill text-white mb-4 inline-block"
                style={{ backgroundColor: post.category.color + '33', borderColor: post.category.color + '66', border: '1px solid' }}
              >
                {post.category.icon} {post.category.name}
              </span>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-brand-300 transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-zinc-400 text-xs">
              {post.author.image && (
                <img src={post.author.image} alt={post.author.name || ''}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-brand-500/50" />
              )}
              <span className="text-zinc-300 font-medium">{post.author.name}</span>
              {post.publishedAt && <span>{formatDateShort(post.publishedAt)}</span>}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime} min
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group block', className)}>
        <article className="flex gap-5 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-dark-800 transition-all">
          <div className="relative rounded-xl overflow-hidden shrink-0" style={{ width: '112px', height: '80px' }}>
            {post.coverImage ? (
              <img src={post.coverImage} alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-dark-700 dark:to-dark-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: post.category.color || '#f59e0b' }}>
                {post.category.name}
              </span>
            )}
            <h3 className="font-display font-bold text-dark-900 dark:text-white text-sm leading-snug mt-1 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
              {post.publishedAt && <span>{formatDateShort(post.publishedAt)}</span>}
              {post.readingTime && <span>{post.readingTime}m read</span>}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group block', className)}>
        <article>
          <div className="relative rounded-xl overflow-hidden mb-3" style={{ height: '180px' }}>
            {post.coverImage ? (
              <img src={post.coverImage} alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-600" />
            )}
            {post.category && (
              <div className="absolute top-3 left-3">
                <span className="category-pill text-white text-[10px]"
                  style={{ backgroundColor: (post.category.color || '#f59e0b') + '99' }}>
                  {post.category.icon}
                </span>
              </div>
            )}
          </div>
          <h3 className="font-display font-bold text-dark-900 dark:text-white leading-tight line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
            {post.publishedAt && <span>{formatDateShort(post.publishedAt)}</span>}
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </article>
      </Link>
    )
  }

  // Default card
  return (
    <Link href={`/blog/${post.slug}`} className={cn('group block', className)}>
      <article className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-dark-700 hover:border-brand-200 dark:hover:border-brand-900 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300">
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 dark:from-dark-700 dark:to-dark-600" />
          )}
          {post.sponsored && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Sponsored
            </div>
          )}
          {post.category && (
            <div className="absolute bottom-3 left-3">
              <span className="category-pill text-white text-[10px]"
                style={{ backgroundColor: (post.category.color || '#f59e0b') + 'cc' }}>
                {post.category.icon} {post.category.name}
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="font-display font-bold text-dark-900 dark:text-white text-lg leading-tight line-clamp-2 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-dark-700">
            <div className="flex items-center gap-2">
              {post.author.image && (
                <img src={post.author.image} alt={post.author.name || ''}
                  className="w-7 h-7 rounded-full object-cover" />
              )}
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime} min
                </span>
              )}
              {post.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}