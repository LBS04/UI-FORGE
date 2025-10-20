'use server';

/**
 * @fileOverview Recommends layout and spacing guidelines based on the target platform and content type.
 *
 * - recommendLayoutAndSpacing - A function that handles the layout and spacing recommendation process.
 * - RecommendLayoutAndSpacingInput - The input type for the recommendLayoutAndSpacing function.
 * - RecommendLayoutAndSpacingOutput - The return type for the recommendLayoutAndSpacing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLayoutAndSpacingInputSchema = z.object({
  platform: z
    .string()
    .describe("The target platform (e.g., mobile, web, desktop)."),
  contentType: z
    .string()
    .describe("The content type (e.g., blog, e-commerce, portfolio)."),
  description: z
    .string()
    .describe("Detailed description of the website or app design."),
});
export type RecommendLayoutAndSpacingInput = z.infer<
  typeof RecommendLayoutAndSpacingInputSchema
>;

const RecommendLayoutAndSpacingOutputSchema = z.object({
  layoutSuggestions: z
    .string()
    .describe("Layout suggestions based on the platform and content type."),
  spacingGuidelines: z
    .string()
    .describe(
      "Spacing guidelines, including margin, padding, and grid system suggestions."
    ),
});
export type RecommendLayoutAndSpacingOutput = z.infer<
  typeof RecommendLayoutAndSpacingOutputSchema
>;

export async function recommendLayoutAndSpacing(
  input: RecommendLayoutAndSpacingInput
): Promise<RecommendLayoutAndSpacingOutput> {
  return recommendLayoutAndSpacingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLayoutAndSpacingPrompt',
  input: {schema: RecommendLayoutAndSpacingInputSchema},
  output: {schema: RecommendLayoutAndSpacingOutputSchema},
  prompt: `You are an experienced UI/UX designer providing layout and spacing recommendations.

  Based on the target platform: {{{platform}}}, content type: {{{contentType}}}, and the following description: {{{description}}}, provide detailed layout suggestions and spacing guidelines.

  Layout suggestions should include information about the arrangement of elements, use of visual hierarchy, and any platform-specific conventions.

  Spacing guidelines should cover recommended margins, padding, and the use of a grid system to maintain consistency.

  Consider the following:
  - How the layout should adapt to different screen sizes for the specified platform.
  - The importance of white space in improving readability and user experience.
  - Examples of successful layouts for the given content type.
  - Specific spacing values to use in CSS, e.g. using an 8dp grid.
  `,
});

const recommendLayoutAndSpacingFlow = ai.defineFlow(
  {
    name: 'recommendLayoutAndSpacingFlow',
    inputSchema: RecommendLayoutAndSpacingInputSchema,
    outputSchema: RecommendLayoutAndSpacingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
