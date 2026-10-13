[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / getHeader

# Function: getHeader()

> **getHeader**(`DB`, `hash`, `number`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/e2store/src/exportHistory.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/exportHistory.ts#L52)

Read an RLP-encoded block header from a LevelDB chain database.

## Parameters

### DB

`BlockDB`

### hash

`Uint8Array`

### number

`bigint`

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
