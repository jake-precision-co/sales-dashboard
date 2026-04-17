'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Today' },
  { href: '/yesterday', label: 'Yesterday' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/monthly', label: 'Monthly' },
  { href: '/log', label: 'Log' },
  { href: '/customer-voice', label: 'Voice' },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-0.5">
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? 'bg-white/10 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
