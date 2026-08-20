[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / estimateTxGasDimensions

# Function: estimateTxGasDimensions()

> **estimateTxGasDimensions**(`vm`, `tx`, `opts?`): `Promise`\<[`TxGasDimensionsEstimate`](../interfaces/TxGasDimensionsEstimate.md)\>

Defined in: [vm/src/estimateTxGasDimensions.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/estimateTxGasDimensions.ts#L64)

Estimate regular / floor / first-touch state gas for `tx` against `vm` state.

## Parameters

### vm

[`VM`](../classes/VM.md)

### tx

`TypedTransaction`

### opts?

#### sender?

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

## Returns

`Promise`\<[`TxGasDimensionsEstimate`](../interfaces/TxGasDimensionsEstimate.md)\>

## Remarks

Experimental (Amsterdam): may change on patch releases.
