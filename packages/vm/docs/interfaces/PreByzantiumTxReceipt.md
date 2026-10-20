[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Defined in: [vm/src/types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L46)

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [vm/src/types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L35)

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [vm/src/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L31)

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: `Log`[]

Defined in: [vm/src/types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L39)

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L50)

Intermediary state root
