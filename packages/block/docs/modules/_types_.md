[@ethereumjs/block](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [BlockData](../interfaces/_types_.blockdata.md)
* [BlockHeaderData](../interfaces/_types_.blockheaderdata.md)
* [BlockOptions](../interfaces/_types_.blockoptions.md)
* [Blockchain](../interfaces/_types_.blockchain.md)
* [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md)

### Type aliases

* [BufferLike](_types_.md#bufferlike)
* [PrefixedHexString](_types_.md#prefixedhexstring)

## Type aliases

###  BufferLike

Ƭ **BufferLike**: *Buffer | [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md) | [PrefixedHexString](_types_.md#prefixedhexstring) | number*

*Defined in [types.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L52)*

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

___

###  PrefixedHexString

Ƭ **PrefixedHexString**: *string*

*Defined in [types.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L47)*

A hex string prefixed with `0x`.
