import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getAllScorecards } from '@/lib/parseScorecard'
import { getAELeaderboard, getSDRLeaderboard } from '@/lib/parseLeaderboard'
import Link from 'next/link'
import LiveStats from '@/components/LiveStats'

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 70) return 'text-green-400'
  if (pct >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

const MEDALS = ['🥇', '🥈', '🥉']

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('user')?.value
  if (!username) redirect('/')
  const user = getUser(username)
  if (!user) redirect('/')

  let cards = getAllScorecards()
  if (user.role !== 'admin' && user.repName) {
    cards = cards.filter(c => c.rep === user.repName)
  }

  const avgScore = cards.length
    ? Math.round(cards.reduce((sum, c) => sum + (c.score / c.maxScore) * 100, 0) / cards.length)
    : 0

  const joeCards = cards.filter(c => c.rep === 'Joe Meyers')
  const jcCards = cards.filter(c => c.rep === 'JC Ruiz')
  const joeAvg = joeCards.length ? Math.round(joeCards.reduce((s, c) => s + (c.score / c.maxScore) * 100, 0) / joeCards.length) : 0
  const jcAvg = jcCards.length ? Math.round(jcCards.reduce((s, c) => s + (c.score / c.maxScore) * 100, 0) / jcCards.length) : 0
  const jcMeetingsBooked = jcCards.filter(c => c.meetingBooked).length

  const aeTop3 = getAELeaderboard().slice(0, 3)
  const sdrTop3 = getSDRLeaderboard().slice(0, 3)

  const recent = cards.slice(0, 5)
  const thisMonth = new Date().toISOString().slice(0, 7)

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Calls Scored</p>
          <p className="text-3xl font-bold text-white mt-1">{cards.length}</p>
        </div>
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Avg Score</p>
          <p className={`text-3xl font-bold mt-1 ${scoreColor(avgScore, 100)}`}>
            {avgScore}<span className="text-lg text-gray-500">/100</span>
          </p>
        </div>
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-3xl font-bold text-white mt-1">
            {cards.filter(c => c.date.startsWith(thisMonth)).length}
          </p>
        </div>
      </div>

      {/* Live Revenue + Sessions */}
      {(user.role === 'admin' || user.role === 'ae') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LiveStats role={user.role} />
          {user.role === 'admin' && (
            <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-500 text-sm">JC — Growth Sessions Set</p>
                <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">From scorecards</span>
              </div>
              <p className="text-4xl font-bold text-purple-400">{jcMeetingsBooked}</p>
              <p className="text-gray-600 text-xs mt-2">meetings booked from cold calls</p>
            </div>
          )}
        </div>
      )}

      {user.role === 'sdr' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-500 text-sm">Growth Sessions Set</p>
            <p className="text-4xl font-bold text-purple-400 mt-1">{jcMeetingsBooked}</p>
            <p className="text-gray-600 text-xs mt-2">meetings booked from cold calls</p>
          </div>
        </div>
      )}

      {/* Rep Comparison — admin only */}
      {user.role === 'admin' && (
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Rep Scores</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Joe Meyers (AE) — {joeCards.length} calls</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${joeAvg >= 70 ? 'bg-green-500' : joeAvg >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${joeAvg}%` }} />
                </div>
                <span className={`text-sm font-bold w-16 ${scoreColor(joeAvg, 100)}`}>{joeAvg}/100</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">JC Ruiz (SDR) — {jcCards.length} calls</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${jcAvg >= 70 ? 'bg-green-500' : jcAvg >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${jcAvg}%` }} />
                </div>
                <span className={`text-sm font-bold w-16 ${scoreColor(jcAvg, 100)}`}>{jcAvg}/100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Leaderboards */}
      {(user.role === 'admin' || user.role === 'ae') && aeTop3.length > 0 && (
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">🏆 Joe — Top 3 Calls</h2>
            <span className="text-xs text-gray-600">All time · by score</span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {aeTop3.map((entry, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{MEDALS[i]}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{entry.prospect}</p>
                    <p className="text-gray-500 text-xs">{entry.company} · {entry.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${scoreColor(entry.score, 100)}`}>
                    {entry.score}<span className="text-gray-600 text-xs">/100</span>
                  </span>
                  <p className="text-gray-600 text-xs">{entry.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(user.role === 'admin' || user.role === 'sdr') && sdrTop3.length > 0 && (
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">🏆 JC — Top 3 Calls</h2>
            <span className="text-xs text-gray-600">All time · by score</span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {sdrTop3.map((entry, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{MEDALS[i]}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{entry.prospect}</p>
                    <p className="text-gray-500 text-xs">{entry.company} · {entry.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${scoreColor(entry.score, 100)}`}>
                    {entry.score}<span className="text-gray-600 text-xs">/100</span>
                  </span>
                  <p className="text-gray-600 text-xs">{entry.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Calls */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Calls</h2>
          <Link href="/dashboard/calls" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Prospect</th>
              {user.role === 'admin' && <th className="px-6 py-3">Rep</th>}
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Score</th>
              <th className="px-6 py-3">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(card => (
              <tr key={card.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition">
                <td className="px-6 py-4 text-sm text-gray-400">{card.date}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/calls/${card.id}`} className="text-white hover:text-blue-400 text-sm font-medium">
                    {card.prospect.split(' — ')[0]}
                  </Link>
                </td>
                {user.role === 'admin' && <td className="px-6 py-4 text-sm text-gray-400">{card.rep}</td>}
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${card.type === 'AE' ? 'border-blue-500/30 text-blue-400 bg-blue-400/10' : 'border-purple-500/30 text-purple-400 bg-purple-400/10'}`}>
                    {card.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${scoreColor(card.score, card.maxScore)}`}>
                    {card.score}<span className="text-gray-600 text-xs">/{card.maxScore}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{card.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
