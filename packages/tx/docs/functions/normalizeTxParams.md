[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / normalizeTxParams

# Function: normalizeTxParams()

> **normalizeTxParams**(`txParamsFromRPC`): [`TypedTxData`](../type-aliases/TypedTxData.md)

Defined in: [util/general.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/general.ts#L11)

Normalizes values for transactions that are received from an RPC provider to be properly usable within
the ethereumjs context

## Parameters

### txParamsFromRPC

`any`

a transaction in the standard JSON-RPC format

## Returns

[`TypedTxData`](../type-aliases/TypedTxData.md)

a normalized [TypedTxData](../type-aliases/TypedTxData.md) object with valid values
