[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / EIP2930Receipt

# Interface: EIP2930Receipt

[types](../modules/types.md).EIP2930Receipt

EIP2930Receipt, which has the same fields as PostByzantiumTxReceipt

**`deprecated`** Please use PostByzantiumTxReceipt instead

## Hierarchy

- [`PostByzantiumTxReceipt`](types.PostByzantiumTxReceipt.md)

  ↳ **`EIP2930Receipt`**

## Table of contents

### Properties

- [bitvector](types.EIP2930Receipt.md#bitvector)
- [gasUsed](types.EIP2930Receipt.md#gasused)
- [logs](types.EIP2930Receipt.md#logs)
- [status](types.EIP2930Receipt.md#status)

## Properties

### bitvector

• **bitvector**: `Buffer`

Bloom bitvector

#### Inherited from

[PostByzantiumTxReceipt](types.PostByzantiumTxReceipt.md).[bitvector](types.PostByzantiumTxReceipt.md#bitvector)

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L16)

___

### gasUsed

• **gasUsed**: `Buffer`

Cumulative gas used in the block including this tx

#### Inherited from

[PostByzantiumTxReceipt](types.PostByzantiumTxReceipt.md).[gasUsed](types.PostByzantiumTxReceipt.md#gasused)

#### Defined in

[types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L12)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Inherited from

[PostByzantiumTxReceipt](types.PostByzantiumTxReceipt.md).[logs](types.PostByzantiumTxReceipt.md#logs)

#### Defined in

[types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L20)

___

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occured

#### Inherited from

[PostByzantiumTxReceipt](types.PostByzantiumTxReceipt.md).[status](types.PostByzantiumTxReceipt.md#status)

#### Defined in

[types.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L42)
