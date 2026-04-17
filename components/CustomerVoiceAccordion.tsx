'use client'

import { useState } from 'react'

interface Props {
  title: string
  emoji: string
  content: string
}

export default function CustomerVoiceAccordion({ title, emoji, content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[#1a1a1a] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#111] hover:bg-[#161616] transition-colors text-left"
      >
        <span className="text-white font-semibold text-base tracking-wide">
          {emoji} {title}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="bg-[#0d0d0d] border-t border-[#1a1a1a] px-5 py-5">
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {content}
          </pre>
        </div>
      )}
    </div>
  )
}
