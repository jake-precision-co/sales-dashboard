'use client'

import { useRouter } from 'next/navigation'

export default function LeaderboardToggle({ activeTab }: { activeTab: 'ae' | 'sdr' }) {
  const router = useRouter()
  return (
    <div className="inline-flex bg-[#111] border border-[#1e1e1e] rounded-xl p-1 gap-1">
      <button
        onClick={() => router.push('/leaderboard')}
        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
          activeTab === 'ae'
            ? 'bg-white text-black shadow'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        AE
      </button>
      <button
        onClick={() => router.push('/leaderboard?tab=sdr')}
        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
          activeTab === 'sdr'
            ? 'bg-white text-black shadow'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        SDR
      </button>
    </div>
  )
}
