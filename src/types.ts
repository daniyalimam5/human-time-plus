/**
 * Anything humanTime/humanDate accept as a point in time: a Date instance,
 * an ISO 8601 string, or a Unix timestamp in milliseconds.
 */
export type DateInput = Date | string | number;

/**
 * Built-in locale codes get autocomplete; any other string is still
 * accepted so consumers can register and use custom locales.
 */
export type LocaleCode = 'en' | 'ur' | (string & {});

export interface RelativeTimeOptions {
  /** Locale to render the phrase in. Defaults to "en". */
  locale?: LocaleCode;
  /** Reference point to compare against instead of the current time. */
  now?: DateInput;
}

export interface DurationOptions {
  /** Locale to render unit names in. Defaults to "en". */
  locale?: LocaleCode;
  /** Use short symbols ("1h 2m 5s") instead of full words. */
  compact?: boolean;
}

export type DateFormatStyle = 'short' | 'medium' | 'long' | 'full';

export interface DateFormatOptions {
  /** Locale to render month/weekday names in. Defaults to "en". */
  locale?: LocaleCode;
  /** Output style. Defaults to "medium" ("Aug 24, 2026"). */
  format?: DateFormatStyle;
  /** Append a formatted time (e.g. "3:45 PM") after the date. */
  includeTime?: boolean;
  /**
   * Which calendar fields to read the date from. "utc" (default) makes
   * output deterministic regardless of the host machine's timezone;
   * "local" reads the date using the host's local timezone instead.
   */
  timeZone?: 'utc' | 'local';
}
