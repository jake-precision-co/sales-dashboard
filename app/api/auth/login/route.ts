import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const user = authenticate(username, password)

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('user', username.toLowerCase(), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return NextResponse.json({ ok: true })
}
