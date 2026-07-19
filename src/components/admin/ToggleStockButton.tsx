
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toggleStoreProductStockAction } from '@/app/admin/dashboard/store/actions';
import { useToast } from '@/hooks/use-toast';

interface ToggleStockButtonProps {
  productId: string;
  currentStockStatus: boolean;
  onToggled?: (newState: boolean) => void;
}

export default function ToggleStockButton({ productId, currentStockStatus, onToggled }: ToggleStockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // This local state is primarily for immediate UI feedback if needed,
  // but server action revalidation will be the source of truth.
  // const [optimisticStockStatus, setOptimisticStockStatus] = useState(currentStockStatus);

  const handleClick = async () => {
    setIsLoading(true);
    // setOptimisticStockStatus(!optimisticStockStatus); // Optimistic update

    const result = await toggleStoreProductStockAction(productId, currentStockStatus); // Pass current server state

    setIsLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      // Revert optimistic update if server action fails
      // setOptimisticStockStatus(currentStockStatus); 
    } else if (result.success) {
      toast({
        title: 'Stock Status Updated',
        description: `Product is now ${result.newState ? 'In Stock' : 'Out of Stock'}.`,
      });
      if (typeof result.newState === 'boolean') {
        onToggled?.(result.newState);
      }
    }
  };

  const Icon = currentStockStatus ? XCircle : CheckCircle;
  const buttonText = currentStockStatus ? 'Mark as Out of Stock' : 'Mark as In Stock';
  const buttonVariant = currentStockStatus ? 'destructive' : 'secondary';

  return (
    <Button
      onClick={handleClick}
      variant={buttonVariant}
      size="sm"
      disabled={isLoading}
      className="inline-flex items-center"
    >
      {isLoading ? (
        <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <Icon className="mr-1.5 h-4 w-4" />
      )}
      {isLoading ? 'Updating...' : buttonText}
    </Button>
  );
}
