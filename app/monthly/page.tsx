export const dynamic = 'force-dynamic'

import Nav from '@/components/Nav'
import MonthCompareChart from '@/components/MonthCompareChart'
import GoalPaceChart from '@/components/GoalPaceChart'
import CollapsibleMonth from '@/components/CollapsibleMonth'
import { getAllScorecards } from '@/lib/parseScorecard'
import { getMonthlySummary } from '@/lib/parseMonthlySummary'
import { getMonthlyStats } from '@/lib/closeApi'

const CURRENT_MONTH = '2026-04'
const CURRENT_MONTH_LABEL = 'April 2026'
const PREV_MONTH = '2026-03'
const PREV_MONTH_LABEL = 'March 2026'
const GOAL_ARR = 170_000    // $170K ARR monthly goal
const GOAL_SETS = 30        // JC sets goal
const GOAL_DEALS = 10       // Joe deals closed goal

function formatRevenue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

export default async function MonthlyPage() {
  const allCards = getAllScorecards()
  const prevSummary = getMonthlySummary()  // March 2026 data
  const liveMonthly = await getMonthlyStats()

  const currentCards = allCards.filter(c => c.date.startsWith(CURRENT_MONTH))
  const prevCards = allCards.filter(c => c.date.startsWith(PREV_MONTH))

  // Current month stats — all from local JSON (scraper pulls live Close data + scorecard file counts)
  // These are current-month only, no all-time bleed
  const currentRevenue = liveMonthly.revenue
  const currentDeals = liveMonthly.deals
  const currentSets = liveMonthly.sets        // JC's booked meetings this month (Close API)
  const callsScored = liveMonthly.callsScored // Scorecard files with this-month ET birthtime
  const avgScore = liveMonthly.avgScore       // Avg score of those files

  // AE + SDR avg scores from scorecard files this month
  const currentAECards = currentCards.filter(c => c.type === 'AE')
  const currentSDRCards = currentCards.filter(c => c.type === 'SDR')
  const currentAvgAE = currentAECards.length
    ? Math.round(currentAECards.reduce((s, c) => s + c.score, 0) / currentAECards.length)
    : 0
  const currentAvgSDR = currentSDRCards.length
    ? Math.round(currentSDRCards.reduce((s, c) => s + c.score, 0) / currentSDRCards.length)
    : 0

  // Prev month stats from monthly-summary.json
  const prevRevenue = prevSummary?.joe?.closedAnnualRevenue ?? 0
  const prevDeals = prevSummary?.joe?.dealsCount ?? 0
  const prevSets = prevSummary?.jc?.growthSessionsSet ?? 0
  const prevCalls = prevSummary?.totalCallsScored ?? prevCards.length
  const prevAvgAE = prevSummary?.avgAEScore ?? 0
  const prevAvgSDR = prevSummary?.avgSDRScore ?? 0

  // Days elapsed in current month
  const etDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const today = new Date(etDateStr + 'T12:00:00')
  const daysElapsed = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const paceMultiplier = daysInMonth / daysElapsed

  // Pace-adjusted projections
  const projectedRevenue = Math.round(currentRevenue * paceMultiplier)
  const projectedSets = Math.round(currentSets * paceMultiplier)
  const projectedDeals = Math.round(currentDeals * paceMultiplier)
  const projectedCalls = Math.round(callsScored * paceMultiplier)

  // Pace vs last month (used in comparison table)
  const revPacePct = prevRevenue > 0 ? ((projectedRevenue - prevRevenue) / prevRevenue) * 100 : 0
  const setsPacePct = prevSets > 0 ? ((projectedSets - prevSets) / prevSets) * 100 : 0
  const dealsPacePct = prevDeals > 0 ? ((projectedDeals - prevDeals) / prevDeals) * 100 : 0
  const callsPacePct = prevCalls > 0 ? ((projectedCalls - prevCalls) / prevCalls) * 100 : 0

  // Pace vs this month's goal (used in Revenue card header)
  const revGoalPct = GOAL_ARR > 0 ? ((projectedRevenue - GOAL_ARR) / GOAL_ARR) * 100 : 0

  // Daily chart data for current month
  const byDate: Record<string, { date: string; calls: number; totalScore: number }> = {}
  for (const card of currentCards) {
    if (!byDate[card.date]) {
      byDate[card.date] = { date: card.date, calls: 0, totalScore: 0 }
    }
    byDate[card.date].calls++
    byDate[card.date].totalScore += card.score
  }
  const dailyData = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      date: d.date.slice(5).replace('-', '/'),  // "04/01"
      calls: d.calls,
      avgScore: Math.round(d.totalScore / d.calls),
    }))

  // Build comparison chart data — avg score by day-of-month
  const scoreByDay = (cards: typeof allCards) => {
    const byDay: Record<number, { total: number; count: number }> = {}
    for (const card of cards) {
      const day = parseInt(card.date.slice(8))
      if (!byDay[day]) byDay[day] = { total: 0, count: 0 }
      byDay[day].total += card.score
      byDay[day].count++
    }
    return byDay
  }
  const currentByDay = scoreByDay(currentCards)
  const prevByDay = scoreByDay(prevCards)
  const allDays = Array.from(new Set([
    ...Object.keys(currentByDay).map(Number),
    ...Object.keys(prevByDay).map(Number),
  ])).sort((a, b) => a - b)
  const compareData = allDays.map(day => ({
    day,
    current: currentByDay[day] ? Math.round(currentByDay[day].total / currentByDay[day].count) : undefined,
    prev: prevByDay[day] ? Math.round(prevByDay[day].total / prevByDay[day].count) : undefined,
  }))

  const goalProgress = GOAL_ARR > 0 ? Math.min((currentRevenue / GOAL_ARR) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-1">Monthly</p>
          <h1 className="text-4xl font-black text-white tracking-tight">{CURRENT_MONTH_LABEL}</h1>
          <p className="text-gray-400 text-sm mt-1">Day {daysElapsed} of {daysInMonth} · {Math.round((daysElapsed / daysInMonth) * 100)}% through the month</p>
        </div>

        {/* ── MTD SCOREBOARD ─────────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            Month-to-Date
          </p>

          {/* Revenue progress */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 mb-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Revenue Closed</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-white tabular-nums">
                    {formatRevenue(currentRevenue)}
                  </span>
                  <span className="text-gray-400 mb-1 text-sm">ARR</span>
                </div>
                {GOAL_ARR > 0 && (
                  <p className="text-gray-400 text-xs mt-1">
                    Goal: {formatRevenue(GOAL_ARR)} · {Math.round(goalProgress)}% there
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">vs {CURRENT_MONTH_LABEL} goal</p>
                <PaceArrow pct={revGoalPct} />
                <p className="text-gray-400 text-xs mt-1">Proj: {formatRevenue(projectedRevenue)}</p>
              </div>
            </div>
            <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full bar-fill transition-all"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox
              label="Sets MTD"
              sublabel="JC Ruiz"
              value={currentSets}
              projected={projectedSets}
              prev={prevSets}
              pacePct={setsPacePct}
            />
            <StatBox
              label="Deals Won"
              sublabel="Joe Meyers"
              value={currentDeals}
              projected={projectedDeals}
              prev={prevDeals}
              pacePct={dealsPacePct}
            />
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Avg Score · AE</p>
              <p className="text-gray-400 text-xs mb-3">Joe Meyers</p>
              <p className="text-4xl font-black tabular-nums text-white">
                {currentAvgAE || '—'}
              </p>

            </div>
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Avg Score · SDR</p>
              <p className="text-gray-400 text-xs mb-3">JC Ruiz</p>
              <p className="text-4xl font-black tabular-nums text-white">
                {currentAvgSDR || '—'}
              </p>

            </div>
          </div>
        </section>

        {/* ── GOAL PACE CHART ────────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            {CURRENT_MONTH_LABEL} · Pace to Goal
          </p>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
            <GoalPaceChart
              pacePct={(daysElapsed / daysInMonth) * 100}
              daysElapsed={daysElapsed}
              daysInMonth={daysInMonth}
              metrics={[
                {
                  label: 'Revenue',
                  sublabel: 'Joe Meyers',
                  current: currentRevenue,
                  goal: GOAL_ARR,
                  format: 'currency',
                  color: 'bg-green-500',
                  alwaysColor: true,
                },
                {
                  label: 'Sets',
                  sublabel: 'JC Ruiz',
                  current: currentSets,
                  goal: GOAL_SETS,
                  format: 'number',
                  color: 'bg-blue-500',
                },
                {
                  label: 'Deals Won',
                  sublabel: 'Joe Meyers',
                  current: currentDeals,
                  goal: GOAL_DEALS,
                  format: 'number',
                  color: 'bg-amber-500',
                },
              ]}
            />
          </div>
        </section>

        {/* ── PACE VS LAST MONTH ─────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            April vs March Pace
          </p>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3">Metric</th>
                  <th className="text-right text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3">March (Actual)</th>
                  <th className="text-right text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3">April (MTD)</th>
                  <th className="text-right text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3">April (Proj)</th>
                </tr>
              </thead>
              <tbody>
                <PaceRow label="Revenue (ARR)" prev={formatRevenue(prevRevenue)} current={formatRevenue(currentRevenue)} projected={formatRevenue(projectedRevenue)} pct={revPacePct} />
                <PaceRow label="Sets (JC)" prev={String(prevSets)} current={String(currentSets)} projected={String(projectedSets)} pct={setsPacePct} />
                <PaceRow label="Deals Won (Joe)" prev={String(prevDeals)} current={String(currentDeals)} projected={String(projectedDeals)} pct={dealsPacePct} last />
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-xs mt-2 pl-1">
            * April projected based on {daysElapsed} day{daysElapsed !== 1 ? 's' : ''} elapsed (÷ {daysElapsed} × {daysInMonth})
          </p>
        </section>

        {/* ── MARCH (collapsible) ────────────────────────────── */}
        <CollapsibleMonth label="March 2026">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Revenue</p>
              <p className="text-gray-400 text-xs mb-3">Joe Meyers</p>
              <p className="text-4xl font-black text-white tabular-nums">{formatRevenue(prevRevenue)}</p>
              <p className="text-gray-400 text-xs mt-2">{prevDeals} deals closed</p>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Sets</p>
              <p className="text-gray-400 text-xs mb-3">JC Ruiz</p>
              <p className="text-4xl font-black text-white tabular-nums">{prevSets}</p>
              <p className="text-gray-400 text-xs mt-2">Growth Sessions booked</p>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Avg Score · AE</p>
              <p className="text-gray-400 text-xs mb-3">Joe Meyers</p>
              <p className="text-4xl font-black tabular-nums text-white">
                {prevAvgAE || '—'}
              </p>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Avg Score · SDR</p>
              <p className="text-gray-400 text-xs mb-3">JC Ruiz</p>
              <p className="text-4xl font-black tabular-nums text-white">
                {prevAvgSDR || '—'}
              </p>
            </div>
          </div>
          <GoalPaceChart
            pacePct={100}
            daysElapsed={31}
            daysInMonth={31}
            metrics={[
              { label: 'Revenue', sublabel: 'Joe Meyers', current: prevRevenue, goal: prevRevenue, format: 'currency', color: 'bg-green-500' },
              { label: 'Sets', sublabel: 'JC Ruiz', current: prevSets, goal: prevSets, format: 'number', color: 'bg-blue-500' },
              { label: 'Deals Won', sublabel: 'Joe Meyers', current: prevDeals, goal: prevDeals, format: 'number', color: 'bg-amber-500' },
            ]}
          />
        </CollapsibleMonth>



      </div>
    </div>
  )
}

function StatBox({
  label,
  sublabel,
  value,
  projected,
  prev,
  pacePct,
}: {
  label: string
  sublabel: string
  value: number
  projected: number
  prev: number
  pacePct: number
}) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
      <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">{label}</p>
      <p className="text-gray-400 text-xs mb-3">{sublabel}</p>
      <p className="text-4xl font-black text-white tabular-nums">{value}</p>
    </div>
  )
}

function PaceArrow({ pct }: { pct: number }) {
  const up = pct >= 0
  return (
    <span className={`text-sm font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>
      {up ? '↑' : '↓'} {Math.abs(Math.round(pct))}%
    </span>
  )
}

function PaceRow({
  label,
  prev,
  current,
  projected,
  pct,
  last,
}: {
  label: string
  prev: string
  current: string
  projected: string
  pct: number
  last?: boolean
}) {
  const up = pct >= 0
  return (
    <tr className={`${last ? '' : 'border-b border-[#141414]'} hover:bg-[#141414] transition-colors`}>
      <td className="px-5 py-3.5 text-gray-400">{label}</td>
      <td className="px-3 py-3.5 text-right text-gray-400 tabular-nums">{prev}</td>
      <td className="px-3 py-3.5 text-right text-white font-semibold tabular-nums">{current}</td>
      <td className="px-5 py-3.5 text-right">
        <span className="text-white tabular-nums">{projected}</span>
        <span className={`ml-2 text-xs font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>
          {up ? '↑' : '↓'}{Math.abs(Math.round(pct))}%
        </span>
      </td>
    </tr>
  )
}
