[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / getBlockTuple

# Function: getBlockTuple()

> **getBlockTuple**(`chainDB`, `metaDB`, `number`): `Promise`\<\{ `blockHash`: `Uint8Array`\<`ArrayBufferLike`\>; `body`: `Uint8Array`\<`ArrayBufferLike`\>; `header`: `Uint8Array`\<`ArrayBufferLike`\>; `receipts`: `Uint8Array`\<`ArrayBufferLike`\>; `totalDifficulty`: `bigint`; \}\>

Defined in: [packages/e2store/src/exportHistory.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/exportHistory.ts#L85)

## Parameters

### chainDB

`BlockDB`

### metaDB

`BlockDB`

### number

`bigint`

## Returns

`Promise`\<\{ `blockHash`: `Uint8Array`\<`ArrayBufferLike`\>; `body`: `Uint8Array`\<`ArrayBufferLike`\>; `header`: `Uint8Array`\<`ArrayBufferLike`\>; `receipts`: `Uint8Array`\<`ArrayBufferLike`\>; `totalDifficulty`: `bigint`; \}\>
