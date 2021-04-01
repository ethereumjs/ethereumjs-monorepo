[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [AfterBlockEvent](_runblock_.afterblockevent.md)

# Interface: AfterBlockEvent

## Hierarchy

* [RunBlockResult](_runblock_.runblockresult.md)

  ↳ **AfterBlockEvent**

## Index

### Properties

* [block](_runblock_.afterblockevent.md#block)
* [gasUsed](_runblock_.afterblockevent.md#gasused)
* [logsBloom](_runblock_.afterblockevent.md#logsbloom)
* [receiptRoot](_runblock_.afterblockevent.md#receiptroot)
* [receipts](_runblock_.afterblockevent.md#receipts)
* [results](_runblock_.afterblockevent.md#results)
* [stateRoot](_runblock_.afterblockevent.md#stateroot)

## Properties

###  block

• **block**: *Block*

*Defined in [runBlock.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L132)*

___

###  gasUsed

• **gasUsed**: *BN*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[gasUsed](_runblock_.runblockresult.md#gasused)*

*Defined in [runBlock.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L76)*

The gas used after executing the block

___

###  logsBloom

• **logsBloom**: *Buffer*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[logsBloom](_runblock_.runblockresult.md#logsbloom)*

*Defined in [runBlock.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L80)*

The bloom filter of the LOGs (events) after executing the block

___

###  receiptRoot

• **receiptRoot**: *Buffer*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[receiptRoot](_runblock_.runblockresult.md#receiptroot)*

*Defined in [runBlock.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L84)*

The receipt root after executing the block

___

###  receipts

• **receipts**: *([PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md) | [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md) | [EIP2930Receipt](_runblock_.eip2930receipt.md))[]*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[receipts](_runblock_.runblockresult.md#receipts)*

*Defined in [runBlock.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L64)*

Receipts generated for transactions in the block

___

###  results

• **results**: *[RunTxResult](_runtx_.runtxresult.md)[]*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[results](_runblock_.runblockresult.md#results)*

*Defined in [runBlock.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L68)*

Results of executing the transactions in the block

___

###  stateRoot

• **stateRoot**: *Buffer*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[stateRoot](_runblock_.runblockresult.md#stateroot)*

*Defined in [runBlock.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L72)*

The stateRoot after executing the block
