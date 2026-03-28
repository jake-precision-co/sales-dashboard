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
}

function parseLeaderboard(filePath: string): LeaderboardEntry[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf-8')
    const entries: LeaderboardEntry[] = []

    for (const line of content.split('\n')) {
      if (!line.includes('|') || line.includes('Rank') || line.includes('---')) continue
      const cols = line.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length < 5) continue

      const rankRaw = cols[0].replace(/[🥇🥈🥉]/g, '').trim()
      const rank = parseInt(rankRaw)
      if (isNaN(rank)) continue

      const scoreMatch = cols[4].match(/(\d+)\/100/)
      if (!scoreMatch) continue

      entries.push({
        rank,
        rep: cols[1],
        prospect: cols[2],
        company: cols[3],
        score: parseInt(scoreMatch[1]),
        outcome: cols[5] ?? '',
        date: cols[cols.length - 1] ?? '',
      })
    }

    return entries.sort((a, b) => a.rank - b.rank)
  } catch (err) {
    console.error(`Error parsing leaderboard ${filePath}:`, err)
    return []
  }
}

export function getAELeaderboard(): LeaderboardEntry[] {
  return parseLeaderboard(path.join(process.cwd(), 'data/leaderboard-ae.md'))
}

export function getSDRLeaderboard(): LeaderboardEntry[] {
  return parseLeaderboard(path.join(process.cwd(), 'data/leaderboard-sdr.md'))
}
