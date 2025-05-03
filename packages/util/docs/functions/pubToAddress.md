[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / pubToAddress

# Function: pubToAddress()

> **pubToAddress**(`pubKey`, `sanitize`): `Uint8Array`

Defined in: [packages/util/src/account.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L538)

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

## Parameters

### pubKey

`Uint8Array`

The two points of an uncompressed key, unless sanitize is enabled

### sanitize

`boolean` = `false`

Accept public keys in other formats

## Returns

`Uint8Array`
