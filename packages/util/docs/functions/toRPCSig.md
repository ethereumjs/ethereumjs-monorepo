[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / toRPCSig

# Function: toRPCSig()

> **toRPCSig**(`v`, `r`, `s`, `chainId?`): `string`

Defined in: [packages/util/src/signature.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L68)

Convert signature parameters into the format of `eth_sign` RPC method.
NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions

## Parameters

### v

`bigint`

### r

`Uint8Array`

### s

`Uint8Array`

### chainId?

`bigint`

## Returns

`string`

Signature
