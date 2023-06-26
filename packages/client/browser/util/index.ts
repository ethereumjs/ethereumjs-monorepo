/**
 * @module util
 */
import { bytesToPrefixedHexString } from '@ethereumjs/util'
import { platform } from 'os'

import { version as packageVersion } from '../../package.json'

export * from '../../src/util/parse'

export function short(bytes: Uint8Array | string): string {
  if (bytes === null || bytes === undefined || bytes === '') return ''
  const bytesString = bytes instanceof Uint8Array ? bytesToPrefixedHexString(bytes) : bytes
  let str = bytesString.substring(0, 6) + '…'
  if (bytesString.length === 66) {
    str += bytesString.substring(62)
  }
  return str
}

export function getClientVersion() {
  const { version } = process
  return `EthereumJS/${packageVersion}/${platform()}/node${version.substring(1)}`
}

/**
 * Returns a friendly time duration.
 * @param time the number of seconds
 */
export function timeDuration(time: number) {
  const min = 60
  const hour = min * 60
  const day = hour * 24
  let str = ''
  if (time > day) {
    str = `${Math.floor(time / day)} day`
  } else if (time > hour) {
    str = `${Math.floor(time / hour)} hour`
  } else if (time > min) {
    str = `${Math.floor(time / min)} min`
  } else {
    str = `${Math.floor(time)} sec`
  }
  if (str.substring(0, 2) !== '1 ') {
    str += 's'
  }
  return str
}

/**
 * Returns a friendly time diff string.
 * @param timestamp the timestamp to diff (in seconds) from now
 */
export function timeDiff(timestamp: number) {
  const diff = new Date().getTime() / 1000 - timestamp
  return timeDuration(diff)
}

/**
 * Stub to exclude node only stats function
 * @returns null
 */
export async function getV8Engine(): Promise<null> {
  return null
}

export const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
