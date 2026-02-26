// // app/feed.xml/route.ts
// import { prisma } from '@/lib/prisma'

// const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
// const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Byte And Budget'
// const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal Finance, Tech & AI, Travel'

// export async function GET() {
//   const posts = await prisma.post.findMany({
//     where: { status: 'PUBLISHED' },
//     include: { author: true, category: true },
//     orderBy: { publishedAt: 'desc' },
//     take: 20,
//   }).catch(() => [])

//   const items = posts.map(post => `
//     <item>
//       <title><![CDATA[${post.title}]]></title>
//       <link>${siteUrl}/blog/${post.slug}</link>
//       <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
//       <description><![CDATA[${post.excerpt || ''}]]></description>
//       <author>${post.author.email} (${post.author.name})</author>
//       ${post.category ? `<category>${post.category.name}</category>` : ''}
//       <pubDate>${post.publishedAt?.toUTCString() || new Date().toUTCString()}</pubDate>
//     </item>
//   `).join('')

//   const rss = `<?xml version="1.0" encoding="UTF-8"?>
// <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
//   <channel>
//     <title>${siteName}</title>
//     <link>${siteUrl}</link>
//     <description>${siteDescription}</description>
//     <language>en-us</language>
//     <managingEditor>hello@${new URL(siteUrl).hostname}</managingEditor>
//     <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
//     <image>
//       <url>${siteUrl}/og-default.jpg</url>
//       <title>${siteName}</title>
//       <link>${siteUrl}</link>
//     </image>
//     ${items}
//   </channel>
// </rss>`

//   return new Response(rss, {
//     headers: {
//       'Content-Type': 'application/xml',
//       'Cache-Control': 's-maxage=3600, stale-while-revalidate',
//     },
//   })
// }


// app/feed.xml/route.ts
import { prisma } from '@/lib/prisma'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Byte And Budget'
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal Finance, Tech &amp; AI, Travel'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  }).catch(() => [])

  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${escapeXml(`${siteUrl}/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${siteUrl}/blog/${post.slug}`)}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <author>${escapeXml(post.author.email)} (${escapeXml(post.author.name ?? '')})</author>
      ${post.category ? `<category>${escapeXml(post.category.name)}</category>` : ''}
      <pubDate>${post.publishedAt?.toUTCString() || new Date().toUTCString()}</pubDate>
    </item>
  `).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <managingEditor>hello@${escapeXml(new URL(siteUrl).hostname)}</managingEditor>
    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${escapeXml(`${siteUrl}/og-default.jpg`)}</url>
      <title>${escapeXml(siteName)}</title>
      <link>${escapeXml(siteUrl)}</link>
    </image>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}