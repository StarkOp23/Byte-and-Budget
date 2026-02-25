// app/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // If no session, just render children (login page handles its own UI)
  // Middleware already handles the redirect to /admin/login for protected routes
  if (!session) {
    return <>{children}</>
  }

  const role = (session.user as any)?.role
  if (role !== 'ADMIN' && role !== 'AUTHOR') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <AdminSidebar user={session.user as any} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
