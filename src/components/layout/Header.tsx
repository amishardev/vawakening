
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Languages, ShoppingCart } from 'lucide-react'; // Added ShoppingCart
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage, type Language } from '@/context/LanguageContext';

interface NavItem {
  href: string;
  labelKey: string;
  icon?: React.ElementType;
}

const logoUrl = "https://raw.githubusercontent.com/amishardev/vawakeningimg/refs/heads/main/download.png";
const logoUrlWhite = "https://raw.githubusercontent.com/amishardev/vawakeningimg/refs/heads/main/download%20(1).png";

// Header height (h-20 = 5rem). The homepage hero pulls itself up by this
// amount so the transparent header floats directly over the hero image.
export const HEADER_HEIGHT_CLASS = 'h-20';

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only the homepage has a full-bleed hero the header can float over.
  // Everywhere else (and once the user scrolls past the hero) it's solid.
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const transparent = isHome && !isScrolled;

  const closeSheet = () => setIsSheetOpen(false);

  const toggleLanguage = () => {
    setLanguage((prevLang: Language) => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const logoLinkContent = (
    <Image
      src={transparent ? logoUrlWhite : logoUrl}
      alt="Vivekananda Awakening Foundation Logo"
      width={125}
      height={68}
      priority
      className="object-contain"
    />
  );

  const navItems: NavItem[] = [
    { href: '/', labelKey: 'header_home' },
    { href: '/about', labelKey: 'header_about' },
    { href: '/programs', labelKey: 'header_programs' },
    { href: '/mythology-meditation', labelKey: 'header_resources' },
    { href: '/blog', labelKey: 'header_blog' },
    { href: '/store', labelKey: 'header_store', icon: ShoppingCart },
  ];

  const languageToggleButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "px-2 sm:px-3",
        transparent ? "text-primary-foreground/85 hover:text-primary-foreground hover:bg-white/10" : "text-muted-foreground hover:text-primary"
      )}
      data-hide="true"
      aria-label={language === 'en' ? t('header_toggle_to_hindi') : t('header_toggle_to_english')}
    >
      <Languages className="h-5 w-5 sm:mr-1" />
      <span className="hidden sm:inline">{language === 'en' ? t('header_toggle_to_hindi') : t('header_toggle_to_english')}</span>
    </Button>
  );

  const mobileLanguageToggleButton = (
     <Button
        variant="ghost"
        onClick={() => {
          toggleLanguage();
          closeSheet();
        }}
        className={cn(
            "w-full justify-start text-base font-medium transition-colors hover:text-primary py-1.5 px-2 rounded-md",
            "text-foreground"
        )}
        data-hide="true"
        aria-label={language === 'en' ? t('header_toggle_to_hindi') : t('header_toggle_to_english')}
    >
        <Languages className="mr-2 h-5 w-5" />
        {language === 'en' ? t('header_toggle_to_hindi') : t('header_toggle_to_english')}
    </Button>
  );

  const headerWrapperClass = cn(
    "sticky top-0 z-50 w-full transition-colors duration-300",
    transparent ? "bg-transparent" : "bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70"
  );

  const navLinkClass = (isActive: boolean) => cn(
    buttonVariants({ variant: 'ghost', size: 'sm' }),
    "rounded-full font-medium transition-colors flex items-center px-3",
    transparent
      ? cn("text-primary-foreground/85 hover:text-primary-foreground hover:bg-white/10", isActive && "bg-white/15 text-primary-foreground")
      : cn("text-muted-foreground hover:text-primary hover:bg-transparent", isActive && "bg-background text-primary shadow-sm")
  );

  if (!isMounted) {
    return (
      <header className={headerWrapperClass}>
        <div className={cn("container mx-auto flex items-center justify-between px-4 md:px-6", HEADER_HEIGHT_CLASS)}>
          <Link href="/" className="flex items-center">
            {logoLinkContent}
          </Link>
          <div className={cn("hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5", !transparent && "bg-muted/60")}>
            {navItems.map((item) => (
              <Link href={item.href} key={item.href} className={navLinkClass(false)}>
                {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className={transparent ? "text-primary-foreground" : undefined}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className={cn(
                "rounded-full",
                transparent ? "bg-background text-foreground hover:bg-background/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Link href="/programs">{t('header_programs')}</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerWrapperClass}>
      <div className={cn("container mx-auto flex items-center justify-between lg:hidden", HEADER_HEIGHT_CLASS)}>
        <Link href="/" className="flex items-center flex-shrink-0" onClick={closeSheet}>
          {logoLinkContent}
        </Link>
        <div className="flex items-center pr-4">
          {languageToggleButton}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("ml-1", transparent && "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground")}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
              <SheetHeader className="mb-6 flex flex-row items-center justify-between">
                <Link href="/" className="flex items-center" onClick={closeSheet}>
                    <Image src={logoUrl} alt="Vivekananda Awakening Foundation Logo" width={125} height={68} priority className="object-contain" />
                </Link>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={closeSheet} className="-mr-2">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetTrigger>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSheet}
                      className={cn(
                      "text-base font-medium transition-colors hover:text-primary py-1.5 px-2 rounded-md flex items-center",
                      pathname === item.href ? "text-primary bg-muted" : "text-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                    {t(item.labelKey)}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-border flex flex-col gap-2">
                  <Button asChild className="rounded-full w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={closeSheet}>
                    <Link href="/programs">{t('header_programs')}</Link>
                  </Button>
                </div>
                <div className="pt-2 border-t border-border mt-2">
                 {mobileLanguageToggleButton}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className={cn("container mx-auto hidden items-center justify-center px-4 lg:flex lg:relative lg:px-6", HEADER_HEIGHT_CLASS)}>
        <div className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center" onClick={closeSheet}>
            {logoLinkContent}
          </Link>
        </div>

        <nav className={cn("flex items-center gap-1 rounded-full px-2 py-1.5", !transparent && "bg-muted/60")}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(pathname === item.href)}>
              {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2">
            {languageToggleButton}
            <Button
              asChild
              size="sm"
              className={cn(
                "rounded-full",
                transparent ? "bg-background text-foreground hover:bg-background/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Link href="/programs">{t('header_programs')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
