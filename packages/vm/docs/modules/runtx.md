[@ethereumjs/vm](../README.md) / runTx

# Module: runTx

## Table of contents

### Interfaces

- [AfterTxEvent](../interfaces/runtx.aftertxevent.md)
- [RunTxOpts](../interfaces/runtx.runtxopts.md)
- [RunTxResult](../interfaces/runtx.runtxresult.md)

### Functions

- [generateTxReceipt](runtx.md#generatetxreceipt)

## Functions

### generateTxReceipt

▸ **generateTxReceipt**(`tx`, `txResult`, `cumulativeGasUsed`): `Promise`<[TxReceipt](types.md#txreceipt)\>

Returns the tx receipt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TypedTransaction` | The transaction |
| `txResult` | [RunTxResult](../interfaces/runtx.runtxresult.md) | The tx result |
| `cumulativeGasUsed` | `BN` | The gas used in the block including this tx |

#### Returns

`Promise`<[TxReceipt](types.md#txreceipt)\>

#### Defined in

[runTx.ts:512](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L512)
