[@ethereumjs/tx](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Classes

* [FakeTransaction](../classes/_index_.faketransaction.md)
* [Transaction](../classes/_index_.transaction.md)

### Interfaces

* [FakeTxData](../interfaces/_index_.faketxdata.md)
* [TransactionOptions](../interfaces/_index_.transactionoptions.md)
* [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md)
* [TxData](../interfaces/_index_.txdata.md)

### Type aliases

* [BufferLike](_index_.md#bufferlike)
* [PrefixedHexString](_index_.md#prefixedhexstring)

## Type aliases

###  BufferLike

Ƭ **BufferLike**: *Buffer | [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md) | [PrefixedHexString](_index_.md#prefixedhexstring) | number*

*Defined in [types.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L18)*

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

___

###  PrefixedHexString

Ƭ **PrefixedHexString**: *string*

*Defined in [types.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L13)*

A hex string prefixed with `0x`.
