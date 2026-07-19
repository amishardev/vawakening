
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProgramsForAdmin } from '@/app/admin/dashboard/programs/actions';
import { PlusCircle, Edit, ExternalLink, CalendarDays, Tag, HandHeart, Layers } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import type { ProgramDocument } from '@/types/program';
import DeleteProgramButton from '@/components/admin/DeleteProgramButton';

export default function ManageProgramsPage() {
  const [programs, setPrograms] = useState<ProgramDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      setIsLoading(true);
      const data = await getProgramsForAdmin();
      setPrograms(data);
      setIsLoading(false);
    }
    fetchPrograms();
  }, []);

  function handleDeleted(id: string) {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <HandHeart className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Program Manager</CardTitle>
              </div>
              <CardDescription>View, edit, or delete existing programs. Or create a new one.</CardDescription>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Link href="/admin/dashboard/programs/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Program
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Loading programs...</p>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No programs found.</p>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard/programs/create">Create Your First Program</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {programs.map((program) => (
                <Card key={program.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row">
                    {program.thumbnail_url && (
                      <div className="md:w-1/4 relative min-h-[150px] md:min-h-full">
                        <Image
                          src={program.thumbnail_url}
                          alt={program.title}
                          fill
                          style={{ objectFit: "cover" }}
                          className="md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                          unoptimized={true}
                        />
                      </div>
                    )}
                    <div className={`p-4 sm:p-5 flex-grow ${program.thumbnail_url ? 'md:w-3/4' : 'w-full'}`}>
                      <h3 className="font-headline text-lg sm:text-xl text-primary mb-1">{program.title}</h3>
                      <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            {program.created_at ? format(new Date(program.created_at), 'PPP') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center">
                            <Layers className="h-3 w-3 mr-1" />
                            <span>{program.category}</span>
                        </div>
                        {program.tags && program.tags.length > 0 && (
                          <>
                            <span className="hidden sm:inline">|</span>
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[100px] xxs:max-w-[150px] xs:max-w-[200px] sm:max-w-xs">
                                {program.tags.split(',').map(t => t.trim()).join(', ')}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                        {program.description || 'No description available.'}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/dashboard/programs/edit/${program.id}`}>
                            <Edit className="mr-1.5 h-4 w-4" /> Edit
                          </Link>
                        </Button>
                        <DeleteProgramButton
                          programId={program.id}
                          programTitle={program.title}
                          onDeleted={() => handleDeleted(program.id)}
                        />
                        {program.learn_more_url && (
                            <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                              <a href={program.learn_more_url} target="_blank" rel="noopener noreferrer">
                                View Program Page <ExternalLink className="ml-1.5 h-4 w-4" />
                              </a>
                            </Button>
                        )}
                         <Button asChild variant="ghost" size="sm" className="text-accent/70 hover:text-accent/60">
                           <Link href={`/programs#${program.id}`} target="_blank" rel="noopener noreferrer">
                             View on Site <ExternalLink className="ml-1.5 h-4 w-4" />
                           </Link>
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
