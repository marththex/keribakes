// ─────────────────────────────────────────────────────────────────────────────
//  Pricing configuration — edit this file to update prices site-wide.
//  Changes here automatically update the gallery cards and order form.
// ─────────────────────────────────────────────────────────────────────────────

import type { CakeOption } from './orderSchema';

// Order form dropdown — must have one entry per CAKE_OPTIONS value in orderSchema.ts
export const PRICING: Record<CakeOption, string> = {
  'Tres Leches Cake (6 in)': 'From $45',
  'Tres Leches Cake (8 in)': 'From $65',
  'Tres Leches Cupcakes':    'From $48 / dozen',
  'Cheesecake Cupcakes':     'From $55 / dozen',
};

// Gallery cards — one entry per card; shows the lowest starting price
export const GALLERY_CARD_PRICE: Record<string, string> = {
  'Tres Leches Cake':     'From $45',
  'Tres Leches Cupcakes': 'From $48 / dozen',
  'Cheesecake Cupcakes':  'From $55 / dozen',
};
