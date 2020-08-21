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

*Defined in [runBlock.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L65)*

Bloom bitvector

___

###  gasUsed

• **gasUsed**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[gasUsed](_runblock_.prebyzantiumtxreceipt.md#gasused)*

*Defined in [runBlock.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L61)*

Gas used

___

###  logs

• **logs**: *any[]*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[logs](_runblock_.prebyzantiumtxreceipt.md#logs)*

*Defined in [runBlock.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L69)*

Logs emitted

___

###  status

• **status**: *0 | 1*

*Defined in [runBlock.ts:91](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L91)*

Status of transaction, `1` if successful, `0` if an exception occured
