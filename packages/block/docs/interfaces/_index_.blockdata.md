[@ethereumjs/block](../README.md) › ["index"](../modules/_index_.md) › [BlockData](_index_.blockdata.md)

# Interface: BlockData

A block's data.

## Hierarchy

* **BlockData**

## Index

### Properties

* [header](_index_.blockdata.md#optional-header)
* [transactions](_index_.blockdata.md#optional-transactions)
* [uncleHeaders](_index_.blockdata.md#optional-uncleheaders)

## Properties

### `Optional` header

• **header**? : *Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [BlockHeaderData](_index_.blockheaderdata.md)*

*Defined in [types.ts:83](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L83)*

___

### `Optional` transactions

• **transactions**? : *Array‹Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | TxData›*

*Defined in [types.ts:84](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L84)*

___

### `Optional` uncleHeaders

• **uncleHeaders**? : *Array‹Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [BlockHeaderData](_index_.blockheaderdata.md)›*

*Defined in [types.ts:85](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L85)*
