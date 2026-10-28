import { pathToFileURL } from 'node:url'

/** Module URL for {@link resolveThreadedNetworkModuleUrl} without static `import.meta` (CJS-safe emit). */
export function ethyCallerModuleUrl(): string {
  const readEsm = Function(
    'return typeof import.meta !== "undefined" && import.meta.url ? import.meta.url : undefined',
  ) as () => string | undefined
  const esm = readEsm()
  if (typeof esm === 'string') return esm

  const readCjs = Function(
    'return typeof __filename !== "undefined" ? __filename : undefined',
  ) as () => string | undefined
  const cjs = readCjs()
  if (typeof cjs === 'string') return pathToFileURL(cjs).href

  throw new Error('Could not resolve caller module URL for devp2p worker')
}
