import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const userCookie = request.cookies.get('user')

    // If no user cookie, redirect to login
    if (!userCookie?.value) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
