
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent, useEffect, Suspense } from 'react';
import { LogIn } from 'lucide-react';
import { auth } from '@/lib/firebaseConfig'; // Use Firebase auth
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <p>Loading...</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const redirectedFrom = searchParams.get('redirectedFrom');
  const targetRedirectPath = redirectedFrom && redirectedFrom.startsWith('/admin/dashboard') ? redirectedFrom : '/admin/dashboard';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard.
        // Role checking is handled in AdminDashboardLayout using custom claims.
        router.push(targetRedirectPath);
      } else {
        // User is signed out.
        setIsLoading(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router, targetRedirectPath]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Email and password are required.',
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      });
      // onAuthStateChanged in useEffect will handle the redirect
    } catch (e: any) {
      let errorMessage = 'Invalid login credentials. Please try again.';
      if (e.code) {
        switch (e.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': // Common error for wrong email/password
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          default:
            errorMessage = e.message || 'An unexpected error occurred during login.';
        }
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !error) { 
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-sm shadow-xl">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl text-primary">Admin Portal</CardTitle>
            <CardDescription>Please log in to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {redirectedFrom && (
                <input type="hidden" name="redirectedFrom" value={redirectedFrom} />
            )}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Logging in...' : <><LogIn className="mr-2 h-4 w-4" /> Log In</>}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
