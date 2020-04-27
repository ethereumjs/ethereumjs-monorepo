[ethereumjs-tx](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Classes

- [FakeTransaction](../classes/_index_.faketransaction.md)
- [Transaction](../classes/_index_.transaction.md)

### Interfaces

- [FakeTxData](../interfaces/_index_.faketxdata.md)
- [TransactionOptions](../interfaces/_index_.transactionoptions.md)
- [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md)
- [TxData](../interfaces/_index_.txdata.md)

### Type aliases

- [BufferLike](_index_.md#bufferlike)
- [PrefixedHexString](_index_.md#prefixedhexstring)

## Type aliases

### BufferLike

Ƭ **BufferLike**: _Buffer | [TransformableToBuffer](../interfaces/\_index_.transformabletobuffer.md) | [PrefixedHexString](_index_.md#prefixedhexstring) | number\_

_Defined in [types.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L19)_

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

---

### PrefixedHexString

Ƭ **PrefixedHexString**: _string_

_Defined in [types.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L14)_

A hex string prefixed with `0x`.
