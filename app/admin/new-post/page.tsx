'use client'
// app/admin/new-post/page.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RichEditor } from '@/components/admin/RichEditor'
import { slugify, calculateReadingTime, generateExcerpt } from '@/lib/utils'
import { Save, Send, ChevronDown, X, Plus, AlertCircle } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color: string | null
  icon: string | null
}

export default function NewPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    featured: false,
    sponsored: false,
    categoryId: '',
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
  })

  const [tagInput, setTagInput] = useState('')
  const [seoExpanded, setSeoExpanded] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Raw slug value while user is typing — converted to final slug on blur
  const [slugRaw, setSlugRaw] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  // Auto-generate slug from title ONLY when slug is empty
  useEffect(() => {
    if (form.title && !form.slug) {
      const generated = slugify(form.title)
      setForm(f => ({ ...f, slug: generated }))
      setSlugRaw(generated)
    }
  }, [form.title])

  const handleContentChange = (html: string) => {
    setForm(f => ({ ...f, content: html }))
    if (!form.excerpt && html.length > 50) {
      setForm(f => ({ ...f, excerpt: generateExcerpt(html) }))
    }
  }

  // Allow typing freely including '-', only slugify on blur
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-\s]/g, '')
    setSlugRaw(raw)
    setForm(f => ({ ...f, slug: raw }))
  }

  const handleSlugBlur = () => {
    const finalSlug = slugify(slugRaw)
    setSlugRaw(finalSlug)
    setForm(f => ({ ...f, slug: finalSlug }))
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.content.trim() || form.content === '<p></p>') errs.content = 'Content is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const save = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!validate()) return
    setSaving(true)
    try {
      const readingTime = calculateReadingTime(form.content)
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status,
          readingTime,
          publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin/posts')
      } else {
        setErrors({ submit: data.error || 'Something went wrong' })
      }
    } finally {
      setSaving(false)
    }
  }

  const metaTitleLength = (form.metaTitle || form.title).length
  const metaDescLength = (form.metaDescription || form.excerpt).length

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-white">New Post</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => save('DRAFT')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-600 text-zinc-300 hover:border-zinc-500 hover:text-white text-sm font-medium transition-all disabled:opacity-50">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button onClick={() => save('PUBLISHED')} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-brand-500/20">
            <Send className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main — 2/3 */}
        <div className="col-span-2 space-y-5">

          {/* Title */}
          <div>
            <input type="text" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Post title..."
              className="w-full bg-dark-800 border border-dark-600 focus:border-brand-500 rounded-2xl px-5 py-4 text-white text-2xl font-display font-bold placeholder-dark-500 outline-none transition-colors" />
            {errors.title && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.title}</p>}
          </div>

          {/* Slug — allows typing '-' freely, slugifies on blur */}
          <div>
            <div className="flex items-center bg-dark-800 border border-dark-600 focus-within:border-brand-500 rounded-xl overflow-hidden transition-colors">
              <span className="px-4 text-zinc-500 text-sm shrink-0 border-r border-dark-600 py-3">/blog/</span>
              <input
                type="text"
                value={slugRaw}
                onChange={handleSlugChange}
                onBlur={handleSlugBlur}
                placeholder="post-url-slug"
                className="flex-1 bg-transparent px-4 py-3 text-zinc-300 text-sm outline-none"
              />
            </div>
            {errors.slug && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.slug}</p>}
          </div>

          {/* Editor */}
          <div>
            <RichEditor
              content={form.content}
              onChange={handleContentChange}
              placeholder="Write your article here..."
            />
            {errors.content && <p className="text-red-400 text-xs mt-1.5">{errors.content}</p>}
          </div>

          {/* SEO */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
            <button type="button" onClick={() => setSeoExpanded(!seoExpanded)}
              className="flex items-center justify-between w-full p-5 text-left hover:bg-dark-700 transition-colors">
              <div>
                <span className="font-semibold text-white text-sm">SEO Settings</span>
                <p className="text-xs text-zinc-500 mt-0.5">Customize how this post appears in search results</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${seoExpanded ? 'rotate-180' : ''}`} />
            </button>
            {seoExpanded && (
              <div className="p-5 border-t border-dark-700 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm text-zinc-400">Meta Title</label>
                    <span className={`text-xs ${metaTitleLength > 80 ? 'text-red-400' : 'text-zinc-500'}`}>{metaTitleLength}/80</span>
                  </div>
                  <input type="text" value={form.metaTitle}
                    onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                    placeholder={form.title || 'SEO title...'}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm text-zinc-400">Meta Description</label>
                    <span className={`text-xs ${metaDescLength > 160 ? 'text-red-400' : 'text-zinc-500'}`}>{metaDescLength}/160</span>
                  </div>
                  <textarea value={form.metaDescription}
                    onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                    placeholder={form.excerpt || 'SEO description...'}
                    rows={3}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-5">

          {/* Publish settings */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Publish Settings</h3>
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

          {/* Category */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setForm(f => ({ ...f, categoryId: cat.id }))}>
                  <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${form.categoryId === cat.id ? 'bg-brand-500 border-brand-500' : 'border-dark-500 group-hover:border-brand-500'}`}>
                    {form.categoryId === cat.id && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{cat.icon} {cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Tags</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-500 transition-colors" />
              <button onClick={addTag} type="button"
                className="p-2 rounded-xl bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-700 text-zinc-300 text-xs">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-white"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover image */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Cover Image</h3>
            <input type="url" value={form.coverImage}
              onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
              placeholder="Image URL..."
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-500 transition-colors" />
            {form.coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden" style={{ height: '140px' }}>
                <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Excerpt</h3>
            <textarea value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short description..."
              rows={3}
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none" />
          </div>
        </div>
      </div>
    </div>
  )
}