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

export const CAKE_OPTIONS = [
  'Tres Leches Cake (6 in)',
  'Tres Leches Cake (8 in)',
  'Tres Leches Cupcakes',
  'Cheesecake Cupcakes',
] as const;
export type CakeOption = (typeof CAKE_OPTIONS)[number];

export const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',
  '4:00 PM',  '5:00 PM',  '6:00 PM',
] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const REFERRAL_OPTIONS = [
  'Instagram',
  'Facebook',
  'Word of mouth',
  'Google Search',
  'TikTok',
  'Referred by a friend',
  'Other',
] as const;
export type ReferralOption = (typeof REFERRAL_OPTIONS)[number];

export const orderSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Enter a valid email address'),
    phone: z
      .string()
      .min(7, 'Enter a valid phone number')
      .regex(/^[\d\s\-()+]+$/, 'Enter a valid phone number'),
    cakeSelection: z.enum(CAKE_OPTIONS, { error: 'Please select a cake' }),
    preferredTime: z.string().min(1, 'Please select a preferred time'),
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
    referralOther: z.string().optional(),
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
    if (
      data.referral === 'Other' &&
      (!data.referralOther || data.referralOther.trim().length === 0)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['referralOther'],
        message: 'Please tell us how you heard about us',
      });
    }
  });

export type OrderFormData = z.infer<typeof orderSchema>;
