
"use client"; 

import Image from 'next/image';
import { notFound } from 'next/navigation'; 
import { CalendarDays, UserCircle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPublishedBlogPostBySlug } from '@/app/admin/dashboard/blogs/actions';
import type { BlogPostDisplay, BlogPostDocument } from '@/types/blog';
import { format } from 'date-fns';
import { useEffect, useState } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';

function transformPostForDisplay(postDoc: BlogPostDocument | null): BlogPostDisplay | null {
  if (!postDoc) return null;
  
  let tagsArray: string[] = [];
  if (postDoc.tags && typeof postDoc.tags === 'string') {
    tagsArray = postDoc.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  return {
    ...postDoc,
    created_at: postDoc.created_at,
    date: postDoc.created_at ? format(new Date(postDoc.created_at), 'PPP') : 'Date not available',
    tags: tagsArray,
    image: postDoc.thumbnailUrl || 'https://placehold.co/600x400.png',
  };
}

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPostDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const slug = params.slug;

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true);
      const rawPost = await getPublishedBlogPostBySlug(slug);
      const displayPost = transformPostForDisplay(rawPost);
      setPost(displayPost);
      setIsLoading(false);
      if (displayPost) {
        document.title = t('page_title_blog_post', { postTitle: displayPost.title });
      } else {
        document.title = t('page_title_blog_post', { postTitle: "Post Not Found" });
      }
    }
    fetchPost();
  }, [slug, t, language]);

  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-16 text-center">{t('blog_loading_post')}</div>;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground">
      {/* Post Header */}
      <section className="relative py-16 sm:py-20 md:py-32">
        <div className="absolute inset-0">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill 
              style={{objectFit:"cover"}} 
              className="opacity-30"
              data-ai-hint={post.dataAiHint || 'blog header'}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">{post.title}</h1>
          <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-muted-foreground mb-2">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1 sm:mr-1.5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1 sm:mr-1.5" />
              <span>By {post.author}</span>
            </div>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-card text-card-foreground">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Post Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <article className="prose prose-base sm:prose-lg lg:prose-xl max-w-3xl mx-auto text-foreground prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-primary">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
      </section>
      
      {/* Back to Blog button */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <Button asChild variant="outline">
                <Link href="/blog">
                    &larr; {t('blog_post_back_button')}
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}

