[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md)

# Interface: PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Hierarchy

* TxReceipt

  ↳ **PreByzantiumTxReceipt**

## Index

### Properties

* [bitvector](_runblock_.prebyzantiumtxreceipt.md#bitvector)
* [gasUsed](_runblock_.prebyzantiumtxreceipt.md#gasused)
* [logs](_runblock_.prebyzantiumtxreceipt.md#logs)
* [stateRoot](_runblock_.prebyzantiumtxreceipt.md#stateroot)

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

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [runBlock.ts:80](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L80)*

Intermediary state root
