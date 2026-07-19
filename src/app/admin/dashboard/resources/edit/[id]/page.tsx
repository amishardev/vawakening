
'use client';

import { useEffect, useState } from 'react';
import ResourceForm from '@/components/admin/ResourceForm';
import { getResourceById, updateResourceAction } from '@/app/admin/dashboard/resources/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { ResourceDocument } from '@/types/resource';

interface EditResourcePageProps {
  params: { id: string };
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const [resource, setResource] = useState<ResourceDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResource() {
      const data = await getResourceById(params.id);
      setResource(data);
      setIsLoading(false);
    }
    fetchResource();
  }, [params.id]);

  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-16 text-center">Loading resource...</div>;
  }

  if (!resource) {
    notFound();
  }

  const updateActionForResource = updateResourceAction.bind(null, params.id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
         <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Edit3 className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Edit Resource</CardTitle>
          </div>
          <CardDescription>Modify the details of the resource below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceForm resource={resource} action={updateActionForResource} />
        </CardContent>
      </Card>
    </div>
  );
}
