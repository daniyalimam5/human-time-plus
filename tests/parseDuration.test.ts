import { describe, expect, it } from 'vitest';

import { humanDuration } from '../src/humanDuration';
import { HumanTimeError } from '../src/errors';
import { parseDuration } from '../src/parseDuration';

describe('parseDuration', () => {
  it('parses a bare number as milliseconds', () => {
    expect(parseDuration('5000')).toBe(5000);
  });

  it('parses a bare decimal number as milliseconds', () => {
    expect(parseDuration('1500.5')).toBe(1500.5);
  });

  it('parses a negative bare number', () => {
    expect(parseDuration('-5000')).toBe(-5000);
  });

  describe('single units', () => {
    it('parses milliseconds', () => {
      expect(parseDuration('500ms')).toBe(500);
    });

    it('parses seconds', () => {
      expect(parseDuration('90s')).toBe(90_000);
    });

    it('parses minutes', () => {
      expect(parseDuration('5m')).toBe(5 * 60_000);
    });

    it('parses hours', () => {
      expect(parseDuration('2h')).toBe(2 * 3_600_000);
    });

    it('parses days', () => {
      expect(parseDuration('3d')).toBe(3 * 86_400_000);
    });

    it('parses weeks', () => {
      expect(parseDuration('2w')).toBe(2 * 7 * 86_400_000);
    });

    it('parses fractional units', () => {
      expect(parseDuration('1.5h')).toBe(5_400_000);
    });

    it('is case-insensitive on unit spelling', () => {
      expect(parseDuration('2H')).toBe(2 * 3_600_000);
    });
  });

  describe('compact combined durations', () => {
    it('parses multiple compact units', () => {
      expect(parseDuration('1h 2m 5s')).toBe(3_725_000);
    });

    it('parses without spaces between segments', () => {
      expect(parseDuration('1h2m5s')).toBe(3_725_000);
    });

    it('parses days combined with smaller units', () => {
      expect(parseDuration('1d 1h 1m 1s')).toBe(90_061_000);
    });
  });

  describe('long-form combined durations', () => {
    it('parses comma-separated words', () => {
      expect(parseDuration('1 hour, 2 minutes, 5 seconds')).toBe(3_725_000);
    });

    it('parses "and"-joined words', () => {
      expect(parseDuration('1 hour and 30 minutes')).toBe(90 * 60_000);
    });

    it('parses singular and plural spellings', () => {
      expect(parseDuration('1 day, 1 hour, 1 minute, 1 second')).toBe(90_061_000);
    });
  });

  describe('round-trips with humanDuration', () => {
    it('recovers the original milliseconds from compact output', () => {
      const ms = 90_061_000;
      expect(parseDuration(humanDuration(ms, { compact: true }))).toBe(ms);
    });

    it('recovers the original milliseconds from long-form output', () => {
      const ms = 3_725_000;
      expect(parseDuration(humanDuration(ms))).toBe(ms);
    });
  });

  describe('invalid input', () => {
    it('throws for an empty string', () => {
      expect(() => parseDuration('')).toThrow(HumanTimeError);
    });

    it('throws for whitespace only', () => {
      expect(() => parseDuration('   ')).toThrow(HumanTimeError);
    });

    it('throws for an unrecognized unit', () => {
      expect(() => parseDuration('5 fortnights')).toThrow(HumanTimeError);
    });

    it('throws for gibberish', () => {
      expect(() => parseDuration('not a duration')).toThrow(HumanTimeError);
    });

    it('throws for trailing garbage after a valid token', () => {
      expect(() => parseDuration('5m???')).toThrow(HumanTimeError);
    });

    it('throws for non-string input', () => {
      // @ts-expect-error deliberately passing an invalid type
      expect(() => parseDuration(5000)).toThrow(HumanTimeError);
    });
  });
});
