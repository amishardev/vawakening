
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getResourcesForAdmin } from '@/app/admin/dashboard/resources/actions';
import { PlusCircle, Edit, ListChecks, ExternalLink, CalendarDays, Tag, Library, Film, FileText, Mic } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import type { ResourceDocument } from '@/types/resource';
import DeleteResourceButton from '@/components/admin/DeleteResourceButton';

function getTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'article':
      return <FileText className="h-4 w-4 mr-1.5" />;
    case 'video':
      return <Film className="h-4 w-4 mr-1.5" />;
    case 'podcast':
      return <Mic className="h-4 w-4 mr-1.5" />;
    default:
      return <Library className="h-4 w-4 mr-1.5" />;
  }
}

export default function ManageResourcesPage() {
  const [resources, setResources] = useState<ResourceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      setIsLoading(true);
      const data = await getResourcesForAdmin();
      setResources(data);
      setIsLoading(false);
    }
    fetchResources();
  }, []);

  function handleDeleted(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ListChecks className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Resource Manager</CardTitle>
              </div>
              <CardDescription>View, edit, or delete existing resources. Or create a new one.</CardDescription>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Link href="/admin/dashboard/resources/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Resource
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Loading resources...</p>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No resources found.</p>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard/resources/create">Create Your First Resource</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row">
                    {resource.thumbnail_url && (
                      <div className="md:w-1/4 relative min-h-[150px] md:min-h-full">
                        <Image
                          src={resource.thumbnail_url}
                          alt={resource.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                          unoptimized={true}
                        />
                      </div>
                    )}
                    <div className={`p-4 sm:p-5 flex-grow ${resource.thumbnail_url ? 'md:w-3/4' : 'w-full'}`}>
                      <h3 className="font-headline text-lg sm:text-xl text-primary mb-1">{resource.name}</h3>
                      <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            {resource.created_at ? format(new Date(resource.created_at), 'PPP') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center">
                            {getTypeIcon(resource.type)}
                            <span>{resource.type}</span>
                        </div>
                        {resource.tags && resource.tags.length > 0 && (
                          <>
                            <span className="hidden sm:inline">|</span>
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[100px] xxs:max-w-[150px] xs:max-w-[200px] sm:max-w-xs">
                                {resource.tags.split(',').map(t => t.trim()).join(', ')}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                        {resource.short_description || 'No description available.'}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/dashboard/resources/edit/${resource.id}`}>
                            <Edit className="mr-1.5 h-4 w-4" /> Edit
                          </Link>
                        </Button>
                        <DeleteResourceButton
                          resourceId={resource.id}
                          resourceName={resource.name}
                          onDeleted={() => handleDeleted(resource.id)}
                        />
                        <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            View Resource <ExternalLink className="ml-1.5 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
