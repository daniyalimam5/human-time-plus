import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { HumanTimeError } from './errors';
import { humanDuration } from './humanDuration';
import { humanTime } from './humanTime';
import { parseDuration } from './parseDuration';

function readVersion(): string {
  try {
    const dir = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(dir, '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

function printHelp(): void {
  console.log(`human-time-plus - convert dates and durations into human-readable text

Usage:
  human-time-plus <date>                 Show relative time (e.g. "2 hours ago")
  human-time-plus <date> --locale ur     Render in another locale
  human-time-plus --duration <ms>        Format a duration in milliseconds
  human-time-plus --duration <ms> --compact
  human-time-plus --parse "1h 30m"       Parse a duration string into milliseconds

Options:
  --duration <ms>   Format milliseconds as a duration instead of relative time
  --parse <text>    Parse a duration string (e.g. "1h 30m", "90s") into milliseconds
  --compact         Use compact duration format (1h 2m 5s)
  --locale <code>   Locale to use (en, ur)
  -h, --help        Show this help message
  -v, --version     Show the version number`);
}

/**
 * Parses CLI arguments into a structured request. Exported (alongside
 * `main`) so it can be exercised directly in tests without spawning a
 * child process.
 */
export function parseArgs(argv: string[]): {
  help: boolean;
  version: boolean;
  locale?: string;
  compact: boolean;
  durationMs?: string;
  parseText?: string;
  date?: string;
} {
  const localeIndex = argv.indexOf('--locale');
  const locale = localeIndex !== -1 ? argv[localeIndex + 1] : undefined;

  const durationIndex = argv.indexOf('--duration');
  const durationMs = durationIndex !== -1 ? argv[durationIndex + 1] : undefined;

  const parseIndex = argv.indexOf('--parse');
  const parseText = parseIndex !== -1 ? argv[parseIndex + 1] : undefined;

  const skip = new Set<number>();
  if (localeIndex !== -1) {
    skip.add(localeIndex).add(localeIndex + 1);
  }
  if (durationIndex !== -1) {
    skip.add(durationIndex).add(durationIndex + 1);
  }
  if (parseIndex !== -1) {
    skip.add(parseIndex).add(parseIndex + 1);
  }
  const date = argv.find((arg, i) => !skip.has(i) && arg !== '--compact' && !arg.startsWith('-'));

  return {
    help: argv.includes('-h') || argv.includes('--help'),
    version: argv.includes('-v') || argv.includes('--version'),
    locale,
    compact: argv.includes('--compact'),
    durationMs,
    parseText,
    date,
  };
}

export function main(argv: string[] = process.argv.slice(2)): void {
  const args = parseArgs(argv);

  if (args.help || argv.length === 0) {
    printHelp();
    return;
  }

  if (args.version) {
    console.log(readVersion());
    return;
  }

  if (args.durationMs !== undefined) {
    const ms = Number(args.durationMs);
    if (Number.isNaN(ms)) {
      throw new HumanTimeError(`Invalid duration value: "${args.durationMs}"`);
    }
    console.log(humanDuration(ms, { compact: args.compact, locale: args.locale }));
    return;
  }

  if (args.parseText !== undefined) {
    console.log(parseDuration(args.parseText));
    return;
  }

  if (!args.date) {
    printHelp();
    return;
  }

  console.log(humanTime(args.date, { locale: args.locale }));
}

const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    main();
  } catch (error) {
    if (error instanceof HumanTimeError) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
