[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [TxReceipt](_runblock_.txreceipt.md)

# Interface: TxReceipt

Receipt generated for a transaction

## Hierarchy

* **TxReceipt**

## Index

### Properties

* [bitvector](_runblock_.txreceipt.md#bitvector)
* [gasUsed](_runblock_.txreceipt.md#gasused)
* [logs](_runblock_.txreceipt.md#logs)
* [status](_runblock_.txreceipt.md#status)

## Properties

###  bitvector

• **bitvector**: *Buffer*

*Defined in [runBlock.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L69)*

Bloom bitvector

___

###  gasUsed

• **gasUsed**: *Buffer*

*Defined in [runBlock.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L65)*

Gas used

___

###  logs

• **logs**: *any[]*

*Defined in [runBlock.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L73)*

Logs emitted

___

###  status

• **status**: *0 | 1*

*Defined in [runBlock.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L61)*

Status of transaction, `1` if successful, `0` if an exception occured
