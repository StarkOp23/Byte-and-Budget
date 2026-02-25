# 🚀 PremiumBlog — Complete Setup Guide

> Answers: missing files fixed, how to start, database setup, creating admin/author accounts.

---

## ✅ Q1 — Complete File List (All Files Included)

```
blog/
├── middleware.ts                        ← Route protection (ADDED)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
├── .env.example
│
├── prisma/
│   ├── schema.prisma                    ← Full DB schema
│   └── seed.ts                         ← Sample data + default admin
│
├── types/index.ts
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── seo.ts
│   └── utils.ts
│
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                         ← Homepage
│   ├── not-found.tsx                    ← 404 page (ADDED)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── about/page.tsx                   ← About page (ADDED)
│   ├── affiliate-disclosure/page.tsx
│   ├── privacy-policy/page.tsx          ← (ADDED)
│   ├── search/page.tsx
│   ├── blog/[slug]/page.tsx             ← FIXED (was /slug/)
│   ├── category/[slug]/page.tsx         ← FIXED (was /slug/)
│   ├── author/[id]/page.tsx             ← (ADDED)
│   ├── feed.xml/route.ts
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── page.tsx                     ← Dashboard
│   │   ├── new-post/page.tsx
│   │   ├── posts/page.tsx               ← All posts (ADDED)
│   │   ├── posts/[id]/page.tsx          ← Edit post (ADDED)
│   │   ├── newsletter/page.tsx          ← Subscribers (ADDED)
│   │   ├── categories/page.tsx          ← Manage categories (ADDED)
│   │   └── authors/page.tsx             ← Create users (ADDED)
│   │
│   └── api/
│       ├── auth/route.ts
│       ├── posts/route.ts
│       ├── posts/[id]/route.ts          ← GET/PATCH/DELETE (ADDED)
│       ├── categories/route.ts          ← GET + POST
│       ├── users/route.ts               ← Create accounts (ADDED)
│       ├── affiliate/track/route.ts
│       └── newsletter/
│           ├── subscribe/route.ts
│           └── export/route.ts          ← CSV export (ADDED)
│
└── components/
    ├── blog/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── PostCard.tsx
    │   ├── SocialShare.tsx
    │   └── ReadingProgress.tsx
    ├── admin/
    │   ├── AdminSidebar.tsx
    │   ├── RichEditor.tsx
    │   ├── PostActionsButton.tsx         ← Delete posts (ADDED)
    │   ├── CategoryForm.tsx              ← (ADDED)
    │   └── CreateAuthorForm.tsx          ← (ADDED)
    ├── monetization/
    │   ├── AdSlot.tsx
    │   ├── NewsletterSignup.tsx
    │   └── AffiliateLink.tsx
    └── ui/
        ├── ThemeProvider.tsx
        └── Toaster.tsx
```

---

## ✅ Q2 — How to Start

### Prerequisites
- Node.js 18+ → download at nodejs.org
- A Supabase account (free) → supabase.com

### Step-by-step

```bash
# 1. Enter the project folder
cd blog

# 2. Install all packages (~2-3 minutes)
npm install

# 3. Copy environment file
cp .env.example .env.local
# → Now edit .env.local (see Q3 below)

# 4. Push database schema
npx prisma db push

# 5. Seed database (creates admin account + sample posts)
npm run db:seed

# 6. Start development server
npm run dev
```

Open **http://localhost:3000** → your blog  
Open **http://localhost:3000/admin** → admin panel

### Production build
```bash
npm run build
npm start
```

---

## ✅ Q3 — How to Connect to Database (Supabase)

### Step 1: Create free Supabase account
1. Go to **https://supabase.com** → Sign Up (free)
2. Click **New Project**
3. Set:
   - Project Name: anything
   - Database Password: strong password → **write this down**
   - Region: closest to you
4. Click **Create new project** — wait ~2 minutes

### Step 2: Get your connection string
1. In Supabase, click **Settings** (⚙️ bottom left)
2. Click **Database**
3. Scroll to **Connection string** section
4. Click the **URI** tab
5. Copy the string — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Fill in .env.local

Open `.env.local` and set these values:

```env
# Paste your Supabase connection string here
DATABASE_URL="postgresql://postgres:YourPassword@db.xxxx.supabase.co:5432/postgres"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="paste-a-random-32-character-string-here"

# For development
NEXTAUTH_URL="http://localhost:3000"

# Your site info (update with real domain later)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="My Blog"
NEXT_PUBLIC_SITE_DESCRIPTION="Personal Finance, Tech and AI, Travel"
```

### Step 4: Generate NEXTAUTH_SECRET
Run in terminal:
```bash
# Mac/Linux:
openssl rand -base64 32

# Windows (PowerShell):
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```
Copy output → paste as NEXTAUTH_SECRET value.

### Step 5: Initialize database
```bash
# Create all tables
npx prisma db push

# Add sample data + default admin account
npm run db:seed
```

**Output after seed:**
```
✅ Database seeded!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐  ADMIN LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  URL:       http://localhost:3000/admin
  Email:     admin@yourblog.com
  Password:  admin123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️  Change password after first login!
```

### Optional: Visual database browser
```bash
npm run db:studio
# Opens at http://localhost:5555
```

---

## ✅ Q4 — How to Create Real Admin and Author Accounts

### Step 1: Log in with default account
- URL: **http://localhost:3000/admin**
- Email: `admin@yourblog.com`
- Password: `admin123`

### Step 2: Create YOUR real admin account
1. Click **Authors** in the left sidebar
2. Fill in the form:
   - **Full Name**: Your name
   - **Role**: `Admin` (full access)
   - **Email**: your real email
   - **Password**: something strong (8+ chars)
3. Click **Create Admin Account**
4. **Log out** → log back in with your real email/password

### Step 3: Add Authors (writers)
Same process, but choose `Author` role:
- Authors can **write and save drafts**
- Authors **cannot publish** — only admins can publish
- Authors log in at the same `/admin/login` URL

### Roles Comparison

| Feature | ADMIN | AUTHOR |
|---------|-------|--------|
| Write posts | ✅ | ✅ |
| Save drafts | ✅ | ✅ |
| Publish posts | ✅ | ❌ |
| Edit any post | ✅ | ❌ |
| Delete posts | ✅ | ❌ |
| Manage categories | ✅ | ❌ |
| Create authors | ✅ | ❌ |
| View newsletter | ✅ | ✅ |
| View analytics | ✅ | ✅ |

### Delete the default seed account
Once you have your own admin account:
```bash
npm run db:studio
# Open Users table → delete admin@yourblog.com
```

---

## 🌐 Deployment

### Push to GitHub
```bash
git init
git add .
git commit -m "Blog launch"
git remote add origin https://github.com/YOU/YOUR-BLOG.git
git push -u origin main
```

### Deploy on Vercel (free)
1. Go to **https://vercel.com** → sign up with GitHub
2. Click **Add New Project** → import your repo
3. Add environment variables from `.env.local`
4. Change `NEXTAUTH_URL` to your real domain
5. Click **Deploy**

### Connect your domain
1. Buy domain at namecheap.com, godaddy.com, etc.
2. In Vercel → your project → **Settings** → **Domains**
3. Add your domain → follow DNS instructions

---

## ❓ Troubleshooting

| Error | Fix |
|-------|-----|
| `Cannot find module` | Run `npm install` |
| `Prisma client not found` | Run `npx prisma generate` |
| `Database connection error` | Check `DATABASE_URL` in `.env.local` |
| `NEXTAUTH_SECRET missing` | Generate and add to `.env.local` |
| Admin login fails | Run `npm run db:seed` first |
| `next: command not found` | Run `npm install` again |
