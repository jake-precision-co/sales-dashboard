import Nav from '@/components/Nav'
import LogFilters from '@/components/LogFilters'
import { getAllScorecards, scoreColorClass, typeBadgeStyle } from '@/lib/parseScorecard'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{
    rep?: string
    type?: string
    score?: string
    from?: string
    to?: string
  }>
}) {
  const { rep, type, score, from, to } = await searchParams

  let cards = getAllScorecards()

  // Apply filters
  if (rep) {
    cards = cards.filter(c => c.rep.toLowerCase().includes(rep.toLowerCase()))
  }
  if (type) {
    cards = cards.filter(c => c.type === type)
  }
  if (score) {
    if (score === '80+') {
      cards = cards.filter(c => c.score >= 80)
    } else if (score === '60-79') {
      cards = cards.filter(c => c.score >= 60 && c.score < 80)
    } else if (score === '0-59') {
      cards = cards.filter(c => c.score < 60)
    }
  }
  if (from) {
    cards = cards.filter(c => c.date >= from)
  }
  if (to) {
    cards = cards.filter(c => c.date <= to)
  }

  const hasFilters = !!(rep || type || score || from || to)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-1">
              All Calls
            </p>
            <h1 className="text-4xl font-black text-white tracking-tight">Call Log</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">
              {cards.length} call{cards.length !== 1 ? 's' : ''}
              {hasFilters && ' (filtered)'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-10" />}>
          <LogFilters />
        </Suspense>

        {/* Call list */}
        {cards.length === 0 ? (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-sm">No calls match your filters.</p>
            <Link href="/log" className="text-gray-400 hover:text-gray-200 text-sm mt-2 inline-block transition">
              Clear filters →
            </Link>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3">Date</th>
                  <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3">Prospect</th>
                  <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden sm:table-cell">Rep</th>
                  <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden md:table-cell">Type</th>
                  <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden lg:table-cell">Outcome</th>
                  <th className="text-right text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card, i) => (
                  <tr
                    key={card.id}
                    className={`border-b border-[#141414] hover:bg-[#141414] transition-colors ${i === cards.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-3.5 text-gray-400 text-xs tabular-nums whitespace-nowrap">
                      {card.date}
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        href={`/scorecard/${card.id}`}
                        className="text-gray-200 hover:text-white transition font-medium"
                      >
                        {card.prospectName}
                      </Link>
                      {card.company && (
                        <p className="text-gray-400 text-xs mt-0.5">{card.company}</p>
                      )}
                      {card.magicMoment && (
                        <p className="text-gray-400 text-xs mt-0.5 italic truncate max-w-[300px] hidden xl:block">
                          "{card.magicMoment}"
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-gray-400 text-sm hidden sm:table-cell whitespace-nowrap">
                      {card.rep.split(' ')[0]}
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center"
                        style={typeBadgeStyle(card.type)}
                      >
                        {card.type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-gray-400 text-xs hidden lg:table-cell max-w-[200px] truncate">
                      {card.outcome}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <span className={`text-xl font-black tabular-nums ${scoreColorClass(card.score)}`}>
                        {card.score}
                      </span>
                      <span className="text-gray-400 text-xs ml-0.5">/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Score legend */}
        <div className="flex items-center gap-5 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> 80+ Elite</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> 60–79 Developing</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Under 60 Needs Work</span>
        </div>

      </div>
    </div>
  )
}
