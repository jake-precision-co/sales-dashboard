import { cookies } from 'next/headers'
import { getUser } from '@/lib/auth'
import { getAllScorecards } from '@/lib/parseScorecard'
import Link from 'next/link'

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 70) return 'text-green-400'
  if (pct >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

export default async function CallsPage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('user')?.value
  const user = getUser(username || '')

  let cards = getAllScorecards()
  if (user && user.role !== 'admin' && user.repName) {
    cards = cards.filter(c => c.rep === user.repName)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold text-white">All Calls</h1>
        <span className="text-gray-500 text-sm">({cards.length})</span>
      </div>

      <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Prospect</th>
              {user && user.role === 'admin' && <th className="px-6 py-3">Rep</th>}
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Score</th>
              <th className="px-6 py-3">Outcome</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition">
                <td className="px-6 py-4 text-sm text-gray-400">{card.date}</td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {card.prospect.split(' — ')[0]}
                  {card.prospect.includes(' — ') && (
                    <span className="text-gray-500 font-normal"> · {card.prospect.split(' — ').slice(1).join(' ')}</span>
                  )}
                </td>
                {user && user.role === 'admin' && <td className="px-6 py-4 text-sm text-gray-400">{card.rep}</td>}
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${card.type === 'AE' ? 'border-blue-500/30 text-blue-400 bg-blue-400/10' : 'border-purple-500/30 text-purple-400 bg-purple-400/10'}`}>
                    {card.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${scoreColor(card.score, card.maxScore)}`}>
                    {card.score}/{card.maxScore}
                  </span>
                  <span className="text-gray-600 text-xs ml-1">({card.score}/{card.maxScore})</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{card.outcome}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/calls/${card.id}`} className="text-blue-400 hover:text-blue-300 text-sm">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
