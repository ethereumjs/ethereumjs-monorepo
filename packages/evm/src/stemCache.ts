import type { PrefixedHexString } from '@ethereumjs/util'
import type { StemAccessEvent, StemMeta } from './verkleAccessWitness.ts'
export class StemCache {
  cache: Map<PrefixedHexString, StemAccessEvent & StemMeta>

  constructor() {
    this.cache = new Map<PrefixedHexString, StemAccessEvent & StemMeta>()
  }

  set(stemKey: PrefixedHexString, accessedStem: StemAccessEvent & StemMeta) {
    this.cache.set(stemKey, accessedStem)
  }

  get(stemHex: PrefixedHexString): (StemAccessEvent & StemMeta) | undefined {
    return this.cache.get(stemHex)
  }

  del(stemHex: PrefixedHexString): void {
    this.cache.delete(stemHex)
  }

  commit(): [PrefixedHexString, StemAccessEvent & StemMeta][] {
    const items: [PrefixedHexString, StemAccessEvent & StemMeta][] = Array.from(
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
   * @returns
   */
  size() {
    return this.cache.size
  }
}
