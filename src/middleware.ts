import { NextResponse, type NextRequest } from 'next/server';
import { getSession as getAuth0Session } from '@auth0/nextjs-auth0/edge';
import { getAuth, Auth } from 'firebase-admin/auth';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// This is a mock of how you might get the currently signed-in user in Firebase
// on the server-side. In a real edge middleware scenario, you would typically
// verify an ID token from the request's Authorization header.
async function getFirebaseUser(request: NextRequest): Promise<any> {
  // This is a simplified check. A real implementation would involve
  // verifying a Firebase ID token.
  const idToken = request.cookies.get('firebaseIdToken')?.value;

  if (!idToken) {
    return null;
  }
  
  // This is where you would verify the token.
  // For this demo, we'll just assume if a token exists, the user is "logged in".
  // In a real app:
  // try {
  //   const decodedToken = await getAuth().verifyIdToken(idToken);
  //   return decodedToken;
  // } catch (error) {
  //   return null;
  // }
  
  // Mock user object if a token is present
  return { uid: 'mock-user-uid-from-middleware' };
}

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
    session = await getFirebaseUser(request);
  } else {
    // Default to Auth0
    const auth0Sess = await getAuth0Session();
    session = auth0Sess?.user;
  }

  // If on a login page
  if (isLoginPage) {
    // If user is already logged in, redirect to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise, show the login page
    return NextResponse.next();
  }
  
  // For all other pages, if there's no session, redirect to the appropriate login page
  if (!session) {
    const loginUrl = authProvider === 'firebase' ? '/firebase-login' : '/api/auth/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // If user is logged in and at the root, redirect to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
};
