[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / getEip2780RecipientRegularGas

# Function: getEip2780RecipientRegularGas()

> **getEip2780RecipientRegularGas**(`tx`, `sender?`): `bigint`

Defined in: [util/intrinsic.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/intrinsic.ts#L47)

EIP-2780 execution-gas extras that sit in intrinsic (and the calldata floor
base): recipient cold access and `TX_VALUE_COST` for value-bearing txs.
Create txs already pay `txCreationGas` (CREATE_ACCESS) via
getIntrinsicGas; this helper adds `TX_VALUE_COST` when `value > 0`.

Since glamsterdam-devnet v8, `TX_VALUE_COST` includes the EIP-7708 transfer
log — do not add `transferLogCost` separately at the tx level.

Self-transfers (`sender === tx.to`) skip the extras. When `sender` cannot
be resolved, a call is treated as a non-self-transfer (conservative).

## Parameters

### tx

[`LegacyTxInterface`](../interfaces/LegacyTxInterface.md)

### sender?

`Address`

## Returns

`bigint`
