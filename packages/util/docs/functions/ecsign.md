[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / ecsign

# Function: ecsign()

> **ecsign**(`msgHash`, `privateKey`, `chainId`?): [`ECDSASignature`](../interfaces/ECDSASignature.md)

Defined in: [packages/util/src/signature.ts:37](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L37)

Returns the ECDSA signature of a message hash.

If `chainId` is provided assume an EIP-155-style signature and calculate the `v` value
accordingly, otherwise return a "static" `v` just derived from the `recovery` bit

## Parameters

### msgHash

`Uint8Array`

### privateKey

`Uint8Array`

### chainId?

`bigint`

## Returns

[`ECDSASignature`](../interfaces/ECDSASignature.md)
