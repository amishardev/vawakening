
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Changed from isAuthenticatedAdmin
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, allow access.
        setIsAuthenticated(true);
      } else {
        // No user logged in
        setIsAuthenticated(false);
        if (pathname !== '/admin/login') { // Avoid toast if already on login page
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'You must be logged in to view the admin dashboard.',
            });
        }
        const loginUrl = new URL('/admin/login', window.location.origin);
        // Add redirectedFrom query parameter if not already on the login page
        if (pathname !== '/admin/login') { 
          loginUrl.searchParams.set('redirectedFrom', pathname);
        }
        router.push(loginUrl.toString());
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname, toast]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <p>Authenticating...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    // This state might be hit briefly during redirection or if auth check fails.
    // The onAuthStateChanged logic should handle redirection.
    return (
         <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <p>Redirecting to login...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
