
'use client';

import ResourceForm from '@/components/admin/ResourceForm';
import { addResourceAction } from '@/app/admin/dashboard/resources/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePlus2 } from 'lucide-react';

export default function CreateResourcePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <FilePlus2 className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Create New Resource</CardTitle>
          </div>
          <CardDescription>Fill in the details below to add a new resource.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceForm action={addResourceAction} />
        </CardContent>
      </Card>
    </div>
  );
}
