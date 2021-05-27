[@ethereumjs/vm](../README.md) / [types](../modules/types.md) / BaseTxReceipt

# Interface: BaseTxReceipt

[types](../modules/types.md).BaseTxReceipt

Abstract interface with common transaction receipt fields

## Hierarchy

- **BaseTxReceipt**

  ↳ [*PreByzantiumTxReceipt*](types.prebyzantiumtxreceipt.md)

  ↳ [*PostByzantiumTxReceipt*](types.postbyzantiumtxreceipt.md)

## Table of contents

### Properties

- [bitvector](types.basetxreceipt.md#bitvector)
- [gasUsed](types.basetxreceipt.md#gasused)
- [logs](types.basetxreceipt.md#logs)

## Properties

### bitvector

• **bitvector**: *Buffer*

Bloom bitvector

Defined in: [types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L16)

___

### gasUsed

• **gasUsed**: *Buffer*

Gas used

Defined in: [types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L12)

___

### logs

• **logs**: Log[]

Logs emitted

Defined in: [types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L20)
