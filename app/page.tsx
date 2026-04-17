import Link from 'next/link'
import Nav from '@/components/Nav'
import StatCard from '@/components/StatCard'
import TodayScorecardCard from '@/components/TodayScorecardCard'
import { getAllScorecards, scoreColorClass, typeBadgeStyle } from '@/lib/parseScorecard'
import { getTodayStats } from '@/lib/closeApi'

/** Calendar date in America/New_York as YYYY-MM-DD (en-CA yields ISO-like ordering). */
function todayEtYmd(date: Date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00Z')
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toUpperCase()
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).toUpperCase()
  const year = d.getFullYear()
  return { weekday, monthDay, year }
}

/** YYYY-MM-DD from scorecard → short label (call date is stored as calendar day). */
function formatScorecardDay(ymd: string) {
  const d = new Date(ymd + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Returns the next Close sync time label in ET (12 PM, 4:30 PM, 7 PM Mon-Fri) */
function nextSyncLabel(): string {
  const now = new Date()
  const etStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now)
  // Parse ET hour/minute
  const [, time] = etStr.split(', ')
  const [h, m] = (time ?? '').split(':').map(Number)
  const minutesNow = (h ?? 0) * 60 + (m ?? 0)
  const dow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' })).getDay() // 0=Sun

  const isWeekday = dow >= 1 && dow <= 5
  if (!isWeekday) return 'Monday at 12:00 PM ET'

  const syncs = [{ label: '12:00 PM ET', mins: 12 * 60 }, { label: '4:30 PM ET', mins: 16 * 60 + 30 }, { label: '7:00 PM ET', mins: 19 * 60 }]
  const next = syncs.find(s => s.mins > minutesNow)
  return next ? next.label : 'Monday at 12:00 PM ET'
}

export default async function TodayPage() {
  const TODAY = todayEtYmd()
  const allCards = getAllScorecards()
  const todayCards = allCards.filter(c => c.scoredDate === TODAY)
  const callOfTheDay = todayCards.length
    ? todayCards.reduce((best, c) => (c.score > best.score ? c : best), todayCards[0])
    : null

  const stats = await getTodayStats()
  const { weekday, monthDay, year } = formatDate(TODAY)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Date display */}
          <div className="pt-2">
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-1">{weekday}</p>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
              {monthDay}
            </h1>
            <p className="text-gray-400 text-xl font-light mt-1">{year}</p>

            <div className="mt-6 flex gap-3">
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-2 text-sm">
                <span className="text-gray-400">Calls scored today: </span>
                <span className="text-white font-bold">{todayCards.length}</span>
              </div>
              <Link
                href="/log"
                className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-[#333] transition"
              >
                View all →
              </Link>
            </div>
          </div>

          {/* Call of the day */}
          <div>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-3">
              Call of the Day
            </p>
            {callOfTheDay ? (
              <TodayScorecardCard card={callOfTheDay} featured />
            ) : (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm">No calls scored today yet.</p>
                <p className="text-gray-400 text-xs mt-1">Check back after the next review.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── LIVE STATS ───────────────────────────────────────── */}
        <section>
          <div className="mb-4 space-y-1">
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold">
              Live Today — Close CRM
            </p>
            <p className="text-gray-300 text-sm">
              Next sync at {nextSyncLabel()} — hustle until then.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Dials"
              sublabel="JC Ruiz"
              value={stats.dials}
              accent="text-white"
            />
            <StatCard
              label="Sets"
              sublabel="JC Ruiz"
              value={stats.sets}
              accent="text-white"
            />
            <StatCard
              label="Closes"
              sublabel="Joe Meyers"
              value={stats.closes}
              accent="text-white"
            />
            <StatCard
              label="Revenue"
              sublabel="Joe Meyers"
              value={stats.revenue}
              format="currency"
              accent="text-white"
            />
          </div>
        </section>

        {/* ── TODAY'S SCORED CALLS ─────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold">
              Today&apos;s Scored Calls
            </p>
            {todayCards.length > 0 && (
              <span className="text-gray-400 text-xs">{todayCards.length} call{todayCards.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {todayCards.length === 0 ? (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-10 text-center">
              <p className="text-gray-400">No scorecards for today.</p>
              <Link href="/log" className="text-gray-400 hover:text-gray-200 text-sm mt-2 inline-block transition">
                Browse all calls →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayCards.map(card => (
                <TodayScorecardCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </section>

        {/* ── RECENT CALLS (latest scored, including today) ───── */}
        <RecentCallsSection allCards={allCards} todayYmd={TODAY} />

      </div>
    </div>
  )
}

function RecentCallsSection({
  allCards,
  todayYmd,
}: {
  allCards: ReturnType<typeof getAllScorecards>
  todayYmd: string
}) {
  const recent = [...allCards]
    .filter(c => c.scoredDate <= todayYmd)
    .sort((a, b) => {
      const byScored = b.scoredDate.localeCompare(a.scoredDate)
      if (byScored !== 0) return byScored
      return b.date.localeCompare(a.date)
    })
    .slice(0, 8)

  if (!recent.length) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold">
          Recent Calls
        </p>
        <Link href="/log" className="text-xs text-gray-400 hover:text-gray-200 transition">
          See all →
        </Link>
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 sm:px-4 py-3 w-[1%] whitespace-nowrap">
                Scored
              </th>
              <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 w-[1%] whitespace-nowrap hidden sm:table-cell">
                Call
              </th>
              <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3">Prospect</th>
              <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden sm:table-cell">Rep</th>
              <th className="text-left text-sm text-gray-400 uppercase tracking-widest font-semibold px-3 py-3 hidden md:table-cell">Type</th>
              <th className="text-right text-sm text-gray-400 uppercase tracking-widest font-semibold px-5 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((card, i) => (
              <tr
                key={card.id}
                className={`border-b border-[#141414] hover:bg-[#141414] transition-colors ${i === recent.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-3 sm:px-4 py-3 text-gray-200 text-sm tabular-nums align-top">
                  {formatScorecardDay(card.scoredDate)}
                </td>
                <td className="px-3 py-3 text-gray-300 text-sm tabular-nums align-top hidden sm:table-cell">
                  {formatScorecardDay(card.date)}
                </td>
                <td className="px-3 py-3">
                  <Link href={`/scorecard/${card.id}`} className="text-gray-300 hover:text-white transition font-medium truncate block max-w-[160px]">
                    {card.prospectName}
                  </Link>
                  {card.company && <span className="text-gray-400 text-xs">{card.company}</span>}
                  <p className="text-gray-300 text-xs tabular-nums mt-1 sm:hidden">
                    Call {formatScorecardDay(card.date)}
                  </p>
                </td>
                <td className="px-3 py-3 text-gray-300 text-sm hidden sm:table-cell">{card.rep.split(' ')[0]}</td>
                <td className="px-3 py-3 hidden md:table-cell">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center"
                    style={typeBadgeStyle(card.type)}
                  >
                    {card.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className={`font-black text-base tabular-nums ${scoreColorClass(card.score)}`}>
                    {card.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
