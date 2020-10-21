[@ethereumjs/vm](../README.md) › ["lib/runBlock"](../modules/_lib_runblock_.md) › [PostByzantiumTxReceipt](_lib_runblock_.postbyzantiumtxreceipt.md)

# Interface: PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

* TxReceipt

  ↳ **PostByzantiumTxReceipt**

## Index

### Properties

* [bitvector](_lib_runblock_.postbyzantiumtxreceipt.md#bitvector)
* [gasUsed](_lib_runblock_.postbyzantiumtxreceipt.md#gasused)
* [logs](_lib_runblock_.postbyzantiumtxreceipt.md#logs)
* [status](_lib_runblock_.postbyzantiumtxreceipt.md#status)

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

###  status

• **status**: *0 | 1*

*Defined in [lib/runBlock.ts:104](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L104)*

Status of transaction, `1` if successful, `0` if an exception occured
