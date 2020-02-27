[ethereumjs-tx](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

- [FakeTxData](../interfaces/_types_.faketxdata.md)
- [TransactionOptions](../interfaces/_types_.transactionoptions.md)
- [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md)
- [TxData](../interfaces/_types_.txdata.md)

### Type aliases

- [BufferLike](_types_.md#bufferlike)
- [PrefixedHexString](_types_.md#prefixedhexstring)

## Type aliases

### BufferLike

Ƭ **BufferLike**: _Buffer | [TransformableToBuffer](../interfaces/\_index_.transformabletobuffer.md) | [PrefixedHexString](_types_.md#prefixedhexstring) | number\_

_Defined in [types.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L19)_

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

---

### PrefixedHexString

Ƭ **PrefixedHexString**: _string_

_Defined in [types.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L14)_

A hex string prefixed with `0x`.
