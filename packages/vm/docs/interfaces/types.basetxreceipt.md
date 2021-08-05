[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / BaseTxReceipt

# Interface: BaseTxReceipt

[types](../modules/types.md).BaseTxReceipt

Abstract interface with common transaction receipt fields

## Hierarchy

- **`BaseTxReceipt`**

  ↳ [`PreByzantiumTxReceipt`](types.PreByzantiumTxReceipt.md)

  ↳ [`PostByzantiumTxReceipt`](types.PostByzantiumTxReceipt.md)

## Table of contents

### Properties

- [bitvector](types.BaseTxReceipt.md#bitvector)
- [gasUsed](types.BaseTxReceipt.md#gasused)
- [logs](types.BaseTxReceipt.md#logs)

## Properties

### bitvector

• **bitvector**: `Buffer`

Bloom bitvector

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L16)

___

### gasUsed

• **gasUsed**: `Buffer`

Cumulative gas used in the block including this tx

#### Defined in

[types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L12)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Defined in

[types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L20)
