import { z } from 'zod';

const MIN_DAYS_AHEAD = 7;

function minDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + MIN_DAYS_AHEAD);
  return d;
}

export const COUNTIES = ['Orange County', 'Los Angeles County'] as const;
export type County = (typeof COUNTIES)[number];

export const orderSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Enter a valid email address'),
    phone: z
      .string()
      .min(7, 'Enter a valid phone number')
      .regex(/^[\d\s\-()+]+$/, 'Enter a valid phone number'),
    occasion: z.string().min(1, 'Occasion is required'),
    servings: z
      .number({ error: 'Enter a number of servings' })
      .int('Enter a whole number of servings')
      .min(6, 'Minimum 6 servings')
      .max(500, 'Maximum 500 servings'),
    flavorNotes: z.string().min(1, 'Please share your flavor preferences'),
    designNotes: z.string().min(1, 'Please describe your design vision'),
    requestedDate: z
      .string()
      .min(1, 'Please choose a date')
      .refine((val) => {
        const chosen = new Date(val + 'T00:00:00');
        return chosen >= minDate();
      }, `Date must be at least ${MIN_DAYS_AHEAD} days from today`),
    fulfillment: z.enum(['pickup', 'delivery']),
    county: z.string().optional(),
    address: z.string().optional(),
    referral: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === 'delivery') {
      if (!data.county || !COUNTIES.includes(data.county as County)) {
        ctx.addIssue({
          code: 'custom',
          path: ['county'],
          message: 'Select Orange County or Los Angeles County',
        });
      }
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: 'custom',
          path: ['address'],
          message: 'Full delivery address is required',
        });
      }
    }
  });

export type OrderFormData = z.infer<typeof orderSchema>;
