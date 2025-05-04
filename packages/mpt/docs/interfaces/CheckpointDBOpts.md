[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / CheckpointDBOpts

# Interface: CheckpointDBOpts

Defined in: [packages/mpt/src/types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L127)

## Properties

### cacheSize?

> `optional` **cacheSize**: `number`

Defined in: [packages/mpt/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L141)

Cache size (default: 0)

***

### db

> **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/mpt/src/types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L131)

A database instance.

***

### valueEncoding?

> `optional` **valueEncoding**: `ValueEncoding`

Defined in: [packages/mpt/src/types.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L136)

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
