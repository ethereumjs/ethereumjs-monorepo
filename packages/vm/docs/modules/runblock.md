[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / runBlock

# Module: runBlock

## Table of contents

### References

- [EIP2930Receipt](runBlock.md#eip2930receipt)
- [PostByzantiumTxReceipt](runBlock.md#postbyzantiumtxreceipt)
- [PreByzantiumTxReceipt](runBlock.md#prebyzantiumtxreceipt)

### Interfaces

- [AfterBlockEvent](../interfaces/runBlock.AfterBlockEvent.md)
- [RunBlockOpts](../interfaces/runBlock.RunBlockOpts.md)
- [RunBlockResult](../interfaces/runBlock.RunBlockResult.md)

### Functions

- [calculateMinerReward](runBlock.md#calculateminerreward)
- [encodeReceipt](runBlock.md#encodereceipt)
- [generateTxReceipt](runBlock.md#generatetxreceipt)
- [rewardAccount](runBlock.md#rewardaccount)

## References

### EIP2930Receipt

Re-exports: [EIP2930Receipt](../interfaces/types.EIP2930Receipt.md)

___

### PostByzantiumTxReceipt

Re-exports: [PostByzantiumTxReceipt](../interfaces/types.PostByzantiumTxReceipt.md)

___

### PreByzantiumTxReceipt

Re-exports: [PreByzantiumTxReceipt](../interfaces/types.PreByzantiumTxReceipt.md)

## Functions

### calculateMinerReward

▸ **calculateMinerReward**(`minerReward`, `ommersNum`): `BN`

#### Parameters

| Name | Type |
| :------ | :------ |
| `minerReward` | `BN` |
| `ommersNum` | `number` |

#### Returns

`BN`

#### Defined in

[runBlock.ts:410](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L410)

___

### encodeReceipt

▸ **encodeReceipt**(`tx`, `receipt`): `Buffer`

Returns the encoded tx receipt.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TypedTransaction` |
| `receipt` | [`TxReceipt`](types.md#txreceipt) |

#### Returns

`Buffer`

#### Defined in

[runBlock.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L432)

___

### generateTxReceipt

▸ **generateTxReceipt**(`tx`, `txRes`, `blockGasUsed`): `Promise`<`Object`\>

Generates the tx receipt and returns { txReceipt, encodedReceipt, receiptLog }

**`deprecated`** Please use the new `generateTxReceipt` located in runTx.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TypedTransaction` |
| `txRes` | [`RunTxResult`](../interfaces/runTx.RunTxResult.md) |
| `blockGasUsed` | `BN` |

#### Returns

`Promise`<`Object`\>

#### Defined in

[runBlock.ts:447](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L447)

___

### rewardAccount

▸ **rewardAccount**(`state`, `address`, `reward`): `Promise`<`Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`StateManager`](../interfaces/state_interface.StateManager.md) |
| `address` | `Address` |
| `reward` | `BN` |

#### Returns

`Promise`<`Account`\>

#### Defined in

[runBlock.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L418)
