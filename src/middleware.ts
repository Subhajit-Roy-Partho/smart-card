import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge';

export async function middleware(request: NextRequest) {
  if (process.env.TEST === '1') {
    const { pathname } = request.nextUrl
    if (pathname === '/api/auth/login' || pathname === '/login') {
       return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  
  const isApiRoute = pathname.startsWith('/api/auth');
  const isPublicAsset = /\.(.*)$/.test(pathname)

  if (isApiRoute || isPublicAsset || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === '/login'
  const session = await getSession();

  if (isLoginPage) {
    if (session?.user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL('/api/auth/login', request.url))
  }
  
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
}
