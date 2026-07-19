
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getBlogPostsForAdmin } from '@/app/admin/dashboard/blogs/actions';
import { PlusCircle, Edit, ListChecks, ExternalLink, CalendarDays, Tag } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import type { BlogPostDocument } from '@/types/blog';
import DeletePostButton from '@/components/admin/DeletePostButton';

export default function ManageBlogsPage() {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      const data = await getBlogPostsForAdmin();
      setPosts(data);
      setIsLoading(false);
    }
    fetchPosts();
  }, []);

  function handleDeleted(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ListChecks className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Blog Manager</CardTitle>
              </div>
              <CardDescription>View, edit, or delete existing blog posts. Or create a new one.</CardDescription>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Link href="/admin/dashboard/blogs/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No blog posts found.</p>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard/blogs/create">Create Your First Post</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row">
                    {post.thumbnailUrl && (
                      <div className="md:w-1/4 relative min-h-[150px] md:min-h-full">
                        <Image
                          src={post.thumbnailUrl}
                          alt={post.title}
                          fill
                          style={{objectFit:"cover"}}
                          className="md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                        />
                      </div>
                    )}
                    <div className={`p-4 sm:p-5 flex-grow ${post.thumbnailUrl ? 'md:w-3/4' : 'w-full'}`}>
                      <h3 className="font-headline text-lg sm:text-xl text-primary mb-1">{post.title}</h3>
                      <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            {post.created_at ? format(new Date(post.created_at), 'PPP') : 'N/A'}
                          </span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <>
                            <span className="hidden sm:inline">|</span>
                            <div className="flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[100px] xxs:max-w-[150px] xs:max-w-[200px] sm:max-w-xs">{post.tags}</span>
                            </div>
                            </>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                        {post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No excerpt available.')}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/dashboard/blogs/edit/${post.id}`}>
                            <Edit className="mr-1.5 h-4 w-4" /> Edit
                          </Link>
                        </Button>
                        <DeletePostButton
                          postId={post.id}
                          postTitle={post.title}
                          onDeleted={() => handleDeleted(post.id)}
                        />
                        <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                           <Link href={`/blog/${post.slug || post.id}`} target="_blank" rel="noopener noreferrer">
                             View Post <ExternalLink className="ml-1.5 h-4 w-4" />
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
