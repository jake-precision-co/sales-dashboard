import Nav from '@/components/Nav'
import LeaderboardToggle from '@/components/LeaderboardToggle'
import { getAELeaderboard, getSDRLeaderboard } from '@/lib/parseLeaderboard'
import { getAllScorecards, scoreColorClass } from '@/lib/parseScorecard'
import { getRecords } from '@/lib/closeApi'
import Link from 'next/link'

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function formatRevenue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab: 'ae' | 'sdr' = tab === 'sdr' ? 'sdr' : 'ae'

  const aeBoard = getAELeaderboard()
  const sdrBoard = getSDRLeaderboard()
  const board = activeTab === 'ae' ? aeBoard : sdrBoard

  // Revenue records from local JSON
  const records = await getRecords()

  // Compute stats from scorecards
  const allCards = getAllScorecards()
  const aeCards = allCards.filter(c => c.type === 'AE')
  const sdrCards = allCards.filter(c => c.type === 'SDR')

  // Dynamic top 5 — sorted from scorecard files directly, always current
  const activeCards = activeTab === 'ae' ? aeCards : sdrCards
  const top5 = [...activeCards]
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((c, i) => ({ ...c, rank: i + 1 }))

  function avgScore(cards: typeof allCards) {
    if (!cards.length) return 0
    return Math.round(cards.reduce((s, c) => s + c.score, 0) / cards.length)
  }

  const thisMonth = '2026-04'
  const aeMonth = aeCards.filter(c => c.date.startsWith(thisMonth))
  const sdrMonth = sdrCards.filter(c => c.date.startsWith(thisMonth))

  // Best single-day stats from scorecards
  function bestDayStats(cards: typeof allCards) {
    const byDay: Record<string, typeof allCards> = {}
    for (const c of cards) {
      byDay[c.date] = byDay[c.date] ?? []
      byDay[c.date].push(c)
    }
    let bestCount = 0, bestAvg = 0, bestDate = ''
    for (const [date, day] of Object.entries(byDay)) {
      if (day.length > bestCount) {
        bestCount = day.length
        bestDate = date
      }
      const avg = Math.round(day.reduce((s, c) => s + c.score, 0) / day.length)
      if (avg > bestAvg) bestAvg = avg
    }
    return { bestCount, bestDate, bestAvg }
  }

  const aeDayStats = bestDayStats(aeCards)
  const sdrDayStats = bestDayStats(sdrCards)

  // All-time best score
  const aeAllTimeBest = aeCards.length ? Math.max(...aeCards.map(c => c.score)) : 0
  const sdrAllTimeBest = sdrCards.length ? Math.max(...sdrCards.map(c => c.score)) : 0

  // Monthly best
  const aeMonthBest = aeCards.length
    ? Object.entries(
        aeCards.reduce((acc, c) => {
          const m = c.date.slice(0, 7)
          acc[m] = (acc[m] ?? 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]
    : null

  const sdrMonthBest = sdrCards.length
    ? Object.entries(
        sdrCards.reduce((acc, c) => {
          const m = c.date.slice(0, 7)
          acc[m] = (acc[m] ?? 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]
    : null

  const active = activeTab === 'ae'
  const repName = active ? 'Joe Meyers' : 'JC Ruiz'
  const repCards = active ? aeCards : sdrCards
  const repMonthCards = active ? aeMonth : sdrMonth
  const dayStats = active ? aeDayStats : sdrDayStats
  const allTimeBest = active ? aeAllTimeBest : sdrAllTimeBest
  const monthBest = active ? aeMonthBest : sdrMonthBest

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-1">
              Rankings
            </p>
            <h1 className="text-4xl font-black text-white tracking-tight">Leaderboard</h1>
          </div>
          <LeaderboardToggle activeTab={activeTab} />
        </div>

        {/* ── TOP-LEVEL RECORDS ──────────────────────────────── */}
        <section>
          {activeTab === 'ae' ? (
            <>
              <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
                Revenue Records · Joe Meyers
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                    💰 Best Day Revenue
                  </p>
                  <p className="text-4xl font-black text-green-400 tabular-nums">
                    {formatRevenue(records.bestDayRevenue.amount)}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {records.bestDayRevenue.rep} · {records.bestDayRevenue.date || '—'}
                  </p>
                </div>
                <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                    📅 Best Month Revenue
                  </p>
                  <p className="text-4xl font-black text-green-400 tabular-nums">
                    {formatRevenue(records.bestMonthRevenue.amount)}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {records.bestMonthRevenue.rep} · {records.bestMonthRevenue.month || '—'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
                Sets Records · JC Ruiz
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                    📞 Best Day Sets
                  </p>
                  <p className="text-4xl font-black text-emerald-400 tabular-nums">
                    {records.bestDaySets.amount}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {records.bestDaySets.rep} · {records.bestDaySets.date || '—'}
                  </p>
                </div>
                <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                    📅 Best Month Sets
                  </p>
                  <p className="text-4xl font-black text-emerald-400 tabular-nums">
                    {records.bestMonthSets.amount}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {records.bestMonthSets.rep} · {records.bestMonthSets.month || '—'}
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ── TOP 5 RANKED CALLS ─────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            Top 5 All-Time · {activeTab.toUpperCase()} Calls
          </p>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {top5.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No entries yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3 w-12">#</th>
                    <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3">Rep</th>
                    <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3">Prospect</th>
                    <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden sm:table-cell">Outcome</th>
                    <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden lg:table-cell">Date</th>
                    <th className="text-right text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {top5.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-[#141414] hover:bg-[#141414] transition-colors ${i === top5.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <span className="text-xl">{RANK_ICONS[entry.rank] ?? entry.rank}</span>
                      </td>
                      <td className="px-3 py-4 text-gray-400 text-sm">{entry.rep.split(' ')[0]}</td>
                      <td className="px-3 py-4 font-medium">
                        <Link href={`/scorecard/${entry.id}`} className="text-white hover:text-amber-300 transition">
                          {entry.prospectName} →
                        </Link>
                        {entry.company && <p className="text-gray-500 text-xs mt-0.5">{entry.company}</p>}
                      </td>
                      <td className="px-3 py-4 text-gray-400 text-sm hidden sm:table-cell">{entry.outcome}</td>
                      <td className="px-3 py-4 text-gray-400 text-xs tabular-nums hidden lg:table-cell">{entry.date}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={`text-2xl font-black tabular-nums ${scoreColorClass(entry.score)}`}>
                          {entry.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ── RECORDS ────────────────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            Records · {repName}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* All-time best score */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                🏆 All-Time Best
              </p>
              <p className={`text-5xl font-black tabular-nums ${scoreColorClass(allTimeBest)}`}>
                {allTimeBest}
              </p>
              <p className="text-gray-400 text-xs mt-1">/ 100 score</p>
            </div>

            {/* Best day (calls volume) */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                📅 Best Day (Volume)
              </p>
              <p className="text-5xl font-black text-white tabular-nums">{dayStats.bestCount}</p>
              <p className="text-gray-400 text-xs mt-1">calls in one day · {dayStats.bestDate}</p>
            </div>

            {/* Best day avg score */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                📈 Best Day (Avg Score)
              </p>
              <p className={`text-5xl font-black tabular-nums ${scoreColorClass(dayStats.bestAvg)}`}>
                {dayStats.bestAvg}
              </p>
              <p className="text-gray-400 text-xs mt-1">average in single day</p>
            </div>

            {/* Best month by volume */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-3">
                🗓 Best Month
              </p>
              {monthBest ? (
                <>
                  <p className="text-5xl font-black text-white tabular-nums">{monthBest[1]}</p>
                  <p className="text-gray-400 text-xs mt-1">calls · {monthBest[0]}</p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">—</p>
              )}
            </div>
          </div>
        </section>

        {/* ── AVERAGE SCORES ─────────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            Average Call Score · {repName}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* All-time */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-4">All-Time</p>
              <div className="flex items-end gap-4">
                <span className={`text-6xl font-black tabular-nums ${scoreColorClass(avgScore(repCards))}`}>
                  {avgScore(repCards)}
                </span>
                <span className="text-gray-400 text-lg mb-1">/ 100</span>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bar-fill ${
                      avgScore(repCards) >= 80 ? 'bg-green-500' :
                      avgScore(repCards) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${avgScore(repCards)}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-2">{repCards.length} calls scored</p>
              </div>
            </div>

            {/* This month */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-4">
                This Month (April)
              </p>
              <div className="flex items-end gap-4">
                <span className={`text-6xl font-black tabular-nums ${
                  repMonthCards.length ? scoreColorClass(avgScore(repMonthCards)) : 'text-gray-400'
                }`}>
                  {repMonthCards.length ? avgScore(repMonthCards) : '—'}
                </span>
                {repMonthCards.length > 0 && <span className="text-gray-400 text-lg mb-1">/ 100</span>}
              </div>
              {repMonthCards.length > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bar-fill ${
                        avgScore(repMonthCards) >= 80 ? 'bg-green-500' :
                        avgScore(repMonthCards) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${avgScore(repMonthCards)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">{repMonthCards.length} calls scored this month</p>
                </div>
              )}
              {repMonthCards.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">No calls scored yet this month</p>
              )}
            </div>
          </div>
        </section>

        {/* ── FULL LEADERBOARD TABLE ──────────────────────────── */}
        {board.length > 5 && (
          <section>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
              Full Rankings · {activeTab.toUpperCase()} All-Time
            </p>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {board.slice(5).map((entry, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#141414] hover:bg-[#141414] transition-colors last:border-b-0"
                    >
                      <td className="px-5 py-3 text-gray-400 text-xs w-12">{entry.rank}</td>
                      <td className="px-3 py-3 text-gray-400 text-sm">{entry.rep}</td>
                      <td className="px-3 py-3 text-white">{entry.prospect}</td>
                      <td className="px-3 py-3 text-gray-400 text-sm hidden md:table-cell">{entry.company}</td>
                      <td className="px-3 py-3 text-gray-400 text-sm hidden sm:table-cell">{entry.outcome}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-black tabular-nums ${scoreColorClass(entry.score)}`}>
                          {entry.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
