import { HumanTimeError } from './errors';
import type { DateInput } from './types';

/**
 * Normalizes a Date, ISO string, or Unix timestamp (milliseconds) into a
 * validated Date. Throws HumanTimeError for anything that doesn't resolve
 * to a real point in time.
 */
export function parseDate(input: DateInput): Date {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'number') {
    date = new Date(input);
  } else if (typeof input === 'string') {
    date = new Date(input);
  } else {
    throw new HumanTimeError(
      `Invalid date input: expected a Date, ISO string, or timestamp number, got ${typeof input}`,
    );
  }

  if (Number.isNaN(date.getTime())) {
    throw new HumanTimeError(`Invalid date: could not parse ${JSON.stringify(input)}`);
  }

  return date;
}
