import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ETHY_CLIENT_NAME = 'Ethy'

let cachedVersion: string | undefined

/** Optional override (e.g. tests); normally resolved from `@ethereumjs/ethy` package.json. */
export function primeEthyClientVersion(version: string): void {
  cachedVersion = version
}

function tryCjsDir(): string | undefined {
  try {
    const readDir = Function(
      'return typeof __dirname !== "undefined" ? __dirname : undefined',
    ) as () => string | undefined
    return readDir()
  } catch {
    return undefined
  }
}

function tryEsmDir(): string | undefined {
  try {
    const readUrl = Function(
      'return typeof import.meta !== "undefined" && import.meta.url ? import.meta.url : undefined',
    ) as () => string | undefined
    const url = readUrl()
    if (typeof url !== 'string') return undefined
    return dirname(fileURLToPath(url))
  } catch {
    return undefined
  }
}

function readEthyPackageVersion(startDir: string): string | undefined {
  let dir = startDir
  for (let depth = 0; depth < 6; depth++) {
    const path = join(dir, 'package.json')
    if (existsSync(path)) {
      try {
        const pkg = JSON.parse(readFileSync(path, 'utf8')) as { name?: string; version?: string }
        if (
          pkg.name === '@ethereumjs/ethy' &&
          typeof pkg.version === 'string' &&
          pkg.version.length > 0
        ) {
          return pkg.version
        }
      } catch {
        // keep walking
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return undefined
}

function resolveEthyClientVersion(): string {
  if (cachedVersion !== undefined) return cachedVersion

  const anchors = [tryEsmDir(), tryCjsDir(), process.cwd()].filter(
    (d): d is string => typeof d === 'string' && d.length > 0,
  )

  for (const anchor of anchors) {
    const version = readEthyPackageVersion(anchor)
    if (version !== undefined) {
      cachedVersion = version
      return version
    }
  }

  cachedVersion = '0.0.0'
  return cachedVersion
}

/** Package version from `package.json` (shown in the TUI chrome). */
export function getEthyClientVersion(): string {
  return resolveEthyClientVersion()
}
