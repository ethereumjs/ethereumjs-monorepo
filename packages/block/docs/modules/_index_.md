[@ethereumjs/block](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Classes

* [Block](../classes/_index_.block.md)
* [BlockHeader](../classes/_index_.blockheader.md)

### Interfaces

* [BlockData](../interfaces/_index_.blockdata.md)
* [BlockHeaderData](../interfaces/_index_.blockheaderdata.md)
* [BlockOptions](../interfaces/_index_.blockoptions.md)
* [Blockchain](../interfaces/_index_.blockchain.md)
* [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md)

### Type aliases

* [BufferLike](_index_.md#bufferlike)
* [PrefixedHexString](_index_.md#prefixedhexstring)

## Type aliases

###  BufferLike

Ƭ **BufferLike**: *Buffer | [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md) | [PrefixedHexString](_index_.md#prefixedhexstring) | number*

*Defined in [types.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L52)*

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

___

###  PrefixedHexString

Ƭ **PrefixedHexString**: *string*

*Defined in [types.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L47)*

A hex string prefixed with `0x`.
