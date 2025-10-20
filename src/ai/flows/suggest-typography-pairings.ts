'use server';

/**
 * @fileOverview Suggests font pairings (headline and body) suitable for a website/app description.
 *
 * - suggestTypographyPairings - A function that handles the font pairing suggestions.
 * - TypographySuggestionsInput - The input type for the suggestTypographyPairings function.
 * - TypographySuggestionsOutput - The return type for the suggestTypographyPairings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TypographySuggestionsInputSchema = z.object({
  description: z.string().describe('A description of the website or app for which typography pairings are needed.'),
  platform: z.enum(['web', 'mobile']).describe('The target platform (web or mobile) for the design.'),
  contentType: z.string().describe('The type of content (e.g., blog, e-commerce) the design will feature.'),
});
export type TypographySuggestionsInput = z.infer<typeof TypographySuggestionsInputSchema>;

const TypographySuggestionsOutputSchema = z.object({
  headlineFont: z.object({
    name: z.string().describe('The name of the suggested headline font.'),
    usage: z.string().describe('Explanation of when to use the headline font.'),
  }).describe('Suggested headline font and its usage.'),
  bodyFont: z.object({
    name: z.string().describe('The name of the suggested body font.'),
    usage: z.string().describe('Explanation of when to use the body font.'),
  }).describe('Suggested body font and its usage.'),
  adaptedTypeSizes: z.string().describe('Intelligently adapted type sizes to the target platform and content types.'),
});
export type TypographySuggestionsOutput = z.infer<typeof TypographySuggestionsOutputSchema>;

export async function suggestTypographyPairings(input: TypographySuggestionsInput): Promise<TypographySuggestionsOutput> {
  return suggestTypographyPairingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTypographyPairingsPrompt',
  input: {schema: TypographySuggestionsInputSchema},
  output: {schema: TypographySuggestionsOutputSchema},
  prompt: `You are an expert in typography, skilled at suggesting font pairings for UI/UX design.

Based on the description of the website/app, suggest a headline font and a body font.
Explain when to use each font. Also, adapt and suggest type sizes based on target platform and content types.

Description: {{{description}}}
Platform: {{{platform}}}
Content Type: {{{contentType}}}

Consider the platform and content type when suggesting the typography pairings. For example, mobile platforms require larger font sizes.

Output the name, usage, and intelligent adaptation of the font sizes to the platform.

Output in JSON format:
`,
});

const suggestTypographyPairingsFlow = ai.defineFlow(
  {
    name: 'suggestTypographyPairingsFlow',
    inputSchema: TypographySuggestionsInputSchema,
    outputSchema: TypographySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
