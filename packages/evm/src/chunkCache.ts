import type { PrefixedHexString } from '@ethereumjs/util'
import type { ChunkAccessEvent } from './verkleAccessWitness.ts'
export class ChunkCache {
  cache: Map<PrefixedHexString, ChunkAccessEvent>

  constructor() {
    this.cache = new Map<PrefixedHexString, ChunkAccessEvent>()
  }

  set(stemKey: PrefixedHexString, accessedStem: ChunkAccessEvent) {
    this.cache.set(stemKey, accessedStem)
  }

  get(stemHex: PrefixedHexString): ChunkAccessEvent | undefined {
    return this.cache.get(stemHex)
  }

  del(stemHex: PrefixedHexString): void {
    this.cache.delete(stemHex)
  }

  commit(): [PrefixedHexString, ChunkAccessEvent][] {
    const items: [PrefixedHexString, ChunkAccessEvent][] = Array.from(this.cache.entries())
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
