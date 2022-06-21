[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

[types](../modules/types.md).PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

- [`BaseTxReceipt`](types.BaseTxReceipt.md)

  ↳ **`PostByzantiumTxReceipt`**

  ↳↳ [`EIP2930Receipt`](types.EIP2930Receipt.md)

  ↳↳ [`EIP1559Receipt`](types.EIP1559Receipt.md)

## Table of contents

### Properties

- [bitvector](types.PostByzantiumTxReceipt.md#bitvector)
- [gasUsed](types.PostByzantiumTxReceipt.md#gasused)
- [logs](types.PostByzantiumTxReceipt.md#logs)
- [status](types.PostByzantiumTxReceipt.md#status)

## Properties

### bitvector

• **bitvector**: `Buffer`

Bloom bitvector

#### Inherited from

[BaseTxReceipt](types.BaseTxReceipt.md).[bitvector](types.BaseTxReceipt.md#bitvector)

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L16)

___

### gasUsed

• **gasUsed**: `Buffer`

Cumulative gas used in the block including this tx

#### Inherited from

[BaseTxReceipt](types.BaseTxReceipt.md).[gasUsed](types.BaseTxReceipt.md#gasused)

#### Defined in

[types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L12)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Inherited from

[BaseTxReceipt](types.BaseTxReceipt.md).[logs](types.BaseTxReceipt.md#logs)

#### Defined in

[types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L20)

___

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occured

#### Defined in

[types.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L42)
