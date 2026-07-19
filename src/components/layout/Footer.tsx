"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext'; 
import { usePathname } from 'next/navigation'; // Import usePathname

const logoUrl = "https://raw.githubusercontent.com/amishardev/vawakeningimg/refs/heads/main/download.png";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { t } = useLanguage(); 
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const companyLinks = [
    { href: '/about', labelKey: 'header_about' },
    { href: '/blog', labelKey: 'header_blog' },
    { href: '/store', labelKey: 'header_store' },
  ];

  const exploreLinks = [
    { href: '/programs', labelKey: 'header_programs' },
    { href: '/mythology-meditation', labelKey: 'header_resources' },
    { href: '/sitemap', labelKey: 'footer_sitemap' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 bg-primary-foreground/95 rounded-md p-1.5">
              <Image
                src={logoUrl}
                alt={t('footer_vivekananda_foundation_logo_alt', { defaultValue: "Vivekananda Awakening Foundation Logo" })}
                width={130}
                height={70}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-primary-foreground/75 max-w-sm">
              {t('footer_description')}
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="https://www.facebook.com/profile.php?id=61577705844773" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground/70 hover:text-primary-foreground"><Facebook size={20} /></Link>
              <Link href="https://www.instagram.com/vivekanandaawakeningfoundation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground/70 hover:text-primary-foreground"><Instagram size={20} /></Link>
              <Link href="https://www.linkedin.com/in/amit-sharma-42a421370/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-primary-foreground/70 hover:text-primary-foreground"><Linkedin size={20} /></Link>
              <Link href="https://www.youtube.com/@VivekanandaAwakeningFoundation" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-primary-foreground/70 hover:text-primary-foreground"><Youtube size={20} /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-base font-semibold text-primary-foreground mb-4">{t('footer_quick_links')}</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/75">
              {companyLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-primary-foreground">{t(link.labelKey)}</Link></li>
              ))}
              {pathname === '/about' && (
                <li>
                  <Link href="/admin/login" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                    {t('footer_admin')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-base font-semibold text-primary-foreground mb-4">{t('header_programs')}</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/75">
              {exploreLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-primary-foreground">{t(link.labelKey)}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-primary-foreground/70">
          <div dangerouslySetInnerHTML={{ __html: t('footer_address') }} />
          <p>
            {t('footer_email_prompt')} <a href="mailto:info@vawakening.com" className="hover:text-primary-foreground">info@vawakening.com</a>
          </p>
        </div>
        <div className="mt-8 border-t border-primary-foreground/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <p>{t('footer_copyright', { year: currentYear })}</p>
          <p dangerouslySetInnerHTML={{
              __html: t('footer_webapp_credit', {}, 'Web app solely created by <a href="https://www.linkedin.com/in/amish-sharma-301040313/" target="_blank" rel="noopener noreferrer" class="hover:text-primary-foreground">Amish Sharma</a>.')
            }}
          />
        </div>
      </div>
    </footer>
  );
}
