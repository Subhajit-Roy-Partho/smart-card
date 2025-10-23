import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')

  const isApiRoute = pathname.startsWith('/api')
  const isPublicAsset = /\.(.*)$/.test(pathname)

  if (isApiRoute || isPublicAsset || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
