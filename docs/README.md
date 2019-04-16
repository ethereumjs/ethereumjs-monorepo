
#  ethereumjs-tx

## Index

### Classes

* [FakeTransaction](classes/faketransaction.md)
* [Transaction](classes/transaction.md)

### Interfaces

* [FakeTxData](interfaces/faketxdata.md)
* [TransactionOptions](interfaces/transactionoptions.md)
* [TransformableToBuffer](interfaces/transformabletobuffer.md)
* [TxData](interfaces/txdata.md)

### Type aliases

* [BufferLike](#bufferlike)
* [PrefixedHexString](#prefixedhexstring)

---

## Type aliases

<a id="bufferlike"></a>

###  BufferLike

**Ƭ BufferLike**: *`Buffer` \| [TransformableToBuffer](interfaces/transformabletobuffer.md) \| [PrefixedHexString](#prefixedhexstring) \| `number`*

*Defined in [types.ts:19](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L19)*

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

___
<a id="prefixedhexstring"></a>

###  PrefixedHexString

**Ƭ PrefixedHexString**: *`string`*

*Defined in [types.ts:14](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L14)*

A hex string prefixed with `0x`.

___

