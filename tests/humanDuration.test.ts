import { describe, expect, it } from 'vitest';

import { humanDuration } from '../src/humanDuration';
import { HumanTimeError } from '../src/errors';
import { ur } from '../src/locales/ur';

describe('humanDuration', () => {
  it('formats a single unit', () => {
    expect(humanDuration(5000)).toBe('5 seconds');
  });

  it('formats singular seconds', () => {
    expect(humanDuration(1000)).toBe('1 second');
  });

  it('formats hours, minutes, and seconds together', () => {
    expect(humanDuration(3_725_000)).toBe('1 hour, 2 minutes, 5 seconds');
  });

  it('formats singular units together', () => {
    expect(humanDuration(3_661_000)).toBe('1 hour, 1 minute, 1 second');
  });

  it('omits zero-value units', () => {
    expect(humanDuration(3_605_000)).toBe('1 hour, 5 seconds');
  });

  it('formats days', () => {
    expect(humanDuration(2 * 86_400_000 + 3_661_000)).toBe('2 days, 1 hour, 1 minute, 1 second');
  });

  it('rounds down sub-second durations to 0 seconds', () => {
    expect(humanDuration(400)).toBe('0 seconds');
  });

  it('handles exactly zero', () => {
    expect(humanDuration(0)).toBe('0 seconds');
  });

  it('treats negative durations as their absolute value', () => {
    expect(humanDuration(-5000)).toBe('5 seconds');
  });

  describe('compact mode', () => {
    it('formats using short unit symbols', () => {
      expect(humanDuration(3_725_000, { compact: true })).toBe('1h 2m 5s');
    });

    it('omits zero-value units in compact mode', () => {
      expect(humanDuration(5000, { compact: true })).toBe('5s');
    });

    it('formats days in compact mode', () => {
      expect(humanDuration(90_061_000, { compact: true })).toBe('1d 1h 1m 1s');
    });
  });

  describe('localization', () => {
    it('renders Urdu duration unit names', () => {
      const expected = [
        `1 ${ur.durationUnits.hour.one}`,
        `2 ${ur.durationUnits.minute.other}`,
        `5 ${ur.durationUnits.second.other}`,
      ].join(ur.durationJoiner);
      expect(humanDuration(3_725_000, { locale: 'ur' })).toBe(expected);
    });

    it('keeps compact symbols in Latin letters for Urdu', () => {
      expect(humanDuration(3_725_000, { locale: 'ur', compact: true })).toBe('1h 2m 5s');
    });
  });

  describe('invalid input', () => {
    it('throws HumanTimeError for NaN', () => {
      expect(() => humanDuration(NaN)).toThrow(HumanTimeError);
    });

    it('throws HumanTimeError for Infinity', () => {
      expect(() => humanDuration(Infinity)).toThrow(HumanTimeError);
    });

    it('throws HumanTimeError for non-number input', () => {
      // @ts-expect-error deliberately passing an invalid type
      expect(() => humanDuration('5000')).toThrow(HumanTimeError);
    });
  });
});
