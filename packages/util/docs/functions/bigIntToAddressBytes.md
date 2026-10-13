[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / bigIntToAddressBytes

# Function: bigIntToAddressBytes()

> **bigIntToAddressBytes**(`value`, `strict?`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L365)

Encode a bigint as a 20-byte address.

## Parameters

### value

`bigint`

### strict?

`boolean` = `true`

When true, reject values longer than 20 bytes instead of truncating

## Returns

`Uint8Array`

## Throws

If `strict` is true and the encoded value exceeds 20 bytes
