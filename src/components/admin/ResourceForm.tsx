
'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { ResourceDocument } from '@/types/resource';
import Image from 'next/image';

interface ResourceFormProps {
  resource?: ResourceDocument | null; // For editing
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

const resourceTypes: ResourceDocument['type'][] = ['Article', 'Video', 'Podcast', 'Other'];

export default function ResourceForm({ resource, action }: ResourceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(resource?.thumbnail_url || '');
  const [selectedType, setSelectedType] = useState<string>(resource?.type || resourceTypes[0]);

  const handleThumbnailUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(event.target.value);
  };

  useEffect(() => {
    if (resource) {
      setThumbnailUrl(resource.thumbnail_url || '');
      setSelectedType(resource.type || resourceTypes[0]);
    }
  }, [resource]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    // Ensure 'type' is correctly added to formData if Select doesn't do it by name
    if (!formData.has('type') && selectedType) {
        formData.set('type', selectedType);
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
        title: resource ? 'Resource Updated' : 'Resource Created',
        description: resource ? 'The resource has been successfully updated.' : 'The new resource has been successfully created.',
      });
      router.push('/admin/dashboard/resources');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Name (Title)</Label>
        <Input
          id="name"
          name="name"
          defaultValue={resource?.name || ''}
          required
          className="mt-1"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="short_description">Short Description</Label>
        <Textarea
          id="short_description"
          name="short_description"
          defaultValue={resource?.short_description || ''}
          rows={3}
          className="mt-1"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="link">Link (URL)</Label>
        <Input
          id="link"
          name="link"
          type="url"
          defaultValue={resource?.link || ''}
          required
          className="mt-1"
          placeholder="https://example.com/resource"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="type">Type</Label>
        <Select name="type" value={selectedType} onValueChange={setSelectedType} required>
          <SelectTrigger className="w-full mt-1" disabled={isLoading}>
            <SelectValue placeholder="Select resource type" />
          </SelectTrigger>
          <SelectContent>
            {resourceTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={resource?.tags || ''}
          className="mt-1"
          placeholder="e.g., Meditation, Wellness, Spirituality"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="thumbnail_url">Thumbnail Image URL (GitHub raw link or direct URL)</Label>
        <Input
          id="thumbnail_url"
          name="thumbnail_url"
          type="url"
          value={thumbnailUrl}
          onChange={handleThumbnailUrlChange}
          className="mt-1"
          placeholder="https://example.com/image.png"
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

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
        {isLoading ? (resource ? 'Updating...' : 'Creating...') : (resource ? 'Update Resource' : 'Create Resource')}
      </Button>
    </form>
  );
}
