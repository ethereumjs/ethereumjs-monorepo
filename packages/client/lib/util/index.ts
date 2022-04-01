/**
 * @module util
 */
import { platform } from 'os'
import { version as packageVersion } from '../../package.json'

export * from './parse'
export * from './rpc'

export function short(buf: Buffer | string): string {
  const bufStr = Buffer.isBuffer(buf) ? `0x${buf.toString('hex')}` : buf
  let str = bufStr.substring(0, 6) + '…'
  if (bufStr.length === 66) {
    str += bufStr.substring(62)
  }
  return str
}

export function getClientVersion() {
  const { version } = process
  return `EthereumJS/${packageVersion}/${platform()}/node${version.substring(1)}`
}
