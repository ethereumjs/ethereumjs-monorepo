[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / CacheOpts

# Interface: CacheOpts

Defined in: [cache/types.ts:6](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/types.ts#L6)

## Properties

### size

> **size**: `number`

Defined in: [cache/types.ts:17](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/types.ts#L17)

Size of the cache (only for LRU cache)

Default: 100000 (account cache) / 20000 (storage cache) / 20000 (code cache)

Note: the cache/trie interplay mechanism is designed in a way that
the theoretical number of max modified accounts between two flush operations
should be smaller than the cache size, otherwise the cache will "forget" the
old modifications resulting in an incomplete set of trie-flushed accounts.

***

### type

> **type**: [`CacheType`](../enumerations/CacheType.md)

Defined in: [cache/types.ts:29](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/types.ts#L29)

Cache type to use.

Available options:

ORDERED_MAP: Cache with no fixed upper bound and dynamic allocation,
use for dynamic setups like testing or similar.

LRU: LRU cache with pre-allocation of memory and a fixed size.
Use for larger and more persistent caches.
