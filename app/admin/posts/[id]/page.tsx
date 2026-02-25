'use client'
// app/admin/posts/[id]/page.tsx
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { RichEditor } from '@/components/admin/RichEditor'
import { slugify, calculateReadingTime, generateExcerpt } from '@/lib/utils'
import { Save, Send, ChevronDown, X, Plus, AlertCircle, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Category { id: string; name: string; slug: string; color: string | null; icon: string | null }

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [seoExpanded, setSeoExpanded] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [post, setPost] = useState<any>(null)

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', coverImage: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    featured: false, sponsored: false, categoryId: '',
    tags: [] as string[], metaTitle: '', metaDescription: '',
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${postId}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([postData, cats]) => {
      setPost(postData)
      setCategories(cats)
      setForm({
        title: postData.title || '',
        slug: postData.slug || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        coverImage: postData.coverImage || '',
        status: postData.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        featured: postData.featured || false,
        sponsored: postData.sponsored || false,
        categoryId: postData.categoryId || '',
        tags: postData.tags?.map((t: any) => t.tag.name) || [],
        metaTitle: postData.metaTitle || '',
        metaDescription: postData.metaDescription || '',
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [postId])

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
      setTagInput('')
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.content || form.content === '<p></p>') errs.content = 'Content is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const save = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!validate()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status,
          readingTime: calculateReadingTime(form.content),
          publishedAt: status === 'PUBLISHED' && !post?.publishedAt ? new Date().toISOString() : post?.publishedAt,
        }),
      })
      if (res.ok) router.push('/admin/posts')
      else {
        const data = await res.json()
        setErrors({ submit: data.error || 'Something went wrong' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-dark-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          {post?.status === 'PUBLISHED' && (
            <Link href={`/blog/${post.slug}`} target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-600 text-zinc-300 hover:border-zinc-500 text-sm font-medium transition-all">
              <Eye className="w-4 h-4" /> View
            </Link>
          )}
          <button onClick={() => save('DRAFT')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-600 text-zinc-300 hover:border-zinc-500 hover:text-white text-sm font-medium transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => save('PUBLISHED')} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-brand-500/20">
            <Send className="w-4 h-4" /> {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* Title */}
          <div>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Post title..."
              className="w-full bg-dark-800 border border-dark-600 focus:border-brand-500 rounded-2xl px-5 py-4 text-white text-2xl font-display font-bold placeholder-dark-500 outline-none transition-colors" />
            {errors.title && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div className="flex items-center bg-dark-800 border border-dark-600 focus-within:border-brand-500 rounded-xl overflow-hidden transition-colors">
            <span className="px-4 text-zinc-500 text-sm shrink-0 border-r border-dark-600 py-3">/blog/</span>
            <input type="text" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
              placeholder="post-url-slug"
              className="flex-1 bg-transparent px-4 py-3 text-zinc-300 text-sm outline-none" />
          </div>

          {/* Editor */}
          <div>
            <RichEditor content={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} />
            {errors.content && <p className="text-red-400 text-xs mt-1.5">{errors.content}</p>}
          </div>

          {/* SEO */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
            <button type="button" onClick={() => setSeoExpanded(!seoExpanded)}
              className="flex items-center justify-between w-full p-5 text-left hover:bg-dark-700 transition-colors">
              <div>
                <span className="font-semibold text-white text-sm">SEO Settings</span>
                <p className="text-xs text-zinc-500 mt-0.5">Meta title, description for search engines</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${seoExpanded ? 'rotate-180' : ''}`} />
            </button>
            {seoExpanded && (
              <div className="p-5 border-t border-dark-700 space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-zinc-400">Meta Title</label>
                    <span className={`text-xs ${(form.metaTitle || form.title).length > 60 ? 'text-red-400' : 'text-zinc-500'}`}>
                      {(form.metaTitle || form.title).length}/60
                    </span>
                  </div>
                  <input type="text" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                    placeholder={form.title} className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-zinc-400">Meta Description</label>
                    <span className={`text-xs ${(form.metaDescription || form.excerpt).length > 160 ? 'text-red-400' : 'text-zinc-500'}`}>
                      {(form.metaDescription || form.excerpt).length}/160
                    </span>
                  </div>
                  <textarea value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                    placeholder={form.excerpt} rows={3}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Settings</h3>
            <div className="space-y-3">
              {[
                { key: 'featured', label: 'Featured Post' },
                { key: 'sponsored', label: 'Sponsored' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-400">{label}</span>
                  <div onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}
                    className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${(form as any)[key] ? 'bg-brand-500' : 'bg-dark-600'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${(form as any)[key] ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => setForm(f => ({ ...f, categoryId: cat.id }))}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${form.categoryId === cat.id ? 'bg-brand-500 border-brand-500' : 'border-dark-500'}`}>
                    {form.categoryId === cat.id && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" /></svg>}
                  </div>
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{cat.icon} {cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Tags</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..." className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-500 transition-colors" />
              <button onClick={addTag} type="button" className="p-2 rounded-xl bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-700 text-zinc-300 text-xs">
                  {tag}
                  <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))} className="text-zinc-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Cover Image</h3>
            <input type="url" value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
              placeholder="Image URL..." className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-500 transition-colors" />
            {form.coverImage && (
              <div className="mt-3 relative aspect-video rounded-xl overflow-hidden">
                <Image src={form.coverImage} alt="Cover" fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Excerpt</h3>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short description..." rows={3}
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
