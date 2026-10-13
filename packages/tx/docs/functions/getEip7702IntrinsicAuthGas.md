[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / getEip7702IntrinsicAuthGas

# Function: getEip7702IntrinsicAuthGas()

> **getEip7702IntrinsicAuthGas**(`tx`): `bigint`

Defined in: [util/intrinsic.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/intrinsic.ts#L154)

EIP-8037 / EIP-7702: state-independent per-authorization regular gas.
Pre-8037 this is already folded into `getDataGas()` via `perEmptyAccountCost`.

## Parameters

### tx

[`LegacyTxInterface`](../interfaces/LegacyTxInterface.md)

## Returns

`bigint`
