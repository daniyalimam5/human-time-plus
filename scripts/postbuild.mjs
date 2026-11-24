import { chmodSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const cliPath = join(dir, '..', 'dist', 'cli.js');

if (existsSync(cliPath)) {
  try {
    chmodSync(cliPath, 0o755);
  } catch {
    // chmod is a no-op on platforms without POSIX permissions (e.g. Windows).
  }
}
