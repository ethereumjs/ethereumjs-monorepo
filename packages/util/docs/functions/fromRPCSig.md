[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / fromRPCSig

# Function: fromRPCSig()

> **fromRPCSig**(`sig`): [`ECDSASignature`](../interfaces/ECDSASignature.md)

Defined in: [packages/util/src/signature.ts:144](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L144)

Convert signature format of the `eth_sign` RPC method to signature parameters

NOTE: For an extracted `v` value < 27 (see Geth bug https://github.com/ethereum/go-ethereum/issues/2053)
`v + 27` is returned for the `v` value
NOTE: After EIP1559, `v` could be `0` or `1` but this function assumes
it's a signed message (EIP-191 or EIP-712) adding `27` at the end. Remove if needed.

## Parameters

### sig

`` `0x${string}` ``

## Returns

[`ECDSASignature`](../interfaces/ECDSASignature.md)
