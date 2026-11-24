import { en } from './en';
import { ur } from './ur';
import type { LocaleDefinition } from './types';
import type { LocaleCode } from '../types';

const registry = new Map<string, LocaleDefinition>([
  ['en', en],
  ['ur', ur],
]);

/**
 * Registers a custom locale (or overrides a built-in one) so it can be
 * passed as `{ locale: code }` to humanTime/humanDuration/humanDate.
 */
export function registerLocale(code: string, definition: LocaleDefinition): void {
  registry.set(code, definition);
}

/** Resolves a locale code to its definition, falling back to English. */
export function getLocale(code?: LocaleCode): LocaleDefinition {
  if (!code) return en;
  return registry.get(code) ?? en;
}

export { en, ur };
export type { LocaleDefinition };
