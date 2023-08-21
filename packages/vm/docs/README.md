@ethereumjs/vm

# @ethereumjs/vm

## Table of contents

### Enumerations

- [BuildStatus](enums/BuildStatus.md)

### Classes

- [BlockBuilder](classes/BlockBuilder.md)
- [VM](classes/VM.md)

### Interfaces

- [AfterBlockEvent](interfaces/AfterBlockEvent.md)
- [AfterTxEvent](interfaces/AfterTxEvent.md)
- [BaseTxReceipt](interfaces/BaseTxReceipt.md)
- [BuildBlockOpts](interfaces/BuildBlockOpts.md)
- [BuilderOpts](interfaces/BuilderOpts.md)
- [EIP4844BlobTxReceipt](interfaces/EIP4844BlobTxReceipt.md)
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

### Functions

- [encodeReceipt](README.md#encodereceipt)

## Type Aliases

### TxReceipt

Ƭ **TxReceipt**: [`PreByzantiumTxReceipt`](interfaces/PreByzantiumTxReceipt.md) \| [`PostByzantiumTxReceipt`](interfaces/PostByzantiumTxReceipt.md) \| [`EIP4844BlobTxReceipt`](interfaces/EIP4844BlobTxReceipt.md)

#### Defined in

[vm/src/types.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L8)

___

### VMEvents

Ƭ **VMEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterBlock` | (`data`: [`AfterBlockEvent`](interfaces/AfterBlockEvent.md), `resolve?`: (`result?`: `any`) => `void`) => `void` |
| `afterTx` | (`data`: [`AfterTxEvent`](interfaces/AfterTxEvent.md), `resolve?`: (`result?`: `any`) => `void`) => `void` |
| `beforeBlock` | (`data`: `Block`, `resolve?`: (`result?`: `any`) => `void`) => `void` |
| `beforeTx` | (`data`: `TypedTransaction`, `resolve?`: (`result?`: `any`) => `void`) => `void` |

#### Defined in

[vm/src/types.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L67)

## Functions

### encodeReceipt

▸ **encodeReceipt**(`receipt`, `txType`): `Uint8Array`

Returns the encoded tx receipt.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`TxReceipt`](README.md#txreceipt) |
| `txType` | `TransactionType` |

#### Returns

`Uint8Array`

#### Defined in

[vm/src/runBlock.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L468)
