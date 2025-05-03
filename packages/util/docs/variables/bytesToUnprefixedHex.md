[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bytesToUnprefixedHex

# Variable: ~~bytesToUnprefixedHex()~~

> `const` **bytesToUnprefixedHex**: (`bytes`) => `string` = `_bytesToUnprefixedHex`

Defined in: [packages/util/src/bytes.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L19)

Convert byte array to hex string.

## Parameters

### bytes

`Uint8Array`

## Returns

`string`

## Example

```ts
bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
```

## Deprecated
