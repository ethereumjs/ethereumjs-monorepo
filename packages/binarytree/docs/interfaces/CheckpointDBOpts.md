[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / CheckpointDBOpts

# Interface: CheckpointDBOpts

Defined in: [types.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L34)

## Properties

### cacheSize?

> `optional` **cacheSize**: `number`

Defined in: [types.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L48)

Cache size (default: 0)

***

### db

> **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [types.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L38)

A database instance.

***

### valueEncoding?

> `optional` **valueEncoding**: `ValueEncoding`

Defined in: [types.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L43)

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
