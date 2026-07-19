
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { deleteProgramAction } from '@/app/admin/dashboard/programs/actions';
import { useToast } from '@/hooks/use-toast';

interface DeleteProgramButtonProps {
  programId: string;
  programTitle: string;
  onDeleted?: () => void;
}

export default function DeleteProgramButton({ programId, programTitle, onDeleted }: DeleteProgramButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the program "${programTitle}"? This action cannot be undone.`)) {
      return;
    }
    setIsLoading(true);
    const result = await deleteProgramAction(programId);
    setIsLoading(false);

    if (result?.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
      toast({ title: 'Program Deleted', description: `"${programTitle}" has been removed.` });
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
