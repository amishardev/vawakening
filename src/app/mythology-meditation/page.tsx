
"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, type ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, Mic, Film, HelpCircle, Library } from 'lucide-react'; // Added Library
import { Button } from '@/components/ui/button';
import { getPublishedResources } from '@/app/admin/dashboard/resources/actions'; // Fetch from Firestore
import type { ResourceDocument, ResourceDisplay } from '@/types/resource';
import { format } from 'date-fns';

// Helper to map DB resource type to an icon component
const getTypeIcon = (type?: string): ReactNode => {
  if (!type) return <Library className="h-5 w-5 text-primary" />;
  switch (type.toLowerCase()) {
    case 'article': return <FileText className="h-5 w-5 text-primary" />;
    case 'video': return <Film className="h-5 w-5 text-primary" />;
    case 'podcast': return <Mic className="h-5 w-5 text-primary" />;
    default: return <Library className="h-5 w-5 text-primary" />;
  }
};

// Transform ResourceDocument from DB to ResourceDisplay for the page
function transformResourceForDisplay(resourceDoc: ResourceDocument): ResourceDisplay {
  let tagsArray: string[] = [];
  if (resourceDoc.tags && typeof resourceDoc.tags === 'string') {
    tagsArray = resourceDoc.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  return {
    ...resourceDoc,
    displayDate: resourceDoc.created_at ? format(new Date(resourceDoc.created_at), 'PPP') : 'Date not available',
    tags: tagsArray,
    image: resourceDoc.thumbnail_url || `https://placehold.co/600x400.png?text=${encodeURIComponent(resourceDoc.type || 'Resource')}`,
    // dataAiHint is optional and might not be in DB, default if needed
    dataAiHint: resourceDoc.dataAiHint || resourceDoc.type?.toLowerCase() || 'resource image',
  };
}


export default function MythologyMeditationPage() {
  const { t, language } = useLanguage();
  const [allResources, setAllResources] = useState<ResourceDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = t('page_title_mythology_meditation');
  }, [t, language]);

  useEffect(() => {
    async function fetchResources() {
      setIsLoading(true);
      try {
        const rawResources = await getPublishedResources();
        setAllResources(rawResources.map(transformResourceForDisplay));
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        // Optionally set an error state to display to the user
      }
      setIsLoading(false);
    }
    fetchResources();
  }, []);

  const articles = allResources.filter(r => r.type.toLowerCase() === 'article');
  const videos = allResources.filter(r => r.type.toLowerCase() === 'video');
  const podcasts = allResources.filter(r => r.type.toLowerCase() === 'podcast');

  const ResourceCardDisplay = ({ resource }: { resource: ResourceDisplay }) => (
    <Card id={resource.id} className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <div className="relative w-full h-48">
        <Image
          src={resource.image}
          alt={resource.name}
          fill
          style={{objectFit:"cover"}}
          data-ai-hint={resource.dataAiHint}
          unoptimized={true} // Added unoptimized prop here
          onError={(e) => e.currentTarget.src = `https://placehold.co/600x400.png?text=${encodeURIComponent(resource.type || 'Error')}`}
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded">
          {resource.type ? (resource.type.charAt(0).toUpperCase() + resource.type.slice(1)) : 'Resource'}
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {getTypeIcon(resource.type)}
          <CardTitle className="font-headline text-xl text-primary">{resource.name}</CardTitle>
        </div>
         <p className="text-xs text-muted-foreground">
            {resource.displayDate}
            {resource.tags.length > 0 && ` • Tags: ${resource.tags.join(', ')}`}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-foreground line-clamp-3">{resource.short_description}</CardDescription>
      </CardContent>
      <CardFooter>
         {resource.link &&
           <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
             <a href={resource.link} target="_blank" rel="noopener noreferrer">
               {resource.type === 'Article' ? t('mythology_read_article_button', {defaultValue: 'Read Article'}) 
                : resource.type === 'Video' ? t('mythology_watch_video_button', {defaultValue: 'Watch Video'}) 
                : resource.type === 'Podcast' ? t('mythology_listen_podcast_button', {defaultValue: 'Listen to Podcast'}) 
                : t('mythology_view_resource_button', {defaultValue: 'View Resource'})}
               <ExternalLink className="ml-2 h-4 w-4" />
             </a>
           </Button>
         }
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-16 text-center">Loading resources...</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/70 via-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block p-3 sm:p-4 bg-primary-foreground/10 rounded-full mb-6 animate-fade-in">
            <Image
              src="https://github.com/amishsharmadevapp/vivekafound/blob/main/Untitled_design__10_-removebg-preview.png?raw=true"
              alt={t('mythology_hero_alt_icon') || "Mythology & Meditation Icon"}
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12"
              priority
            />
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in delay-100">
            {t('mythology_hero_title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto animate-slide-in-up delay-300">
            {t('mythology_hero_subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-headline text-2xl sm:text-3xl text-primary mb-4">{t('mythology_intro_title')}</h2>
            <p className="text-md sm:text-lg mb-6">
              {t('mythology_intro_p1')}
            </p>
          </div>
        </div>
      </section>

      <Tabs defaultValue="all" className="w-full container mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mb-8 md:mb-12">
          <TabsTrigger value="all">{t('mythology_tab_all')}</TabsTrigger>
          <TabsTrigger value="articles">{t('mythology_tab_articles')}</TabsTrigger>
          <TabsTrigger value="videos">{t('mythology_tab_videos')}</TabsTrigger>
          <TabsTrigger value="podcasts">{t('mythology_tab_podcasts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allResources.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {allResources.map((resource, index) => (
                <div key={resource.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <ResourceCardDisplay resource={resource} />
                </div>
              ))}
            </div>
          ) : <p className="text-center text-md sm:text-lg text-muted-foreground py-8">{t('mythology_no_resources_message', {defaultValue: "No resources available yet. Check back soon!"})}</p>}
        </TabsContent>
        <TabsContent value="articles">
           {articles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((resource, index) => (
                 <div key={resource.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <ResourceCardDisplay resource={resource} />
                </div>
              ))}
            </div>
          ) : <p className="text-center text-md sm:text-lg text-muted-foreground py-8">{t('mythology_no_articles_message')}</p>}
        </TabsContent>
        <TabsContent value="videos">
           {videos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {videos.map((resource, index) => (
                <div key={resource.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <ResourceCardDisplay resource={resource} />
                </div>
              ))}
            </div>
          ) : <p className="text-center text-md sm:text-lg text-muted-foreground py-8">{t('mythology_no_videos_message')}</p>}
        </TabsContent>
        <TabsContent value="podcasts">
          {podcasts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {podcasts.map((resource, index) => (
                <div key={resource.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <ResourceCardDisplay resource={resource} />
                </div>
              ))}
            </div>
          ) : <p className="text-center text-md sm:text-lg text-muted-foreground py-8">{t('mythology_no_podcasts_message')}</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

    