/**
 * @module util
 */
import { platform } from 'os'
import { version as packageVersion } from '../../package.json'

export * from './parse'

export function short(buffer: Buffer): string {
  return buffer.toString('hex').slice(0, 8) + '...'
}

export function getClientVersion() {
  const { version } = process
  return `EthereumJS/${packageVersion}/${platform()}/node${version.substring(1)}`
}
