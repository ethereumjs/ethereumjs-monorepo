[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / getCalldataFloorGas

# Function: getCalldataFloorGas()

> **getCalldataFloorGas**(`tx`, `sender?`): `bigint`

Defined in: [util/intrinsic.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/intrinsic.ts#L124)

EIP-7623 calldata floor: `floor_base + totalCostFloorPerToken * tokens`.

Under EIP-2780 the floor base is the decomposed regular intrinsic
(`TX_BASE` + recipient/value), not `txGas` alone. Pass `sender` when it is
already known (e.g. `runTx`) so self-transfers are priced correctly even
if the tx is unsigned.

Returns `0` when EIP-7623 is not active.

## Parameters

### tx

[`LegacyTxInterface`](../interfaces/LegacyTxInterface.md)

### sender?

`Address`

## Returns

`bigint`
