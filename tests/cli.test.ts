import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { main, parseArgs } from '../src/cli';

describe('cli', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    process.exitCode = undefined;
  });

  describe('parseArgs', () => {
    it('extracts a positional date', () => {
      expect(parseArgs(['2026-08-24T07:30:00Z']).date).toBe('2026-08-24T07:30:00Z');
    });

    it('extracts --duration and --compact', () => {
      const args = parseArgs(['--duration', '3725000', '--compact']);
      expect(args.durationMs).toBe('3725000');
      expect(args.compact).toBe(true);
    });

    it('extracts --parse', () => {
      expect(parseArgs(['--parse', '1h 30m']).parseText).toBe('1h 30m');
    });

    it('extracts --locale alongside a date', () => {
      const args = parseArgs(['2026-08-24T07:30:00Z', '--locale', 'ur']);
      expect(args.date).toBe('2026-08-24T07:30:00Z');
      expect(args.locale).toBe('ur');
    });

    it('flags help and version', () => {
      expect(parseArgs(['--help']).help).toBe(true);
      expect(parseArgs(['-v']).version).toBe(true);
    });
  });

  describe('main', () => {
    it('prints a relative time for a date argument', () => {
      const past = new Date(Date.now() - 5 * 60_000).toISOString();
      main([past]);
      expect(logSpy).toHaveBeenCalledWith('5 minutes ago');
    });

    it('prints a formatted duration', () => {
      main(['--duration', '3725000']);
      expect(logSpy).toHaveBeenCalledWith('1 hour, 2 minutes, 5 seconds');
    });

    it('prints a compact duration', () => {
      main(['--duration', '3725000', '--compact']);
      expect(logSpy).toHaveBeenCalledWith('1h 2m 5s');
    });

    it('prints milliseconds parsed from a duration string', () => {
      main(['--parse', '1h 30m']);
      expect(logSpy).toHaveBeenCalledWith(90 * 60_000);
    });

    it('prints help with no arguments', () => {
      main([]);
      expect(logSpy).toHaveBeenCalled();
      expect(logSpy.mock.calls[0][0]).toContain('Usage');
    });

    it('throws for an invalid duration', () => {
      expect(() => main(['--duration', 'nope'])).toThrow();
    });
  });
});
