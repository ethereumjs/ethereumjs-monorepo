[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / PutBatch

# Interface: PutBatch\<TKey, TValue\>

Defined in: [packages/util/src/db.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L29)

## Type Parameters

### TKey

`TKey` *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

### TValue

`TValue` *extends* `Uint8Array` \| `string` \| [`DBObject`](../type-aliases/DBObject.md) = `Uint8Array`

## Properties

### key

> **key**: `TKey`

Defined in: [packages/util/src/db.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L34)

***

### opts?

> `optional` **opts**: [`EncodingOpts`](../type-aliases/EncodingOpts.md)

Defined in: [packages/util/src/db.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L36)

***

### type

> **type**: `"put"`

Defined in: [packages/util/src/db.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L33)

***

### value

> **value**: `TValue`

Defined in: [packages/util/src/db.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L35)
