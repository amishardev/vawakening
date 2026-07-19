
"use client"; 

import Image from 'next/image';
import BlogPostCard from '@/components/shared/BlogPostCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getPublishedBlogPosts } from '@/app/admin/dashboard/blogs/actions';
import type { BlogPostDisplay, BlogPostDocument } from '@/types/blog';
import { format } from 'date-fns';
import { useEffect, useState, useMemo, FormEvent, Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';

function transformPostForDisplay(postDoc: BlogPostDocument): BlogPostDisplay {
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

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 md:px-6 py-16 text-center">Loading...</div>}>
      <BlogPageContent />
    </Suspense>
  );
}

function BlogPageContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [allDisplayPosts, setAllDisplayPosts] = useState<BlogPostDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || ''); 
  const [currentFilterQuery, setCurrentFilterQuery] = useState(searchParams.get('query') || ''); 

  useEffect(() => {
    document.title = t('page_title_blog');
  }, [t, language]);

  useEffect(() => {
    async function fetchPosts() {
      const rawPosts = await getPublishedBlogPosts();
      setAllDisplayPosts(rawPosts.map(transformPostForDisplay));
    }
    fetchPosts();
  }, []);
  
  useEffect(() => {
    setCurrentFilterQuery(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPath = searchQuery ? `/blog?query=${encodeURIComponent(searchQuery)}` : '/blog';
    router.push(newPath); 
  };
  
  const postsToDisplay = useMemo(() => {
    if (!currentFilterQuery) return allDisplayPosts;
    const lowerQuery = currentFilterQuery.toLowerCase();
    return allDisplayPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }, [allDisplayPosts, currentFilterQuery]);


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
           <div className="inline-block p-3 sm:p-4 bg-primary-foreground/10 rounded-full mb-6 animate-fade-in">
            <Image
              src="https://github.com/amishsharmadevapp/vivekafound/blob/main/Untitled_design__10_-removebg-preview.png?raw=true"
              alt={t('blog_hero_alt_icon') || "Vivekananda Awakening Foundation Blog Icon"}
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12"
              priority
            />
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in delay-100">
            {t('blog_hero_title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto animate-slide-in-up delay-300">
            {t('blog_hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Blog List Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-12">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg mx-auto">
              <Input 
                type="search" 
                name="query"
                placeholder={t('blog_search_placeholder')}
                className="flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search blog posts"
              />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">{t('blog_search_button')}</span>
              </Button>
            </form>
          </div>

          {postsToDisplay.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {postsToDisplay.map((post, index) => (
                <div key={post.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <BlogPostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="font-headline text-xl sm:text-2xl text-primary mb-4">{t('blog_no_posts_title')}</h2>
              <p className="text-md sm:text-lg text-muted-foreground">
                {currentFilterQuery ? 
                  (t('blog_no_posts_query_message', { query: currentFilterQuery })) : 
                  (t('blog_no_posts_default_message'))}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
// Add to LanguageContext.tsx 'en':
// "blog_hero_alt_icon": "Vivekananda Awakening Foundation Blog Icon",

