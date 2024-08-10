export enum CacheType {
  LRU = 'lru',
  ORDERED_MAP = 'ordered_map',
}

export interface CacheOpts {
  size: number
  type: CacheType
}

export type CacheSettings = {
  deactivate: boolean
  type: CacheType
  size: number
}

export interface CacheStateManagerOpts {
  /**
   * Allows for cache deactivation
   *
   * Depending on the use case and underlying datastore (and eventual concurrent cache
   * mechanisms there), usage with or without cache can be faster
   *
   * Default: false
   */
  deactivate?: boolean

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
  type?: CacheType

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
  size?: number
}

export interface CachesStateManagerOpts {
  account?: CacheStateManagerOpts
  code?: CacheStateManagerOpts
  storage?: CacheStateManagerOpts
}
