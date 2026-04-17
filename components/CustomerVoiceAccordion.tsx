'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  title: string
  emoji: string
  content: string
}

const mdComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-white mt-6 mb-2 pt-4 border-t border-[#2a2a2a] first:mt-0 first:pt-0 first:border-t-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-white mt-4 mb-1">
      {children}
    </h3>
  ),
  p: ({ children }) => {
    // Detect pull quotes: lines starting with " or "
    const text = typeof children === 'string' ? children : ''
    const isPullQuote = text.startsWith('\u201c') || text.startsWith('"')
    if (isPullQuote) {
      return (
        <p className="border-l-2 border-white/50 pl-3 my-3 text-white text-sm leading-relaxed italic">
          {children}
        </p>
      )
    }
    return (
      <p className="text-gray-300 text-sm leading-relaxed my-2">{children}</p>
    )
  },
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-gray-400 italic">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 my-2 pl-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1 my-2 pl-2">
      {children}
    </ol>
  ),
  li: ({ children }) => {
    // Check if the li starts with a pull quote
    const firstChild = Array.isArray(children) ? children[0] : children
    const text = typeof firstChild === 'string' ? firstChild : ''
    const isPullQuote = text.startsWith('\u201c') || text.startsWith('"')
    if (isPullQuote) {
      return (
        <li className="border-l-2 border-white/50 pl-3 my-2 text-white italic list-none">
          {children}
        </li>
      )
    }
    return <li className="text-gray-300">{children}</li>
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/30 pl-4 my-3 italic text-gray-200">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-[#2a2a2a] my-4" />,
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
        <div className="bg-[#0d0d0d] border-t border-[#1a1a1a] px-5 py-5 max-h-[70vh] overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
