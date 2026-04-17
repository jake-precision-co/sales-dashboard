import fs from 'fs'
import path from 'path'

export type LeaderboardEntry = {
  rank: number
  rep: string
  prospect: string
  company: string
  score: number
  outcome: string
  date: string
  scorecardId: string | null
}

/** Build a lookup: "YYYY-MM-DD-firstname-lastname" → scorecard filename (without .md) */
function buildScorecardIndex(type: 'AE' | 'SDR'): Map<string, string> {
  const dir = path.join(process.cwd(), `data/${type}/scorecards`)
  const index = new Map<string, string>()
  if (!fs.existsSync(dir)) return index
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue
    index.set(file.replace(/\.md$/, '').toLowerCase(), file.replace(/\.md$/, ''))
  }
  return index
}

/** Fuzzy-match a leaderboard entry to a scorecard file */
function findScorecardId(
  prospect: string,
  date: string,
  index: Map<string, string>
): string | null {
  // Normalize prospect: lowercase, first word only (first name), strip punctuation
  const firstName = prospect.toLowerCase().split(/[\s(—–]/)[0].replace(/[^a-z]/g, '')

  for (const [key, id] of index) {
    // Must start with the date
    if (!key.startsWith(date)) continue
    // Must contain the first name somewhere in the slug
    if (key.includes(firstName)) return id
  }

  // Fallback: just match date + any part of prospect name words
  const words = prospect.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  for (const [key, id] of index) {
    if (!key.startsWith(date)) continue
    if (words.some(w => key.includes(w))) return id
  }

  return null
}

function parseLeaderboard(filePath: string, type: 'AE' | 'SDR'): LeaderboardEntry[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf-8')
    const entries: LeaderboardEntry[] = []
    const index = buildScorecardIndex(type)

    for (const line of content.split('\n')) {
      if (!line.includes('|') || line.includes('Rank') || line.includes('---')) continue
      const cols = line.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length < 5) continue

      const rankRaw = cols[0].replace(/[🥇🥈🥉]/g, '').trim()
      const rank = parseInt(rankRaw)
      if (isNaN(rank)) continue

      const scoreMatch = cols[4].match(/(\d+)\/100/)
      if (!scoreMatch) continue

      const prospect = cols[2]
      // Find date column by pattern — could be any position
      const date = cols.find(c => /^\d{4}-\d{2}-\d{2}$/.test(c)) ?? ''
      const scorecardId = findScorecardId(prospect, date, index)

      entries.push({
        rank,
        rep: cols[1],
        prospect,
        company: cols[3],
        score: parseInt(scoreMatch[1]),
        outcome: cols[5] ?? '',
        date,
        scorecardId,
      })
    }

    return entries.sort((a, b) => a.rank - b.rank)
  } catch (err) {
    console.error(`Error parsing leaderboard ${filePath}:`, err)
    return []
  }
}

export function getAELeaderboard(): LeaderboardEntry[] {
  return parseLeaderboard(path.join(process.cwd(), 'data/leaderboard-ae.md'), 'AE')
}

export function getSDRLeaderboard(): LeaderboardEntry[] {
  return parseLeaderboard(path.join(process.cwd(), 'data/leaderboard-sdr.md'), 'SDR')
}
