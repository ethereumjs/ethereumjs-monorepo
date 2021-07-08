[ethereumjs-util](../README.md) / types

# Module: types

## Table of contents

### Enumerations

- [TypeOutput](../enums/types.typeoutput.md)

### Interfaces

- [TransformableToArray](../interfaces/types.transformabletoarray.md)
- [TransformableToBuffer](../interfaces/types.transformabletobuffer.md)

### Type aliases

- [AddressLike](types.md#addresslike)
- [BNLike](types.md#bnlike)
- [BufferLike](types.md#bufferlike)
- [PrefixedHexString](types.md#prefixedhexstring)
- [TypeOutputReturnType](types.md#typeoutputreturntype)

### Functions

- [bnToHex](types.md#bntohex)
- [bnToRlp](types.md#bntorlp)
- [bnToUnpaddedBuffer](types.md#bntounpaddedbuffer)
- [toType](types.md#totype)

## Type aliases

### AddressLike

Ƭ **AddressLike**: [Address](../classes/address.address-1.md) \| `Buffer` \| [PrefixedHexString](types.md#prefixedhexstring)

A type that represents an Address-like value.
To convert to address, use `new Address(toBuffer(value))`

#### Defined in

[packages/util/src/types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L32)

___

### BNLike

Ƭ **BNLike**: [BN](../classes/externals.bn-1.md) \| [PrefixedHexString](types.md#prefixedhexstring) \| `number` \| `Buffer`

#### Defined in

[packages/util/src/types.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L9)

___

### BufferLike

Ƭ **BufferLike**: `Buffer` \| `Uint8Array` \| `number`[] \| `number` \| [BN](../classes/externals.bn-1.md) \| [TransformableToBuffer](../interfaces/types.transformabletobuffer.md) \| [PrefixedHexString](types.md#prefixedhexstring)

#### Defined in

[packages/util/src/types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L14)

___

### PrefixedHexString

Ƭ **PrefixedHexString**: `string`

#### Defined in

[packages/util/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L26)

___

### TypeOutputReturnType

Ƭ **TypeOutputReturnType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `0` | `number` |
| `1` | [BN](../classes/externals.bn-1.md) |
| `2` | `Buffer` |
| `3` | [PrefixedHexString](types.md#prefixedhexstring) |

#### Defined in

[packages/util/src/types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L86)

## Functions

### bnToHex

▸ **bnToHex**(`value`): [PrefixedHexString](types.md#prefixedhexstring)

Convert BN to 0x-prefixed hex string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [BN](../classes/externals.bn-1.md) |

#### Returns

[PrefixedHexString](types.md#prefixedhexstring)

#### Defined in

[packages/util/src/types.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L53)

___

### bnToRlp

▸ **bnToRlp**(`value`): `Buffer`

Deprecated alias for [bnToUnpaddedBuffer](types.md#bntounpaddedbuffer)

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [BN](../classes/externals.bn-1.md) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/types.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L72)

___

### bnToUnpaddedBuffer

▸ **bnToUnpaddedBuffer**(`value`): `Buffer`

Convert value from BN to an unpadded Buffer
(useful for RLP transport)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [BN](../classes/externals.bn-1.md) | value to convert |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/types.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L62)

___

### toType

▸ **toType**<T\>(`input`, `outputType`): [TypeOutputReturnType](types.md#typeoutputreturntype)[`T`]

Convert an input to a specified type

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: [TypeOutput](../enums/types.typeoutput.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [ToBufferInputTypes](bytes.md#tobufferinputtypes) | value to convert |
| `outputType` | `T` | type to output |

#### Returns

[TypeOutputReturnType](types.md#typeoutputreturntype)[`T`]

#### Defined in

[packages/util/src/types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L98)
