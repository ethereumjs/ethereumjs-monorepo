[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / ecrecover

# Function: ecrecover()

> **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId`?): `Uint8Array`

Defined in: [packages/util/src/signature.ts:73](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L73)

ECDSA public key recovery from signature.
NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions

## Parameters

### msgHash

`Uint8Array`

### v

`bigint`

### r

`Uint8Array`

### s

`Uint8Array`

### chainId?

`bigint`

## Returns

`Uint8Array`

Recovered public key
