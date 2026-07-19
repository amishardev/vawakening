
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { deleteBlogPostAction } from '@/app/admin/dashboard/blogs/actions';
import { useToast } from '@/hooks/use-toast';

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
  onDeleted?: () => void;
}

export default function DeletePostButton({ postId, postTitle, onDeleted }: DeletePostButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`)) {
      return;
    }
    setIsLoading(true);
    const result = await deleteBlogPostAction(postId);
    setIsLoading(false);

    if (result?.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
      toast({ title: 'Blog Post Deleted', description: `"${postTitle}" has been removed.` });
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
