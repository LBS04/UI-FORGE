'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateDesignSuggestions } from '@/lib/actions';
import type { DesignSuggestions } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ColorPaletteSection } from '@/components/color-palette-section';
import { TypographySection } from '@/components/typography-section';
import { LayoutSpacingSection } from '@/components/layout-spacing-section';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';

const formSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description (at least 10 characters)."),
  platform: z.enum(['web', 'mobile'], { required_error: "Please select a platform." }),
  contentType: z.string().min(3, "Please specify a content type (at least 3 characters)."),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<DesignSuggestions | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      platform: 'web',
      contentType: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuggestions(null);
    const result = await generateDesignSuggestions(data);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    } else if (result.suggestions) {
      setSuggestions(result.suggestions);
      const resultsEl = document.getElementById('results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold tracking-wider">UI Forge</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-card border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-headline text-4xl md:text-5xl font-bold">Unleash Your Creativity</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Describe your app or website idea, and let our AI provide expert suggestions on colors, typography, and layout to kickstart your design process.
              </p>
            </div>
            
            <Card className="max-w-3xl mx-auto mt-12 shadow-xl border-border/70">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Design Prompt</CardTitle>
                <CardDescription>Tell us about your project.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., A mobile app for booking yoga classes, with a calm and welcoming feel."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="web">Web</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="contentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., E-commerce, Blog, Portfolio" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                       <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
                        {loading ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Ideas
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>

        {(loading || suggestions) && (
           <section id="results" className="py-12 md:py-20">
             <div className="container mx-auto px-4 space-y-8">
              {loading && (
                <>
                  <Skeleton className="h-96 w-full rounded-xl" />
                  <Skeleton className="h-80 w-full rounded-xl" />
                  <Skeleton className="h-80 w-full rounded-xl" />
                </>
              )}
              {suggestions && (
                <>
                  <ColorPaletteSection data={suggestions.color} />
                  <TypographySection data={suggestions.typography} />
                  <LayoutSpacingSection data={suggestions.layout} />
                </>
              )}
            </div>
           </section>
        )}
      </main>

      <footer className="py-6 border-t bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        </div>
      </footer>
    </div>
  );
}
