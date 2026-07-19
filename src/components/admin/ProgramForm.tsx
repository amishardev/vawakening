
'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { ProgramDocument } from '@/types/program';
import Image from 'next/image';

interface ProgramFormProps {
  program?: ProgramDocument | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

const programCategories = [
  "Meditation + Mental Health",
  "Social & Economic Empowerment",
  "Environmental Action",
  "Mythology & Meditation Resources",
  "Education & Skill Development",
  "Community Outreach",
  "Other"
];

const iconNameSuggestions = [
  "OmSymbol", "Users", "Leaf", "Zap", "BookOpen", "FileText", "Mic", "Film", "HandHelping", "Award", "Heart", "Smile", "Feather", "Globe"
];


export default function ProgramForm({ program, action }: ProgramFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(program?.thumbnail_url || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(program?.category || programCategories[0]);
  const [longDescription, setLongDescription] = useState<string>(program?.long_description || '');

  const handleThumbnailUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(event.target.value);
  };

  useEffect(() => {
    if (program) {
      setThumbnailUrl(program.thumbnail_url || '');
      setSelectedCategory(program.category || programCategories[0]);
      setLongDescription(program.long_description || '');
    }
  }, [program]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    if (!formData.has('category') && selectedCategory) {
        formData.set('category', selectedCategory);
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
        title: program ? 'Program Updated' : 'Program Created',
        description: program ? 'The program has been successfully updated.' : 'The new program has been successfully created.',
      });
      router.push('/admin/dashboard/programs');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={program?.title || ''}
          required
          className="mt-1"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory} required>
          <SelectTrigger className="w-full mt-1" disabled={isLoading}>
            <SelectValue placeholder="Select program category" />
          </SelectTrigger>
          <SelectContent>
            {programCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Short Description (for previews)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={program?.description || ''}
          rows={3}
          className="mt-1"
          placeholder="A brief summary of the program."
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="long_description">Detailed Description (HTML allowed)</Label>
        <Tabs defaultValue="edit" className="mt-1">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Textarea
              id="long_description"
              name="long_description"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={10}
              placeholder="Provide a comprehensive description of the program. You can use HTML for formatting."
              disabled={isLoading}
            />
          </TabsContent>
          <TabsContent value="preview">
            {longDescription ? (
              <article
                className="prose prose-sm sm:prose-base max-w-none min-h-[200px] rounded-md border border-input bg-background px-3 py-2 prose-headings:font-headline prose-headings:text-primary prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: longDescription }}
              />
            ) : (
              <p className="min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                Nothing to preview yet — start typing in the Edit tab.
              </p>
            )}
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground mt-1">
          Basic formatting: Use HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;.
        </p>
      </div>

      <div>
        <Label htmlFor="learn_more_url">Learn More URL (optional)</Label>
        <Input
          id="learn_more_url"
          name="learn_more_url"
          type="url"
          defaultValue={program?.learn_more_url || ''}
          className="mt-1"
          placeholder="https://example.com/program-details"
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

      <div>
        <Label htmlFor="icon_name">Icon Name (optional, e.g., Users, Leaf, OmSymbol)</Label>
        <Input
          id="icon_name"
          name="icon_name"
          defaultValue={program?.icon_name || ''}
          className="mt-1"
          placeholder="Lucide icon name or OmSymbol"
          list="icon-suggestions"
          disabled={isLoading}
        />
        <datalist id="icon-suggestions">
          {iconNameSuggestions.map(icon => <option key={icon} value={icon} />)}
        </datalist>
        <p className="text-xs text-muted-foreground mt-1">
          Enter a Lucide icon name (e.g., HandHelping) or OmSymbol. See Lucide React website for names.
        </p>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={program?.tags || ''}
          className="mt-1"
          placeholder="e.g., Wellness, Community, Youth"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="data_ai_hint">Image AI Hint (optional)</Label>
        <Input
          id="data_ai_hint"
          name="data_ai_hint"
          defaultValue={program?.data_ai_hint || ''}
          className="mt-1"
          placeholder="e.g., community gathering, nature meditation (max 2 words)"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
        {isLoading ? (program ? 'Updating...' : 'Creating...') : (program ? 'Update Program' : 'Create Program')}
      </Button>
    </form>
  );
}
