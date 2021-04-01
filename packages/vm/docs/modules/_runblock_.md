[@ethereumjs/vm](../README.md) › ["runBlock"](_runblock_.md)

# Module: "runBlock"

## Index

### Interfaces

* [AfterBlockEvent](../interfaces/_runblock_.afterblockevent.md)
* [EIP2930Receipt](../interfaces/_runblock_.eip2930receipt.md)
* [PostByzantiumTxReceipt](../interfaces/_runblock_.postbyzantiumtxreceipt.md)
* [PreByzantiumTxReceipt](../interfaces/_runblock_.prebyzantiumtxreceipt.md)
* [RunBlockOpts](../interfaces/_runblock_.runblockopts.md)
* [RunBlockResult](../interfaces/_runblock_.runblockresult.md)

### Functions

* [calculateMinerReward](_runblock_.md#calculateminerreward)
* [generateTxReceipt](_runblock_.md#generatetxreceipt)
* [rewardAccount](_runblock_.md#rewardaccount)

## Functions

###  calculateMinerReward

▸ **calculateMinerReward**(`minerReward`: BN, `ommersNum`: number): *BN*

*Defined in [runBlock.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L403)*

**Parameters:**

Name | Type |
------ | ------ |
`minerReward` | BN |
`ommersNum` | number |

**Returns:** *BN*

___

###  generateTxReceipt

▸ **generateTxReceipt**(`this`: [VM](../classes/_index_.vm.md), `tx`: TypedTransaction, `txRes`: [RunTxResult](../interfaces/_runtx_.runtxresult.md), `blockGasUsed`: BN): *Promise‹object›*

*Defined in [runBlock.ts:425](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L425)*

Generates the tx receipt and returns { txReceipt, encodedReceipt, receiptLog }

**Parameters:**

Name | Type |
------ | ------ |
`this` | [VM](../classes/_index_.vm.md) |
`tx` | TypedTransaction |
`txRes` | [RunTxResult](../interfaces/_runtx_.runtxresult.md) |
`blockGasUsed` | BN |

**Returns:** *Promise‹object›*

___

###  rewardAccount

▸ **rewardAccount**(`state`: [StateManager](../interfaces/_state_index_.statemanager.md), `address`: Address, `reward`: BN): *Promise‹Account›*

*Defined in [runBlock.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L411)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [StateManager](../interfaces/_state_index_.statemanager.md) |
`address` | Address |
`reward` | BN |

**Returns:** *Promise‹Account›*
