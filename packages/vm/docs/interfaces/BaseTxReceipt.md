[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: [vm/src/types.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L24)

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [vm/src/types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L32)

Bloom bitvector

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [vm/src/types.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L28)

Cumulative gas used in the block including this tx

***

### logs

> **logs**: `Log`[]

Defined in: [vm/src/types.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L36)

Logs emitted
