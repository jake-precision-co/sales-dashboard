import Nav from '@/components/Nav'
import { getAllScorecards, getScorecardById, scoreColorClass, typeBadgeStyle } from '@/lib/parseScorecard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

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

// ── Inline bold renderer ──────────────────────────────────────
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i} className="text-gray-200 font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}

// ── Scoring table (Criteria | Max | Score | Notes) ───────────
function ScoringTable({ rows }: { rows: string[][] }) {
  const isHeader = (r: string[]) =>
    r[0].toLowerCase().includes('criteria') || r[0].toLowerCase().includes('section')
  const dataRows = rows.filter(r => !isHeader(r))

  return (
    <div className="space-y-2 my-3">
      {dataRows.map((cols, i) => {
        const criteria = cols[0] ?? ''
        const max = cols[1] ?? ''
        const score = cols[2] ?? ''
        const notes = cols[3] ?? ''
        const scoreNum = parseInt(score)
        const maxNum = parseInt(max.replace('/', ''))
        const pct = maxNum ? (scoreNum / maxNum) * 100 : 0
        const scoreColor = pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
        const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'

        return (
          <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden">
            {/* Standard / criteria row */}
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-[#1a1a1a]">
              <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold flex-1">
                {criteria}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-1 bg-[#222] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`font-black text-sm tabular-nums ${scoreColor}`}>{score}</span>
                <span className="text-gray-600 text-xs">/{maxNum || max.replace('/', '')}</span>
              </div>
            </div>
            {/* Feedback / notes row */}
            {notes && (
              <div className="px-4 py-2.5">
                <p className="text-gray-300 text-sm leading-relaxed">{notes}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Content renderer ─────────────────────────────────────────
function ContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip code fences
    if (trimmed === '```') { i++; continue }

    // Horizontal separators
    if (/^═{3,}$/.test(trimmed)) {
      elements.push(<div key={i} className="border-t border-[#1e1e1e] my-5" />)
      i++; continue
    }
    if (/^-{3,}$/.test(trimmed)) {
      elements.push(<div key={i} className="border-t border-[#1a1a1a] my-4" />)
      i++; continue
    }

    // Table — collect all consecutive table rows
    if (/^\|/.test(trimmed)) {
      const tableRows: string[][] = []
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        const row = lines[i].trim()
        if (!/^\|[-\s|]+\|$/.test(row)) { // skip separator rows
          tableRows.push(row.split('|').filter(Boolean).map(c => c.trim()))
        }
        i++
      }
      if (tableRows.length > 0) {
        // Detect scoring table: has Max/Score columns
        const isScoringTable = tableRows[0]?.some(c =>
          /max|score|\/\d/i.test(c)
        ) || tableRows.some(r => /^\/\d/.test(r[1] ?? ''))
        if (isScoringTable) {
          elements.push(<ScoringTable key={`table-${i}`} rows={tableRows} />)
        } else {
          // Generic table — simple grid
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-3">
              <table className="w-full text-sm border border-[#1e1e1e] rounded-xl overflow-hidden">
                <tbody>
                  {tableRows.map((cols, ri) => (
                    <tr key={ri} className="border-b border-[#161616] last:border-b-0">
                      {cols.map((col, ci) => (
                        <td key={ci} className="px-4 py-2.5 text-gray-400 text-sm">{col}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      }
      continue
    }

    // H3 headers (### text)
    if (/^###\s/.test(line)) {
      elements.push(
        <h4 key={i} className="text-amber-400 font-bold text-base mt-8 mb-3 pb-1 border-b border-amber-500/20">
          {line.replace(/^###\s*/, '').replace(/\*\*/g, '')}
        </h4>
      )
      i++; continue
    }

    // H2 headers (## text)
    if (/^##\s/.test(line)) {
      elements.push(
        <h3 key={i} className="text-blue-400 font-bold text-lg mt-10 mb-3 pb-1 border-b border-blue-500/20">
          {line.replace(/^##\s*/, '').replace(/\*\*/g, '')}
        </h3>
      )
      i++; continue
    }

    // H1 headers (# text)
    if (/^#\s/.test(line)) {
      elements.push(
        <h2 key={i} className="text-white font-black text-xl mt-6 mb-2">
          {line.replace(/^#\s*/, '')}
        </h2>
      )
      i++; continue
    }

    // SCORE line
    if (/^SCORE:\s/.test(trimmed)) {
      elements.push(
        <div key={i} className="text-white font-black text-xl my-4 py-3 px-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl">
          {trimmed}
        </div>
      )
      i++; continue
    }

    // SECTION BREAKDOWN dotted lines (e.g. "  Opener & Energy .... 11/15")
    if (/^\s{2,}.+\.{3,}\s*\d+\/\d+/.test(line)) {
      const match = line.match(/^\s{2,}(.+?)\s*\.{3,}\s*(\d+)\/(\d+)/)
      if (match) {
        const label = match[1].trim()
        const score = parseInt(match[2])
        const max = parseInt(match[3])
        const pct = Math.round((score / max) * 100)
        const color = pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
        const bar = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
        elements.push(
          <div key={i} className="flex items-center gap-3 py-1.5">
            <span className="text-gray-300 text-sm flex-1">{label}</span>
            <div className="w-24 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-sm font-black tabular-nums w-12 text-right ${color}`}>{score}/{max}</span>
          </div>
        )
        i++; continue
      }
    }

    // All-caps section headers (e.g. WHAT WENT WELL:, TOP COACHING PRIORITY:)
    if (
      /^[A-Z][A-Z\s&'():—–\-]{4,}[:\s]/.test(trimmed) &&
      trimmed.length < 80 &&
      !trimmed.startsWith('|')
    ) {
      elements.push(
        <p key={i} className="text-gray-500 uppercase tracking-widest text-xs font-bold mt-8 mb-3">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      )
      i++; continue
    }

    // Arrow lines (coaching / key points)
    if (/^\s*→/.test(line)) {
      elements.push(
        <div key={i} className="text-emerald-300 pl-4 border-l-2 border-emerald-500/40 py-1 my-1.5 leading-relaxed text-sm font-medium">
          {renderInline(line.replace(/^\s*→\s*/, ''))}
        </div>
      )
      i++; continue
    }

    // Markdown bold standalone lines (**TEXT:**)
    if (/^\*\*[A-Z]/.test(trimmed) && trimmed.endsWith('**')) {
      elements.push(
        <p key={i} className="text-gray-200 font-semibold mt-5 mb-1.5 text-sm">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      )
      i++; continue
    }

    // Bold line with content after (**Text:** rest)
    if (/^\*\*/.test(trimmed)) {
      elements.push(
        <p key={i} className="text-gray-300 py-0.5 leading-relaxed text-sm">
          {renderInline(trimmed)}
        </p>
      )
      i++; continue
    }

    // Bullet points (•, -, *)
    if (/^\s*[-•*](?!\s*[-*])/.test(line)) {
      const text = line.replace(/^\s*[-•*]\s*/, '')
      elements.push(
        <div key={i} className="flex gap-2.5 text-gray-300 py-1 pl-2">
          <span className="text-gray-500 shrink-0 mt-1 text-xs">▸</span>
          <span className="leading-relaxed text-sm">{renderInline(text)}</span>
        </div>
      )
      i++; continue
    }

    // Numbered list items
    if (/^\s*\d+\./.test(line)) {
      elements.push(
        <div key={i} className="text-gray-300 py-0.5 pl-2 leading-relaxed text-sm">
          {renderInline(line)}
        </div>
      )
      i++; continue
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />)
      i++; continue
    }

    // Indented metadata lines (e.g. "  Rep: Joe Meyers")
    if (/^\s{2,}[A-Za-z]/.test(line) && !line.includes('....')) {
      elements.push(
        <div key={i} className="text-gray-400 pl-4 py-0.5 font-mono text-xs leading-relaxed">
          {trimmed}
        </div>
      )
      i++; continue
    }

    // Default paragraph
    elements.push(
      <p key={i} className="text-gray-300 py-0.5 leading-relaxed text-sm">
        {renderInline(line)}
      </p>
    )
    i++
  }

  return <div className="space-y-0">{elements}</div>
}
