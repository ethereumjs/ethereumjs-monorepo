[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / VerkleTreeOpts

# Interface: VerkleTreeOpts

Defined in: [types.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L10)

## Properties

### cacheSize

> **cacheSize**: `number`

Defined in: [types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L35)

LRU cache for tree nodes to allow for faster node retrieval.

Default: 0 (deactivated)

***

### db

> **db**: `DB`\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L18)

A database instance.

***

### root?

> `optional` **root**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L23)

A `Uint8Array` for the root of a previously stored tree

***

### useRootPersistence

> **useRootPersistence**: `boolean`

Defined in: [types.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L28)

Store the root inside the database after every `write` operation

***

### verkleCrypto

> **verkleCrypto**: `VerkleCrypto`

Defined in: [types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L14)

An instantiated Verkle Cryptography interface
