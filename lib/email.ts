// lib/email.ts
// Central email service using Resend
// All emails share the same brand design system

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — email not sent. Subject:', subject)
    return { ok: false, error: 'No API key' }
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'newsletter@yourdomain.com'
  const fromName = process.env.NEXT_PUBLIC_SITE_NAME || 'PremiumBlog'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo && { reply_to: replyTo }),
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[Email] Resend error:', data)
    return { ok: false, error: data.message }
  }
  return { ok: true, data }
}

// ─────────────────────────────────────────────
// SHARED EMAIL WRAPPER
// ─────────────────────────────────────────────
function emailWrapper(content: string, siteName: string, siteUrl: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${siteName}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header / Logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <a href="${siteUrl}" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;">
                <span style="display:inline-block;width:40px;height:40px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:10px;text-align:center;line-height:40px;font-size:20px;font-weight:900;color:white;font-family:Georgia,serif;">B</span>
                <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${siteName}</span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#161616;border:1px solid #2a2a2a;border-radius:20px;overflow:hidden;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#555;">
                You're receiving this because you subscribed to ${siteName}.
              </p>
              <p style="margin:0;font-size:12px;color:#444;">
                <a href="${siteUrl}/unsubscribe" style="color:#f59e0b;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}/privacy-policy" style="color:#f59e0b;text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}" style="color:#f59e0b;text-decoration:none;">${siteUrl.replace('https://', '')}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// ─────────────────────────────────────────────
// WELCOME EMAIL (sent on newsletter subscribe)
// ─────────────────────────────────────────────
export function buildWelcomeEmail({
  name,
  siteName,
  siteUrl,
  siteDescription,
}: {
  name?: string
  siteName: string
  siteUrl: string
  siteDescription?: string
}) {
  const firstName = name?.split(' ')[0] || 'there'

  const content = `
    <!-- Hero -->
    <div style="padding:48px 40px 32px;text-align:center;background:linear-gradient(180deg,#1a1400 0%,#161616 100%);">
      <div style="display:inline-block;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:50px;padding:8px 20px;margin-bottom:24px;">
        <span style="color:#f59e0b;font-size:14px;font-weight:600;">Welcome aboard 🎉</span>
      </div>
      <h1 style="margin:0 0 16px;font-size:32px;font-weight:800;color:#ffffff;line-height:1.2;letter-spacing:-0.5px;">
        You're in, ${firstName}!
      </h1>
      <p style="margin:0;font-size:16px;color:#888;line-height:1.6;max-width:400px;display:inline-block;">
        ${siteDescription || `Thanks for subscribing to ${siteName}. We're glad you're here.`}
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);margin:0 40px;"></div>

    <!-- What to expect -->
    <div style="padding:32px 40px;">
      <h2 style="margin:0 0 20px;font-size:18px;font-weight:700;color:#ffffff;">What to expect</h2>
      ${[
        { icon: '💰', title: 'Personal Finance', desc: 'Actionable tips on saving, investing, and building wealth.' },
        { icon: '🤖', title: 'Tech & AI', desc: 'Honest reviews of the latest AI tools and tech products.' },
        { icon: '✈️', title: 'Travel', desc: 'Real budget breakdowns and destination guides.' },
      ].map(item => `
        <div style="display:flex;gap:16px;margin-bottom:20px;align-items:flex-start;">
          <div style="width:44px;height:44px;background:#1f1f1f;border:1px solid #2a2a2a;border-radius:12px;text-align:center;line-height:44px;font-size:20px;flex-shrink:0;">${item.icon}</div>
          <div>
            <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#ffffff;">${item.title}</p>
            <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">${item.desc}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- CTA -->
    <div style="padding:0 40px 40px;text-align:center;">
      <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000000;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.2px;">
        Read Latest Articles →
      </a>
      <p style="margin:20px 0 0;font-size:13px;color:#555;">
        You'll receive an email whenever we publish something new.
      </p>
    </div>
  `

  return emailWrapper(content, siteName, siteUrl)
}

// ─────────────────────────────────────────────
// NEW POST EMAIL (sent to all subscribers on publish)
// ─────────────────────────────────────────────
export function buildNewPostEmail({
  post,
  siteName,
  siteUrl,
}: {
  post: {
    title: string
    slug: string
    excerpt?: string | null
    coverImage?: string | null
    readingTime?: number | null
    author: { name: string | null }
    category?: { name: string; color: string | null; icon: string | null } | null
  }
  siteName: string
  siteUrl: string
}) {
  const postUrl = `${siteUrl}/blog/${post.slug}`

  const content = `
    <!-- Cover image -->
    ${post.coverImage ? `
    <div style="height:240px;overflow:hidden;border-radius:20px 20px 0 0;">
      <img src="${post.coverImage}" alt="${post.title}" style="width:100%;height:100%;object-fit:cover;" />
    </div>
    ` : `
    <div style="height:8px;background:linear-gradient(90deg,#f59e0b,#d97706,#f59e0b);"></div>
    `}

    <!-- Content -->
    <div style="padding:40px;">
      
      <!-- Badge row -->
      <div style="margin-bottom:20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="display:inline-block;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 12px;border-radius:50px;">
          New Article
        </span>
        ${post.category ? `
        <span style="display:inline-block;background:${(post.category.color || '#6366f1')}22;border:1px solid ${(post.category.color || '#6366f1')}44;color:${post.category.color || '#6366f1'};font-size:11px;font-weight:600;padding:5px 12px;border-radius:50px;">
          ${post.category.icon || ''} ${post.category.name}
        </span>
        ` : ''}
        ${post.readingTime ? `
        <span style="font-size:12px;color:#555;">⏱ ${post.readingTime} min read</span>
        ` : ''}
      </div>

      <!-- Title -->
      <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.3;letter-spacing:-0.5px;">
        <a href="${postUrl}" style="color:#ffffff;text-decoration:none;">${post.title}</a>
      </h1>

      <!-- Excerpt -->
      ${post.excerpt ? `
      <p style="margin:0 0 28px;font-size:15px;color:#888;line-height:1.7;">${post.excerpt}</p>
      ` : ''}

      <!-- Author -->
      <div style="display:flex;align-items:center;gap:12px;padding:16px;background:#1f1f1f;border-radius:12px;margin-bottom:28px;">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:50%;text-align:center;line-height:36px;font-weight:700;color:#000;font-size:16px;flex-shrink:0;">
          ${(post.author.name || 'A')[0].toUpperCase()}
        </div>
        <div>
          <p style="margin:0;font-size:13px;font-weight:600;color:#ffffff;">${post.author.name || 'Author'}</p>
          <p style="margin:0;font-size:12px;color:#555;">Author</p>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="${postUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000000;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.2px;">
          Read Full Article →
        </a>
      </div>
    </div>
  `

  return emailWrapper(content, siteName, siteUrl)
}
