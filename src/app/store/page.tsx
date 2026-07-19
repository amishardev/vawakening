
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, IndianRupee, Bell, CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState, FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { StoreProductDocument, StoreProductDisplay } from '@/types/store';
import { getPublishedStoreProducts, addStockNotificationRequestAction } from '@/app/admin/dashboard/store/actions';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

function transformProductForDisplay(productDoc: StoreProductDocument): StoreProductDisplay {
  const IndianLocale = 'en-IN'; // For INR formatting
  return {
    ...productDoc,
    displayPrice: new Intl.NumberFormat(IndianLocale, {
      style: 'currency',
      currency: 'INR',
    }).format(productDoc.price),
    image: productDoc.thumbnail_url || `https://placehold.co/400x300.png?text=${encodeURIComponent(productDoc.name)}`,
  };
}

export default function StorePage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<StoreProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotifyMeLoading, setIsNotifyMeLoading] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [selectedProductForNotification, setSelectedProductForNotification] = useState<StoreProductDisplay | null>(null);


  useEffect(() => {
    document.title = t('page_title_store');
  }, [t, language]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const rawProducts = await getPublishedStoreProducts();
        setProducts(rawProducts.map(transformProductForDisplay));
      } catch (error) {
        console.error("Failed to fetch store products:", error);
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const handleNotifyMeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProductForNotification || !notifyEmail) return;

    setIsNotifyMeLoading(true);
    const result = await addStockNotificationRequestAction(selectedProductForNotification.id, notifyEmail);
    setIsNotifyMeLoading(false);

    if (result.success) {
      toast({ title: t('store_notify_me_success_title'), description: result.message || t('store_notify_me_success_desc') });
      setSelectedProductForNotification(null); // Close dialog by resetting this
      setNotifyEmail('');
    } else {
      toast({ variant: 'destructive', title: t('store_notify_me_error_title'), description: result.error || t('store_notify_me_error_desc') });
    }
  };


  const ProductCard = ({ product }: { product: StoreProductDisplay }) => (
    <Card id={`product-${product.id}`} className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      {product.image && (
        <div className="relative w-full h-56 sm:h-64 bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{objectFit:"cover"}}
            data-ai-hint={product.data_ai_hint || 'store product'}
            className="rounded-t-lg"
            unoptimized={true}
            onError={(e) => e.currentTarget.src = `https://placehold.co/400x300.png?text=${encodeURIComponent(product.name)}`}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-xl text-primary">{product.name}</CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
            <p className="text-lg font-semibold text-foreground flex items-center">
                <IndianRupee className="h-5 w-5 mr-0.5" />{product.price.toFixed(2)}
            </p>
            <Badge variant={product.in_stock ? 'secondary' : 'destructive'} className="text-xs whitespace-nowrap">
                {product.in_stock ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {product.in_stock ? t('store_in_stock') : t('store_out_of_stock')}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <CardDescription className="text-foreground line-clamp-3">{product.description || t('store_no_description')}</CardDescription>
      </CardContent>
      <CardFooter>
        {product.in_stock ? (
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <ShoppingCart className="mr-2 h-4 w-4" /> {t('store_add_to_cart_button')}
          </Button>
        ) : (
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" onClick={() => setSelectedProductForNotification(product)}>
              <Bell className="mr-2 h-4 w-4" /> {t('store_notify_me_button')}
            </Button>
          </DialogTrigger>
        )}
      </CardFooter>
    </Card>
  );


  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-16 text-center">{t('store_loading_products')}</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/70 via-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block p-3 sm:p-4 bg-primary-foreground/10 rounded-full mb-6 animate-fade-in">
            <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in delay-100">
            {t('store_hero_title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto animate-slide-in-up delay-300">
            {t('store_hero_subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <Dialog> {/* Each card gets its own Dialog context */}
                    <ProductCard product={product} />
                     {/* This DialogContent is associated with the DialogTrigger inside ProductCard */}
                     {!product.in_stock && selectedProductForNotification?.id === product.id && (
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleNotifyMeSubmit}>
                                <DialogHeader>
                                <DialogTitle>{t('store_notify_me_dialog_title')} - {selectedProductForNotification.name}</DialogTitle>
                                <DialogDescription>
                                    {t('store_notify_me_dialog_desc')}
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right col-span-1">
                                    {t('store_notify_me_email_label')}
                                    </Label>
                                    <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={notifyEmail}
                                    onChange={(e) => setNotifyEmail(e.target.value)}
                                    className="col-span-3"
                                    required
                                    disabled={isNotifyMeLoading}
                                    />
                                </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                      <Button type="button" variant="outline" onClick={() => {setSelectedProductForNotification(null); setNotifyEmail('');}} disabled={isNotifyMeLoading}>
                                      {t('store_notify_me_cancel_button')}
                                      </Button>
                                  </DialogClose>
                                <Button type="submit" disabled={isNotifyMeLoading} className="bg-primary text-primary-foreground">
                                    {isNotifyMeLoading ? t('store_notify_me_submitting_button') : t('store_notify_me_submit_button')}
                                </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                     )}
                  </Dialog>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-12">
                <h2 className="font-headline text-xl sm:text-2xl text-primary mb-4">{t('store_no_products_title')}</h2>
                <p className="text-md sm:text-lg text-muted-foreground">{t('store_no_products_message')}</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
