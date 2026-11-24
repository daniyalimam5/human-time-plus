import { describe, expect, it } from 'vitest';

import { parseDate } from '../src/parseDate';
import { HumanTimeError } from '../src/errors';

describe('parseDate', () => {
  it('accepts a valid Date object', () => {
    const date = new Date('2026-08-24T00:00:00Z');
    expect(parseDate(date).getTime()).toBe(date.getTime());
  });

  it('accepts an ISO string', () => {
    expect(parseDate('2026-08-24T00:00:00Z').getTime()).toBe(
      new Date('2026-08-24T00:00:00Z').getTime(),
    );
  });

  it('accepts a Unix timestamp in milliseconds', () => {
    expect(parseDate(1_756_000_000_000).getTime()).toBe(1_756_000_000_000);
  });

  it('throws for an invalid Date object', () => {
    expect(() => parseDate(new Date('nonsense'))).toThrow(HumanTimeError);
  });

  it('throws for an unparsable string', () => {
    expect(() => parseDate('definitely not a date')).toThrow(HumanTimeError);
  });

  it('throws for NaN', () => {
    expect(() => parseDate(NaN)).toThrow(HumanTimeError);
  });

  it('throws for unsupported input types', () => {
    // @ts-expect-error deliberately passing an invalid type
    expect(() => parseDate(null)).toThrow(HumanTimeError);
    // @ts-expect-error deliberately passing an invalid type
    expect(() => parseDate(undefined)).toThrow(HumanTimeError);
    // @ts-expect-error deliberately passing an invalid type
    expect(() => parseDate({})).toThrow(HumanTimeError);
  });
});
