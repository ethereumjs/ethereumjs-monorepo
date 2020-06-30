[@ethereumjs/tx](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [FakeTxData](../interfaces/_types_.faketxdata.md)
* [TransactionOptions](../interfaces/_types_.transactionoptions.md)
* [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md)
* [TxData](../interfaces/_types_.txdata.md)

### Type aliases

* [BufferLike](_types_.md#bufferlike)
* [PrefixedHexString](_types_.md#prefixedhexstring)

## Type aliases

###  BufferLike

Ƭ **BufferLike**: *Buffer | [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md) | [PrefixedHexString](_types_.md#prefixedhexstring) | number*

*Defined in [types.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L18)*

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

___

###  PrefixedHexString

Ƭ **PrefixedHexString**: *string*

*Defined in [types.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L13)*

A hex string prefixed with `0x`.
