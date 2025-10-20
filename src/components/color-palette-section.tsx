'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ColorResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  data: ColorResult;
}

export function ColorPaletteSection({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const cssVariables = data.palette
      .map((color, index) => `--color-suggestion-${index + 1}: ${color.hexCode}; /* ${color.name} */`)
      .join('\n');

    navigator.clipboard.writeText(cssVariables).then(() => {
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
        <CardTitle className="font-headline text-2xl tracking-wide">Color Palette</CardTitle>
        <CardDescription>A palette generated to match your project's vibe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.scaleImage && (
          <div className="relative w-full h-24 rounded-lg overflow-hidden border">
            <Image src={data.scaleImage} alt="Color Palette Scale" layout="fill" objectFit="cover" unoptimized />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.palette.map((color, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div
                className="w-16 h-16 rounded-lg shrink-0 border shadow-inner"
                style={{ backgroundColor: color.hexCode }}
              />
              <div>
                <h4 className="font-bold font-headline capitalize">{color.name}</h4>
                <p className="text-sm text-muted-foreground font-mono">{color.hexCode}</p>
                <p className="text-sm mt-1">{color.meaning}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <Button onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy CSS Variables
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
