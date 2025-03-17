[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / PutBatch

# Interface: PutBatch\<TKey, TValue\>

Defined in: [packages/util/src/db.ts:25](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L25)

## Type Parameters

• **TKey** *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

• **TValue** *extends* `Uint8Array` \| `string` \| [`DBObject`](../type-aliases/DBObject.md) = `Uint8Array`

## Properties

### key

> **key**: `TKey`

Defined in: [packages/util/src/db.ts:30](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L30)

***

### opts?

> `optional` **opts**: [`EncodingOpts`](../type-aliases/EncodingOpts.md)

Defined in: [packages/util/src/db.ts:32](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L32)

***

### type

> **type**: `"put"`

Defined in: [packages/util/src/db.ts:29](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L29)

***

### value

> **value**: `TValue`

Defined in: [packages/util/src/db.ts:31](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L31)
