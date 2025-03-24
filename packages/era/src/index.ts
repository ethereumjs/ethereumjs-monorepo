import { readFileSync } from 'fs'

export * from './blockTuple.ts'
export * from './e2store.ts'
export * from './era1.ts'
export * from './exportHistory.ts'
export * from './snappy.ts'
export * from './types.ts'

export function readBinaryFile(path: string) {
  return new Uint8Array(readFileSync(path))
}
