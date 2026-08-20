[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / computeIntrinsicGasDimensions8037

# Function: computeIntrinsicGasDimensions8037()

> **computeIntrinsicGasDimensions8037**(`common`, `tx`, `blockGasLimit?`, `_sender?`): `object`

Defined in: [eip8037.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip8037.ts#L53)

EIP-8037 intrinsic-gas decomposition.

Under glamsterdam-devnet v7+, intrinsic gas is entirely **regular**
(EIP-2780 state-independent). New-account and 7702 auth/write state gas
are charged at top-frame access, so this returns
`{ intrinsicRegular: tx.getIntrinsicGas(), intrinsicState: 0n }` whether
EIP-8037 is active or not.

Block inclusion does **not** subtract this split from `tx.gas`. Use
[txExceedsAvailableBlockGas8037](txExceedsAvailableBlockGas8037.md) (`min(TX_MAX, tx.gas)` vs remaining
regular, `tx.gas` vs remaining state). Reservoir sizing in `runTx()` uses
`intrinsicRegular`:

  execution_gas = tx.gas - intrinsic
  gas_left      = min(TX_MAX - intrinsicRegular, execution_gas)
  reservoir     = execution_gas - gas_left

## Parameters

### common

`Common`

### tx

`IntrinsicDimensionsTx`

### blockGasLimit?

`bigint`

Reserved for a future derived `costPerStateByte`; unused under v7.

### \_sender?

#### bytes

`Uint8Array`

## Returns

`object`

### intrinsicRegular

> **intrinsicRegular**: `bigint`

### intrinsicState

> **intrinsicState**: `bigint`

## Remarks

Experimental (Amsterdam): may change on patch releases.
