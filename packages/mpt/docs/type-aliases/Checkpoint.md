[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / Checkpoint

# Type Alias: Checkpoint

> **Checkpoint** = `object`

Defined in: [types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L157)

In-memory diff layer for a trie checkpoint (keys stored as unprefixed hex strings).

## Properties

### keyValueMap

> **keyValueMap**: `Map`\<`string`, `Uint8Array` \| `undefined`\>

Defined in: [types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L160)

***

### root

> **root**: `Uint8Array`

Defined in: [types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L162)

Trie root hash at the time this checkpoint was opened.
