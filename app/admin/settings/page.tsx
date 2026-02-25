'use client'
// app/admin/settings/page.tsx
import { useState, useEffect } from 'react'
import {
  Globe, Mail, Share2, BarChart2, AlertTriangle,
  Save, CheckCircle, AlertCircle, Eye, EyeOff,
  Loader2, RefreshCw, Send, Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'site' | 'email' | 'social' | 'seo' | 'danger'

interface Settings {
  siteName: string
  siteDescription: string
  siteUrl: string
  logoUrl: string
  faviconUrl: string
  twitterHandle: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  youtubeUrl: string
  googleAnalyticsId: string
  adsenseClientId: string
  resendApiKey: string
  fromEmail: string
  emailSignature: string
  footerText: string
  maintenanceMode: boolean
  postsPerPage: number
}

const defaultSettings: Settings = {
  siteName: '', siteDescription: '', siteUrl: '', logoUrl: '', faviconUrl: '',
  twitterHandle: '', facebookUrl: '', instagramUrl: '', linkedinUrl: '', youtubeUrl: '',
  googleAnalyticsId: '', adsenseClientId: '',
  resendApiKey: '', fromEmail: '', emailSignature: '', footerText: '',
  maintenanceMode: false, postsPerPage: 12,
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'site', label: 'Site', icon: Globe },
  { id: 'email', label: 'Email & Newsletter', icon: Mail },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'seo', label: 'SEO & Analytics', icon: BarChart2 },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('site')
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  // Email test state
  const [testEmail, setTestEmail] = useState('')
  const [testingSend, setTestingSend] = useState(false)
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings({ ...defaultSettings, ...data })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (key: keyof Settings, value: any) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  const save = async () => {
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setStatusMsg('Settings saved successfully!')
      } else {
        setStatus('error')
        setStatusMsg(data.error || 'Failed to save settings')
      }
    } finally {
      setSaving(false)
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) return
    setTestingSend(true)
    setTestResult('')
    try {
      const res = await fetch('/api/newsletter/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, siteName: settings.siteName, siteUrl: settings.siteUrl }),
      })
      const data = await res.json()
      setTestResult(data.ok ? '✅ Test email sent! Check your inbox.' : `❌ ${data.error}`)
    } finally {
      setTestingSend(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  const inputClass = "w-full bg-dark-700 border border-dark-600 focus:border-brand-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-zinc-600"
  const labelClass = "block text-sm font-medium text-zinc-400 mb-1.5"

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 mt-1">Configure your blog and integrations</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-brand-500/20">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Status banner */}
      {status !== 'idle' && (
        <div className={cn(
          'flex items-center gap-3 p-4 rounded-xl border mb-6 text-sm',
          status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        )}>
          {status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {statusMsg}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                  activeTab === tab.id
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-dark-700'
                )}>
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 bg-dark-800 border border-dark-700 rounded-2xl p-6">

          {/* ── SITE SETTINGS ── */}
          {activeTab === 'site' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-white text-xl mb-5">Site Settings</h2>

              <div>
                <label className={labelClass}>Site Name *</label>
                <input value={settings.siteName} onChange={e => set('siteName', e.target.value)}
                  placeholder="PremiumBlog" className={inputClass} />
                <p className="text-xs text-zinc-500 mt-1">Appears in the browser tab, emails, and SEO metadata</p>
              </div>

              <div>
                <label className={labelClass}>Site Description</label>
                <textarea value={settings.siteDescription} onChange={e => set('siteDescription', e.target.value)}
                  placeholder="Personal Finance, Tech & AI, and Travel insights" rows={3}
                  className={cn(inputClass, 'resize-none')} />
              </div>

              <div>
                <label className={labelClass}>Site URL *</label>
                <input value={settings.siteUrl} onChange={e => set('siteUrl', e.target.value)}
                  placeholder="https://yourdomain.com" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Logo URL</label>
                  <input value={settings.logoUrl} onChange={e => set('logoUrl', e.target.value)}
                    placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Favicon URL</label>
                  <input value={settings.faviconUrl} onChange={e => set('faviconUrl', e.target.value)}
                    placeholder="https://..." className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Posts Per Page</label>
                  <input type="number" min="1" max="50" value={settings.postsPerPage}
                    onChange={e => set('postsPerPage', parseInt(e.target.value) || 12)}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Footer Text</label>
                  <input value={settings.footerText} onChange={e => set('footerText', e.target.value)}
                    placeholder="© 2025 All rights reserved" className={inputClass} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700 border border-dark-600">
                <div>
                  <p className="font-medium text-white text-sm">Maintenance Mode</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Temporarily take the site offline for visitors</p>
                </div>
                <div onClick={() => set('maintenanceMode', !settings.maintenanceMode)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-all cursor-pointer relative',
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-dark-500'
                  )}>
                  <div className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                    settings.maintenanceMode ? 'left-7' : 'left-1'
                  )} />
                </div>
              </div>
            </div>
          )}

          {/* ── EMAIL & NEWSLETTER ── */}
          {activeTab === 'email' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-white text-xl mb-5">Email & Newsletter</h2>

              {/* Resend setup guide */}
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30">
                <p className="text-brand-300 text-sm font-semibold mb-1">Setup Guide — Resend</p>
                <ol className="text-zinc-400 text-xs space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://resend.com" target="_blank" className="text-brand-400 hover:underline">resend.com</a> → Sign up free (3,000 emails/month)</li>
                  <li>Verify your domain (or use their test email for development)</li>
                  <li>Create an API Key → paste it below</li>
                  <li>Add <code className="bg-dark-700 px-1 rounded">RESEND_API_KEY</code> to your <code className="bg-dark-700 px-1 rounded">.env.local</code> file too</li>
                </ol>
              </div>

              <div>
                <label className={labelClass}>Resend API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.resendApiKey}
                    onChange={e => set('resendApiKey', e.target.value)}
                    placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
                    className={cn(inputClass, 'pr-12')}
                  />
                  <button type="button" onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Stored securely. Displayed masked after saving.</p>
              </div>

              <div>
                <label className={labelClass}>From Email Address</label>
                <input value={settings.fromEmail} onChange={e => set('fromEmail', e.target.value)}
                  placeholder="newsletter@yourdomain.com" className={inputClass} />
                <p className="text-xs text-zinc-500 mt-1">Must be verified in Resend</p>
              </div>

              <div>
                <label className={labelClass}>Email Signature</label>
                <textarea value={settings.emailSignature} onChange={e => set('emailSignature', e.target.value)}
                  placeholder="Stay curious — The PremiumBlog Team" rows={2}
                  className={cn(inputClass, 'resize-none')} />
              </div>

              {/* Test email */}
              <div className="p-5 rounded-xl bg-dark-700 border border-dark-600">
                <p className="font-semibold text-white text-sm mb-1">Send Test Email</p>
                <p className="text-zinc-500 text-xs mb-4">Sends a sample welcome email to verify your setup is working</p>
                <div className="flex gap-3">
                  <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-dark-600 border border-dark-500 focus:border-brand-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors" />
                  <button onClick={sendTestEmail} disabled={testingSend || !testEmail}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 hover:bg-brand-500/30 text-sm font-medium transition-all disabled:opacity-50">
                    {testingSend ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Test
                  </button>
                </div>
                {testResult && (
                  <p className="text-sm mt-3 text-zinc-300">{testResult}</p>
                )}
              </div>

              {/* Blast to all */}
              <div className="p-5 rounded-xl bg-dark-700 border border-dark-600">
                <p className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  Auto Newsletter Blasts
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  When you <strong className="text-white">publish a post</strong>, an email is automatically sent to all confirmed subscribers with the post title, excerpt, cover image, and a link to read it.
                </p>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  When someone <strong className="text-white">subscribes</strong>, they immediately receive a branded welcome email.
                </p>
                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-emerald-400 text-xs font-medium">Both are active — no configuration needed once your API key is set.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── SOCIAL MEDIA ── */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-white text-xl mb-5">Social Media</h2>

              <div>
                <label className={labelClass}>Twitter / X Handle</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">@</span>
                  <input value={settings.twitterHandle} onChange={e => set('twitterHandle', e.target.value.replace('@', ''))}
                    placeholder="yourblog" className={cn(inputClass, 'pl-8')} />
                </div>
              </div>

              {[
                { key: 'facebookUrl', label: 'Facebook Page URL', placeholder: 'https://facebook.com/yourpage' },
                { key: 'instagramUrl', label: 'Instagram URL', placeholder: 'https://instagram.com/yourhandle' },
                { key: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourcompany' },
                { key: 'youtubeUrl', label: 'YouTube Channel URL', placeholder: 'https://youtube.com/@yourchannel' },
              ].map(field => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <input value={(settings as any)[field.key]} onChange={e => set(field.key as any, e.target.value)}
                    placeholder={field.placeholder} className={inputClass} />
                </div>
              ))}
            </div>
          )}

          {/* ── SEO & ANALYTICS ── */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-white text-xl mb-5">SEO & Analytics</h2>

              <div>
                <label className={labelClass}>Google Analytics ID</label>
                <input value={settings.googleAnalyticsId} onChange={e => set('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX" className={inputClass} />
                <p className="text-xs text-zinc-500 mt-1">
                  Get it from <a href="https://analytics.google.com" target="_blank" className="text-brand-400 hover:underline">analytics.google.com</a> → Admin → Data Streams
                </p>
              </div>

              <div>
                <label className={labelClass}>Google AdSense Client ID</label>
                <input value={settings.adsenseClientId} onChange={e => set('adsenseClientId', e.target.value)}
                  placeholder="ca-pub-xxxxxxxxxxxxxxxxx" className={inputClass} />
                <p className="text-xs text-zinc-500 mt-1">
                  Apply at <a href="https://adsense.google.com" target="_blank" className="text-brand-400 hover:underline">adsense.google.com</a> — approval takes 2–4 weeks
                </p>
              </div>

              <div className="p-4 rounded-xl bg-dark-700 border border-dark-600 space-y-3">
                <p className="font-semibold text-white text-sm">Automatic SEO Features</p>
                {[
                  { label: 'Dynamic sitemap.xml', desc: 'Auto-generated from all published posts' },
                  { label: 'robots.txt', desc: 'Configured to allow all crawlers, block /admin' },
                  { label: 'RSS Feed', desc: 'Available at /feed.xml for news aggregators' },
                  { label: 'Open Graph Tags', desc: 'All posts have proper og:image, og:title, og:description' },
                  { label: 'JSON-LD Structured Data', desc: 'Article schema on every post for rich snippets' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-zinc-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DANGER ZONE ── */}
          {activeTab === 'danger' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-white text-xl mb-2">Danger Zone</h2>
              <p className="text-zinc-400 text-sm mb-5">These actions are irreversible. Be careful.</p>

              {[
                {
                  title: 'Clear All Page View Data',
                  desc: 'Deletes all analytics data (page views). Post content is not affected.',
                  action: 'Clear Analytics',
                  color: 'border-yellow-500/30 bg-yellow-500/5',
                  btnColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30',
                  onClick: async () => {
                    if (!confirm('Clear all analytics data? This cannot be undone.')) return
                    await fetch('/api/analytics/clear', { method: 'DELETE' })
                    alert('Analytics data cleared.')
                  }
                },
                {
                  title: 'Clear All Newsletter Subscribers',
                  desc: 'Permanently deletes all subscriber emails from the database.',
                  action: 'Delete All Subscribers',
                  color: 'border-orange-500/30 bg-orange-500/5',
                  btnColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30',
                  onClick: async () => {
                    if (!confirm('Delete ALL subscribers? This cannot be undone.')) return
                    await fetch('/api/newsletter/subscribers', { method: 'DELETE' })
                    alert('All subscribers deleted.')
                  }
                },
                {
                  title: 'Delete All Draft Posts',
                  desc: 'Permanently deletes all posts with status DRAFT. Published posts are not affected.',
                  action: 'Delete All Drafts',
                  color: 'border-red-500/30 bg-red-500/5',
                  btnColor: 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30',
                  onClick: async () => {
                    if (!confirm('Delete all draft posts? This cannot be undone.')) return
                    await fetch('/api/posts/drafts', { method: 'DELETE' })
                    alert('All drafts deleted.')
                  }
                },
              ].map(item => (
                <div key={item.title} className={cn('p-5 rounded-xl border', item.color)}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white text-sm">{item.title}</p>
                      <p className="text-zinc-400 text-xs mt-1">{item.desc}</p>
                    </div>
                    <button onClick={item.onClick}
                      className={cn('shrink-0 px-4 py-2 rounded-xl border text-xs font-semibold transition-all', item.btnColor)}>
                      {item.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
