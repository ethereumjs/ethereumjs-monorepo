[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [RunBlockResult](_runblock_.runblockresult.md)

# Interface: RunBlockResult

Result of [runBlock](../classes/_index_.vm.md#runblock)

## Hierarchy

* **RunBlockResult**

  ↳ [AfterBlockEvent](_runblock_.afterblockevent.md)

## Index

### Properties

* [receipts](_runblock_.runblockresult.md#receipts)
* [results](_runblock_.runblockresult.md#results)

## Properties

###  receipts

• **receipts**: *([PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md) | [PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md))[]*

*Defined in [runBlock.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L64)*

Receipts generated for transactions in the block

___

###  results

• **results**: *[RunTxResult](_runtx_.runtxresult.md)[]*

*Defined in [runBlock.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L68)*

Results of executing the transactions in the block
