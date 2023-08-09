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

• **bitvector**: `Uint8Array`

Bloom bitvector

#### Defined in

[vm/src/types.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L21)

___

### cumulativeBlockGasUsed

• **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Defined in

[vm/src/types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L17)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Defined in

[vm/src/types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L25)
