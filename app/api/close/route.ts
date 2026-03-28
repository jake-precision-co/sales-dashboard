import { NextResponse } from 'next/server'

const CLOSE_API_KEY = process.env.CLOSE_API_KEY!
const JOE_USER_ID = 'user_IR5aJUIkgGSbD1qNmvIkF04XvGCAjO3E9KjnSyPAPgX'

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { start, end }
}

function toAnnual(value: number, period: string): number {
  // value is in cents
  const dollars = value / 100
  if (period === 'monthly') return dollars * 12
  if (period === 'annual') return dollars
  if (period === 'one_time') return dollars
  return dollars
}

export async function GET() {
  try {
    if (!CLOSE_API_KEY) {
      console.error('CLOSE_API_KEY not configured')
      return NextResponse.json({ 
        joeAnnualRevenue: 0, 
        joeDealsCount: 0, 
        month: `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}` 
      })
    }

    const { start, end } = getMonthRange()
    const auth = Buffer.from(`${CLOSE_API_KEY}:`).toString('base64')

    const res = await fetch(
      `https://api.close.com/api/v1/opportunity/?date_won__gte=${start}T00:00:00&date_won__lte=${end}T23:59:59&_fields=id,lead_name,value,value_period,date_won,user_name,user_id`,
      { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' }
    )

    if (!res.ok) throw new Error(`Close API error: ${res.status}`)

    const data = await res.json()
    const opps = data.data ?? []

    // Joe's won deals this month — annualized
    const joeDeals = opps.filter((o: any) => o.user_id === JOE_USER_ID)
    const joeAnnualRevenue = joeDeals.reduce((sum: number, o: any) => sum + toAnnual(o.value, o.value_period), 0)
    const joeDealsCount = joeDeals.length

    return NextResponse.json({
      joeAnnualRevenue: Math.round(joeAnnualRevenue),
      joeDealsCount,
      month: `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
    })
  } catch (err) {
    console.error('Close API error:', err)
    return NextResponse.json({ 
      joeAnnualRevenue: 0, 
      joeDealsCount: 0, 
      month: `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}` 
    })
  }
}
