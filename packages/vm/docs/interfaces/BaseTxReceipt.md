[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: [vm/src/types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L27)

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [vm/src/types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L35)

Bloom bitvector

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [vm/src/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L31)

Cumulative gas used in the block including this tx

***

### logs

> **logs**: `Log`[]

Defined in: [vm/src/types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L39)

Logs emitted
