// types/index.ts
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  featured: boolean
  sponsored: boolean
  views: number
  readingTime: number | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  authorId: string
  author: Author
  categoryId: string | null
  category: Category | null
  tags: TagOnPost[]
}

export interface Author {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  twitter: string | null
  website: string | null
  role: 'ADMIN' | 'AUTHOR'
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  _count?: { posts: number }
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface TagOnPost {
  tag: Tag
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  confirmed: boolean
  createdAt: Date
}

export interface PostWithRelations extends Post {
  author: Author
  category: Category | null
  tags: TagOnPost[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
