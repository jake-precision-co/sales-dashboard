/**
 * closeApi.ts — Film Room data layer
 *
 * ⚡ NO LIVE API CALLS. Reads from data/close-stats.json.
 * That file is populated by scripts/close-data-scraper.py (run on a schedule).
 *
 * Betty overnight build — 2026-04-01
 */

import fs from 'fs'
import path from 'path'

// ── Types ────────────────────────────────────────────────────────────────────

export type DayStats = {
  date: string
  dials: number
  sets: number
  closes: number
  revenue: number
}

export type TodayStats = DayStats

export type MonthlyStats = {
  month: string
  revenue: number
  deals: number
  sets: number
  callsScored: number
  avgScore: number
}

export type Records = {
  bestDayRevenue: { amount: number; rep: string; date: string }
  bestDaySets: { amount: number; rep: string; date: string }
  bestMonthRevenue: { amount: number; rep: string; month: string }
  bestMonthSets: { amount: number; rep: string; month: string }
}

export type CloseStats = {
  lastUpdated: string
  today: DayStats
  yesterday: DayStats
  monthly: MonthlyStats
  records: Records
}

// ── Reader ───────────────────────────────────────────────────────────────────

const STATS_FILE = path.join(process.cwd(), 'data', 'close-stats.json')

function todayEtYmd(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function yesterdayEtYmd(date: Date = new Date()): string {
  const ymd = todayEtYmd(date)
  const ref = new Date(`${ymd}T12:00:00.000Z`)
  ref.setUTCDate(ref.getUTCDate() - 1)
  return ref.toISOString().slice(0, 10)
}

/** Map calendar YYYY-MM-DD to the matching `today` or `yesterday` block from the last export. */
function dayStatsForCalendarDate(stats: CloseStats, ymd: string): DayStats | null {
  if (stats.today.date === ymd) return stats.today
  if (stats.yesterday.date === ymd) return stats.yesterday
  return null
}

function emptyDay(ymd: string): DayStats {
  return { date: ymd, dials: 0, sets: 0, closes: 0, revenue: 0 }
}

function readStats(): CloseStats | null {
  try {
    if (!fs.existsSync(STATS_FILE)) {
      console.warn('[closeApi] close-stats.json not found at', STATS_FILE)
      return null
    }
    const raw = fs.readFileSync(STATS_FILE, 'utf-8')
    return JSON.parse(raw) as CloseStats
  } catch (err) {
    console.error('[closeApi] Error reading close-stats.json:', err)
    return null
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

const EMPTY_MONTHLY: MonthlyStats = {
  month: new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
  }).format(new Date()),
  revenue: 0,
  deals: 0,
  sets: 0,
  callsScored: 0,
  avgScore: 0,
}

const EMPTY_RECORDS: Records = {
  bestDayRevenue: { amount: 0, rep: 'Joe Meyers', date: '' },
  bestDaySets: { amount: 0, rep: 'JC Ruiz', date: '' },
  bestMonthRevenue: { amount: 0, rep: 'Joe Meyers', month: '' },
  bestMonthSets: { amount: 0, rep: 'JC Ruiz', month: '' },
}

/** Today's stats — dials, sets, closes, revenue (calendar ET, not raw JSON `today` when export lags). */
export async function getTodayStats(): Promise<TodayStats> {
  const want = todayEtYmd()
  const stats = readStats()
  if (!stats) return emptyDay(want)
  return dayStatsForCalendarDate(stats, want) ?? emptyDay(want)
}

/** Yesterday's stats — same export, matched to calendar yesterday ET */
export async function getYesterdayStats(): Promise<DayStats> {
  const want = yesterdayEtYmd()
  const stats = readStats()
  if (!stats) return emptyDay(want)
  return dayStatsForCalendarDate(stats, want) ?? emptyDay(want)
}

/** Monthly stats — revenue, deals, sets, callsScored, avgScore */
export async function getMonthlyStats(): Promise<MonthlyStats> {
  const stats = readStats()
  if (!stats) return EMPTY_MONTHLY
  return stats.monthly
}

/** All-time records from daily-records.md */
export async function getRecords(): Promise<Records> {
  const stats = readStats()
  if (!stats) return EMPTY_RECORDS
  return stats.records
}

/** When the data was last refreshed */
export async function getLastUpdated(): Promise<string> {
  const stats = readStats()
  if (!stats) return ''
  return stats.lastUpdated
}
