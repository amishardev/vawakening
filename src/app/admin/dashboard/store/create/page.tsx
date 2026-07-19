
'use client';

import StoreProductForm from '@/components/admin/StoreProductForm';
import { addStoreProductAction } from '@/app/admin/dashboard/store/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PackagePlus } from 'lucide-react';

export default function CreateStoreProductPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <PackagePlus className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Create New Store Product</CardTitle>
          </div>
          <CardDescription>Fill in the details below to add a new product to the store.</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreProductForm action={addStoreProductAction} />
        </CardContent>
      </Card>
    </div>
  );
}
