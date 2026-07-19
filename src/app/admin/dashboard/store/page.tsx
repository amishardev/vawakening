
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStoreProductsForAdmin } from '@/app/admin/dashboard/store/actions';
import { PlusCircle, Edit, PackageSearch, ExternalLink, CalendarDays, CheckCircle, XCircle, IndianRupee } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { StoreProductDocument } from '@/types/store';
import DeleteStoreProductButton from '@/components/admin/DeleteStoreProductButton';
import ToggleStockButton from '@/components/admin/ToggleStockButton';

export default function ManageStoreProductsPage() {
  const [products, setProducts] = useState<StoreProductDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const data = await getStoreProductsForAdmin();
      setProducts(data);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  function handleDeleted(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleStockToggled(id: string, newState: boolean) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, in_stock: newState } : p)));
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <PackageSearch className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Store Product Manager</CardTitle>
              </div>
              <CardDescription>View, edit, or delete existing store products. Or create a new one.</CardDescription>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Link href="/admin/dashboard/store/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No store products found.</p>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard/store/create">Add Your First Product</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product) => (
                <Card key={product.id} id={`product-${product.id}`} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row">
                    {product.thumbnail_url && (
                      <div className="md:w-1/4 relative min-h-[150px] md:min-h-full bg-muted">
                        <Image
                          src={product.thumbnail_url}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                          unoptimized={true}
                        />
                      </div>
                    )}
                    <div className={`p-4 sm:p-5 flex-grow ${product.thumbnail_url ? 'md:w-3/4' : 'w-full'}`}>
                      <h3 className="font-headline text-lg sm:text-xl text-primary mb-1">{product.name}</h3>
                      <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            Added: {product.created_at ? format(new Date(product.created_at), 'PPP') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-0.5" />
                            <span>{product.price.toFixed(2)}</span>
                        </div>
                         <Badge variant={product.in_stock ? 'secondary' : 'destructive'} className="text-xs">
                            {product.in_stock ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                         </Badge>
                      </div>
                      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                        {product.description || 'No description available.'}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/dashboard/store/edit/${product.id}`}>
                            <Edit className="mr-1.5 h-4 w-4" /> Edit
                          </Link>
                        </Button>
                        <DeleteStoreProductButton
                          productId={product.id}
                          productName={product.name}
                          onDeleted={() => handleDeleted(product.id)}
                        />
                        <ToggleStockButton
                          productId={product.id}
                          currentStockStatus={product.in_stock}
                          onToggled={(newState) => handleStockToggled(product.id, newState)}
                        />
                        <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                           <Link href={`/store#product-${product.id}`} target="_blank" rel="noopener noreferrer">
                             View on Site <ExternalLink className="ml-1.5 h-4 w-4" />
                           </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
