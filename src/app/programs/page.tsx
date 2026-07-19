
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, HandHelping, Users, Leaf, Zap, BookOpen, HelpCircle, ExternalLink, Layers } from 'lucide-react'; // Added Layers
import { OmSymbol } from '@/components/shared/OmSymbol';
import React, { useEffect, useState, ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProgramDocument, ProgramDisplay } from '@/types/program'; // Using new types
import { getPublishedPrograms } from '@/app/admin/dashboard/programs/actions'; // Fetch from Firestore
import { format } from 'date-fns';

// Helper to map string icon name to an icon component
const getIconComponent = (iconName?: string): ReactNode => {
  if (!iconName || typeof iconName !== 'string') return <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;

  const normalizedIconName = iconName.toLowerCase();
  switch (normalizedIconName) {
    case 'omsymbol': return <OmSymbol className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
    case 'users': return <Users className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
    case 'leaf': return <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
    case 'zap': return <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
    case 'bookopen': return <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
    case 'handhelping': return <HandHelping className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
    // Add more specific mappings if needed or rely on a dynamic import for all lucide-react icons
    // For simplicity, let's keep a few common ones and a default.
    default:
      // Attempt to find a matching Lucide icon (case-insensitive for common icons)
      // This is a simplified approach. A more robust solution might involve a larger mapping
      // or ensuring iconName matches Lucide export names exactly.
      const LucideIcons: { [key: string]: React.FC<any> } = { Users, Leaf, Zap, BookOpen, HandHelping, Layers };
      const IconComp = Object.keys(LucideIcons).find(key => key.toLowerCase() === normalizedIconName);
      if (IconComp) {
        const ActualIcon = LucideIcons[IconComp];
        return <ActualIcon className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
      }
      return <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />;
  }
};

// Transform ProgramDocument from DB to ProgramDisplay for the page
function transformProgramForDisplay(programDoc: ProgramDocument): ProgramDisplay {
  let tagsArray: string[] = [];
  if (programDoc.tags && typeof programDoc.tags === 'string') {
    tagsArray = programDoc.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  return {
    ...programDoc,
    created_at: programDoc.created_at, // Keep original
    displayDate: programDoc.created_at ? format(new Date(programDoc.created_at), 'PPP') : 'Date not available',
    tags: tagsArray,
    image: programDoc.thumbnail_url || `https://placehold.co/400x300.png?text=${encodeURIComponent(programDoc.title)}`,
    data_ai_hint: programDoc.data_ai_hint || 'program image',
  };
}


export default function ProgramsPage() {
  const { t, language } = useLanguage();
  const [allPrograms, setAllPrograms] = useState<ProgramDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = t('page_title_programs');
  }, [t, language]);

  useEffect(() => {
    async function fetchPrograms() {
      setIsLoading(true);
      try {
        const rawPrograms = await getPublishedPrograms();
        setAllPrograms(rawPrograms.map(transformProgramForDisplay));
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
      setIsLoading(false);
    }
    fetchPrograms();
  }, []);

  const categories = Array.from(new Set(allPrograms.map(p => p.category).filter(Boolean)));

  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-16 text-center">{t('programs_loading')}</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {t('programs_hero_title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto animate-slide-in-up delay-200">
            {t('programs_hero_subtitle')}
          </p>
        </div>
      </section>

      {categories.map(category => (
        <section key={category} id={(category).toLowerCase().replace(/\s\W/g, '-')} className="py-12 md:py-16 first:pt-16 md:first:pt-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-10 text-center md:text-left">
              {category}
            </h2>
            <div className="grid md:grid-cols-1 gap-8 md:gap-12">
              {allPrograms.filter(p => p.category === category).map((program, index) => (
                <Card key={program.id} id={program.id} className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col md:flex-row items-stretch animate-fade-in`} style={{animationDelay: `${index * 100}ms`}}>
                  {program.image && (
                    <div className="md:w-1/3 relative min-h-[200px] sm:min-h-[250px] md:min-h-full bg-muted">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        style={{objectFit:"cover"}}
                        data-ai-hint={program.data_ai_hint || 'program image'}
                        className="md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                        unoptimized={true}
                        onError={(e) => e.currentTarget.src = `https://placehold.co/400x300.png?text=${encodeURIComponent(program.title)}`}
                      />
                    </div>
                  )}
                  <div className={`flex flex-col p-4 sm:p-6 ${program.image ? 'md:w-2/3' : 'w-full'}`}>
                    <CardHeader className="p-0 pb-3 sm:pb-4">
                       <div className="flex items-center gap-2 sm:gap-3 mb-1">
                        {getIconComponent(program.icon_name)}
                        <CardTitle className="font-headline text-xl sm:text-2xl text-primary">{program.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <CardDescription className="text-foreground text-sm sm:text-base mb-2 line-clamp-3">{program.description}</CardDescription>
                      {program.long_description && <div className="text-muted-foreground text-xs sm:text-sm line-clamp-4 prose prose-sm prose-p:my-1 prose-headings:my-1" dangerouslySetInnerHTML={{ __html: program.long_description }} />}
                    </CardContent>
                    <div className="p-0 pt-4 sm:pt-6">
                        {program.learn_more_url ? (
                             <Button asChild className="mt-auto bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                               <Link href={program.learn_more_url} target='_blank' rel='noopener noreferrer'>
                                {t('programs_get_involved_button')} <ExternalLink className="ml-2 h-4 w-4" />
                               </Link>
                            </Button>
                        ) : (
                            <Button asChild className="mt-auto bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                               <Link href={`/#introduction?program=${encodeURIComponent(program.title)}`}>
                                {t('programs_get_involved_button')} <HandHelping className="ml-2 h-4 w-4" />
                               </Link>
                            </Button>
                        )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
             {allPrograms.filter(p => p.category === category).length === 0 && (
                <p className="text-center text-muted-foreground">{t('programs_no_programs_in_category', { category })}</p>
            )}
          </div>
        </section>
      ))}
      {allPrograms.length === 0 && !isLoading && (
         <div className="container mx-auto px-4 md:px-6 py-16 text-center">
            <p className="text-lg text-muted-foreground">{t('programs_no_programs_available')}</p>
        </div>
      )}

      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-6">
            {t('programs_cta_title')}
          </h2>
          <p className="text-md sm:text-lg text-foreground max-w-2xl mx-auto mb-8">
            {t('programs_cta_subtitle')}
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/#introduction">
                {t('programs_cta_button', {defaultValue: "Support Our Work"})} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
