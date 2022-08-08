[@ethereumjs/vm](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Abstract interface with common transaction receipt fields

## Hierarchy

- **`BaseTxReceipt`**

  ↳ [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)

  ↳ [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Table of contents

### Properties

- [bitvector](BaseTxReceipt.md#bitvector)
- [cumulativeBlockGasUsed](BaseTxReceipt.md#cumulativeblockgasused)
- [logs](BaseTxReceipt.md#logs)

## Properties

### bitvector

• **bitvector**: `Buffer`

Bloom bitvector

#### Defined in

[packages/vm/src/types.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L22)

___

### cumulativeBlockGasUsed

• **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Defined in

[packages/vm/src/types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L18)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Defined in

[packages/vm/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L26)
