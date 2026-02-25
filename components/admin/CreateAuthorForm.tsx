'use client'
// components/admin/CreateAuthorForm.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export function CreateAuthorForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'AUTHOR' as 'ADMIN' | 'AUTHOR',
    bio: '', twitter: '', website: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          bio: form.bio,
          twitter: form.twitter,
          website: form.website,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'AUTHOR', bio: '', twitter: '', website: '' })
        router.refresh()
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" /> Account created successfully!
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Full Name *</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith" required
            className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Role *</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}
            className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors cursor-pointer">
            <option value="AUTHOR">Author (write drafts)</option>
            <option value="ADMIN">Admin (full access)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Email *</label>
        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="author@yourblog.com" required
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Password *</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Min 8 characters" required minLength={8}
            className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none transition-colors" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Confirm Password *</label>
        <input type="password" value={form.confirmPassword}
          onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
          placeholder="Repeat password" required
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Bio</label>
        <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          placeholder="Short author bio..." rows={2}
          className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Twitter handle</label>
          <input type="text" value={form.twitter} onChange={e => setForm(f => ({ ...f, twitter: e.target.value.replace('@', '') }))}
            placeholder="username (no @)"
            className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Website</label>
          <input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
        </div>
      </div>

      <button type="submit" disabled={saving}
        className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm transition-all">
        {saving ? 'Creating...' : `Create ${form.role === 'ADMIN' ? 'Admin' : 'Author'} Account`}
      </button>
    </form>
  )
}
