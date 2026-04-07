import { cookies } from 'next/headers'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import NavLinks from '@/components/NavLinks'
import LogoutButton from '@/components/LogoutButton'

export default async function Nav() {
  const cookieStore = await cookies()
  const username = cookieStore.get('user')?.value ?? ''
  const user = getUser(username)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center transition group-hover:bg-gray-100">
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-black text-white text-sm tracking-widest hidden sm:block">
              FILM ROOM
            </span>
          </Link>

          {/* Nav links (client component for active state) */}
          <NavLinks />

          {/* User info + logout */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-300 hidden sm:block">
              {user?.role === 'admin' ? '👑 ' : ''}{username}
            </span>
            <LogoutButton />
          </div>

        </div>
      </div>
    </nav>
  )
}
