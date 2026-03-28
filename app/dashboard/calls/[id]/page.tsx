import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getScorecardById } from '@/lib/parseScorecard'
import Link from 'next/link'
import SectionChart from '@/components/SectionChart'

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 70) return 'text-green-400'
  if (pct >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function scoreBadge(score: number, max: number) {
  const pct = (score / max) * 100
  if (pct >= 70) return 'bg-green-400/10 border-green-400/30 text-green-400'
  if (pct >= 50) return 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
  return 'bg-red-400/10 border-red-400/30 text-red-400'
}

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const username = cookieStore.get('user')?.value
  if (!username) redirect('/')
  const user = getUser(username)
  if (!user) redirect('/')

  const card = getScorecardById(id)
  if (!card) notFound()

  // Access control
  if (user.role !== 'admin' && user.repName && card.rep !== user.repName) {
    redirect('/dashboard')
  }

  const pct = Math.round((card.score / card.maxScore) * 100)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/calls" className="text-gray-500 hover:text-gray-300 text-sm">← All Calls</Link>
      </div>

      {/* Header */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{card.prospect.split(' — ')[0]}</h1>
            {card.prospect.includes(' — ') && (
              <p className="text-gray-400 mt-0.5">{card.prospect.split(' — ').slice(1).join(' — ')}</p>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-sm text-gray-500">{card.date}</span>
              <span className="text-gray-700">·</span>
              <span className="text-sm text-gray-500">{card.rep}</span>
              <span className="text-gray-700">·</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${card.type === 'AE' ? 'border-blue-500/30 text-blue-400 bg-blue-400/10' : 'border-purple-500/30 text-purple-400 bg-purple-400/10'}`}>
                {card.type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${scoreColor(card.score, card.maxScore)}`}>{pct}%</div>
            <div className="text-gray-500 text-sm mt-1">{card.score} / {card.maxScore} pts</div>
            <div className={`mt-2 text-xs px-3 py-1 rounded-full border inline-block ${scoreBadge(card.score, card.maxScore)}`}>
              {pct >= 70 ? '🟢 Strong' : pct >= 50 ? '🟡 Developing' : '🔴 Needs Work'}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <span className="text-sm text-gray-500">Outcome: </span>
          <span className="text-sm text-white font-medium">{card.outcome}</span>
        </div>
      </div>

      {/* Section Breakdown */}
      {card.sections.length > 0 && (
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Section Breakdown</h2>
          <SectionChart sections={card.sections} />

          <div className="mt-6 space-y-2">
            {card.sections.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{s.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${Math.round((s.score / s.max) * 100) >= 70 ? 'bg-green-500' : Math.round((s.score / s.max) * 100) >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.round((s.score / s.max) * 100)}%` }}
                    />
                  </div>
                  <span className={`font-medium w-14 text-right ${scoreColor(s.score, s.max)}`}>
                    {s.score}/{s.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
