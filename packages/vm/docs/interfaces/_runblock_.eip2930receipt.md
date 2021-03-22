[@ethereumjs/vm](../README.md) › ["runBlock"](../modules/_runblock_.md) › [EIP2930Receipt](_runblock_.eip2930receipt.md)

# Interface: EIP2930Receipt

## Hierarchy

  ↳ [PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md)

  ↳ **EIP2930Receipt**

## Index

### Properties

* [bitvector](_runblock_.eip2930receipt.md#bitvector)
* [gasUsed](_runblock_.eip2930receipt.md#gasused)
* [logs](_runblock_.eip2930receipt.md#logs)
* [status](_runblock_.eip2930receipt.md#status)

## Properties

###  bitvector

• **bitvector**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[bitvector](_runblock_.prebyzantiumtxreceipt.md#bitvector)*

*Defined in [runBlock.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L98)*

Bloom bitvector

___

###  gasUsed

• **gasUsed**: *Buffer*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[gasUsed](_runblock_.prebyzantiumtxreceipt.md#gasused)*

*Defined in [runBlock.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L94)*

Gas used

___

###  logs

• **logs**: *Log[]*

*Inherited from [PreByzantiumTxReceipt](_runblock_.prebyzantiumtxreceipt.md).[logs](_runblock_.prebyzantiumtxreceipt.md#logs)*

*Defined in [runBlock.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L102)*

Logs emitted

___

###  status

• **status**: *0 | 1*

*Inherited from [PostByzantiumTxReceipt](_runblock_.postbyzantiumtxreceipt.md).[status](_runblock_.postbyzantiumtxreceipt.md#status)*

*Defined in [runBlock.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L124)*

Status of transaction, `1` if successful, `0` if an exception occured
