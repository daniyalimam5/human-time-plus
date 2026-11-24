import { HumanTimeError } from './errors';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365.25 * DAY;

/**
 * Recognized unit spellings, mapped to their millisecond value. "Month" is
 * deliberately excluded: its real-world length varies (28-31 days), so a
 * parsed value would silently be wrong depending on which month was meant.
 */
const UNIT_MS: Record<string, number> = {
  ms: 1,
  msec: 1,
  msecs: 1,
  millisecond: 1,
  milliseconds: 1,
  s: SECOND,
  sec: SECOND,
  secs: SECOND,
  second: SECOND,
  seconds: SECOND,
  m: MINUTE,
  min: MINUTE,
  mins: MINUTE,
  minute: MINUTE,
  minutes: MINUTE,
  h: HOUR,
  hr: HOUR,
  hrs: HOUR,
  hour: HOUR,
  hours: HOUR,
  d: DAY,
  day: DAY,
  days: DAY,
  w: WEEK,
  wk: WEEK,
  wks: WEEK,
  week: WEEK,
  weeks: WEEK,
  y: YEAR,
  yr: YEAR,
  yrs: YEAR,
  year: YEAR,
  years: YEAR,
};

const NUMBER_ONLY = /^-?\d+(?:\.\d+)?$/;
const TOKEN = /(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/g;

/**
 * Parses a human-written duration string into milliseconds. The inverse of
 * `humanDuration`: it understands both its compact output ("1h 2m 5s") and
 * its long-form output ("1 hour, 2 minutes, 5 seconds"), plus common
 * shorthand like "1.5h" or "90s". A bare number (e.g. "5000") is treated as
 * milliseconds already, matching the convention of the popular `ms` package.
 *
 * Recognized units: ms, s(ec), m(in), h(our|r), d(ay), w(eek), y(ear), each
 * accepting singular or plural spellings.
 */
export function parseDuration(input: string): number {
  if (typeof input !== 'string') {
    throw new HumanTimeError(
      `Invalid duration string: expected a string, got ${typeof input}`,
    );
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new HumanTimeError('Invalid duration string: input is empty');
  }

  if (NUMBER_ONLY.test(trimmed)) {
    return Number(trimmed);
  }

  const negative = trimmed.startsWith('-');
  const body = negative ? trimmed.slice(1) : trimmed;

  let totalMs = 0;
  let sawToken = false;

  for (const match of body.matchAll(TOKEN)) {
    const [, amount, rawUnit] = match;
    const unit = UNIT_MS[rawUnit.toLowerCase()];
    if (unit === undefined) {
      throw new HumanTimeError(`Invalid duration string: unrecognized unit "${rawUnit}"`);
    }
    totalMs += Number(amount) * unit;
    sawToken = true;
  }

  if (!sawToken) {
    throw new HumanTimeError(`Invalid duration string: could not parse ${JSON.stringify(input)}`);
  }

  const remainder = body.replace(TOKEN, '').replace(/[,\s]|and/gi, '');
  if (remainder.length > 0) {
    throw new HumanTimeError(`Invalid duration string: could not parse ${JSON.stringify(input)}`);
  }

  const result = Math.round(totalMs);
  return negative ? -result : result;
}
