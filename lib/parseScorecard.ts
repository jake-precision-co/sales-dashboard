import fs from 'fs'
import path from 'path'
import type { CSSProperties } from 'react'

export type SectionScore = {
  name: string
  score: number
  max: number
}

export type Scorecard = {
  id: string
  rep: string
  date: string
  callDate: string       // when the call happened (from Date: field), YYYY-MM-DD
  prospect: string       // full prospect line
  prospectName: string   // just the person's name
  company: string        // extracted company
  type: 'AE' | 'SDR'
  score: number
  maxScore: number
  outcome: string
  sections: SectionScore[]
  filePath: string
  tier: number | null
  meetingBooked: boolean
  closed: boolean
  magicMoment: string
  filmReviewTactic: string
  rawContent: string
  scoredDate: string   // date Phil scored it (from Scored: field), YYYY-MM-DD
}

const AE_DIR = path.join(process.cwd(), 'data/AE/scorecards')
const SDR_DIR = path.join(process.cwd(), 'data/SDR/scorecards')

function extractNames(prospectLine: string): { prospectName: string; company: string } {
  // "Alex Le — Cloud Contractor (gocallio.com) — $1.5K MRR"
  // "Khabir Muhammad — Creditfixrr — ~$25K MRR"
  // "Scott Messick — Analyst1"
  const parts = prospectLine.split(/\s*[—–-]{1,3}\s*/)
  const prospectName = parts[0].trim()
  if (parts.length < 2) return { prospectName, company: '' }

  const company = parts[1]
    .replace(/\s*\([^)]*\).*$/, '')   // remove (url) and trailing
    .replace(/\s*~?\$[\d.,]+.*$/, '') // remove price info
    .replace(/\s*\d+K.*$/, '')        // remove e.g. "25K MRR"
    .trim()

  return { prospectName, company }
}

function extractMagicMoment(content: string): string {
  // Pattern 1: "Best moment: text" (with optional quotes)
  const bestMomentMatch = content.match(/Best moment:\s*"?([^"\n]+)"?/i)
  if (bestMomentMatch) {
    return bestMomentMatch[1].replace(/^["']|["']$/g, '').trim().substring(0, 250)
  }

  // Pattern 2: First substantial bullet in WHAT WENT WELL
  const wellSection = content.match(
    /WHAT WENT WELL[:\s]*\n([\s\S]+?)(?:\n\nWHAT TO|WHAT TO IMPROVE|TOP COACHING|═══)/i
  )
  if (wellSection) {
    const lines = wellSection[1].split('\n')
    for (const line of lines) {
      // Strip bullets, timestamps like [00:00], markdown bold, etc.
      const trimmed = line
        .replace(/^\s*[•\-\*\[\d:]+\]?\s*/, '')
        .replace(/\*\*/g, '')
        .trim()
      if (trimmed.length > 30) return trimmed.substring(0, 250)
    }
  }

  return ''
}

function extractFilmReviewTactic(content: string): string {
  // Pattern 1: arrow after TOP COACHING PRIORITY (first line only)
  const priorityMatch = content.match(/TOP COACHING PRIORITY[:\s]*\n\s*→\s*([^\n]+)/i)
  if (priorityMatch) return priorityMatch[1].trim().substring(0, 300)

  // Pattern 2: no arrow — grab first content line
  const altMatch = content.match(/TOP COACHING PRIORITY[:\s]*\n\s*([^\n]+)/i)
  if (altMatch) {
    return altMatch[1].replace(/^\s*→\s*/, '').trim().substring(0, 300)
  }

  return ''
}

function parseMarkdown(content: string, filePath: string, type: 'AE' | 'SDR'): Scorecard | null {
  try {
    const repMatch = content.match(/\*?\*?Rep:\*?\*?\s+(.+)/i)
    const dateMatch = content.match(/\*?\*?Date:\*?\*?\s+(\d{4}-\d{2}-\d{2})/i)
    const prospectMatch = content.match(/\*?\*?Prospect:\*?\*?\s+(.+)/i)
    const scoreMatch = content.match(/SCORE:\s+(\d+)\s*\/\s*(\d+)/i)
    const outcomeMatch = content.match(/OUTCOME:\s*\[x\]\s+([^\[]+?)(?:\s*\[|\s*—|\s*$|\n)/i)

    if (!repMatch || !dateMatch || !scoreMatch) return null

    const rep = repMatch[1].trim()
    const date = dateMatch[1].trim()
    const prospect = prospectMatch ? prospectMatch[1].trim() : 'Unknown'
    const score = parseInt(scoreMatch[1])
    const maxScore = parseInt(scoreMatch[2])
    const outcome = outcomeMatch ? outcomeMatch[1].trim() : 'Unknown'

    const { prospectName, company } = extractNames(prospect)

    // Parse Scored: field (when Phil scored it)
    const scoredMatch = content.match(/\*?\*?Scored:\*?\*?\s+(\d{4}-\d{2}-\d{2})/i)
    const scoredDateFromContent = scoredMatch ? scoredMatch[1] : null

    // Parse section scores from the SECTION BREAKDOWN block
    const sections: SectionScore[] = []
    const sectionRegex = /^\s{2}(.+?)\s*\.+\s*(\d+)\/(\d+)/gm
    let match
    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push({
        name: match[1].trim(),
        score: parseInt(match[2]),
        max: parseInt(match[3]),
      })
    }

    // Detect tier (AE)
    let tier: number | null = null
    const tierMatch = content.match(/Tier Discussed:.*?\[x\].*?\$(\d+)K/i)
    if (tierMatch) tier = parseInt(tierMatch[1]) * 1000

    const closed = /OUTCOME:.*\[x\]\s*(Closed|Enrolled)/i.test(content)
    const meetingBooked = /OUTCOME:.*\[x\]\s*Meeting Booked/i.test(content)

    const magicMoment = extractMagicMoment(content)
    const filmReviewTactic = extractFilmReviewTactic(content)

    const id = path.basename(filePath, '.md')

    return {
      id,
      rep,
      date,
      callDate: date,   // when the call happened (from Date: field)
      prospect,
      prospectName,
      company,
      type,
      score,
      maxScore,
      outcome,
      sections,
      filePath,
      tier,
      meetingBooked,
      closed,
      magicMoment,
      filmReviewTactic,
      rawContent: content,
      scoredDate: scoredDateFromContent ?? date,  // from Scored: field; fallback to call date
    }
  } catch {
    return null
  }
}

export function getAllScorecards(): Scorecard[] {
  const cards: Scorecard[] = []

  try {
    for (const [dir, type] of [[AE_DIR, 'AE'], [SDR_DIR, 'SDR']] as [string, 'AE' | 'SDR'][]) {
      if (!fs.existsSync(dir)) continue
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
      for (const file of files) {
        try {
          const filePath = path.join(dir, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          const stat = fs.statSync(filePath)
          const card = parseMarkdown(content, filePath, type)
          if (card) {
            // If Scored: field was parsed from content, keep it; otherwise fall back to file birthtime
            if (!content.match(/\*?\*?Scored:\*?\*?\s+\d{4}-\d{2}-\d{2}/i)) {
              card.scoredDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(stat.birthtime)
            }
            cards.push(card)
          }
        } catch (err) {
          console.error(`Error reading scorecard ${file}:`, err)
        }
      }
    }
  } catch (err) {
    console.error('Error loading scorecards:', err)
    return []
  }

  return cards.sort((a, b) => b.date.localeCompare(a.date))
}

export function getScorecardById(id: string): Scorecard | null {
  const all = getAllScorecards()
  return all.find(c => c.id === id) ?? null
}

export function scoreColor(score: number, max = 100): 'green' | 'amber' | 'red' {
  const pct = (score / max) * 100
  if (pct >= 80) return 'green'
  if (pct >= 60) return 'amber'
  return 'red'
}

export function scoreColorClass(score: number, max = 100): string {
  const color = scoreColor(score, max)
  if (color === 'green') return 'text-green-400'
  if (color === 'amber') return 'text-amber-400'
  return 'text-red-400'
}

export function scoreBgClass(score: number, max = 100): string {
  const color = scoreColor(score, max)
  if (color === 'green') return 'bg-green-400/10 border-green-400/30 text-green-400'
  if (color === 'amber') return 'bg-amber-400/10 border-amber-400/30 text-amber-400'
  return 'bg-red-400/10 border-red-400/30 text-red-400'
}

/** AE vs SDR pill — inline styles so Tailwind never overrides colors */
export function typeBadgeStyle(type: 'AE' | 'SDR'): CSSProperties {
  if (type === 'AE') {
    return {
      backgroundColor: 'rgba(37, 99, 235, 0.35)',
      border: '1px solid #3b82f6',
      color: '#dbeafe',
    }
  }
  return {
    backgroundColor: 'rgba(22, 163, 74, 0.35)',
    border: '1px solid #22c55e',
    color: '#dcfce7',
  }
}
