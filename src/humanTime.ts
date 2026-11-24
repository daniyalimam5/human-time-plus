import { getLocale } from './locales';
import type { RelativeUnits } from './locales/types';
import { parseDate } from './parseDate';
import type { DateInput, RelativeTimeOptions } from './types';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30.4375 * DAY; // 365.25 / 12 days, average month length
const YEAR = 365.25 * DAY;

/** Anything within this many milliseconds of "now" renders as "just now". */
const JUST_NOW_THRESHOLD = 30 * SECOND;

type UnitKey = keyof RelativeUnits;

/**
 * Ordered smallest to largest. Each tier is used while the elapsed time is
 * less than the *next* tier's `ms` value, so boundaries land exactly on
 * "59 seconds" -> "1 minute", "59 minutes" -> "1 hour", etc.
 */
const TIERS: ReadonlyArray<{ unit: UnitKey; ms: number }> = [
  { unit: 'second', ms: SECOND },
  { unit: 'minute', ms: MINUTE },
  { unit: 'hour', ms: HOUR },
  { unit: 'day', ms: DAY },
  { unit: 'week', ms: WEEK },
  { unit: 'month', ms: MONTH },
  { unit: 'year', ms: YEAR },
];

/**
 * Renders a Date/ISO string/timestamp as a relative phrase like
 * "5 minutes ago" or "in 3 days", relative to `options.now` (defaults to
 * the current time).
 */
export function humanTime(input: DateInput, options: RelativeTimeOptions = {}): string {
  const target = parseDate(input);
  const reference = options.now !== undefined ? parseDate(options.now) : new Date();
  const locale = getLocale(options.locale);

  const diffMs = target.getTime() - reference.getTime();
  const absMs = Math.abs(diffMs);

  if (absMs < JUST_NOW_THRESHOLD) {
    return locale.justNow;
  }

  let tier = TIERS[TIERS.length - 1];
  for (let i = 0; i < TIERS.length; i += 1) {
    const upperBound = i + 1 < TIERS.length ? TIERS[i + 1].ms : Infinity;
    if (absMs < upperBound) {
      tier = TIERS[i];
      break;
    }
  }

  const value = Math.max(1, Math.floor(absMs / tier.ms));
  const unitForm = locale.units[tier.unit];
  const word = value === 1 ? unitForm.one : unitForm.other;
  const phrase = `${value} ${word}`;

  return diffMs >= 0 ? locale.future(phrase) : locale.past(phrase);
}
