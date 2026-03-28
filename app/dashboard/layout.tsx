import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const username = cookieStore.get('user')?.value
  if (!username) redirect('/')

  const user = getUser(username)
  if (!user) redirect('/')

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-gray-800 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎬</span>
            <span className="font-bold text-white">The Alpha Board</span>
            <span className="text-gray-600 text-sm">· Precision</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {user.role === 'admin' ? '👑 ' : ''}{username}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
