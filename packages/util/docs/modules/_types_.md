[ethereumjs-util](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [TransformableToArray](../interfaces/_types_.transformabletoarray.md)
* [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md)

### Type aliases

* [BNLike](_types_.md#bnlike)
* [BufferLike](_types_.md#bufferlike)
* [PrefixedHexString](_types_.md#prefixedhexstring)

### Functions

* [bnToRlp](_types_.md#bntorlp)

## Type aliases

###  BNLike

Ƭ **BNLike**: *BN | string | number*

*Defined in [types.ts:7](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/types.ts#L7)*

___

###  BufferLike

Ƭ **BufferLike**: *Buffer | Uint8Array | number[] | number | BN | [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md) | [PrefixedHexString](_types_.md#prefixedhexstring)*

*Defined in [types.ts:12](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/types.ts#L12)*

___

###  PrefixedHexString

Ƭ **PrefixedHexString**: *string*

*Defined in [types.ts:24](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/types.ts#L24)*

## Functions

###  bnToRlp

▸ **bnToRlp**(`value`: BN): *Buffer*

*Defined in [types.ts:46](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/types.ts#L46)*

Convert value from BN to RLP (unpadded buffer)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | BN | value to convert  |

**Returns:** *Buffer*
