import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Program } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <div className="relative w-full h-48">
        <Image
          src={program.image}
          alt={program.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={program.dataAiHint}
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {program.icon && <div className="text-primary">{program.icon}</div>}
          <CardTitle className="font-headline text-xl text-primary">{program.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-foreground">{program.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary p-0 hover:text-accent">
          <Link href={`/programs#${program.id}`}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
