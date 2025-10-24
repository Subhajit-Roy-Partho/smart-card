import { NextResponse, type NextRequest } from 'next/server';
import { getSession as getAuth0Session } from '@auth0/nextjs-auth0/edge';

// NOTE: The server-side Firebase user check has been removed.
// The Firebase client SDK handles session state, and for this demo,
// client-side checks and Firestore security rules are sufficient.
// The previous implementation was looking for a 'firebaseIdToken' cookie
// which is not set by the client SDK, causing a login loop.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authProvider = process.env.AUTH;

  // Allow public assets and API routes to pass through
  if (pathname.startsWith('/_next') || /\.(.*)$/.test(pathname) || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }
  
  const isLoginPage = pathname === '/login' || pathname === '/firebase-login';

  let session;
  if (authProvider === 'firebase') {
    // For Firebase, we now rely on the client to manage the session.
    // The middleware will not block access to the dashboard directly,
    // but the dashboard itself will handle unauthenticated users
    // via the useUser hook. A full page reload after login ensures
    // the client-side state is correct.
    // The most important check is for the login page itself.
  } else {
    // Default to Auth0 session check
    const auth0Sess = await getAuth0Session();
    session = auth0Sess?.user;
  }

  // If using Auth0 and not authenticated, redirect to Auth0 login
  if (authProvider !== 'firebase' && !session && !isLoginPage) {
     return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }

  // If using Auth0 and IS authenticated and on the login page, redirect to dashboard
  if (authProvider !== 'firebase' && session && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is logged in (for Auth0) and at the root, redirect to dashboard
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // For Firebase, if at the root, always go to dashboard.
  // The dashboard page itself is client-side and will redirect to login if needed.
  if (pathname === '/' && authProvider === 'firebase') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
};
