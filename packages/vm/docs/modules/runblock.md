[@ethereumjs/vm](../README.md) / runBlock

# Module: runBlock

## Table of contents

### References

- [EIP2930Receipt](runblock.md#eip2930receipt)
- [PostByzantiumTxReceipt](runblock.md#postbyzantiumtxreceipt)
- [PreByzantiumTxReceipt](runblock.md#prebyzantiumtxreceipt)

### Interfaces

- [AfterBlockEvent](../interfaces/runblock.afterblockevent.md)
- [RunBlockOpts](../interfaces/runblock.runblockopts.md)
- [RunBlockResult](../interfaces/runblock.runblockresult.md)

### Functions

- [calculateMinerReward](runblock.md#calculateminerreward)
- [encodeReceipt](runblock.md#encodereceipt)
- [generateTxReceipt](runblock.md#generatetxreceipt)
- [rewardAccount](runblock.md#rewardaccount)

## References

### EIP2930Receipt

Re-exports: [EIP2930Receipt](../interfaces/types.eip2930receipt.md)

___

### PostByzantiumTxReceipt

Re-exports: [PostByzantiumTxReceipt](../interfaces/types.postbyzantiumtxreceipt.md)

___

### PreByzantiumTxReceipt

Re-exports: [PreByzantiumTxReceipt](../interfaces/types.prebyzantiumtxreceipt.md)

## Functions

### calculateMinerReward

▸ **calculateMinerReward**(`minerReward`: BN, `ommersNum`: *number*): BN

#### Parameters

| Name | Type |
| :------ | :------ |
| `minerReward` | BN |
| `ommersNum` | *number* |

**Returns:** BN

Defined in: [runBlock.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L330)

___

### encodeReceipt

▸ **encodeReceipt**(`tx`: TypedTransaction, `receipt`: [*TxReceipt*](types.md#txreceipt)): *Buffer*

Returns the encoded tx receipt.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | TypedTransaction |
| `receipt` | [*TxReceipt*](types.md#txreceipt) |

**Returns:** *Buffer*

Defined in: [runBlock.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L352)

___

### generateTxReceipt

▸ **generateTxReceipt**(`tx`: TypedTransaction, `txRes`: [*RunTxResult*](../interfaces/runtx.runtxresult.md), `blockGasUsed`: BN): *Promise*<{ `encodedReceipt`: *Buffer* ; `receiptLog`: *string* ; `txReceipt`: [*PreByzantiumTxReceipt*](../interfaces/types.prebyzantiumtxreceipt.md) \| [*PostByzantiumTxReceipt*](../interfaces/types.postbyzantiumtxreceipt.md)  }\>

Generates the tx receipt and returns { txReceipt, encodedReceipt, receiptLog }

**`deprecated`** Please use the new `generateTxReceipt` located in runTx.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | TypedTransaction |
| `txRes` | [*RunTxResult*](../interfaces/runtx.runtxresult.md) |
| `blockGasUsed` | BN |

**Returns:** *Promise*<{ `encodedReceipt`: *Buffer* ; `receiptLog`: *string* ; `txReceipt`: [*PreByzantiumTxReceipt*](../interfaces/types.prebyzantiumtxreceipt.md) \| [*PostByzantiumTxReceipt*](../interfaces/types.postbyzantiumtxreceipt.md)  }\>

Defined in: [runBlock.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L367)

___

### rewardAccount

▸ **rewardAccount**(`state`: [*StateManager*](../interfaces/state_interface.statemanager.md), `address`: Address, `reward`: BN): *Promise*<Account\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [*StateManager*](../interfaces/state_interface.statemanager.md) |
| `address` | Address |
| `reward` | BN |

**Returns:** *Promise*<Account\>

Defined in: [runBlock.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L338)
