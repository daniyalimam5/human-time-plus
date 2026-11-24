import { describe, expect, it } from 'vitest';

import { humanDate } from '../src/humanDate';
import { HumanTimeError } from '../src/errors';

describe('humanDate', () => {
  it('formats an ISO string in medium form by default', () => {
    expect(humanDate('2026-08-24T07:30:00Z')).toBe('Aug 24, 2026');
  });

  it('formats a Date object', () => {
    expect(humanDate(new Date('2026-08-24T07:30:00Z'))).toBe('Aug 24, 2026');
  });

  it('formats a Unix timestamp in milliseconds', () => {
    expect(humanDate(new Date('2026-08-24T07:30:00Z').getTime())).toBe('Aug 24, 2026');
  });

  it('formats the short style', () => {
    expect(humanDate('2026-08-24T07:30:00Z', { format: 'short' })).toBe('08/24/2026');
  });

  it('formats the long style', () => {
    expect(humanDate('2026-08-24T07:30:00Z', { format: 'long' })).toBe('August 24, 2026');
  });

  it('formats the full style with weekday', () => {
    expect(humanDate('2026-08-24T07:30:00Z', { format: 'full' })).toBe('Monday, August 24, 2026');
  });

  it('appends time when includeTime is set', () => {
    expect(humanDate('2026-08-24T07:30:00Z', { includeTime: true })).toBe('Aug 24, 2026 7:30 AM');
  });

  it('formats midnight and noon correctly with includeTime', () => {
    expect(humanDate('2026-08-24T00:00:00Z', { includeTime: true })).toBe('Aug 24, 2026 12:00 AM');
    expect(humanDate('2026-08-24T12:00:00Z', { includeTime: true })).toBe('Aug 24, 2026 12:00 PM');
  });

  it('renders Urdu month names', () => {
    expect(humanDate('2026-08-24T07:30:00Z', { locale: 'ur' })).toBe('اگست 24, 2026');
  });

  it('throws HumanTimeError for an invalid date string', () => {
    expect(() => humanDate('not a date')).toThrow(HumanTimeError);
  });

  describe('timeZone option', () => {
    it('reads local calendar fields when timeZone is "local"', () => {
      const date = new Date(2026, 7, 24, 10, 0, 0); // local Aug 24, 2026
      expect(humanDate(date, { timeZone: 'local' })).toBe('Aug 24, 2026');
    });
  });
});
