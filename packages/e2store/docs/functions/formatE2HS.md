[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / formatE2HS

# Function: formatE2HS()

> **formatE2HS**(`data`, `epoch`): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [packages/e2store/src/e2hs/e2hs.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/e2hs/e2hs.ts#L18)

Format an e2hs file from block tuples and an epoch index.

## Parameters

### data

`object`[]

Block tuples (header with proof, body, receipts)

### epoch

`number`

Epoch number written into the block index

## Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>
