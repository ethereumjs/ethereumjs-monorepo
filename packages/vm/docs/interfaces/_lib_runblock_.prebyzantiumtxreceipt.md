[@ethereumjs/vm](../README.md) › ["lib/runBlock"](../modules/_lib_runblock_.md) › [PreByzantiumTxReceipt](_lib_runblock_.prebyzantiumtxreceipt.md)

# Interface: PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Hierarchy

* TxReceipt

  ↳ **PreByzantiumTxReceipt**

## Index

### Properties

* [bitvector](_lib_runblock_.prebyzantiumtxreceipt.md#bitvector)
* [gasUsed](_lib_runblock_.prebyzantiumtxreceipt.md#gasused)
* [logs](_lib_runblock_.prebyzantiumtxreceipt.md#logs)
* [stateRoot](_lib_runblock_.prebyzantiumtxreceipt.md#stateroot)

## Properties

###  bitvector

• **bitvector**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_lib_runblock_.prebyzantiumtxreceipt.md).[bitvector](_lib_runblock_.prebyzantiumtxreceipt.md#bitvector)*

*Defined in [lib/runBlock.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L78)*

Bloom bitvector

___

###  gasUsed

• **gasUsed**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_lib_runblock_.prebyzantiumtxreceipt.md).[gasUsed](_lib_runblock_.prebyzantiumtxreceipt.md#gasused)*

*Defined in [lib/runBlock.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L74)*

Gas used

___

###  logs

• **logs**: *any[]*

*Inherited from [PreByzantiumTxReceipt](_lib_runblock_.prebyzantiumtxreceipt.md).[logs](_lib_runblock_.prebyzantiumtxreceipt.md#logs)*

*Defined in [lib/runBlock.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L82)*

Logs emitted

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [lib/runBlock.ts:93](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L93)*

Intermediary state root
