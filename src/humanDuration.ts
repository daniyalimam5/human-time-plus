import { HumanTimeError } from './errors';
import { getLocale } from './locales';
import type { DurationOptions } from './types';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type DurationUnit = 'day' | 'hour' | 'minute' | 'second';

/**
 * Renders a millisecond duration as a human-readable string, e.g.
 * "1 hour, 2 minutes, 5 seconds" or, with `{ compact: true }`, "1h 2m 5s".
 * Zero-value units are omitted; durations under a second render as "0 seconds".
 */
export function humanDuration(ms: number, options: DurationOptions = {}): string {
  if (typeof ms !== 'number' || Number.isNaN(ms) || !Number.isFinite(ms)) {
    throw new HumanTimeError(
      `Invalid duration: expected a finite number of milliseconds, got ${JSON.stringify(ms)}`,
    );
  }

  const locale = getLocale(options.locale);
  const totalMs = Math.floor(Math.abs(ms));

  const days = Math.floor(totalMs / DAY);
  const hours = Math.floor((totalMs % DAY) / HOUR);
  const minutes = Math.floor((totalMs % HOUR) / MINUTE);
  const seconds = Math.floor((totalMs % MINUTE) / SECOND);

  const allParts: Array<{ value: number; unit: DurationUnit }> = [
    { value: days, unit: 'day' },
    { value: hours, unit: 'hour' },
    { value: minutes, unit: 'minute' },
    { value: seconds, unit: 'second' },
  ];
  const parts = allParts.filter((part) => part.value > 0);

  if (parts.length === 0) {
    parts.push({ value: 0, unit: 'second' });
  }

  if (options.compact) {
    return parts.map((part) => `${part.value}${locale.durationCompactUnits[part.unit]}`).join(' ');
  }

  return parts
    .map((part) => {
      const form = locale.durationUnits[part.unit];
      const word = part.value === 1 ? form.one : form.other;
      return `${part.value} ${word}`;
    })
    .join(locale.durationJoiner);
}
