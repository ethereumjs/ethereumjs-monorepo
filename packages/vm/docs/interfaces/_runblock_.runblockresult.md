[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [RunBlockResult](_runblock_.runblockresult.md)

# Interface: RunBlockResult

Result of [runBlock](../classes/_index_.vm.md#runblock)

## Hierarchy

* **RunBlockResult**

  ↳ [AfterBlockEvent](_runblock_.afterblockevent.md)

## Index

### Properties

* [gasUsed](_runblock_.runblockresult.md#gasused)
* [logsBloom](_runblock_.runblockresult.md#logsbloom)
* [receiptRoot](_runblock_.runblockresult.md#receiptroot)
* [receipts](_runblock_.runblockresult.md#receipts)
* [results](_runblock_.runblockresult.md#results)
* [stateRoot](_runblock_.runblockresult.md#stateroot)

## Properties

###  gasUsed

• **gasUsed**: *BN*

*Defined in [runBlock.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L76)*

The gas used after executing the block

___

###  logsBloom

• **logsBloom**: *Buffer*

*Defined in [runBlock.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L80)*

The bloom filter of the LOGs (events) after executing the block

___

###  receiptRoot

• **receiptRoot**: *Buffer*

*Defined in [runBlock.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L84)*

The receipt root after executing the block

___

###  receipts

• **receipts**: *([PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md) | [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md) | [EIP2930Receipt](_runblock_.eip2930receipt.md))[]*

*Defined in [runBlock.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L64)*

Receipts generated for transactions in the block

___

###  results

• **results**: *[RunTxResult](_runtx_.runtxresult.md)[]*

*Defined in [runBlock.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L68)*

Results of executing the transactions in the block

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [runBlock.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L72)*

The stateRoot after executing the block
