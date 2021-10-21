/**
 * @module util
 */
import { platform } from 'os'
import { inspect } from 'util'
import { version as packageVersion } from '../../package.json'

export * from './parse'

export function short(buffer: Buffer): string {
  return buffer.toString('hex').slice(0, 8) + '...'
}

export function getClientVersion() {
  const { version } = process
  return `EthereumJS/${packageVersion}/${platform()}/node${version.substring(1)}`
}

/**
 * Internal util to pretty print params for logging.
 */
export function inspectParams(params: any, shorten?: number) {
  let inspected = inspect(params, {
    colors: true,
    maxStringLength: 100,
  } as any)
  if (shorten) {
    inspected = inspected.replace(/\n/g, '').replace(/ {2}/g, ' ')
    if (inspected.length > shorten) {
      inspected = inspected.slice(0, shorten) + '...'
    }
  }
  return inspected
}
