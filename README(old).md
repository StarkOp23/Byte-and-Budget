# 🚀 PremiumBlog — Full Stack Blog Platform

A premium, SEO-optimized blog built with Next.js 14, PostgreSQL (Supabase), and Tailwind CSS.  
Three niches: Personal Finance 💰 | Tech & AI 🤖 | Travel ✈️  
Four revenue streams: Affiliate → Newsletter → Ads → Sponsored Posts

---

## ⚡ Quick Start (5 Steps)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and fill in:
- `DATABASE_URL` — from Supabase (free at supabase.com)
- `NEXTAUTH_SECRET` — any random 32+ char string
- `NEXTAUTH_URL` — `http://localhost:3000` for dev

### Step 3 — Set up database
```bash
npx prisma db push     # creates all tables
npm run db:seed        # creates admin user + sample posts + categories
```

### Step 4 — Start dev server
```bash
npm run dev
```
Visit `http://localhost:3000` — your blog is live.

### Step 5 — Log in to admin
Visit `http://localhost:3000/admin`  
Email: `admin@yourblog.com`  
Password: `admin123`  
**Change these immediately in production.**

---

## 🗂️ Project Structure

```
app/
  page.tsx                    ← Homepage
  blog/[slug]/page.tsx        ← Individual article pages
  category/[slug]/page.tsx    ← Category listing pages
  search/page.tsx             ← Search
  about/page.tsx              ← About page
  admin/                      ← Protected admin panel
    page.tsx                  ← Dashboard
    login/page.tsx            ← Login
    new-post/page.tsx         ← Create post
    posts/page.tsx            ← Manage posts
  api/
    posts/route.ts            ← Posts CRUD API
    categories/route.ts       ← Categories API
    newsletter/               ← Newsletter subscribe
    affiliate/track/          ← Affiliate click tracking
    auth/                     ← NextAuth
  sitemap.ts                  ← Auto-generated sitemap.xml
  robots.ts                   ← robots.txt
  feed.xml/route.ts           ← RSS feed

components/
  blog/
    Header.tsx                ← Navigation (dark/light toggle, mobile menu)
    Footer.tsx                ← Footer with links
    PostCard.tsx              ← Article cards (4 variants)
    SocialShare.tsx           ← Twitter/LinkedIn/Facebook/copy
    ReadingProgress.tsx       ← Reading progress bar
  admin/
    AdminSidebar.tsx          ← Admin navigation
    RichEditor.tsx            ← TipTap editor (full featured)
  monetization/
    AdSlot.tsx                ← Google AdSense slots (activate when ready)
    NewsletterSignup.tsx      ← 4 variants (hero/inline/sidebar/popup)
    AffiliateLink.tsx         ← Tracked affiliate links (3 variants)
  ui/
    ThemeProvider.tsx         ← Dark/light mode
    Toaster.tsx               ← Notifications

lib/
  prisma.ts                   ← Database client
  auth.ts                     ← NextAuth config
  seo.ts                      ← SEO metadata generators
  utils.ts                    ← Helpers

prisma/
  schema.prisma               ← Database schema
  seed.ts                     ← Sample data
```

---

## 💰 Monetization Setup

### 1. Affiliate Links
Use the `AffiliateLink` component anywhere in your content:
```tsx
// In your MDX/article content or components
<AffiliateLink href="https://example.com" label="Try it free" variant="button" />
<AffiliateLink href="https://example.com" label="Best budget card" variant="inline" />
<AffiliateLink href="https://example.com" label="Top VPN" description="Best for travel" variant="card" />
```
All clicks are tracked in the `AffiliateClick` database table.

### 2. Newsletter (Resend)
1. Create account at resend.com (free: 3,000 emails/month)
2. Add `RESEND_API_KEY` to `.env.local`
3. Uncomment the Resend code in `app/api/newsletter/subscribe/route.ts`
4. Newsletter signups go to your database automatically

### 3. Google AdSense
1. Apply at google.com/adsense
2. Wait for approval (~2-4 weeks, need live site with content)
3. Once approved, add `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxx` to `.env.local`
4. Uncomment the script tag in `app/layout.tsx`
5. Ad slots are already placed — they auto-activate with your client ID

### 4. Sponsored Posts
When creating a post in admin, toggle "Sponsored" on.  
The post gets a "Sponsored" badge automatically.  
A disclosure notice appears at the top of the article (FTC compliance).

---

## 🔍 SEO Features

Every page automatically gets:
- Dynamic `<title>` and `<meta description>`
- Open Graph tags (Facebook, LinkedIn sharing)
- Twitter Card tags
- JSON-LD structured data (Article schema, Breadcrumb schema)
- Canonical URLs
- `sitemap.xml` at `/sitemap.xml` (submit to Google Search Console)
- `robots.txt` at `/robots.txt`
- RSS feed at `/feed.xml`
- Reading time calculated automatically
- Image optimization (WebP, lazy loading)

### After deploying, do this:
1. Go to Google Search Console (search.google.com/search-console)
2. Add your domain
3. Submit `https://yourdomain.com/sitemap.xml`
4. Set up Google Analytics (add script to `app/layout.tsx`)

---

## 🚀 Deployment (Vercel + Supabase)

### Database (Supabase)
1. Go to supabase.com → New project
2. Copy the `DATABASE_URL` from Settings → Database → Connection string
3. Run `npx prisma db push` to create tables
4. Run `npm run db:seed` to add sample data

### Deployment (Vercel)
1. Push code to GitHub
2. Go to vercel.com → Import project
3. Add all environment variables from `.env.example`
4. Deploy — takes ~2 minutes
5. Add your custom domain in Vercel → Domains

---

## 👤 User Roles

| Role   | Can Do |
|--------|--------|
| ADMIN  | Everything — publish, manage users, see all analytics |
| AUTHOR | Write posts and save drafts. Cannot publish. |

---

## 🎨 Design System

**Fonts**: Playfair Display (headings) + DM Sans (body) + Fira Code (code)  
**Colors**: Brand amber/gold (`brand-500` = `#f59e0b`)  
**Theme**: Dark mode default, light mode toggle  
**Animations**: Fade-up on load, hover transitions, progress bar  

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` 14 | Framework |
| `@prisma/client` | Database ORM |
| `next-auth` | Authentication |
| `@tiptap/*` | Rich text editor |
| `resend` | Email delivery |
| `cloudinary` | Image hosting |
| `lucide-react` | Icons |
| `tailwindcss` | Styling |
| `zod` | Validation |

---

## 🔧 Customization

**Change site name**: Update `NEXT_PUBLIC_SITE_NAME` in `.env.local`  
**Change colors**: Edit `tailwind.config.ts` → `colors.brand`  
**Add categories**: Use Prisma Studio (`npm run db:studio`) or the admin panel  
**Add fonts**: Replace Google Fonts imports in `app/globals.css`  

---

Built to earn. Good luck. 🚀
