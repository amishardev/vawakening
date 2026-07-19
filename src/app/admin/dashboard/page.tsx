
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, LayoutDashboard, Newspaper, Settings, Library, HandHeart, ShoppingCart } from 'lucide-react'; // Added ShoppingCart
import Link from 'next/link';
import { auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/'); // Redirect to home page after logout
    } catch (error: any) {
      console.error('Firebase Logout Error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'Could not log you out. Please try again.',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <div className="flex items-center justify-center gap-2 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-primary">Admin Dashboard</CardTitle>
          </div>
          <p className="text-muted-foreground">Vivekananda Awakening Foundation Admin Portal.</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg">
            You are successfully logged in as an administrator.
          </p>

          <div className="space-y-3">
            <p className="font-semibold text-foreground text-lg">Content Management</p>
            <Button variant="outline" asChild className="w-full text-base py-6">
                <Link href="/admin/dashboard/blogs">
                    <Newspaper className="mr-2 h-5 w-5" /> Manage Blog Posts
                </Link>
            </Button>
            <Button variant="outline" asChild className="w-full text-base py-6">
                <Link href="/admin/dashboard/resources">
                    <Library className="mr-2 h-5 w-5" /> Manage Resources
                </Link>
            </Button>
            <Button variant="outline" asChild className="w-full text-base py-6">
                <Link href="/admin/dashboard/programs">
                    <HandHeart className="mr-2 h-5 w-5" /> Manage Programs
                </Link>
            </Button>
            <Button variant="outline" asChild className="w-full text-base py-6">
                <Link href="/admin/dashboard/store">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Manage Store Products
                </Link>
            </Button>
          </div>

           <div className="space-y-3 pt-4">
            <p className="font-semibold text-foreground text-lg">Settings & Utilities</p>
            <Button variant="outline" className="w-full sm:w-auto" disabled>
                <Settings className="mr-2 h-5 w-5" /> Site Settings (Coming Soon)
            </Button>
          </div>

          <div className="pt-4">
            <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
