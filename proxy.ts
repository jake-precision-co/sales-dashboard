import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and all API routes through
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Require auth cookie for all other routes
  const userCookie = request.cookies.get('user')
  if (!userCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
