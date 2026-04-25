import { describe, it, expect } from 'vitest';
import { orderSchema } from '../lib/orderSchema';

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0]!;
}

const validPickup = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '(714) 555-0100',
  cakeSelection: 'Tres Leches Cupcakes' as const,
  preferredTime: '2:00 PM',
  requestedDate: futureDate(8),
  fulfillment: 'pickup' as const,
};

const validDelivery = {
  ...validPickup,
  fulfillment: 'delivery' as const,
  county: 'Orange County',
  street: '123 Blossom Ave',
  city: 'Irvine',
  zip: '92618',
};

describe('orderSchema — valid orders', () => {
  it('accepts a valid pickup order', () => {
    expect(orderSchema.safeParse(validPickup).success).toBe(true);
  });

  it('accepts a valid delivery order', () => {
    expect(orderSchema.safeParse(validDelivery).success).toBe(true);
  });

  it('accepts optional add-ons', () => {
    const result = orderSchema.safeParse({ ...validPickup, addOns: 'Fresh strawberries, candles' });
    expect(result.success).toBe(true);
  });

  it('accepts referral with Other + text', () => {
    const result = orderSchema.safeParse({ ...validPickup, referral: 'Other', referralOther: 'Yelp' });
    expect(result.success).toBe(true);
  });

  it('accepts referral with friend name', () => {
    const result = orderSchema.safeParse({ ...validPickup, referral: 'Referred by a friend', referralFriend: 'Sarah' });
    expect(result.success).toBe(true);
  });

  it('accepts an optional apt/unit on delivery', () => {
    const result = orderSchema.safeParse({ ...validDelivery, unit: 'Apt 4B' });
    expect(result.success).toBe(true);
  });
});

describe('orderSchema — date validation', () => {
  it('rejects a date fewer than 7 days out', () => {
    const result = orderSchema.safeParse({ ...validPickup, requestedDate: futureDate(3) });
    expect(result.success).toBe(false);
  });

  it('rejects today as the requested date', () => {
    const result = orderSchema.safeParse({ ...validPickup, requestedDate: futureDate(0) });
    expect(result.success).toBe(false);
  });

  it('accepts exactly 7 days out', () => {
    const result = orderSchema.safeParse({ ...validPickup, requestedDate: futureDate(7) });
    expect(result.success).toBe(true);
  });
});

describe('orderSchema — delivery validation', () => {
  it('requires street, city, and zip for delivery', () => {
    const result = orderSchema.safeParse({ ...validPickup, fulfillment: 'delivery', county: 'Orange County' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = Object.keys(result.error.flatten().fieldErrors);
      expect(fields).toContain('street');
      expect(fields).toContain('city');
      expect(fields).toContain('zip');
    }
  });

  it('rejects a ZIP code that is not 5 digits', () => {
    const result = orderSchema.safeParse({ ...validDelivery, zip: '1234' });
    expect(result.success).toBe(false);
  });

  it('rejects a county outside OC and LA', () => {
    const result = orderSchema.safeParse({ ...validDelivery, county: 'San Diego County' });
    expect(result.success).toBe(false);
  });
});

describe('orderSchema — referral validation', () => {
  it('requires referralOther text when referral is Other', () => {
    const result = orderSchema.safeParse({ ...validPickup, referral: 'Other', referralOther: '' });
    expect(result.success).toBe(false);
  });

  it('requires referralFriend name when referral is Referred by a friend', () => {
    const result = orderSchema.safeParse({ ...validPickup, referral: 'Referred by a friend', referralFriend: '' });
    expect(result.success).toBe(false);
  });
});

describe('orderSchema — cake selection', () => {
  it('rejects an unlisted cake type', () => {
    const result = orderSchema.safeParse({ ...validPickup, cakeSelection: 'Wedding Cake' });
    expect(result.success).toBe(false);
  });

  it('accepts all four valid cake options', () => {
    const options = [
      'Tres Leches Cake (6 in)',
      'Tres Leches Cake (8 in)',
      'Tres Leches Cupcakes',
      'Cheesecake Cupcakes',
    ] as const;
    for (const cakeSelection of options) {
      expect(orderSchema.safeParse({ ...validPickup, cakeSelection }).success).toBe(true);
    }
  });
});
