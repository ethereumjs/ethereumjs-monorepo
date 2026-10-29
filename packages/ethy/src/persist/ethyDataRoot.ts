import * as os from 'node:os'
import * as path from 'node:path'

/** Default Ethy data root; override with `ETHY_DATADIR` or `--datadir`. */
export function resolveEthyDataDir(override?: string): string {
  if (override !== undefined && override.length > 0) return override
  const fromEnv = process.env.ETHY_DATADIR
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv
  const home = os.homedir()
  if (process.platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'ethy')
  }
  if (process.platform === 'win32') {
    const local = process.env.LOCALAPPDATA ?? path.join(home, 'AppData', 'Local')
    return path.join(local, 'ethy')
  }
  const xdg = process.env.XDG_DATA_HOME
  return path.join(xdg ?? path.join(home, '.local', 'share'), 'ethy')
}
