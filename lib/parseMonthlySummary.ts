import fs from 'fs'
import path from 'path'

export type MonthlySummary = {
  month: string
  generated: string
  joe: { closedAnnualRevenue: number; dealsCount: number }
  jc: { growthSessionsSet: number }
  avgAEScore: number
  avgSDRScore: number
  totalCallsScored: number
}

export function getMonthlySummary(): MonthlySummary | null {
  try {
    const filePath = path.join(process.cwd(), 'data/monthly-summary.json')
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}
