[ethereumjs-util](../README.md) / bytes

# Module: bytes

## Table of contents

### Type aliases

- [ToBufferInputTypes](bytes.md#tobufferinputtypes)

### Functions

- [addHexPrefix](bytes.md#addhexprefix)
- [baToJSON](bytes.md#batojson)
- [bufferToHex](bytes.md#buffertohex)
- [bufferToInt](bytes.md#buffertoint)
- [fromSigned](bytes.md#fromsigned)
- [setLengthLeft](bytes.md#setlengthleft)
- [setLengthRight](bytes.md#setlengthright)
- [toBuffer](bytes.md#tobuffer)
- [toUnsigned](bytes.md#tounsigned)
- [unpadArray](bytes.md#unpadarray)
- [unpadBuffer](bytes.md#unpadbuffer)
- [unpadHexString](bytes.md#unpadhexstring)
- [zeros](bytes.md#zeros)

## Type aliases

### ToBufferInputTypes

Ƭ **ToBufferInputTypes**: [PrefixedHexString](types.md#prefixedhexstring) \| `number` \| [BN](../classes/externals.bn-1.md) \| `Buffer` \| `Uint8Array` \| `number`[] \| [TransformableToArray](../interfaces/types.transformabletoarray.md) \| [TransformableToBuffer](../interfaces/types.transformabletobuffer.md) \| ``null`` \| `undefined`

#### Defined in

[packages/util/src/bytes.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L108)

## Functions

### addHexPrefix

▸ `Const` **addHexPrefix**(`str`): `string`

Adds "0x" to a given `String` if it does not already start with "0x".

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L205)

___

### baToJSON

▸ `Const` **baToJSON**(`ba`): `any`

Converts a `Buffer` or `Array` to JSON.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ba` | `any` | (Buffer\|Array) |

#### Returns

`any`

(Array|String|null)

#### Defined in

[packages/util/src/bytes.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L218)

___

### bufferToHex

▸ `Const` **bufferToHex**(`buf`): `string`

Converts a `Buffer` into a `0x`-prefixed hex `String`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L181)

___

### bufferToInt

▸ `Const` **bufferToInt**(`buf`): `number`

Converts a `Buffer` to a `Number`.

**`throws`** If the input number exceeds 53 bits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`number`

#### Defined in

[packages/util/src/bytes.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L173)

___

### fromSigned

▸ `Const` **fromSigned**(`num`): [BN](../classes/externals.bn-1.md)

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | `Buffer` | Signed integer value |

#### Returns

[BN](../classes/externals.bn-1.md)

#### Defined in

[packages/util/src/bytes.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L190)

___

### setLengthLeft

▸ `Const` **setLengthLeft**(`msg`, `length`): `Buffer`

Left Pads a `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `msg` | `Buffer` | the value to pad (Buffer) |
| `length` | `number` | the number of bytes the output should be |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L46)

___

### setLengthRight

▸ `Const` **setLengthRight**(`msg`, `length`): `Buffer`

Right Pads a `Buffer` with trailing zeros till it has `length` bytes.
it truncates the end if it exceeds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `msg` | `Buffer` | the value to pad (Buffer) |
| `length` | `number` | the number of bytes the output should be |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L58)

___

### toBuffer

▸ `Const` **toBuffer**(`v`): `Buffer`

Attempts to turn a value into a `Buffer`.
Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BN` and other objects
with a `toArray()` or `toBuffer()` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | [ToBufferInputTypes](bytes.md#tobufferinputtypes) | the value |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L126)

___

### toUnsigned

▸ `Const` **toUnsigned**(`num`): `Buffer`

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | [BN](../classes/externals.bn-1.md) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L198)

___

### unpadArray

▸ `Const` **unpadArray**(`a`): `number`[]

Trims leading zeros from an `Array` (of numbers).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number`[] | (number[]) |

#### Returns

`number`[]

(number[])

#### Defined in

[packages/util/src/bytes.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L92)

___

### unpadBuffer

▸ `Const` **unpadBuffer**(`a`): `Buffer`

Trims leading zeros from a `Buffer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Buffer` | (Buffer) |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L82)

___

### unpadHexString

▸ `Const` **unpadHexString**(`a`): `string`

Trims leading zeros from a hex-prefixed `String`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `string` | (String) |

#### Returns

`string`

(String)

#### Defined in

[packages/util/src/bytes.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L102)

___

### zeros

▸ `Const` **zeros**(`bytes`): `Buffer`

Returns a buffer filled with 0s.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `number` | the number of bytes the buffer should be |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L10)
