[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / runTx

# Module: runTx

## Table of contents

### Interfaces

- [AfterTxEvent](../interfaces/runTx.AfterTxEvent.md)
- [RunTxOpts](../interfaces/runTx.RunTxOpts.md)
- [RunTxResult](../interfaces/runTx.RunTxResult.md)

### Functions

- [generateTxReceipt](runTx.md#generatetxreceipt)

## Functions

### generateTxReceipt

▸ **generateTxReceipt**(`tx`, `txResult`, `cumulativeGasUsed`): `Promise`<[`TxReceipt`](types.md#txreceipt)\>

Returns the tx receipt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TypedTransaction` | The transaction |
| `txResult` | [`RunTxResult`](../interfaces/runTx.RunTxResult.md) | The tx result |
| `cumulativeGasUsed` | `BN` | The gas used in the block including this tx |

#### Returns

`Promise`<[`TxReceipt`](types.md#txreceipt)\>

#### Defined in

[runTx.ts:512](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L512)
