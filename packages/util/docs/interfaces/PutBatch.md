[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / PutBatch

# Interface: PutBatch\<TKey, TValue\>

Defined in: [packages/util/src/db.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L37)

Batch entry that inserts or updates a key.

## Type Parameters

### TKey

`TKey` *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

### TValue

`TValue` *extends* `Uint8Array` \| `string` \| [`DBObject`](../type-aliases/DBObject.md) = `Uint8Array`

## Properties

### key

> **key**: `TKey`

Defined in: [packages/util/src/db.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L42)

***

### opts?

> `optional` **opts?**: [`EncodingOpts`](../type-aliases/EncodingOpts.md)

Defined in: [packages/util/src/db.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L44)

***

### type

> **type**: `"put"`

Defined in: [packages/util/src/db.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L41)

***

### value

> **value**: `TValue`

Defined in: [packages/util/src/db.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L43)
