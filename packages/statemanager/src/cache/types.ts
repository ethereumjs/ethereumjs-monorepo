/** Cache backend kind for account/code/storage caches. */
export type CacheType = (typeof CacheType)[keyof typeof CacheType]

/** Supported cache implementations. */
export const CacheType = {
  LRU: 'lru',
  ORDERED_MAP: 'ordered_map',
} as const

/** Per-cache sizing and implementation options. */
export interface CacheOpts {
  /**
   * Size of the cache (only for LRU cache)
   *
   * Default: 100000 (account cache) / 20000 (storage cache) / 20000 (code cache)
   *
   * Note: the cache/trie interplay mechanism is designed in a way that
   * the theoretical number of max modified accounts between two flush operations
   * should be smaller than the cache size, otherwise the cache will "forget" the
   * old modifications resulting in an incomplete set of trie-flushed accounts.
   */
  size: number
  /**
   * Cache type to use.
   *
   * Available options:
   *
   * ORDERED_MAP: Cache with no fixed upper bound and dynamic allocation,
   * use for dynamic setups like testing or similar.
   *
   * LRU: LRU cache with pre-allocation of memory and a fixed size.
   * Use for larger and more persistent caches.
   */
  type: CacheType
}

/** Cache configuration passed into {@link Caches} / state manager constructors. */
export interface CachesStateManagerOpts {
  /** Account cache options. */
  account?: Partial<CacheOpts>
  /** Contract code cache options. */
  code?: Partial<CacheOpts>
  /** Storage slot cache options. */
  storage?: Partial<CacheOpts>
}
