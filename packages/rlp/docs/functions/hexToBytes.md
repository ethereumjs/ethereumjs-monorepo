[**@ethereumjs/rlp**](../README.md)

***

[@ethereumjs/rlp](../README.md) / hexToBytes

# Function: hexToBytes()

> **hexToBytes**(`hex`): `Uint8Array`

Defined in: [packages/rlp/src/index.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L180)

Convert a hex string (with or without `0x`) into bytes.

## Parameters

### hex

`string`

## Returns

`Uint8Array`

## Example

```ts
hexToBytes('0xcafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
```

## Throws

If the input is not valid hex or has an odd number of nibbles
