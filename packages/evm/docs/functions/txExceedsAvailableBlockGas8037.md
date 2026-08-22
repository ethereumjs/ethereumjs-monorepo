[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / txExceedsAvailableBlockGas8037

# Function: txExceedsAvailableBlockGas8037()

> **txExceedsAvailableBlockGas8037**(`txGasLimit`, `txMaxGasLimit`, `blockGasLimit`, `blockRegularGasUsed`, `blockStateGasUsed`): `boolean`

Defined in: [eip8037.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip8037.ts#L82)

EIP-8037 per-tx block inclusion check (v7+).

Rejects when `min(TX_MAX, tx.gas) > regular_available` or
`tx.gas > state_available`, where
`*_available = block.gas_limit - block_*_gas_used`.

`TX_MAX` caps only the regular bound; the state check uses uncapped `tx.gas`.

## Parameters

### txGasLimit

`bigint`

### txMaxGasLimit

`bigint`

### blockGasLimit

`bigint`

### blockRegularGasUsed

`bigint`

### blockStateGasUsed

`bigint`

## Returns

`boolean`

`true` when either dimension would exceed the block's remaining gas.

## Remarks

Experimental (Amsterdam): may change on patch releases.
