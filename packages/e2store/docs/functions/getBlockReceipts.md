[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / getBlockReceipts

# Function: getBlockReceipts()

> **getBlockReceipts**(`DB`, `blockHash`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/e2store/src/exportHistory.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/exportHistory.ts#L88)

Read RLP-encoded receipts for a block hash from the meta database.

## Parameters

### DB

`BlockDB`

### blockHash

`Uint8Array`

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
