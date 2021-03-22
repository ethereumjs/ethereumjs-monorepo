[ethereumjs-util](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Enumerations

* [TypeOutput](../enums/_types_.typeoutput.md)

### Interfaces

* [TransformableToArray](../interfaces/_types_.transformabletoarray.md)
* [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md)

### Type aliases

* [AddressLike](_types_.md#addresslike)
* [BNLike](_types_.md#bnlike)
* [BufferLike](_types_.md#bufferlike)
* [PrefixedHexString](_types_.md#prefixedhexstring)
* [TypeOutputReturnType](_types_.md#typeoutputreturntype)

### Functions

* [bnToHex](_types_.md#bntohex)
* [bnToRlp](_types_.md#bntorlp)
* [toType](_types_.md#totype)

## Type aliases

###  AddressLike

Ƭ **AddressLike**: *[Address](../classes/_address_.address.md) | Buffer | [PrefixedHexString](_types_.md#prefixedhexstring)*

*Defined in [types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L32)*

A type that represents an Address-like value.
To convert to address, use `new Address(toBuffer(value))`

___

###  BNLike

Ƭ **BNLike**: *BN | [PrefixedHexString](_types_.md#prefixedhexstring) | number | Buffer*

*Defined in [types.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L9)*

___

###  BufferLike

Ƭ **BufferLike**: *Buffer | Uint8Array | number[] | number | BN | [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md) | [PrefixedHexString](_types_.md#prefixedhexstring)*

*Defined in [types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L14)*

___

###  PrefixedHexString

Ƭ **PrefixedHexString**: *string*

*Defined in [types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L26)*

___

###  TypeOutputReturnType

Ƭ **TypeOutputReturnType**: *object*

*Defined in [types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L77)*

#### Type declaration:

* **__computed**: *[PrefixedHexString](_types_.md#prefixedhexstring)*

## Functions

###  bnToHex

▸ **bnToHex**(`value`: BN): *[PrefixedHexString](_types_.md#prefixedhexstring)*

*Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L53)*

Convert BN to 0x-prefixed hex string.

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *[PrefixedHexString](_types_.md#prefixedhexstring)*

___

###  bnToRlp

▸ **bnToRlp**(`value`: BN): *Buffer*

*Defined in [types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L61)*

Convert value from BN to RLP (unpadded buffer)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | BN | value to convert  |

**Returns:** *Buffer*

___

###  toType

▸ **toType**‹**T**›(`input`: [ToBufferInputTypes](_bytes_.md#tobufferinputtypes), `outputType`: T): *TypeOutputReturnType[T]*

*Defined in [types.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L89)*

Convert an input to a specified type

**Type parameters:**

▪ **T**: *[TypeOutput](../enums/_types_.typeoutput.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | [ToBufferInputTypes](_bytes_.md#tobufferinputtypes) | value to convert |
`outputType` | T | type to output  |

**Returns:** *TypeOutputReturnType[T]*
