[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / TrieShallowCopyOpts

# Interface: TrieShallowCopyOpts

Defined in: [types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L131)

Overrides applied when shallow-copying a trie.

## Properties

### cacheSize?

> `optional` **cacheSize?**: `number`

Defined in: [types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L135)

LRU cache size for the copy; defaults to `0` (disabled).

***

### keyPrefix?

> `optional` **keyPrefix?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L133)

Optional key prefix for the copied trie's DB keys.
