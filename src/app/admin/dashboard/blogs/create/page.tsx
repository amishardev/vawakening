
'use client';

import BlogForm from '@/components/admin/BlogForm';
import { addBlogPostAction } from '@/app/admin/dashboard/blogs/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePlus2 } from 'lucide-react';

export default function CreateBlogPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <FilePlus2 className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Create New Blog Post</CardTitle>
          </div>
          <CardDescription>Fill in the details below to publish a new article.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm action={addBlogPostAction} />
        </CardContent>
      </Card>
    </div>
  );
}
