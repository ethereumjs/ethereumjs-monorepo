[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / computeIntrinsicGasDimensions8037

# Function: computeIntrinsicGasDimensions8037()

> **computeIntrinsicGasDimensions8037**(`common`, `tx`, `blockGasLimit?`): `object`

Defined in: [eip8037.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip8037.ts#L49)

EIP-8037 intrinsic-gas decomposition.

Returns `{ intrinsicRegular, intrinsicState }` such that
`intrinsicRegular + intrinsicState` equals the tx's total intrinsic
charge under EIP-8037. Callers may then use the split for the per-tx
block-gas pre-execution checks:

  regular check: min(TX_MAX, tx.gas - intrinsicState) > regular_available  → reject
  state check:   (tx.gas - intrinsicRegular)         > state_available     → reject

and for sizing the EIP-8037 state-gas reservoir.

When EIP-8037 is not active, returns `{ intrinsicRegular: tx.getIntrinsicGas(),
intrinsicState: 0n }` so callers can use a single code path.

## Parameters

### common

`Common`

### tx

`IntrinsicDimensionsTx`

### blockGasLimit?

`bigint`

## Returns

`object`

### intrinsicRegular

> **intrinsicRegular**: `bigint`

### intrinsicState

> **intrinsicState**: `bigint`

## Remarks

Experimental (Amsterdam): may change on patch releases.
