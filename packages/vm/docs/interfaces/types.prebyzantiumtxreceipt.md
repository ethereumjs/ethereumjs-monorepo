[@ethereumjs/vm](../README.md) / [types](../modules/types.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

[types](../modules/types.md).PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Hierarchy

- [*BaseTxReceipt*](types.basetxreceipt.md)

  ↳ **PreByzantiumTxReceipt**

## Table of contents

### Properties

- [bitvector](types.prebyzantiumtxreceipt.md#bitvector)
- [gasUsed](types.prebyzantiumtxreceipt.md#gasused)
- [logs](types.prebyzantiumtxreceipt.md#logs)
- [stateRoot](types.prebyzantiumtxreceipt.md#stateroot)

## Properties

### bitvector

• **bitvector**: *Buffer*

Bloom bitvector

Inherited from: [BaseTxReceipt](types.basetxreceipt.md).[bitvector](types.basetxreceipt.md#bitvector)

Defined in: [types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L16)

___

### gasUsed

• **gasUsed**: *Buffer*

Gas used

Inherited from: [BaseTxReceipt](types.basetxreceipt.md).[gasUsed](types.basetxreceipt.md#gasused)

Defined in: [types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L12)

___

### logs

• **logs**: Log[]

Logs emitted

Inherited from: [BaseTxReceipt](types.basetxreceipt.md).[logs](types.basetxreceipt.md#logs)

Defined in: [types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L20)

___

### stateRoot

• **stateRoot**: *Buffer*

Intermediary state root

Defined in: [types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L31)
