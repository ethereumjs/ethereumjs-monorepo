[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / short

# Function: short()

> **short**(`bytes`, `maxLength`): `string`

Defined in: [packages/util/src/bytes.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L315)

Shortens a string  or Uint8Array's hex string representation to maxLength (default 50).

Examples:

Input:  '657468657265756d000000000000000000000000000000000000000000000000'
Output: '657468657265756d0000000000000000000000000000000000…'

## Parameters

### bytes

`string` | `Uint8Array`\<`ArrayBufferLike`\>

### maxLength

`number` = `50`

## Returns

`string`
