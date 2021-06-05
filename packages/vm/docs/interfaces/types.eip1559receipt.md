[@ethereumjs/vm](../README.md) / [types](../modules/types.md) / EIP1559Receipt

# Interface: EIP1559Receipt

[types](../modules/types.md).EIP1559Receipt

## Hierarchy

- [*PostByzantiumTxReceipt*](types.postbyzantiumtxreceipt.md)

  ↳ **EIP1559Receipt**

## Table of contents

### Properties

- [bitvector](types.eip1559receipt.md#bitvector)
- [gasUsed](types.eip1559receipt.md#gasused)
- [logs](types.eip1559receipt.md#logs)
- [status](types.eip1559receipt.md#status)

## Properties

### bitvector

• **bitvector**: *Buffer*

Bloom bitvector

Inherited from: [PostByzantiumTxReceipt](types.postbyzantiumtxreceipt.md).[bitvector](types.postbyzantiumtxreceipt.md#bitvector)

Defined in: [types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L16)

___

### gasUsed

• **gasUsed**: *Buffer*

Gas used

Inherited from: [PostByzantiumTxReceipt](types.postbyzantiumtxreceipt.md).[gasUsed](types.postbyzantiumtxreceipt.md#gasused)

Defined in: [types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L12)

___

### logs

• **logs**: Log[]

Logs emitted

Inherited from: [PostByzantiumTxReceipt](types.postbyzantiumtxreceipt.md).[logs](types.postbyzantiumtxreceipt.md#logs)

Defined in: [types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L20)

___

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occured

Inherited from: [PostByzantiumTxReceipt](types.postbyzantiumtxreceipt.md).[status](types.postbyzantiumtxreceipt.md#status)

Defined in: [types.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L42)
