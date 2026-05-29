[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToUtf8

# Function: bytesToUtf8()

> **bytesToUtf8**(`bytes`): `string`

Defined in: [packages/util/src/bytes.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L533)

## Parameters

### bytes

`Uint8Array`

The input Uint8Array to convert.

## Returns

`string`

The UTF-8 string.

## Notice

Converts a Uint8Array to a UTF-8 string.
Implementation copied from ethereum-cryptography https://github.com/ethereum/js-ethereum-cryptography/blob/31f980b2847545d33268f2510ba38a3836202a44/src/utils.ts#L22-L27

## Throws

If the input is not a Uint8Array.
