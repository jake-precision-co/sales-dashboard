import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Precision Film Room',
  description: 'Sales call dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-gray-100">{children}</body>
    </html>
  )
}
