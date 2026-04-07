'use client'

import { useEffect, useState } from 'react'

type CloseData = {
  joeAnnualRevenue: number
  joeDealsCount: number
  month: string
}

export default function LiveStats({ role }: { role: string }) {
  const [data, setData] = useState<CloseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/close')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-32 mb-3" />
      <div className="h-10 bg-gray-800 rounded w-40" />
    </div>
  )

  if (!data) return null

  return (
    <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-400 text-sm">Joe — Closed ARR</p>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">Live · {data.month}</span>
      </div>
      <p className="text-4xl font-bold text-green-400">
        ${data.joeAnnualRevenue.toLocaleString()}
        <span className="text-lg text-gray-400">/yr</span>
      </p>
      <p className="text-gray-400 text-xs mt-2">{data.joeDealsCount} deal{data.joeDealsCount !== 1 ? 's' : ''} closed this month</p>
    </div>
  )
}
