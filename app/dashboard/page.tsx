import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getAllScorecards, Scorecard } from '@/lib/parseScorecard'
import Link from 'next/link'

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 70) return 'text-green-400'
  if (pct >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function scoreBg(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 70) return 'bg-green-400/10 border-green-400/30 text-green-400'
  if (pct >= 50) return 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
  return 'bg-red-400/10 border-red-400/30 text-red-400'
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('user')?.value
  if (!username) redirect('/')
  const user = getUser(username)
  if (!user) redirect('/')

  let cards = getAllScorecards()

  // Filter by rep if not admin
  if (user.role !== 'admin' && user.repName) {
    cards = cards.filter(c => c.rep === user.repName)
  }

  const avgScore = cards.length
    ? Math.round(cards.reduce((sum, c) => sum + (c.score / c.maxScore) * 100, 0) / cards.length)
    : 0

  // Rep comparison for admin
  const joeCards = cards.filter(c => c.rep === 'Joe Meyers')
  const jcCards = cards.filter(c => c.rep === 'JC Ruiz')
  const joeAvg = joeCards.length ? Math.round(joeCards.reduce((s, c) => s + (c.score / c.maxScore) * 100, 0) / joeCards.length) : 0
  const jcAvg = jcCards.length ? Math.round(jcCards.reduce((s, c) => s + (c.score / c.maxScore) * 100, 0) / jcCards.length) : 0

  const recent = cards.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Total Calls Scored</p>
          <p className="text-3xl font-bold text-white mt-1">{cards.length}</p>
        </div>
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Average Score</p>
          <p className={`text-3xl font-bold mt-1 ${scoreColor(avgScore, 100)}`}>{avgScore}%</p>
        </div>
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-3xl font-bold text-white mt-1">
            {cards.filter(c => c.date.startsWith('2026-03')).length}
          </p>
        </div>
      </div>

      {/* Rep Comparison — admin only */}
      {user.role === 'admin' && (
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Rep Comparison</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Joe Meyers (AE) — {joeCards.length} calls</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${joeAvg >= 70 ? 'bg-green-500' : joeAvg >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${joeAvg}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${scoreColor(joeAvg, 100)}`}>{joeAvg}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">JC Ruiz (SDR) — {jcCards.length} calls</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${jcAvg >= 70 ? 'bg-green-500' : jcAvg >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${jcAvg}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${scoreColor(jcAvg, 100)}`}>{jcAvg}%</span>
              </div>
            </div>
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
                    {Math.round((card.score / card.maxScore) * 100)}%
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
