import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const user = authenticate(username, password)

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('user', username.toLowerCase(), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  return response
}
