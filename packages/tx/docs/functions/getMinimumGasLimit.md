[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / getMinimumGasLimit

# Function: getMinimumGasLimit()

> **getMinimumGasLimit**(`tx`, `sender?`): `bigint`

Defined in: [util/intrinsic.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/intrinsic.ts#L142)

Minimum `gasLimit` for the tx to pass [TransactionInterface.isValid](../interfaces/TransactionInterface.md#isvalid):
`max(getIntrinsicGas(), getCalldataFloorGas())` when EIP-7623 is active,
otherwise intrinsic gas alone.

Does not include EIP-8037 first-touch state gas (that depends on pre-state;
see `estimateTxGasDimensions()` on `@ethereumjs/vm`).

## Parameters

### tx

[`LegacyTxInterface`](../interfaces/LegacyTxInterface.md)

### sender?

`Address`

## Returns

`bigint`
