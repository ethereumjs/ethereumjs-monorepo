[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [AfterBlockEvent](_runblock_.afterblockevent.md)

# Interface: AfterBlockEvent

## Hierarchy

* [RunBlockResult](_runblock_.runblockresult.md)

  ↳ **AfterBlockEvent**

## Index

### Properties

* [block](_runblock_.afterblockevent.md#block)
* [receipts](_runblock_.afterblockevent.md#receipts)
* [results](_runblock_.afterblockevent.md#results)

## Properties

###  block

• **block**: *Block*

*Defined in [runBlock.ts:113](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L113)*

___

###  receipts

• **receipts**: *([PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md) | [PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md))[]*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[receipts](_runblock_.runblockresult.md#receipts)*

*Defined in [runBlock.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L64)*

Receipts generated for transactions in the block

___

###  results

• **results**: *[RunTxResult](_runtx_.runtxresult.md)[]*

*Inherited from [RunBlockResult](_runblock_.runblockresult.md).[results](_runblock_.runblockresult.md#results)*

*Defined in [runBlock.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L68)*

Results of executing the transactions in the block
