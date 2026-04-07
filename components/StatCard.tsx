'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  label: string
  sublabel?: string
  value: number
  prefix?: string
  suffix?: string
  format?: 'number' | 'currency'
  accent?: string
}

function formatValue(n: number, format: 'number' | 'currency'): string {
  if (format === 'currency') {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
    return `$${n.toLocaleString()}`
  }
  return n.toLocaleString()
}

export default function StatCard({
  label,
  sublabel,
  value,
  prefix = '',
  suffix = '',
  format = 'number',
  accent = 'text-white',
}: Props) {
  const [displayValue, setDisplayValue] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0)
      return
    }
    const duration = 800
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * value))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [value])

  const formatted =
    format === 'currency'
      ? formatValue(displayValue, 'currency')
      : `${prefix}${displayValue.toLocaleString()}${suffix}`

  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-1 hover:border-[#2a2a2a] transition-colors">
      <div className="text-sm text-gray-300 uppercase tracking-widest font-semibold">{label}</div>
      {sublabel && <div className="text-sm text-gray-400 -mt-0.5">{sublabel}</div>}
      <div className={`text-4xl font-black tabular-nums mt-1 ${accent}`}>{formatted}</div>
    </div>
  )
}
