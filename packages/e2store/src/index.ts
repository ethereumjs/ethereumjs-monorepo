import { readFileSync } from 'fs'

export * from './era/index.ts'
export * from './e2store.ts'
export * from './era1/index.ts'
export * from './e2hs/index.ts'
export * from './exportHistory.ts'
export * from './snappy.ts'
export * from './types.ts'
export * from './blockIndex.ts'

export function readBinaryFile(path: string) {
  return new Uint8Array(readFileSync(path))
}
