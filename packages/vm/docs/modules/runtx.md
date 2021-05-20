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

▸ **generateTxReceipt**(`tx`: TypedTransaction, `txResult`: [*RunTxResult*](../interfaces/runtx.runtxresult.md), `blockGasUsed`: BN): *Promise*<[*TxReceipt*](types.md#txreceipt)\>

Returns the tx receipt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | TypedTransaction | The transaction |
| `txResult` | [*RunTxResult*](../interfaces/runtx.runtxresult.md) | The tx result |
| `blockGasUsed` | BN | The amount of gas used in the block up until this tx |

**Returns:** *Promise*<[*TxReceipt*](types.md#txreceipt)\>

Defined in: [runTx.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L417)
