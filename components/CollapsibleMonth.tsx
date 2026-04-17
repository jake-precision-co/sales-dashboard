'use client'

import { useState } from 'react'

type Props = {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function CollapsibleMonth({ label, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#141414] transition-colors"
      >
        <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold">{label}</p>
        <span className={`text-gray-400 text-lg transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 space-y-6 border-t border-[#1a1a1a]">
          {children}
        </div>
      )}
    </div>
  )
}
