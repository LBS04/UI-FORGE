import type { GenerateColorPaletteOutput } from '@/ai/flows/generate-color-palette';
import type { RecommendLayoutAndSpacingOutput } from '@/ai/flows/recommend-layout-and-spacing';
import type { SuggestTypographyPairingsOutput } from '@/ai/flows/suggest-typography-pairings';

export type ColorResult = GenerateColorPaletteOutput;
export type TypographyResult = SuggestTypographyPairingsOutput;
export type LayoutResult = RecommendLayoutAndSpacingOutput;

export type DesignSuggestions = {
  color: ColorResult;
  typography: TypographyResult;
  layout: LayoutResult;
};
