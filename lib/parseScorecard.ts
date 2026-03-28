import fs from 'fs'
import path from 'path'

export type SectionScore = {
  name: string
  score: number
  max: number
}

export type Scorecard = {
  id: string
  rep: string
  date: string
  prospect: string
  type: 'AE' | 'SDR'
  score: number
  maxScore: number
  outcome: string
  sections: SectionScore[]
  filePath: string
}

const AE_DIR = path.join(process.cwd(), 'data/AE/scorecards')
const SDR_DIR = path.join(process.cwd(), 'data/SDR/scorecards')

function parseMarkdown(content: string, filePath: string, type: 'AE' | 'SDR'): Scorecard | null {
  try {
    const repMatch = content.match(/Rep:\s+(.+)/i)
    const dateMatch = content.match(/Date:\s+(\d{4}-\d{2}-\d{2})/i)
    const prospectMatch = content.match(/Prospect:\s+(.+)/i)
    const scoreMatch = content.match(/SCORE:\s+(\d+)\s*\/\s*(\d+)/i)
    const outcomeMatch = content.match(/OUTCOME:\s*\[x\]\s+([^\[]+?)(?:\s*\[|$)/i)

    if (!repMatch || !dateMatch || !scoreMatch) return null

    const rep = repMatch[1].trim()
    const date = dateMatch[1].trim()
    const prospect = prospectMatch ? prospectMatch[1].trim() : 'Unknown'
    const score = parseInt(scoreMatch[1])
    const maxScore = parseInt(scoreMatch[2])
    const outcome = outcomeMatch ? outcomeMatch[1].trim() : 'Unknown'

    // Parse section scores
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

    const id = path.basename(filePath, '.md')

    return { id, rep, date, prospect, type, score, maxScore, outcome, sections, filePath }
  } catch {
    return null
  }
}

export function getAllScorecards(): Scorecard[] {
  const cards: Scorecard[] = []

  for (const [dir, type] of [[AE_DIR, 'AE'], [SDR_DIR, 'SDR']] as [string, 'AE' | 'SDR'][]) {
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const filePath = path.join(dir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const card = parseMarkdown(content, filePath, type)
      if (card) cards.push(card)
    }
  }

  return cards.sort((a, b) => b.date.localeCompare(a.date))
}

export function getScorecardById(id: string): Scorecard | null {
  const all = getAllScorecards()
  return all.find(c => c.id === id) ?? null
}
