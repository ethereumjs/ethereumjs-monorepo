[@ethereumjs/vm](../README.md) / [types](../modules/types.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

[types](../modules/types.md).PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

- [*BaseTxReceipt*](types.basetxreceipt.md)

  ↳ **PostByzantiumTxReceipt**

  ↳↳ [*EIP2930Receipt*](types.eip2930receipt.md)

  ↳↳ [*EIP1559Receipt*](types.eip1559receipt.md)

## Table of contents

### Properties

- [bitvector](types.postbyzantiumtxreceipt.md#bitvector)
- [gasUsed](types.postbyzantiumtxreceipt.md#gasused)
- [logs](types.postbyzantiumtxreceipt.md#logs)
- [status](types.postbyzantiumtxreceipt.md#status)

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

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occured

Defined in: [types.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/types.ts#L42)
