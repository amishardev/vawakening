
'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { StoreProductDocument } from '@/types/store';
import Image from 'next/image';

interface StoreProductFormProps {
  product?: StoreProductDocument | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export default function StoreProductForm({ product, action }: StoreProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(product?.thumbnail_url || '');
  const [isInStock, setIsInStock] = useState<boolean>(product?.in_stock ?? true);

  const handleThumbnailUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(event.target.value);
  };

  useEffect(() => {
    if (product) {
      setThumbnailUrl(product.thumbnail_url || '');
      setIsInStock(product.in_stock ?? true);
    }
  }, [product]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    // Ensure 'in_stock' is represented, as unchecked checkboxes aren't sent
    if (!formData.has('in_stock')) {
        formData.append('in_stock', isInStock ? 'on' : ''); // 'on' if true, empty if false (will become 'on' or null)
    } else {
        // If it exists, it means it was checked, ensure it's 'on'
        if (isInStock) formData.set('in_stock', 'on');
        else formData.set('in_stock', ''); // Will be interpreted as false
    }
    
    const result = await action(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      toast({
        title: product ? 'Product Updated' : 'Product Created',
        description: product ? 'The product has been successfully updated.' : 'The new product has been successfully created.',
      });
      router.push('/admin/dashboard/store');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name || ''}
          required
          className="mt-1"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description || ''}
          rows={5}
          className="mt-1"
          placeholder="Detailed product description."
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="price">Price (INR)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price?.toString() || '0.00'}
          required
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="thumbnail_url">Thumbnail Image URL (optional)</Label>
        <Input
          id="thumbnail_url"
          name="thumbnail_url"
          type="url"
          value={thumbnailUrl}
          onChange={handleThumbnailUrlChange}
          className="mt-1"
          placeholder="https://example.com/image.png or GitHub raw link"
          disabled={isLoading}
        />
        {thumbnailUrl && (
          <div className="mt-4">
            <p className="text-sm mb-1">Preview:</p>
            <Image
                src={thumbnailUrl}
                alt="Thumbnail preview"
                width={200}
                height={120}
                className="rounded-md object-cover border"
                unoptimized={true} 
                onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/200x120.png?text=Invalid+URL';
                    e.currentTarget.alt = 'Invalid or broken thumbnail URL';
                }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="in_stock"
          name="in_stock"
          checked={isInStock}
          onCheckedChange={setIsInStock}
          disabled={isLoading}
        />
        <Label htmlFor="in_stock">In Stock</Label>
      </div>

      <div>
        <Label htmlFor="data_ai_hint">Image AI Hint (optional, for placeholder/search)</Label>
        <Input
          id="data_ai_hint"
          name="data_ai_hint"
          defaultValue={product?.data_ai_hint || ''}
          className="mt-1"
          placeholder="e.g., spiritual book, meditation cushion (max 2 words)"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
        {isLoading ? (product ? 'Updating Product...' : 'Creating Product...') : (product ? 'Update Product' : 'Create Product')}
      </Button>
    </form>
  );
}
