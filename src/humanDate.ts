import { getLocale } from './locales';
import { parseDate } from './parseDate';
import type { DateFormatOptions, DateInput } from './types';

interface DateParts {
  day: number;
  monthIndex: number;
  year: number;
  weekdayIndex: number;
  hours: number;
  minutes: number;
}

function readParts(date: Date, timeZone: 'utc' | 'local'): DateParts {
  if (timeZone === 'local') {
    return {
      day: date.getDate(),
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      weekdayIndex: date.getDay(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  }
  return {
    day: date.getUTCDate(),
    monthIndex: date.getUTCMonth(),
    year: date.getUTCFullYear(),
    weekdayIndex: date.getUTCDay(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  };
}

/**
 * Formats a Date/ISO string/timestamp as a clean, locale-aware date string,
 * e.g. "Aug 24, 2026". Defaults to reading the date's UTC calendar fields
 * so output is deterministic regardless of the host machine's timezone;
 * pass `{ timeZone: 'local' }` to read local wall-clock fields instead.
 */
export function humanDate(input: DateInput, options: DateFormatOptions = {}): string {
  const date = parseDate(input);
  const locale = getLocale(options.locale);
  const format = options.format ?? 'medium';
  const timeZone = options.timeZone ?? 'utc';

  const { day, monthIndex, year, weekdayIndex, hours, minutes } = readParts(date, timeZone);

  let result: string;
  switch (format) {
    case 'short':
      result = `${String(monthIndex + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
      break;
    case 'long':
      result = `${locale.monthsLong[monthIndex]} ${day}, ${year}`;
      break;
    case 'full':
      result = `${locale.weekdaysLong[weekdayIndex]}, ${locale.monthsLong[monthIndex]} ${day}, ${year}`;
      break;
    case 'medium':
    default:
      result = `${locale.monthsShort[monthIndex]} ${day}, ${year}`;
      break;
  }

  if (options.includeTime) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    result += ` ${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  return result;
}
