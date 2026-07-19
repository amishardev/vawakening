
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { deleteResourceAction } from '@/app/admin/dashboard/resources/actions';
import { useToast } from '@/hooks/use-toast';

interface DeleteResourceButtonProps {
  resourceId: string;
  resourceName: string;
  onDeleted?: () => void;
}

export default function DeleteResourceButton({ resourceId, resourceName, onDeleted }: DeleteResourceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the resource "${resourceName}"? This action cannot be undone.`)) {
      return;
    }
    setIsLoading(true);
    const result = await deleteResourceAction(resourceId);
    setIsLoading(false);

    if (result?.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
      toast({ title: 'Resource Deleted', description: `"${resourceName}" has been removed.` });
      onDeleted?.();
    }
  }

  return (
    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
      {isLoading ? <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1.5 h-4 w-4" />}
      Delete
    </Button>
  );
}
