import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MythologyResource } from '@/lib/data';
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  resource: MythologyResource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <div className="relative w-full h-48">
        <Image
          src={resource.image}
          alt={resource.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={resource.dataAiHint}
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded">
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {resource.icon && <div className="text-primary">{resource.icon}</div>}
          <CardTitle className="font-headline text-xl text-primary">{resource.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-foreground">{resource.description}</CardDescription>
        {resource.type === 'article' && (
          <div className="mt-2 text-sm text-muted-foreground max-h-20 overflow-y-auto">
            <p>{resource.linkOrContent.substring(0,150)}...</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {resource.type === 'article' ? (
           <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
            {/* For articles, link might go to a full article page if implemented */}
            <Link href={`/mythology-meditation#${resource.id}`}> 
              Read More <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
            <a href={resource.linkOrContent} target="_blank" rel="noopener noreferrer">
              {resource.type === 'video' ? 'Watch Video' : 'Listen to Podcast'} <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
