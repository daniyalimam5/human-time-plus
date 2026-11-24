export interface PluralForm {
  /** Form used when the value is exactly 1 (e.g. "minute"). */
  one: string;
  /** Form used for every other value (e.g. "minutes"). */
  other: string;
}

export interface RelativeUnits {
  second: PluralForm;
  minute: PluralForm;
  hour: PluralForm;
  day: PluralForm;
  week: PluralForm;
  month: PluralForm;
  year: PluralForm;
}

export interface DurationUnits {
  day: PluralForm;
  hour: PluralForm;
  minute: PluralForm;
  second: PluralForm;
}

export interface DurationCompactUnits {
  day: string;
  hour: string;
  minute: string;
  second: string;
}

export interface LocaleDefinition {
  /** BCP-47-ish code this locale is registered under, e.g. "en". */
  code: string;
  /** Shown for anything within the "just now" threshold. */
  justNow: string;
  /** Wraps a rendered phrase (e.g. "5 minutes") for the past: "5 minutes ago". */
  past: (phrase: string) => string;
  /** Wraps a rendered phrase for the future: "in 5 minutes". */
  future: (phrase: string) => string;
  /** Singular/plural unit names used by humanTime. */
  units: RelativeUnits;
  /** Singular/plural unit names used by humanDuration's long form. */
  durationUnits: DurationUnits;
  /** Short symbols used by humanDuration's compact form. */
  durationCompactUnits: DurationCompactUnits;
  /** Separator placed between duration parts in long form, e.g. ", ". */
  durationJoiner: string;
  /** Abbreviated month names, January first. */
  monthsShort: string[];
  /** Full month names, January first. */
  monthsLong: string[];
  /** Abbreviated weekday names, Sunday first. */
  weekdaysShort: string[];
  /** Full weekday names, Sunday first. */
  weekdaysLong: string[];
}
