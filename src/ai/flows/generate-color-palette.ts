'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating color palettes based on a user's description of their desired website or app.
 *
 * - generateColorPalette - The function to generate a color palette and explanations.
 * - GenerateColorPaletteInput - The input type for the generateColorPalette function.
 * - GenerateColorPaletteOutput - The output type for the generateColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColorPaletteInputSchema = z.object({
  description: z.string().describe('A description of the desired website or app.'),
});
export type GenerateColorPaletteInput = z.infer<typeof GenerateColorPaletteInputSchema>;

const ColorDetailsSchema = z.object({
  hexCode: z.string().describe('The hex code of the color.'),
  name: z.string().describe('The common name of the color.'),
  meaning: z.string().describe('The emotional meaning and impact of the color.'),
});

const GenerateColorPaletteOutputSchema = z.object({
  palette: z.array(ColorDetailsSchema).describe('An array of color suggestions with their hex codes and emotional meanings.'),
  scaleImage: z.string().describe('A color scale image representing the generated color palette as a data URI.'),
  usage: z.string().describe('Suggestions on how to apply the generated colors within the app for optimal usability and visual hierarchy.'),
});
export type GenerateColorPaletteOutput = z.infer<typeof GenerateColorPaletteOutputSchema>;

export async function generateColorPalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorPalettePrompt',
  input: {schema: GenerateColorPaletteInputSchema},
  output: {schema: GenerateColorPaletteOutputSchema},
  prompt: `You are an experienced color palette designer. Given the following description of a website or app:

  "{{{description}}}"

  1.  Generate a color palette consisting of 5 distinct colors that would be appropriate for the described application. For each color, specify:
      - hexCode: The hexadecimal color code (e.g., "#70A1A9").
      - name: The common English name of the color (e.g., "muted teal").
      - meaning: A detailed explanation of the emotional impact and psychological associations of the color, and why it is suitable for the described application.

  2.  Provide practical suggestions on how to apply these colors to a user interface for optimal usability and visual hierarchy. Consider elements like primary buttons, backgrounds, text, accents, and borders.
  
  3.  Generate a color scale image representing the generated color palette as a data URI. The image should be a simple horizontal bar showcasing the 5 colors side-by-side.

  Present the final output as a single JSON object.
  `,
});

const generateColorPaletteFlow = ai.defineFlow(
  {
    name: 'generateColorPaletteFlow',
    inputSchema: GenerateColorPaletteInputSchema,
    outputSchema: GenerateColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
