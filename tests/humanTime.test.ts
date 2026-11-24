import { describe, expect, it } from 'vitest';

import { humanTime } from '../src/humanTime';
import { HumanTimeError } from '../src/errors';

const NOW = new Date('2026-08-24T12:00:00.000Z');
const iso = (offsetMs: number) => new Date(NOW.getTime() + offsetMs).toISOString();

describe('humanTime', () => {
  it('returns "just now" for the current instant', () => {
    expect(humanTime(NOW, { now: NOW })).toBe('just now');
  });

  it('returns "just now" for a few seconds ago', () => {
    expect(humanTime(iso(-5000), { now: NOW })).toBe('just now');
  });

  describe('seconds', () => {
    it('formats seconds ago', () => {
      expect(humanTime(iso(-45_000), { now: NOW })).toBe('45 seconds ago');
    });

    it('formats singular second', () => {
      expect(humanTime(iso(-31_000), { now: NOW })).toBe('31 seconds ago');
    });

    it('stays in seconds at the 59 second boundary', () => {
      expect(humanTime(iso(-59_000), { now: NOW })).toBe('59 seconds ago');
    });
  });

  describe('minutes', () => {
    it('rolls over to 1 minute at exactly 60 seconds', () => {
      expect(humanTime(iso(-60_000), { now: NOW })).toBe('1 minute ago');
    });

    it('formats minutes ago', () => {
      expect(humanTime(iso(-5 * 60_000), { now: NOW })).toBe('5 minutes ago');
    });

    it('stays in minutes at the 59 minute boundary', () => {
      expect(humanTime(iso(-59 * 60_000), { now: NOW })).toBe('59 minutes ago');
    });
  });

  describe('hours', () => {
    it('rolls over to 1 hour at exactly 60 minutes', () => {
      expect(humanTime(iso(-60 * 60_000), { now: NOW })).toBe('1 hour ago');
    });

    it('formats hours ago', () => {
      expect(humanTime(iso(-2 * 60 * 60_000), { now: NOW })).toBe('2 hours ago');
    });

    it('stays in hours at the 23 hour boundary', () => {
      expect(humanTime(iso(-23 * 60 * 60_000), { now: NOW })).toBe('23 hours ago');
    });
  });

  describe('days', () => {
    it('rolls over to 1 day at exactly 24 hours', () => {
      expect(humanTime(iso(-24 * 60 * 60_000), { now: NOW })).toBe('1 day ago');
    });

    it('formats days ago', () => {
      expect(humanTime(iso(-3 * 24 * 60 * 60_000), { now: NOW })).toBe('3 days ago');
    });
  });

  describe('weeks', () => {
    it('rolls over to 1 week at exactly 7 days', () => {
      expect(humanTime(iso(-7 * 24 * 60 * 60_000), { now: NOW })).toBe('1 week ago');
    });

    it('formats weeks ago', () => {
      expect(humanTime(iso(-2 * 7 * 24 * 60 * 60_000), { now: NOW })).toBe('2 weeks ago');
    });
  });

  describe('months', () => {
    it('formats months ago', () => {
      expect(humanTime(iso(-65 * 24 * 60 * 60_000), { now: NOW })).toBe('2 months ago');
    });
  });

  describe('years', () => {
    it('formats years ago', () => {
      expect(humanTime(iso(-400 * 24 * 60 * 60_000), { now: NOW })).toBe('1 year ago');
    });

    it('formats multiple years ago', () => {
      expect(humanTime(iso(-800 * 24 * 60 * 60_000), { now: NOW })).toBe('2 years ago');
    });
  });

  describe('future dates', () => {
    it('formats minutes in the future', () => {
      expect(humanTime(iso(10 * 60_000), { now: NOW })).toBe('in 10 minutes');
    });

    it('formats days in the future', () => {
      expect(humanTime(iso(3 * 24 * 60 * 60_000), { now: NOW })).toBe('in 3 days');
    });

    it('formats hours in the future', () => {
      expect(humanTime(iso(2 * 60 * 60_000), { now: NOW })).toBe('in 2 hours');
    });
  });

  describe('input formats', () => {
    it('accepts a Date object', () => {
      expect(humanTime(new Date(NOW.getTime() - 5 * 60_000), { now: NOW })).toBe('5 minutes ago');
    });

    it('accepts an ISO string', () => {
      expect(humanTime(iso(-5 * 60_000), { now: NOW })).toBe('5 minutes ago');
    });

    it('accepts a Unix timestamp in milliseconds', () => {
      expect(humanTime(NOW.getTime() - 5 * 60_000, { now: NOW })).toBe('5 minutes ago');
    });

    it('accepts a Unix timestamp for `now`', () => {
      expect(humanTime(iso(-5 * 60_000), { now: NOW.getTime() })).toBe('5 minutes ago');
    });
  });

  describe('invalid input', () => {
    it('throws HumanTimeError for an unparsable string', () => {
      expect(() => humanTime('not a date')).toThrow(HumanTimeError);
    });

    it('throws HumanTimeError for an invalid Date object', () => {
      expect(() => humanTime(new Date('invalid'))).toThrow(HumanTimeError);
    });

    it('throws HumanTimeError for non date-like input', () => {
      // @ts-expect-error deliberately passing an invalid type
      expect(() => humanTime({})).toThrow(HumanTimeError);
    });
  });

  describe('localization', () => {
    it('renders Urdu relative time in the past', () => {
      expect(humanTime(iso(-5 * 60_000), { now: NOW, locale: 'ur' })).toBe('5 منٹ پہلے');
    });

    it('renders Urdu relative time in the future', () => {
      expect(humanTime(iso(10 * 60_000), { now: NOW, locale: 'ur' })).toBe('10 منٹ میں');
    });

    it('renders Urdu "just now"', () => {
      expect(humanTime(NOW, { now: NOW, locale: 'ur' })).toBe('ابھی ابھی');
    });

    it('falls back to English for an unknown locale', () => {
      expect(humanTime(iso(-5 * 60_000), { now: NOW, locale: 'xx' })).toBe('5 minutes ago');
    });
  });
});
