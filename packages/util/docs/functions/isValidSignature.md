[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / isValidSignature

# Function: isValidSignature()

> **isValidSignature**(`v`, `r`, `s`, `homesteadOrLater`, `chainId?`): `boolean`

Defined in: [packages/util/src/signature.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L158)

Validate a ECDSA signature.
NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions

## Parameters

### v

`bigint`

### r

`Uint8Array`

### s

`Uint8Array`

### homesteadOrLater

`boolean` = `true`

Indicates whether this is being used on either the homestead hardfork or a later one

### chainId?

`bigint`

## Returns

`boolean`
