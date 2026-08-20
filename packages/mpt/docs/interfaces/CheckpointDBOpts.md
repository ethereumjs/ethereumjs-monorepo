[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / CheckpointDBOpts

# Interface: CheckpointDBOpts

Defined in: [types.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L139)

Options for [CheckpointDB](../classes/CheckpointDB.md).

## Properties

### cacheSize?

> `optional` **cacheSize?**: `number`

Defined in: [types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L153)

Cache size (default: 0)

***

### db

> **db**: [`DB`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/interfaces/DB.md)\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L143)

A database instance.

***

### valueEncoding?

> `optional` **valueEncoding?**: `ValueEncoding`

Defined in: [types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L148)

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
