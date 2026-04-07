import Nav from '@/components/Nav'
import { getAllScorecards, getScorecardById, scoreColorClass, typeBadgeStyle } from '@/lib/parseScorecard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ScorecardPage({
  params,
}: {
  params: Promise<{ filename: string }>
}) {
  const { filename } = await params
  const scorecard = getScorecardById(filename)

  if (!scorecard) notFound()

  // Get prev/next navigation
  const all = getAllScorecards()
  const idx = all.findIndex(c => c.id === scorecard.id)
  const prev = idx < all.length - 1 ? all[idx + 1] : null
  const next = idx > 0 ? all[idx - 1] : null

  const pct = Math.round((scorecard.score / scorecard.maxScore) * 100)
  const color = scorecard.score >= 80 ? 'green' : scorecard.score >= 60 ? 'amber' : 'red'
  const colorClass = scoreColorClass(scorecard.score)
  const tierLabel = scorecard.tier
    ? `$${(scorecard.tier / 1000).toFixed(0)}K/mo`
    : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── BREADCRUMB NAV ──────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link href="/log" className="hover:text-white transition">Log</Link>
            <span>/</span>
            <span className="text-gray-200">{scorecard.prospectName}</span>
          </div>
          <div className="flex items-center gap-2">
            {prev && (
              <Link
                href={`/scorecard/${prev.id}`}
                className="text-xs text-gray-400 hover:text-white bg-[#111] border border-[#1e1e1e] px-3 py-1.5 rounded-lg transition hover:border-[#333] flex items-center gap-1.5"
              >
                ← {prev.prospectName}
              </Link>
            )}
            {next && (
              <Link
                href={`/scorecard/${next.id}`}
                className="text-xs text-gray-400 hover:text-white bg-[#111] border border-[#1e1e1e] px-3 py-1.5 rounded-lg transition hover:border-[#333] flex items-center gap-1.5"
              >
                {next.prospectName} →
              </Link>
            )}
          </div>
        </div>

        {/* ── HERO CARD ───────────────────────────────────────── */}
        <div className={`bg-[#111] border rounded-2xl p-6 ${
          color === 'green' ? 'border-green-500/30' :
          color === 'amber' ? 'border-amber-500/30' :
          'border-red-500/30'
        }`}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center"
                  style={typeBadgeStyle(scorecard.type)}
                >
                  {scorecard.type}
                </span>
                <span className="text-xs text-gray-400 bg-[#0f0f0f] px-2.5 py-1 rounded-full">
                  {scorecard.rep}
                </span>
                <span className="text-xs text-gray-400">{scorecard.date}</span>
                {tierLabel && (
                  <span className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
                    {tierLabel}
                  </span>
                )}
              </div>

              {/* Prospect */}
              <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                {scorecard.prospectName}
              </h1>
              {scorecard.company && (
                <p className="text-gray-400 text-lg mt-0.5">{scorecard.company}</p>
              )}

              {/* Outcome */}
              <div className="mt-4 inline-flex items-center gap-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-4 py-2">
                <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Outcome</span>
                <span className="text-gray-300 text-sm">{scorecard.outcome}</span>
              </div>
            </div>

            {/* Big score */}
            <div className="text-right shrink-0">
              <div className={`text-7xl font-black tabular-nums leading-none ${colorClass}`}>
                {scorecard.score}
              </div>
              <div className="text-gray-400 text-sm mt-1">/ {scorecard.maxScore}</div>
              <div className={`text-sm font-bold mt-1 ${colorClass}`}>{pct}%</div>
              <div className="text-xs text-gray-400 mt-1">
                {pct >= 80 ? 'Elite' : pct >= 60 ? 'Developing' : 'Needs Work'}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION SCORES ──────────────────────────────────── */}
        {scorecard.sections.length > 0 && (
          <section>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
              Section Breakdown
            </p>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
              {scorecard.sections.map((s, i) => {
                const sPct = Math.round((s.score / s.max) * 100)
                const sColorClass = scoreColorClass(s.score, s.max)
                const sBarColor =
                  sPct >= 80 ? 'bg-green-500' :
                  sPct >= 60 ? 'bg-amber-500' : 'bg-red-500'
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gray-300 text-sm font-medium">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black tabular-nums ${sColorClass}`}>
                          {s.score}
                        </span>
                        <span className="text-gray-400 text-xs">/ {s.max}</span>
                        <span className={`text-xs ${sColorClass}`}>({sPct}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bar-fill ${sBarColor}`}
                        style={{ width: `${sPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── MAGIC MOMENT ────────────────────────────────────── */}
        {scorecard.magicMoment && (
          <section>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-3">
              ✦ Call Highlight
            </p>
            <div className="bg-[#111] border border-amber-500/20 rounded-2xl p-5">
              <p className="text-amber-300 text-sm font-semibold mb-2 uppercase tracking-widest text-xs">
                Magic Moment
              </p>
              <blockquote className="text-gray-300 text-base leading-relaxed italic border-l-2 border-amber-500/40 pl-4">
                "{scorecard.magicMoment}"
              </blockquote>
            </div>
          </section>
        )}

        {/* ── FILM REVIEW TACTIC ──────────────────────────────── */}
        {scorecard.filmReviewTactic && (
          <section>
            <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-3">
              🎬 Film Review
            </p>
            <div className="bg-[#111] border border-blue-500/20 rounded-2xl p-5">
              <p className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-widest">
                Top Coaching Priority
              </p>
              <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-blue-500/40 pl-4">
                {scorecard.filmReviewTactic}
              </p>
            </div>
          </section>
        )}

        {/* ── FULL CONTENT ────────────────────────────────────── */}
        <section>
          <p className="text-gray-400 text-sm tracking-[0.3em] uppercase font-semibold mb-4">
            Full Scorecard
          </p>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 sm:p-7">
            <ContentRenderer content={scorecard.rawContent} />
          </div>
        </section>

        {/* ── BOTTOM NAV ──────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 pb-8">
          {prev ? (
            <Link
              href={`/scorecard/${prev.id}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#1e1e1e] px-4 py-2.5 rounded-xl transition hover:border-[#333]"
            >
              <span>←</span>
              <div>
                <p className="text-xs text-gray-400">Previous</p>
                <p>{prev.prospectName}</p>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/scorecard/${next.id}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#1e1e1e] px-4 py-2.5 rounded-xl transition hover:border-[#333] text-right"
            >
              <div>
                <p className="text-xs text-gray-400">Next</p>
                <p>{next.prospectName}</p>
              </div>
              <span>→</span>
            </Link>
          ) : <div />}
        </div>

      </div>
    </div>
  )
}

// ── Content renderer ─────────────────────────────────────────
function ContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="text-sm space-y-0">
      {lines.map((line, i) => {
        const trimmed = line.trim()

        // Skip code fences
        if (trimmed === '```') return null

        // Horizontal separators
        if (/^═{3,}$/.test(trimmed)) {
          return <div key={i} className="border-t border-[#1e1e1e] my-4" />
        }
        if (/^-{3,}$/.test(trimmed)) {
          return <div key={i} className="border-t border-[#1a1a1a] my-3" />
        }

        // H3 headers (### text)
        if (/^###\s/.test(line)) {
          return (
            <h4 key={i} className="text-amber-400 font-bold text-base mt-7 mb-2">
              {line.replace(/^###\s*/, '').replace(/\*\*/g, '')}
            </h4>
          )
        }

        // H2 headers (## text)
        if (/^##\s/.test(line)) {
          return (
            <h3 key={i} className="text-blue-400 font-bold text-lg mt-8 mb-2">
              {line.replace(/^##\s*/, '').replace(/\*\*/g, '')}
            </h3>
          )
        }

        // H1 headers (# text)
        if (/^#\s/.test(line)) {
          return (
            <h2 key={i} className="text-white font-black text-xl mt-6 mb-2">
              {line.replace(/^#\s*/, '')}
            </h2>
          )
        }

        // SCORE line
        if (/^SCORE:\s/.test(trimmed)) {
          return (
            <div key={i} className="text-white font-black text-lg my-3 py-2 border-y border-[#1e1e1e]">
              {trimmed}
            </div>
          )
        }

        // All-caps section headers (e.g. WHAT WENT WELL:, TOP COACHING PRIORITY:)
        if (
          /^[A-Z][A-Z\s&'():—–\-]{4,}[:\s]/.test(trimmed) &&
          trimmed.length < 80 &&
          !trimmed.startsWith('|')
        ) {
          return (
            <p key={i} className="text-gray-400 uppercase tracking-widest text-xs font-bold mt-6 mb-2">
              {trimmed.replace(/\*\*/g, '')}
            </p>
          )
        }

        // Arrow lines (coaching / key points)
        if (/^\s*→/.test(line)) {
          return (
            <div key={i} className="text-emerald-400 pl-4 border-l-2 border-emerald-500/30 py-0.5 my-1 leading-relaxed">
              {line.replace(/^\s*→\s*/, '')}
            </div>
          )
        }

        // Table separator row — skip
        if (/^\|[-\s|]+\|$/.test(trimmed)) return null

        // Table row
        if (/^\|/.test(trimmed)) {
          const cols = trimmed.split('|').filter(Boolean).map(c => c.trim())
          const isHeader =
            i > 0 &&
            (lines[i - 1].toLowerCase().includes('criteria') ||
              lines[i - 1].toLowerCase().includes('section') ||
              lines[i - 1].toLowerCase().includes('---'))
          return (
            <div
              key={i}
              className={`grid text-xs py-1.5 border-b border-[#161616] gap-x-4 ${
                isHeader ? 'text-gray-400' : 'text-gray-400'
              }`}
              style={{ gridTemplateColumns: `1fr ${cols.slice(1).map(() => 'auto').join(' ')}` }}
            >
              {cols.map((col, j) => (
                <span
                  key={j}
                  className={j === 0 ? '' : 'text-right tabular-nums text-gray-400'}
                >
                  {col.replace(/\*\*/g, '')}
                </span>
              ))}
            </div>
          )
        }

        // Markdown bold section headers (**TEXT:**)
        if (/^\*\*[A-Z].*\*\*$/.test(trimmed)) {
          return (
            <p key={i} className="text-gray-400 font-semibold mt-4 mb-1">
              {trimmed.replace(/\*\*/g, '')}
            </p>
          )
        }

        // Bullet points (•, -, *)
        if (/^\s*[-•*](?!\s*[-*])/.test(line)) {
          const text = line.replace(/^\s*[-•*]\s*/, '').replace(/\*\*/g, '')
          return (
            <div key={i} className="flex gap-2 text-gray-400 py-0.5 pl-2">
              <span className="text-gray-400 shrink-0 mt-0.5">·</span>
              <span className="leading-relaxed">{text}</span>
            </div>
          )
        }

        // Numbered list items
        if (/^\s*\d+\./.test(line)) {
          return (
            <div key={i} className="text-gray-400 py-0.5 pl-2 leading-relaxed">
              {line.replace(/\*\*/g, '')}
            </div>
          )
        }

        // Empty line
        if (!trimmed) {
          return <div key={i} className="h-1.5" />
        }

        // Indented metadata lines (e.g. "  Rep: Joe Meyers")
        if (/^\s{2,}[A-Za-z]/.test(line)) {
          return (
            <div key={i} className="text-gray-400 pl-4 py-0.5 font-mono text-xs leading-relaxed">
              {trimmed}
            </div>
          )
        }

        // Default paragraph
        return (
          <p key={i} className="text-gray-400 py-0.5 leading-relaxed">
            {line.replace(/\*\*/g, '')}
          </p>
        )
      })}
    </div>
  )
}
