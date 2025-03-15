import { existsSync, readFileSync } from 'fs'
import { platform } from 'os'
import { dirname, join as joinPath } from 'path'
import { fileURLToPath } from 'url'
/**
 * @module util
 */
import { bytesToHex } from '@ethereumjs/util'

export * from './inclineClient.ts'
export * from './parse.ts'
export * from './rpc.ts'
// See: https://stackoverflow.com/a/50053801
const __dirname = dirname(fileURLToPath(import.meta.url))

export function short(bytes: Uint8Array | string): string {
  if (bytes === null || bytes === undefined || bytes === '') return ''
  const bytesString = bytes instanceof Uint8Array ? bytesToHex(bytes) : bytes
  let str = bytesString.substring(0, 6) + '…'
  if (bytesString.length === 66) {
    str += bytesString.substring(62)
  }
  return str
}

export function getPackageJSON() {
  // Find the package.json by checking the current directory and then
  // moving up a directory each time until package.json is found,
  // or we are at the root directory.
  let currentDir = __dirname

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const packageJsonPath = joinPath(currentDir, 'package.json')
    if (existsSync(packageJsonPath)) {
      // Read package.json contents
      const parsedJSON = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

      // Verify that the package.json contains the version
      if (parsedJSON.version !== undefined) {
        return parsedJSON
      }
      // If it does not contain the version, then keep moving to upper directories until a version is found
    }
    const parentDir = dirname(currentDir)
    // If we've reached the root directory, stop searching
    if (parentDir === currentDir) {
      // No package.json found
      return {}
    }
    currentDir = parentDir // Move up one directory
  }
}

export function getClientVersion() {
  const packageJSON = getPackageJSON()
  const { version } = process
  return `EthereumJS/${packageJSON.version}/${platform()}/node${version.substring(1)}`
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

// Dynamically load v8 for tracking mem stats
export const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
export type V8Engine = {
  getHeapStatistics: () => { heap_size_limit: number; used_heap_size: number }
}
let v8Engine: V8Engine | null = null
export async function getV8Engine(): Promise<V8Engine | null> {
  if (isBrowser() === false && v8Engine === null) {
    v8Engine = (await import('node:v8')) as V8Engine
  }
  return v8Engine
}
