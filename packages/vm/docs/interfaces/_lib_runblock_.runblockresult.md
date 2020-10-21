[@ethereumjs/vm](../README.md) › ["lib/runBlock"](../modules/_lib_runblock_.md) › [RunBlockResult](_lib_runblock_.runblockresult.md)

# Interface: RunBlockResult

Result of [runBlock](../classes/_lib_index_.vm.md#runblock)

## Hierarchy

* **RunBlockResult**

## Index

### Properties

* [receipts](_lib_runblock_.runblockresult.md#receipts)
* [results](_lib_runblock_.runblockresult.md#results)

## Properties

###  receipts

• **receipts**: *([PreByzantiumTxReceipt](_lib_runblock_.prebyzantiumtxreceipt.md) | [PostByzantiumTxReceipt](_lib_runblock_.postbyzantiumtxreceipt.md))[]*

*Defined in [lib/runBlock.ts:60](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L60)*

Receipts generated for transactions in the block

___

###  results

• **results**: *[RunTxResult](_lib_runtx_.runtxresult.md)[]*

*Defined in [lib/runBlock.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L64)*

Results of executing the transactions in the block
