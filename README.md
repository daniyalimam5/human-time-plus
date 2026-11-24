# human-time-plus

[![npm version](https://img.shields.io/npm/v/human-time-plus.svg)](https://www.npmjs.com/package/human-time-plus)
[![npm downloads](https://img.shields.io/npm/dm/human-time-plus.svg)](https://www.npmjs.com/package/human-time-plus)
[![bundle size](https://img.shields.io/bundlephobia/minzip/human-time-plus)](https://bundlephobia.com/package/human-time-plus)
[![license](https://img.shields.io/npm/l/human-time-plus.svg)](./LICENSE)

Tiny, dependency-free helpers for the date/time formatting you write in every project: relative timestamps, durations, and clean date strings. Comes with a CLI and English/Urdu localization out of the box.

```ts
import { humanTime, humanDuration, humanDate, parseDuration } from 'human-time-plus';

humanTime(new Date());       // "just now"
humanDuration(3725000);      // "1 hour, 2 minutes, 5 seconds"
humanDate('2026-08-24T07:30:00Z'); // "Aug 24, 2026"
parseDuration('1h 30m');     // 5400000
```

## Why human-time-plus?

- **Zero dependencies.** Nothing to audit, nothing to break underneath you.
- **Tiny.** ~2 KB minified and gzipped, tree-shakeable, no bloat.
- **Correct.** Precise boundary handling (59s → 1m, 59m → 1h, ...), validated dates, no silent `Invalid Date` strings.
- **Both module systems.** Ships ESM and CommonJS builds with full type definitions.
- **Localized.** English and Urdu today, with a simple registry to add more.
- **A CLI included.** Format a date or duration from your terminal without opening a REPL.
- **Parses durations too.** `parseDuration` reads config-style strings like `"1h 30m"` back into milliseconds, so you don't need a separate package like `ms` alongside this one.

### How it compares

| | human-time-plus | moment.js | day.js | timeago.js |
| --- | --- | --- | --- | --- |
| Dependencies | 0 | 0 | 0 | 0 |
| Min+gzip size | ~2 KB | ~72 KB | ~2 KB | ~2 KB |
| `humanTime` / `humanDuration` / `humanDate` in one package | Yes | Split across plugins | Split across plugins | Relative time only |
| Built-in CLI | Yes | No | No | No |
| Parses `"1h 30m"` style strings back to ms | Yes | No | No | No |
| TypeScript types included | Yes | Community `@types` | Yes | Community `@types` |
| Maintenance status | Active | In maintenance mode | Active | Sparse |

human-time-plus is not trying to replace a full date math library like day.js. It solves one problem well: turning a timestamp or a duration into text a person would actually say, with a tiny footprint and no plugin system to learn.

## Installation

```bash
npm install human-time-plus
```

## Basic usage

```ts
import { humanTime, humanDuration, humanDate } from 'human-time-plus';

// Relative time
humanTime(new Date());                     // "just now"
humanTime('2026-08-24T07:00:00Z');         // "5 minutes ago"
humanTime(Date.now() - 2 * 60 * 60 * 1000); // "2 hours ago"
humanTime(Date.now() + 10 * 60 * 1000);     // "in 10 minutes"

// Durations
humanDuration(5000);                       // "5 seconds"
humanDuration(3725000);                    // "1 hour, 2 minutes, 5 seconds"
humanDuration(3725000, { compact: true }); // "1h 2m 5s"

// Dates
humanDate('2026-08-24T07:30:00Z');                    // "Aug 24, 2026"
humanDate('2026-08-24T07:30:00Z', { format: 'full' }); // "Monday, August 24, 2026"
```

## API reference

### `humanTime(date, options?)`

Converts a point in time into a relative phrase like `"5 minutes ago"` or `"in 3 days"`.

**`date`**: a `Date`, an ISO 8601 string, or a Unix timestamp in milliseconds.

**`options`**

| Option   | Type                | Default | Description                                      |
| -------- | ------------------- | ------- | ------------------------------------------------- |
| `locale` | `'en' \| 'ur'`       | `'en'`  | Locale to render the phrase in.                   |
| `now`    | `Date \| string \| number` | current time | Reference point to compare against. Useful for tests and for formatting against a time other than "now". |

Boundaries: under 30 seconds renders as `"just now"`; after that the scale steps through seconds → minutes → hours → days → weeks → months → years, each unit taking over exactly where the previous one hits its ceiling (59 seconds stays `"59 seconds ago"`, 60 seconds becomes `"1 minute ago"`).

### `humanDuration(milliseconds, options?)`

Converts a millisecond duration into a readable string, e.g. `"1 hour, 2 minutes, 5 seconds"`. Units with a value of zero are omitted, so `humanDuration(5000)` is `"5 seconds"`, not `"0 hours, 0 minutes, 5 seconds"`. Durations under a second render as `"0 seconds"`. Negative durations are treated as their absolute value.

**`options`**

| Option    | Type                | Default | Description                                            |
| --------- | ------------------- | ------- | -------------------------------------------------------- |
| `locale`  | `'en' \| 'ur'`       | `'en'`  | Locale for unit names.                                   |
| `compact` | `boolean`            | `false` | Use short symbols (`1h 2m 5s`) instead of full words.     |

```ts
humanDuration(90061000);                    // "1 day, 1 hour, 1 minute, 1 second"
humanDuration(90061000, { compact: true }); // "1d 1h 1m 1s"
```

### `parseDuration(text)`

The inverse of `humanDuration`. Parses a duration string into milliseconds, so you don't need to reach for a separate package like `ms` alongside this one.

```ts
parseDuration('5000');              // 5000 (a bare number is already milliseconds)
parseDuration('90s');               // 90000
parseDuration('1.5h');              // 5400000
parseDuration('1h 30m');            // 5400000
parseDuration('1h30m');             // 5400000, spacing is optional
parseDuration('1 hour, 30 minutes'); // 5400000, understands humanDuration's own output
parseDuration('1 hour and 30 minutes'); // 5400000
```

Recognized units: `ms`, `s`/`sec`/`second(s)`, `m`/`min`/`minute(s)`, `h`/`hr`/`hour(s)`, `d`/`day(s)`, `w`/`wk`/`week(s)`, `y`/`yr`/`year(s)`, matched case-insensitively. `month` is deliberately not supported since its real length varies from 28 to 31 days, so a parsed value would silently be wrong depending on which month was meant. Throws `HumanTimeError` for anything it can't parse.

### `humanDate(date, options?)`

Formats a date as a clean, locale-aware string.

**`date`**: a `Date`, an ISO 8601 string, or a Unix timestamp in milliseconds.

**`options`**

| Option        | Type                                     | Default    | Description                                                                 |
| ------------- | ----------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `locale`      | `'en' \| 'ur'`                             | `'en'`     | Locale for month/weekday names.                                              |
| `format`      | `'short' \| 'medium' \| 'long' \| 'full'`  | `'medium'` | Output style. See the table below.                                           |
| `includeTime` | `boolean`                                  | `false`    | Append a formatted time, e.g. `"Aug 24, 2026 7:30 AM"`.                       |
| `timeZone`    | `'utc' \| 'local'`                         | `'utc'`    | Which calendar fields to read the date from. `'utc'` keeps output deterministic regardless of the host machine's timezone. |

| `format`  | Example                        |
| --------- | ------------------------------- |
| `short`   | `08/24/2026`                    |
| `medium`  | `Aug 24, 2026`                  |
| `long`    | `August 24, 2026`               |
| `full`    | `Monday, August 24, 2026`       |

### Errors

Invalid input (an unparsable date string, a non-finite duration, `NaN`, `null`, etc.) throws a `HumanTimeError`. It never fails silently with an `"Invalid Date"` string.

```ts
import { humanTime, HumanTimeError } from 'human-time-plus';

try {
  humanTime('not a date');
} catch (error) {
  if (error instanceof HumanTimeError) {
    console.error(error.message); // "Invalid date: could not parse \"not a date\""
  }
}
```

## Localization

human-time-plus ships English (`en`) and Urdu (`ur`):

```ts
humanTime(date, { locale: 'ur' }); // "5 منٹ پہلے"
humanDuration(3725000, { locale: 'ur' }); // "1 گھنٹہ، 2 منٹ، 5 سیکنڈ"
humanDate(date, { locale: 'ur' }); // "اگست 24, 2026"
```

Compact durations always use the same short symbols (`1h 2m 5s`) regardless of locale. They're meant to be terse, at-a-glance units rather than translated prose.

Adding a new locale just means implementing the `LocaleDefinition` shape and registering it. No build step or plugin system required:

```ts
import { registerLocale } from 'human-time-plus';

registerLocale('es', {
  code: 'es',
  justNow: 'justo ahora',
  past: (phrase) => `hace ${phrase}`,
  future: (phrase) => `en ${phrase}`,
  units: {
    second: { one: 'segundo', other: 'segundos' },
    minute: { one: 'minuto', other: 'minutos' },
    hour: { one: 'hora', other: 'horas' },
    day: { one: 'día', other: 'días' },
    week: { one: 'semana', other: 'semanas' },
    month: { one: 'mes', other: 'meses' },
    year: { one: 'año', other: 'años' },
  },
  durationUnits: {
    day: { one: 'día', other: 'días' },
    hour: { one: 'hora', other: 'horas' },
    minute: { one: 'minuto', other: 'minutos' },
    second: { one: 'segundo', other: 'segundos' },
  },
  durationCompactUnits: { day: 'd', hour: 'h', minute: 'm', second: 's' },
  durationJoiner: ', ',
  monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  monthsLong: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  weekdaysShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  weekdaysLong: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
});

humanTime(date, { locale: 'es' }); // "hace 5 minutos"
```

## CLI usage

The package installs a `human-time-plus` binary you can run with `npx` (no global install needed):

```bash
npx human-time-plus "2026-08-24T07:30:00Z"
# 2 hours ago

npx human-time-plus --duration 3725000
# 1 hour, 2 minutes, 5 seconds

npx human-time-plus --duration 3725000 --compact
# 1h 2m 5s

npx human-time-plus "2026-08-24T07:30:00Z" --locale ur
# 2 گھنٹے پہلے

npx human-time-plus --parse "1h 30m"
# 5400000

npx human-time-plus --help
```

## TypeScript usage

human-time-plus is written in TypeScript and ships its own `.d.ts` files, so no `@types` package is needed. All three functions, their option objects, and the locale registry are fully typed:

```ts
import type { DateInput, RelativeTimeOptions, LocaleDefinition } from 'human-time-plus';

function formatEvent(date: DateInput, options: RelativeTimeOptions): string {
  return humanTime(date, options);
}
```

`LocaleCode` autocompletes the built-in `'en' | 'ur'` while still accepting any other string, so registering custom locales doesn't fight the type checker.

## Examples

```ts
// A live-updating "last seen" label
function lastSeenLabel(lastActiveAt: string) {
  return humanTime(lastActiveAt);
}

// Job duration in a CI dashboard
function jobDurationLabel(startedAt: number, finishedAt: number) {
  return humanDuration(finishedAt - startedAt, { compact: true });
}

// A published-on date, deterministic across servers in any timezone
function publishedOnLabel(publishedAt: Date) {
  return humanDate(publishedAt, { format: 'long' });
}

// A config file lets someone write TTL: "1h 30m" instead of TTL_MS: 5400000
function readCacheTtl(config: { ttl: string }) {
  return parseDuration(config.ttl);
}
```

## Node.js and browser compatibility

human-time-plus has no runtime dependencies and uses only standard `Date` APIs, so it runs anywhere modern JavaScript runs: Node.js 16+, browsers, Deno, and edge runtimes. The published package includes both an ESM build (`import`) and a CommonJS build (`require`), selected automatically via `package.json#exports`.

## License

MIT
