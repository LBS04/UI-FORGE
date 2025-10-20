'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TypographyResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Props {
  data: TypographyResult;
}

export function TypographySection({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const cssStyles = `
/* Typography Suggestions */
.font-headline {
  font-family: '${data.headlineFont.name}', sans-serif;
}

.font-body {
  font-family: '${data.bodyFont.name}', serif;
}
`;
    navigator.clipboard.writeText(cssStyles.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
      });
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wide">Typography</CardTitle>
        <CardDescription>Font pairings and sizing for readability and style.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <h3 className="font-headline text-lg font-bold">Headline: <span className="font-normal">{data.headlineFont.name}</span></h3>
            <p className="text-sm leading-relaxed">{data.headlineFont.usage}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-headline text-lg font-bold">Body: <span className="font-normal">{data.bodyFont.name}</span></h3>
            <p className="text-sm leading-relaxed">{data.bodyFont.usage}</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="font-headline text-lg font-bold">Adaptive Type Scale</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{data.adaptedTypeSizes}</p>
        </div>
        <div className="pt-4">
          <Button onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy CSS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
