[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / CheckpointDBOpts

# Interface: CheckpointDBOpts

Defined in: [types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L35)

## Properties

### cacheSize?

> `optional` **cacheSize?**: `number`

Defined in: [types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L49)

Cache size (default: 0)

***

### db

> **db**: [`DB`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/interfaces/DB.md)\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L39)

A database instance.

***

### valueEncoding?

> `optional` **valueEncoding?**: `ValueEncoding`

Defined in: [types.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L44)

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
