import { readFileSync } from 'fs'

export * from './blockTuple.js'
export * from './e2store.js'
export * from './era1.js'
export * from './exportHistory.js'
export * from './snappy.js'
export * from './types.js'

export function readBinaryFile(path: string) {
  return new Uint8Array(readFileSync(path))
}
