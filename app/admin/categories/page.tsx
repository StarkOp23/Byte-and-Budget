// app/admin/categories/page.tsx
import { prisma } from '@/lib/prisma'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { Tag, FileText } from 'lucide-react'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: 'asc' },
  }).catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Categories</h1>
        <p className="text-zinc-400 mt-1">Manage your content categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add new */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-5">Add Category</h2>
          <CategoryForm />
        </div>

        {/* Existing categories */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-5">Existing Categories</h2>
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-4 p-4 rounded-xl bg-dark-700 border border-dark-600">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: (cat.color || '#f59e0b') + '22' }}>
                  {cat.icon || '📁'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{cat.name}</p>
                  <p className="text-zinc-500 text-xs">/{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  {cat._count.posts}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
