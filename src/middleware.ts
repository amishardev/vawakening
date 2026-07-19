
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run before a request is completed.
// With Firebase Auth, session management is primarily handled by the Firebase SDK on the client-side.
// Server-side session cookies can be used (Next.js examples with 'firebase-admin' and custom handling),
// but for this setup, we rely on client-side checks in layouts.
// This middleware can be simplified or used for other purposes if needed.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Firebase Auth session state is handled client-side by the SDK.

  // You could add other middleware logic here if necessary,
  // for example, redirecting based on path or other headers.

  return res;
}

export const config = {
  matcher: [
    // We can keep matching /admin paths if there's other logic,
    // but primary auth enforcement is now client-side in the layout.
    '/admin/:path*', 
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
