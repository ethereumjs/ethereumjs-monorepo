import type { PrefixedHexString } from '@ethereumjs/util'
import type { BinaryChunkAccessEvent } from './binaryTreeAccessWitness.ts'

export class ChunkCache {
  cache: Map<PrefixedHexString, BinaryChunkAccessEvent>

  constructor() {
    this.cache = new Map<PrefixedHexString, BinaryChunkAccessEvent>()
  }

  set(stemKey: PrefixedHexString, accessedStem: BinaryChunkAccessEvent) {
    this.cache.set(stemKey, accessedStem)
  }

  get(stemHex: PrefixedHexString): BinaryChunkAccessEvent | undefined {
    return this.cache.get(stemHex)
  }

  del(stemHex: PrefixedHexString): void {
    this.cache.delete(stemHex)
  }

  commit(): [PrefixedHexString, BinaryChunkAccessEvent][] {
    const items: [PrefixedHexString, BinaryChunkAccessEvent][] = Array.from(this.cache.entries())
    this.clear()
    return items
  }

  clear(): void {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}
