import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = {
    student: ['/dashboard', '/summarize', '/q-and-a', '/test-generator'],
    teacher: ['/teacher-dashboard', '/manage-students'],
    admin: ['/admin-dashboard'],
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.get('firebase-auth-token'); // Simplified check

  const allProtectedRoutes = Object.values(protectedRoutes).flat();

  // If user is not authenticated and trying to access a protected route, redirect to sign-in
  if (!authed && allProtectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (authed && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
