
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BlogPostDisplay } from '@/types/blog'; // Updated to use BlogPostDisplay
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { stripHtml } from '@/lib/utils'; // Import the utility
import { useLanguage } from '@/context/LanguageContext';

interface BlogPostCardProps {
  post: BlogPostDisplay; // Changed from BlogPost to BlogPostDisplay
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <Link href={`/blog/${post.slug || post.id}`} className="block">
        <div className="relative w-full h-56">
          <Image
            src={post.image} // image should be thumbnailUrl or fallback
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={post.dataAiHint || 'blog post image'}
          />
        </div>
      </Link>
      <CardHeader>
        <Link href={`/blog/${post.slug || post.id}`} className="block">
          <CardTitle className="font-headline text-xl text-primary hover:text-accent transition-colors">
            {post.title}
          </CardTitle>
        </Link>
        <div className="text-xs text-muted-foreground flex items-center space-x-2 mt-1">
          <div className="flex items-center">
            <CalendarDays className="h-3 w-3 mr-1" />
            {/* 'date' field is now available directly on BlogPostDisplay */}
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <UserCircle className="h-3 w-3 mr-1" />
            <span>{post.author}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-foreground">{stripHtml(post.excerpt)}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
            </div>
        )}
        <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
          <Link href={`/blog/${post.slug || post.id}`}>
            {t('blog_read_more_button')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
