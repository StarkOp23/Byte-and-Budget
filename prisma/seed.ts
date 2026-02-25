// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@yourblog.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@yourblog.com',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Founder and editor of this blog.',
    },
  })

  // Create categories
  const categories = [
    {
      name: 'Personal Finance',
      slug: 'personal-finance',
      description: 'Money management, investing, saving, and building wealth.',
      color: '#10B981',
      icon: '',
    },
    {
      name: 'Tech & AI',
      slug: 'tech-ai',
      description: 'Technology news, AI tools, and digital productivity.',
      color: '#6366F1',
      icon: '',
    },
    {
      name: 'Travel',
      slug: 'travel',
      description: 'Travel guides, tips, and destination inspiration.',
      color: '#F59E0B',
      icon: '',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Sample posts
  const financeCategory = await prisma.category.findUnique({ where: { slug: 'personal-finance' } })
  const techCategory = await prisma.category.findUnique({ where: { slug: 'tech-ai' } })
  const travelCategory = await prisma.category.findUnique({ where: { slug: 'travel' } })

  const samplePosts = [
    {
      title: 'How to Save Your First $10,000: A Realistic Guide',
      slug: 'how-to-save-first-10000-realistic-guide',
      excerpt: 'Saving $10,000 feels impossible when you\'re starting from zero. Here\'s the exact system that works, even on a modest income.',
      content: '<h2>Start With Why</h2><p>Before we talk numbers, you need a strong reason to save. Without a clear goal, willpower alone won\'t carry you through the hard months.</p><p>Your first $10,000 should be your emergency fund. Not a vacation fund, not a car fund — an emergency fund. This money is your financial foundation.</p><h2>The 24-Hour Rule</h2><p>Every non-essential purchase over $50 gets a 24-hour waiting period. This single rule eliminates most impulse spending.</p><h2>Automate Everything</h2><p>Set up an automatic transfer to your savings account on payday. Start with 10% of your income. You won\'t miss what you never see.</p>',
      status: 'PUBLISHED' as const,
      featured: true,
      readingTime: 7,
      publishedAt: new Date(),
      metaTitle: 'How to Save Your First $10,000 — Step by Step Guide',
      metaDescription: 'A realistic, actionable guide to saving your first $10,000 even on a modest income. Includes the exact system and mindset shifts that work.',
      categoryId: financeCategory?.id,
      authorId: admin.id,
    },
    {
      title: 'The 10 Best AI Tools for Content Creators in 2025',
      slug: 'best-ai-tools-content-creators-2025',
      excerpt: 'These AI tools will save you 10+ hours per week and dramatically improve your output quality. Tested and ranked.',
      content: '<h2>Why AI Tools Matter Now</h2><p>The content creator landscape has fundamentally changed. The creators winning in 2025 aren\'t necessarily the most talented — they\'re the most efficiently tooled.</p><h2>1. Claude (Anthropic)</h2><p>For long-form writing, research synthesis, and complex reasoning, Claude is unmatched. The context window is enormous, making it ideal for editing full articles.</p><h2>2. Midjourney v6</h2><p>Still the gold standard for AI image generation. The photorealism in v6 is genuinely stunning.</p>',
      status: 'PUBLISHED' as const,
      featured: true,
      readingTime: 9,
      publishedAt: new Date(),
      metaTitle: 'Best AI Tools for Content Creators 2025 (Tested & Ranked)',
      metaDescription: 'The 10 best AI tools for content creators tested and ranked. Save 10+ hours per week with these productivity tools.',
      categoryId: techCategory?.id,
      authorId: admin.id,
    },
    {
      title: 'Southeast Asia on $50/Day: The Complete Budget Travel Guide',
      slug: 'southeast-asia-budget-travel-guide-50-dollars-day',
      excerpt: 'Travel through Thailand, Vietnam, and Bali for under $50 a day without sacrificing comfort. Here\'s exactly how.',
      content: '<h2>Is $50/Day Realistic?</h2><p>Yes — but only if you understand where the money goes. In Southeast Asia, accommodation and food are dramatically cheaper than the West. Your biggest enemy is the tourist trap restaurant near the main attraction.</p><h2>Where to Stay</h2><p>Guesthouses and small family-run hotels offer the best value. Aim for $15-25 per night for a clean, private room with AC and WiFi.</p>',
      status: 'PUBLISHED' as const,
      featured: false,
      readingTime: 12,
      publishedAt: new Date(),
      metaTitle: 'Southeast Asia on $50/Day — Complete Budget Travel Guide',
      metaDescription: 'Travel Southeast Asia on $50 a day. Complete guide to Thailand, Vietnam, and Bali including accommodation, food, and transport costs.',
      categoryId: travelCategory?.id,
      authorId: admin.id,
    },
  ]

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  console.log('\n✅ Database seeded!')
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔐  ADMIN LOGIN CREDENTIALS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  URL:       http://localhost:3000/admin')
  console.log('  Email:     admin@yourblog.com')
  console.log('  Password:  admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  ⚠️  Change password after first login!')
  console.log('  Go to: Admin → Authors → Create Account')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
