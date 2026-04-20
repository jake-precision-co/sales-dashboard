export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Nav from '@/components/Nav'
import StatCard from '@/components/StatCard'
import { getAllScorecards, scoreColorClass, typeBadgeStyle } from '@/lib/parseScorecard'
import { getYesterdayStats } from '@/lib/closeApi'

/** Calendar today in ET as YYYY-MM-DD */
function todayEtYmd(date: Date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Previous business day in ET — on Monday, returns Friday (skips weekend). */
function yesterdayEtYmd(date: Date = new Date()): string {
  const ymd = todayEtYmd(date)
  const ref = new Date(`${ymd}T12:00:00.000Z`)
  ref.setUTCDate(ref.getUTCDate() - 1)
  // If we landed on Sunday (0), step back to Friday
  if (ref.getUTCDay() === 0) ref.setUTCDate(ref.getUTCDate() - 2)
  return ref.toISOString().slice(0, 10)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00Z')
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toUpperCase()
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).toUpperCase()
  const year = d.getFullYear()
  return { weekday, monthDay, year }
}

export default async function YesterdayPage() {
  const stats = await getYesterdayStats()

  const YESTERDAY = yesterdayEtYmd()

  const allCards = getAllScorecards()
  const yesterdayCards = allCards.filter(c => c.date === YESTERDAY)
  const callOfTheDay = yesterdayCards.length
    ? yesterdayCards.reduce((best, c) => (c.score > best.score ? c : best), yesterdayCards[0])
    : null

  const { weekday, monthDay, year } = formatDate(YESTERDAY)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Date display */}
          <div className="pt-2">
            {/* Yesterday badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-xs text-gray-400 font-semibold tracking-widest uppercase mb-3">
              ◀ Yesterday
            </div>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-1">{weekday}</p>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
              {monthDay}
            </h1>
            <p className="text-gray-400 text-xl font-light mt-1">{year}</p>

            <div className="mt-6 flex gap-3">
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-2 text-sm">
                <span className="text-gray-400">Calls scored: </span>
                <span className="text-white font-bold">{yesterdayCards.length}</span>
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
              Best Call · Yesterday
            </p>
            {callOfTheDay ? (
              <Link href={`/scorecard/${callOfTheDay.id}`} className="block group">
                <div className="bg-[#111] border border-[#222] rounded-2xl p-5 hover:border-[#333] transition-all glow-gold">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center"
                          style={typeBadgeStyle(callOfTheDay.type)}
                        >
                          {callOfTheDay.type}
                        </span>
                        <span className="text-gray-400 text-xs">Scored {callOfTheDay.scoredDate}</span>
                      </div>
                      <div className="text-gray-500 text-xs tabular-nums mb-0.5">Call: {callOfTheDay.date}</div>
                      <h2 className="text-white font-bold text-xl truncate">
                        {callOfTheDay.prospectName}
                      </h2>
                      <p className="text-gray-400 text-sm">{callOfTheDay.company || callOfTheDay.rep}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-5xl font-black tabular-nums ${scoreColorClass(callOfTheDay.score)}`}>
                        {callOfTheDay.score}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">/ 100</div>
                    </div>
                  </div>

                  {callOfTheDay.magicMoment && (
                    <div className="mt-4 border-t border-[#1a1a1a] pt-4">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">
                        ✦ Magic Moment
                      </p>
                      <p className="text-gray-300 text-sm italic leading-relaxed line-clamp-2">
                        &quot;{callOfTheDay.magicMoment}&quot;
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-200 transition">
                    <span>View full scorecard</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm">No calls scored yesterday.</p>
                <p className="text-gray-400 text-xs mt-1">Check the log for historical calls.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── YESTERDAY'S STATS ────────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            Yesterday — via Close CRM
          </p>
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

        {/* ── YESTERDAY'S SCORED CALLS ─────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold">
              Scored Calls · Yesterday
            </p>
            {yesterdayCards.length > 0 && (
              <span className="text-gray-400 text-xs">{yesterdayCards.length} call{yesterdayCards.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {yesterdayCards.length === 0 ? (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-10 text-center">
              <p className="text-gray-400">No scorecards for yesterday.</p>
              <Link href="/log" className="text-gray-400 hover:text-gray-200 text-sm mt-2 inline-block transition">
                Browse all calls →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {yesterdayCards.map(card => (
                <Link key={card.id} href={`/scorecard/${card.id}`} className="block group">
                  <div
                    className={`bg-[#111] border rounded-2xl p-5 h-full flex flex-col gap-3 hover:bg-[#141414] transition-all ${
                      card.score >= 80
                        ? 'border-green-500/20 hover:border-green-500/40'
                        : card.score >= 60
                        ? 'border-amber-500/20 hover:border-amber-500/40'
                        : 'border-red-500/20 hover:border-red-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center"
                            style={typeBadgeStyle(card.type)}
                          >
                            {card.type}
                          </span>
                          <span className="text-gray-400 text-xs">{card.rep.split(' ')[0]}</span>
                        </div>
                        <p className="text-white font-semibold truncate">{card.prospectName}</p>
                        <p className="text-gray-400 text-sm truncate">{card.company}</p>
                        <p className="text-gray-500 text-xs tabular-nums">Call: {card.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-3xl font-black tabular-nums ${scoreColorClass(card.score)}`}>
                          {card.score}
                        </div>
                        <div className="text-gray-400 text-xs">/ 100</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 bg-[#0f0f0f] rounded-lg px-3 py-1.5 truncate">
                      {card.outcome}
                    </div>

                    {card.magicMoment && (
                      <p className="text-gray-400 text-xs italic leading-relaxed line-clamp-2 flex-1">
                        &quot;{card.magicMoment}&quot;
                      </p>
                    )}

                    <div className="text-xs text-gray-400 group-hover:text-gray-200 transition">
                      Full scorecard →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
