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

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [runBlock.ts:97](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runBlock.ts#L97)*

Intermediary state root
