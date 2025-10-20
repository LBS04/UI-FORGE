import type { LayoutResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Props {
  data: LayoutResult;
}

export function LayoutSpacingSection({ data }: Props) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wide">Layout & Spacing</CardTitle>
        <CardDescription>Guidelines for a structured and balanced design.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-headline text-lg font-bold">Layout Suggestions</h3>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{data.layoutSuggestions}</p>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="font-headline text-lg font-bold">Spacing Guidelines</h3>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{data.spacingGuidelines}</p>
        </div>
      </CardContent>
    </Card>
  );
}
