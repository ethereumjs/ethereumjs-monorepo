[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / BatchDBOp

# Type Alias: BatchDBOp\<TKey, TValue\>

> **BatchDBOp**\<`TKey`, `TValue`\> = [`PutBatch`](../interfaces/PutBatch.md)\<`TKey`, `TValue`\> \| [`DelBatch`](../interfaces/DelBatch.md)\<`TKey`\>

Defined in: [packages/util/src/db.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L6)

Batch write or delete operation for a [DB](../interfaces/DB.md).

## Type Parameters

### TKey

`TKey` *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

### TValue

`TValue` *extends* `Uint8Array` \| `string` \| [`DBObject`](DBObject.md) = `Uint8Array`
