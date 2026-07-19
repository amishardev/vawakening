
'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { BlogPostDocument } from '@/types/blog';
import Image from 'next/image';

interface BlogFormProps {
  post?: BlogPostDocument | null; // For editing
  action: (formData: FormData) => Promise<{ error?: string; id?: string } | void>;
}

export default function BlogForm({ post, action }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Initialize thumbnailUrl from post or as empty string
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(post?.thumbnailUrl || '');
  const [contentValue, setContentValue] = useState<string>(post?.content || '');

  // Update thumbnailUrl state when input changes
  const handleThumbnailUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(event.target.value);
  };

  // Update contentValue when textarea changes
  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentValue(event.target.value);
  };

  // Ensure form fields are pre-filled if 'post' data changes (e.g., navigating between edit pages)
  useEffect(() => {
    if (post) {
      setThumbnailUrl(post.thumbnailUrl || '');
      setContentValue(post.content || '');
    }
  }, [post]);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    // The thumbnailUrl is already part of formData due to the input's name attribute.

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
        title: post ? 'Blog Post Updated' : 'Blog Post Created',
        description: post ? 'Your blog post has been successfully updated.' : 'Your new blog post has been successfully created.',
      });
      router.push('/admin/dashboard/blogs');
      router.refresh();
    }
  }

  // Handle tags display: if post.tags is a string, use it; otherwise, default to empty.
  const defaultTagsValue = typeof post?.tags === 'string' ? post.tags : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={post?.title || ''}
          required
          className="mt-1"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="content">Content (HTML allowed)</Label>
        <Tabs defaultValue="edit" className="mt-1">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Textarea
              id="content"
              name="content"
              value={contentValue} // Use controlled component for content
              onChange={handleContentChange}
              required
              rows={15}
              placeholder="Write your blog post content here. You can use HTML tags (e.g., <h1>, <p>, <strong>) for formatting. Hindi text is supported."
              disabled={isLoading}
            />
          </TabsContent>
          <TabsContent value="preview">
            {contentValue ? (
              <article
                className="prose prose-sm sm:prose-base max-w-none min-h-[300px] rounded-md border border-input bg-background px-3 py-2 prose-headings:font-headline prose-headings:text-primary prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: contentValue }}
              />
            ) : (
              <p className="min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                Nothing to preview yet — start typing in the Edit tab.
              </p>
            )}
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground mt-1">
          Basic formatting: Use HTML tags like &lt;h1&gt;-&lt;h6&gt; for headings, &lt;p&gt; for paragraphs, &lt;strong&gt; for bold, &lt;em&gt; for italics.
        </p>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={defaultTagsValue}
          className="mt-1"
          placeholder="e.g., Meditation, Wellness, Spirituality"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="thumbnailUrl">Thumbnail Image URL (GitHub raw link)</Label>
        <Input
          id="thumbnailUrl"
          name="thumbnailUrl"
          type="text"
          value={thumbnailUrl} // Controlled component
          onChange={handleThumbnailUrlChange}
          className="mt-1"
          placeholder="https://raw.githubusercontent.com/user/repo/main/image.png"
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
                    // Fallback if image fails to load, e.g. broken URL
                    e.currentTarget.src = 'https://placehold.co/200x120.png?text=Invalid+URL';
                }}
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
        {isLoading ? (post ? 'Updating...' : 'Creating...') : (post ? 'Update Post' : 'Create Post')}
      </Button>
    </form>
  );
}
