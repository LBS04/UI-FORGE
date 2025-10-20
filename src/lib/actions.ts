'use server';

import { z } from 'zod';
import { generateColorPalette } from '@/ai/flows/generate-color-palette';
import { recommendLayoutAndSpacing } from '@/ai/flows/recommend-layout-and-spacing';
import { suggestTypographyPairings } from '@/ai/flows/suggest-typography-pairings';
import type { DesignSuggestions } from './types';

const FormSchema = z.object({
  description: z.string(),
  platform: z.enum(['web', 'mobile']),
  contentType: z.string(),
});

type FormData = z.infer<typeof FormSchema>;

export async function generateDesignSuggestions(input: FormData): Promise<{ suggestions?: DesignSuggestions; error?: string; }> {
  const validatedInput = FormSchema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input.' };
  }
  
  const { description, platform, contentType } = validatedInput.data;

  try {
    const [color, typography, layout] = await Promise.all([
      generateColorPalette({ description }),
      suggestTypographyPairings({ description, platform, contentType }),
      recommendLayoutAndSpacing({ description, platform, contentType }),
    ]);

    return { suggestions: { color, typography, layout } };

  } catch (error) {
    console.error('Error generating design suggestions:', error);
    return { error: 'An unexpected error occurred while generating suggestions. The AI may be busy. Please try again in a moment.' };
  }
}
