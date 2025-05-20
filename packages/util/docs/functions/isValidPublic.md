[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / isValidPublic

# Function: isValidPublic()

> **isValidPublic**(`publicKey`, `sanitize`): `boolean`

Defined in: [packages/util/src/account.ts:507](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L507)

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

## Parameters

### publicKey

`Uint8Array`

The two points of an uncompressed key, unless sanitize is enabled

### sanitize

`boolean` = `false`

Accept public keys in other formats

## Returns

`boolean`
