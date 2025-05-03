[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / CacheOpts

# Interface: CacheOpts

Defined in: [cache/types.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/types.ts#L8)

## Properties

### size

> **size**: `number`

Defined in: [cache/types.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/types.ts#L19)

Size of the cache (only for LRU cache)

Default: 100000 (account cache) / 20000 (storage cache) / 20000 (code cache)

Note: the cache/trie interplay mechanism is designed in a way that
the theoretical number of max modified accounts between two flush operations
should be smaller than the cache size, otherwise the cache will "forget" the
old modifications resulting in an incomplete set of trie-flushed accounts.

***

### type

> **type**: [`CacheType`](../type-aliases/CacheType.md)

Defined in: [cache/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/types.ts#L31)

Cache type to use.

Available options:

ORDERED_MAP: Cache with no fixed upper bound and dynamic allocation,
use for dynamic setups like testing or similar.

LRU: LRU cache with pre-allocation of memory and a fixed size.
Use for larger and more persistent caches.
