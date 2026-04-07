'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function LogFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      router.push(`/log?${next.toString()}`)
    },
    [params, router]
  )

  const rep    = params.get('rep')    ?? ''
  const type   = params.get('type')   ?? ''
  const score  = params.get('score')  ?? ''
  const from   = params.get('from')   ?? ''
  const to     = params.get('to')     ?? ''

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Rep filter */}
      <select
        value={rep}
        onChange={e => update('rep', e.target.value)}
        className="bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#333] cursor-pointer"
      >
        <option value="">All Reps</option>
        <option value="Joe Meyers">Joe (AE)</option>
        <option value="JC Ruiz">JC (SDR)</option>
      </select>

      {/* Type filter */}
      <select
        value={type}
        onChange={e => update('type', e.target.value)}
        className="bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#333] cursor-pointer"
      >
        <option value="">AE + SDR</option>
        <option value="AE">AE Only</option>
        <option value="SDR">SDR Only</option>
      </select>

      {/* Score range */}
      <select
        value={score}
        onChange={e => update('score', e.target.value)}
        className="bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#333] cursor-pointer"
      >
        <option value="">All Scores</option>
        <option value="80+">🟢 80+ (Elite)</option>
        <option value="60-79">🟡 60–79 (Developing)</option>
        <option value="0-59">🔴 Under 60 (Needs Work)</option>
      </select>

      {/* Date range */}
      <input
        type="date"
        value={from}
        onChange={e => update('from', e.target.value)}
        className="bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-[#333] cursor-pointer [color-scheme:dark]"
        title="From date"
      />
      <input
        type="date"
        value={to}
        onChange={e => update('to', e.target.value)}
        className="bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-[#333] cursor-pointer [color-scheme:dark]"
        title="To date"
      />

      {/* Clear */}
      {(rep || type || score || from || to) && (
        <button
          onClick={() => router.push('/log')}
          className="text-sm text-gray-300 hover:text-white transition px-2 py-1"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
