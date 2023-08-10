[@ethereumjs/util](../README.md) / PutBatch

# Interface: PutBatch<TKey, TValue\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `Uint8Array` \| `string` \| `number` = `Uint8Array` |
| `TValue` | extends `Uint8Array` \| `string` \| [`DBObject`](../README.md#dbobject) = `Uint8Array` |

## Table of contents

### Properties

- [key](PutBatch.md#key)
- [opts](PutBatch.md#opts)
- [type](PutBatch.md#type)
- [value](PutBatch.md#value)

## Properties

### key

• **key**: `TKey`

#### Defined in

[packages/util/src/db.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L30)

___

### opts

• `Optional` **opts**: [`EncodingOpts`](../README.md#encodingopts)

#### Defined in

[packages/util/src/db.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L32)

___

### type

• **type**: ``"put"``

#### Defined in

[packages/util/src/db.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L29)

___

### value

• **value**: `TValue`

#### Defined in

[packages/util/src/db.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L31)
