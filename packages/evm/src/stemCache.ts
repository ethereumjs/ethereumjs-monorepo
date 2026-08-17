import type { PrefixedHexString } from '@ethereumjs/util'
import type { BinaryStemAccessEvent, BinaryStemMeta } from './binaryTreeAccessWitness.ts'

export class StemCache {
  cache: Map<PrefixedHexString, BinaryStemAccessEvent & BinaryStemMeta>

  constructor() {
    this.cache = new Map<PrefixedHexString, BinaryStemAccessEvent & BinaryStemMeta>()
  }

  set(stemKey: PrefixedHexString, accessedStem: BinaryStemAccessEvent & BinaryStemMeta) {
    this.cache.set(stemKey, accessedStem)
  }

  get(stemHex: PrefixedHexString): (BinaryStemAccessEvent & BinaryStemMeta) | undefined {
    return this.cache.get(stemHex)
  }

  del(stemHex: PrefixedHexString): void {
    this.cache.delete(stemHex)
  }

  commit(): [PrefixedHexString, BinaryStemAccessEvent & BinaryStemMeta][] {
    const items: [PrefixedHexString, BinaryStemAccessEvent & BinaryStemMeta][] = Array.from(
      this.cache.entries(),
    )
    this.clear()
    return items
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Returns the size of the cache
   * @returns Number of cached stems currently stored
   */
  size() {
    return this.cache.size
  }
}
