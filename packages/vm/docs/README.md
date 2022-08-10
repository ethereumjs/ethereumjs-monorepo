@ethereumjs/vm

# @ethereumjs/vm

## Table of contents

### Classes

- [EEI](classes/EEI.md)
- [VM](classes/VM.md)

### Interfaces

- [AfterBlockEvent](interfaces/AfterBlockEvent.md)
- [AfterTxEvent](interfaces/AfterTxEvent.md)
- [BaseTxReceipt](interfaces/BaseTxReceipt.md)
- [BuildBlockOpts](interfaces/BuildBlockOpts.md)
- [BuilderOpts](interfaces/BuilderOpts.md)
- [PostByzantiumTxReceipt](interfaces/PostByzantiumTxReceipt.md)
- [PreByzantiumTxReceipt](interfaces/PreByzantiumTxReceipt.md)
- [RunBlockOpts](interfaces/RunBlockOpts.md)
- [RunBlockResult](interfaces/RunBlockResult.md)
- [RunTxOpts](interfaces/RunTxOpts.md)
- [RunTxResult](interfaces/RunTxResult.md)
- [SealBlockOpts](interfaces/SealBlockOpts.md)
- [VMOpts](interfaces/VMOpts.md)

### Type Aliases

- [TxReceipt](README.md#txreceipt)
- [VMEvents](README.md#vmevents)

## Type Aliases

### TxReceipt

Ƭ **TxReceipt**: [`PreByzantiumTxReceipt`](interfaces/PreByzantiumTxReceipt.md) \| [`PostByzantiumTxReceipt`](interfaces/PostByzantiumTxReceipt.md)

#### Defined in

[packages/vm/src/types.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L9)

___

### VMEvents

Ƭ **VMEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterBlock` | (`data`: [`AfterBlockEvent`](interfaces/AfterBlockEvent.md), `resolve?`: (`result`: `any`) => `void`) => `void` |
| `afterTx` | (`data`: [`AfterTxEvent`](interfaces/AfterTxEvent.md), `resolve?`: (`result`: `any`) => `void`) => `void` |
| `beforeBlock` | (`data`: `Block`, `resolve?`: (`result`: `any`) => `void`) => `void` |
| `beforeTx` | (`data`: `TypedTransaction`, `resolve?`: (`result`: `any`) => `void`) => `void` |

#### Defined in

[packages/vm/src/types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L51)
