'use client'
// components/admin/CategoryForm.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#8B5CF6', '#F97316']

export function CategoryForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', color: '#10B981' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: form.slug || slugify(form.name) }),
      })
      if (res.ok) {
        setSuccess(true)
        setForm({ name: '', slug: '', description: '', icon: '', color: '#10B981' })
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Name *</label>
        <input type="text" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
          placeholder="Personal Finance" required
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Slug</label>
        <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
          placeholder="personal-finance"
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Emoji Icon</label>
        <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
          placeholder="💰"
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Short description..." rows={2}
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(color => (
            <button key={color} type="button" onClick={() => setForm(f => ({ ...f, color }))}
              className="w-8 h-8 rounded-lg border-2 transition-all"
              style={{ backgroundColor: color, borderColor: form.color === color ? 'white' : 'transparent' }} />
          ))}
        </div>
      </div>
      <button type="submit" disabled={saving || !form.name}
        className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2">
        {success ? <><CheckCircle className="w-4 h-4" /> Created!</> : saving ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  )
}
