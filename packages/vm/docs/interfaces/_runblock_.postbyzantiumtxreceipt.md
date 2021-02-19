[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md)

# Interface: PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

* TxReceipt

  ↳ **PostByzantiumTxReceipt**

## Index

### Properties

* [bitvector](_runblock_.postbyzantiumtxreceipt.md#bitvector)
* [gasUsed](_runblock_.postbyzantiumtxreceipt.md#gasused)
* [logs](_runblock_.postbyzantiumtxreceipt.md#logs)
* [status](_runblock_.postbyzantiumtxreceipt.md#status)

## Properties

###  bitvector

• **bitvector**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[bitvector](_runblock_.prebyzantiumtxreceipt.md#bitvector)*

*Defined in [runBlock.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L82)*

Bloom bitvector

___

###  gasUsed

• **gasUsed**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[gasUsed](_runblock_.prebyzantiumtxreceipt.md#gasused)*

*Defined in [runBlock.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L78)*

Gas used

___

###  logs

• **logs**: *Log[]*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[logs](_runblock_.prebyzantiumtxreceipt.md#logs)*

*Defined in [runBlock.ts:86](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L86)*

Logs emitted

___

###  status

• **status**: *0 | 1*

*Defined in [runBlock.ts:108](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L108)*

Status of transaction, `1` if successful, `0` if an exception occured
