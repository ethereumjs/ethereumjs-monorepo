[ethereumjs-block](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Classes

- [Block](../classes/_index_.block.md)
- [BlockHeader](../classes/_index_.blockheader.md)

### Interfaces

- [BlockData](../interfaces/_index_.blockdata.md)
- [BlockHeaderData](../interfaces/_index_.blockheaderdata.md)
- [Blockchain](../interfaces/_index_.blockchain.md)
- [ChainOptions](../interfaces/_index_.chainoptions.md)
- [TransformableToBuffer](../interfaces/_index_.transformabletobuffer.md)

### Type aliases

- [BufferLike](_index_.md#bufferlike)
- [PrefixedHexString](_index_.md#prefixedhexstring)

## Type aliases

### BufferLike

Ƭ **BufferLike**: _Buffer | [TransformableToBuffer](../interfaces/\_index_.transformabletobuffer.md) | [PrefixedHexString](_index_.md#prefixedhexstring) | number\_

_Defined in [types.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L42)_

A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.

---

### PrefixedHexString

Ƭ **PrefixedHexString**: _string_

_Defined in [types.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L37)_

A hex string prefixed with `0x`.
