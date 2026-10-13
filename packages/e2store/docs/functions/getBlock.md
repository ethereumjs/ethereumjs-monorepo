[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / getBlock

# Function: getBlock()

> **getBlock**(`DB`, `number`): `Promise`\<\{ `body`: `Uint8Array`\<`ArrayBufferLike`\>; `header`: `Uint8Array`\<`ArrayBufferLike`\>; \}\>

Defined in: [packages/e2store/src/exportHistory.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/exportHistory.ts#L76)

Fetch RLP-encoded header and body for a block by number.

## Parameters

### DB

`BlockDB`

### number

`bigint`

## Returns

`Promise`\<\{ `body`: `Uint8Array`\<`ArrayBufferLike`\>; `header`: `Uint8Array`\<`ArrayBufferLike`\>; \}\>
