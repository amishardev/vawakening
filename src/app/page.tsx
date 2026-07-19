
"use client"; // Mark as client component to use LanguageContext

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, Users2, Leaf, Lightbulb, Users, GraduationCap } from 'lucide-react';
import { OmSymbol } from '@/components/shared/OmSymbol';
import { MandalaSymbol } from '@/components/shared/MandalaSymbol';
import { getFeaturedBlogPosts } from '@/app/admin/dashboard/blogs/actions';
import type { BlogPostDisplay, BlogPostDocument } from '@/types/blog';
import { format } from 'date-fns';
import { stripHtml } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Images generated for the redesign
const HERO_IMAGE = "https://raw.githubusercontent.com/amishardev/vawakeningimg/refs/heads/main/ChatGPT%20Image%20Jul%2018%2C%202026%2C%2009_11_31%20PM.png";
const PROCESS_IMAGE = "https://raw.githubusercontent.com/amishardev/vawakeningimg/refs/heads/main/ChatGPT%20Image%20Jul%2018%2C%202026%2C%2009_14_45%20PM.png";
const FINAL_CTA_IMAGE = "https://raw.githubusercontent.com/amishardev/vawakeningimg/refs/heads/main/ChatGPT%20Image%20Jul%2018%2C%202026%2C%2009_15_22%20PM.png";

// Existing foundation image assets (already hosted, reused here)
const MEDITATION_PROGRAM_IMAGE = "https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Assistant_A_Mindful_Living_%26_Med.png";
const WOMEN_EMPOWERMENT_IMAGE = "https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Assistant_A_Shakti__Women_Empowe.webp";
const INSPIRED_AVATAR_IMAGE = "https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Untitled%20design%20(7).png";

// Helper function to transform BlogPostDocument to BlogPostDisplay
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

export default function HomePage() {
  const { t, language } = useLanguage();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostDisplay[]>([]);
  const [rawFeaturedPostsLength, setRawFeaturedPostsLength] = useState(0);

  useEffect(() => {
    document.title = t('page_title_home');
  }, [t, language]);

  useEffect(() => {
    async function fetchPosts() {
      const rawPosts = await getFeaturedBlogPosts(4);
      setFeaturedPosts(rawPosts.map(transformPostForDisplay));
      setRawFeaturedPostsLength(rawPosts.length);
    }
    fetchPosts();
  }, []);

  const heroStats = [
    { icon: <Sparkles className="h-5 w-5 text-primary-foreground/90" />, titleKey: 'home_stat1_title', descKey: 'home_stat1_desc' },
    { icon: <BookOpen className="h-5 w-5 text-primary-foreground/90" />, titleKey: 'home_stat2_title', descKey: 'home_stat2_desc' },
    { icon: <Users2 className="h-5 w-5 text-primary-foreground/90" />, titleKey: 'home_stat3_title', descKey: 'home_stat3_desc' },
  ];

  const services = [
    { icon: <OmSymbol className="h-7 w-7 text-accent" />, titleKey: 'home_service1_title', descKey: 'home_service1_desc' },
    { icon: <Users className="h-7 w-7 text-accent" />, titleKey: 'home_service2_title', descKey: 'home_service2_desc' },
    { icon: <GraduationCap className="h-7 w-7 text-accent" />, titleKey: 'home_service3_title', descKey: 'home_service3_desc' },
    { icon: <Leaf className="h-7 w-7 text-accent" />, titleKey: 'home_service4_title', descKey: 'home_service4_desc' },
  ];

  const steps = [
    { numberKey: 'home_step1_number', titleKey: 'home_step1_title', descKey: 'home_step1_desc' },
    { numberKey: 'home_step2_number', titleKey: 'home_step2_title', descKey: 'home_step2_desc' },
    { numberKey: 'home_step3_number', titleKey: 'home_step3_title', descKey: 'home_step3_desc' },
  ];

  const whyChooseFeatures = [
    { icon: <MandalaSymbol className="h-7 w-7 text-accent" />, nameKey: 'about_value_holistic_growth_name', descKey: 'about_value_holistic_growth_desc' },
    { icon: <Users2 className="h-7 w-7 text-accent" />, nameKey: 'about_value_inclusiveness_name', descKey: 'about_value_inclusiveness_desc' },
    { icon: <Lightbulb className="h-7 w-7 text-accent" />, nameKey: 'about_value_empowerment_name', descKey: 'about_value_empowerment_desc' },
    { icon: <Leaf className="h-7 w-7 text-accent" />, nameKey: 'about_value_sustainability_name', descKey: 'about_value_sustainability_desc' },
  ];

  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section - pulled up under the transparent header so the image runs full-bleed to the top */}
      <section className="relative -mt-20 min-h-[92vh] sm:min-h-[95vh] overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="A person meditating at sunset, overlooking a forested valley"
          fill
          priority
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/60" />

        <div className="relative z-10 flex flex-col min-h-[92vh] sm:min-h-[95vh] px-6 md:px-12 pt-40 md:pt-56 pb-10 md:pb-12">
          {/* Headline */}
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground max-w-2xl leading-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.4)] animate-fade-in">
            <span className="block">{t('home_hero_title_line1')}</span>
            <span className="block text-primary-foreground/80 font-medium">{t('home_hero_title_line2')}</span>
          </h1>

          {/* Flexible spacer: keeps breathing room above the bottom cluster without pulling it apart */}
          <div className="flex-1 min-h-12" />

          {/* Bottom cluster: each caption sits directly above the content it belongs to */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-md">
              <p className="text-primary-foreground/80 text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 animate-fade-in">
                {t('home_hero_tag_left')}
              </p>
              <p className="text-base sm:text-lg text-primary-foreground/90 mb-6 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)] animate-slide-in-up delay-200">
                {t('home_hero_subtitle')}
              </p>
              <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-8 animate-slide-in-up delay-400">
                <Link href="/about">{t('home_explore_button')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3">
              <p className="text-primary-foreground/80 text-xs sm:text-sm tracking-[0.2em] uppercase animate-fade-in">
                {t('home_hero_tag_right')}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap divide-y sm:divide-y-0 sm:divide-x divide-primary-foreground/15 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl overflow-hidden">
                {heroStats.map((stat) => (
                  <div key={stat.titleKey} className="flex items-center gap-2.5 px-4 py-3 sm:px-5 w-full sm:w-auto">
                    <div className="shrink-0">{stat.icon}</div>
                    <p className="text-xs sm:text-[13px] font-medium text-primary-foreground leading-snug max-w-[10rem]">
                      {t(stat.descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro strip: tagline */}
      <section className="py-8 md:py-10 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">{t('home_welcome_title')}</p>
          <p className="font-headline italic text-lg sm:text-xl text-primary">{t('home_welcome_tagline')}</p>
        </div>
      </section>

      {/* Our Path to Holistic Growth (Services) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-sm font-medium tracking-widest uppercase text-accent">{t('home_services_eyebrow')}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary mb-4 text-center lg:text-left">
                {t('home_services_title')}
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 text-center lg:text-left">
                {t('home_services_subtitle')}
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] hidden lg:block">
                <Image
                  src={MEDITATION_PROGRAM_IMAGE}
                  alt="Guided meditation session"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.titleKey} className="border-none shadow-md bg-card hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="p-3 rounded-full bg-accent/10 w-fit mb-2">{service.icon}</div>
                    <CardTitle className="font-headline text-lg text-primary">{t(service.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{t(service.descKey)}</p>
                    <Link href="/programs" className="text-sm font-medium text-accent inline-flex items-center hover:underline">
                      {t('home_service_more_details')} <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-sm font-medium tracking-widest uppercase text-accent">{t('home_how_it_works_eyebrow')}</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary max-w-xl md:text-right">
            {t('home_how_it_works_title')}
          </h2>
        </div>
        <div className="relative min-h-[520px] sm:min-h-[420px] overflow-hidden">
          <Image
            src={PROCESS_IMAGE}
            alt="A wooden canoe resting on a calm lake at sunrise"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center py-12">
            <div className="grid sm:grid-cols-3 gap-6 w-full">
              {steps.map((step) => (
                <div key={step.numberKey} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-primary-foreground">
                  <span className="font-headline text-3xl font-bold text-primary-foreground/70">{t(step.numberKey)}</span>
                  <h3 className="font-headline text-xl font-semibold mt-3 mb-2">{t(step.titleKey)}</h3>
                  <p className="text-sm text-primary-foreground/85">{t(step.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            <Link href="/programs">{t('home_how_it_works_button')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-sm font-medium tracking-widest uppercase text-accent">{t('home_why_eyebrow')}</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary mb-4">
                {t('about_inspired_title')}
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8">
                {t('about_philosophy')}
              </p>
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                <Link href="/about">{t('home_why_learn_more')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <Image
                src={WOMEN_EMPOWERMENT_IMAGE}
                alt="Community empowerment workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-border pt-10">
            {whyChooseFeatures.map((feature) => (
              <div key={feature.nameKey} className="text-center sm:text-left">
                <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto sm:mx-0 mb-3">{feature.icon}</div>
                <h3 className="font-headline text-lg text-primary mb-1">{t(feature.nameKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Quote */}
      <section className="py-16 md:py-24 bg-secondary/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-sm font-medium tracking-widest uppercase text-accent">{t('home_quote_eyebrow')}</span>
          </div>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md mb-6">
              <Image
                src={INSPIRED_AVATAR_IMAGE}
                alt={t('about_inspired_alt_text')}
                fill
                className="object-cover"
              />
            </div>
            <blockquote className="font-headline text-xl sm:text-2xl md:text-3xl italic text-primary leading-snug">
              {t('about_vivekananda_quote')}
            </blockquote>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-sm font-medium tracking-widest uppercase text-accent">{t('home_articles_eyebrow')}</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary mb-10 text-center md:text-left">
            {t('home_featured_articles_title')}
          </h2>
          {featuredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPosts.map((post) => (
                <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md mb-3">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={post.dataAiHint || 'featured article'}
                    />
                  </div>
                  <h3 className="font-headline text-base text-primary group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-foreground text-center">{t('home_no_featured_articles')}</p>
          )}
          {rawFeaturedPostsLength > 0 && (
            <div className="text-center mt-10">
              <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
                <Link href="/blog">{t('home_view_all_articles_button')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Image
          src={FINAL_CTA_IMAGE}
          alt="A person walking down a sunlit forest path"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-primary-foreground">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t('home_discover_programs_title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            {t('home_discover_programs_subtitle')}
          </p>
          <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-8">
            <Link href="/programs">{t('home_explore_programs_button')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
