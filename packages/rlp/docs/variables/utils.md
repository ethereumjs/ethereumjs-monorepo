[**@ethereumjs/rlp**](../README.md)

***

[@ethereumjs/rlp](../README.md) / utils

# Variable: utils

> `const` **utils**: `object`

Defined in: [packages/rlp/src/index.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L330)

Low-level helpers shared by the encode/decode implementation.

## Type Declaration

### bytesToHex

> **bytesToHex**: (`uint8a`) => `string`

#### Parameters

##### uint8a

`Uint8Array`

#### Returns

`string`

### concatBytes

> **concatBytes**: (...`arrays`) => `Uint8Array`

Concatenates two Uint8Arrays into one.

#### Parameters

##### arrays

...`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Uint8Array`

### hexToBytes

> **hexToBytes**: (`hex`) => `Uint8Array`

Convert a hex string (with or without `0x`) into bytes.

#### Parameters

##### hex

`string`

#### Returns

`Uint8Array`

#### Example

```ts
hexToBytes('0xcafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
```

#### Throws

If the input is not valid hex or has an odd number of nibbles

### utf8ToBytes

> **utf8ToBytes**: (`utf`) => `Uint8Array`

#### Parameters

##### utf

`string`

#### Returns

`Uint8Array`
