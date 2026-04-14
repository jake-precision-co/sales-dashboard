import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Film Room · Precision',
  description: 'Sales war room — built to win.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-gray-100 antialiased leading-relaxed">
        {children}
      </body>
    </html>
  )
}
