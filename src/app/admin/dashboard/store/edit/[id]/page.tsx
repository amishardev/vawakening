
'use client';

import { useEffect, useState } from 'react';
import StoreProductForm from '@/components/admin/StoreProductForm';
import { getStoreProductById, updateStoreProductAction } from '@/app/admin/dashboard/store/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { StoreProductDocument } from '@/types/store';

interface EditStoreProductPageProps {
  params: { id: string };
}

export default function EditStoreProductPage({ params }: EditStoreProductPageProps) {
  const [product, setProduct] = useState<StoreProductDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const data = await getStoreProductById(params.id);
      setProduct(data);
      setIsLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-16 text-center">Loading product...</div>;
  }

  if (!product) {
    notFound();
  }

  const updateActionForProduct = updateStoreProductAction.bind(null, params.id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
         <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Edit3 className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Edit Store Product</CardTitle>
          </div>
          <CardDescription>Modify the details of the store product below.</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreProductForm product={product} action={updateActionForProduct} />
        </CardContent>
      </Card>
    </div>
  );
}
