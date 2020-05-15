[ethereumjs-block](../README.md) › ["types"](../modules/_types_.md) › [BlockData](_types_.blockdata.md)

# Interface: BlockData

A block's data.

## Hierarchy

* **BlockData**

## Index

### Properties

* [header](_types_.blockdata.md#optional-header)
* [transactions](_types_.blockdata.md#optional-transactions)
* [uncleHeaders](_types_.blockdata.md#optional-uncleheaders)

## Properties

### `Optional` header

• **header**? : *Buffer | [PrefixedHexString](../modules/_types_.md#prefixedhexstring) | [BufferLike](../modules/_types_.md#bufferlike)[] | [BlockHeaderData](_index_.blockheaderdata.md)*

*Defined in [types.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L69)*

___

### `Optional` transactions

• **transactions**? : *Array‹Buffer | [PrefixedHexString](../modules/_types_.md#prefixedhexstring) | [BufferLike](../modules/_types_.md#bufferlike)[] | TxData›*

*Defined in [types.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L70)*

___

### `Optional` uncleHeaders

• **uncleHeaders**? : *Array‹Buffer | [PrefixedHexString](../modules/_types_.md#prefixedhexstring) | [BufferLike](../modules/_types_.md#bufferlike)[] | [BlockHeaderData](_index_.blockheaderdata.md)›*

*Defined in [types.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L71)*
