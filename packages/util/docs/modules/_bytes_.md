[ethereumjs-util](../README.md) › ["bytes"](_bytes_.md)

# Module: "bytes"

## Index

### Type aliases

* [ToBufferInputTypes](_bytes_.md#tobufferinputtypes)

### Functions

* [addHexPrefix](_bytes_.md#const-addhexprefix)
* [baToJSON](_bytes_.md#const-batojson)
* [bufferToHex](_bytes_.md#const-buffertohex)
* [bufferToInt](_bytes_.md#const-buffertoint)
* [fromSigned](_bytes_.md#const-fromsigned)
* [setLengthLeft](_bytes_.md#const-setlengthleft)
* [setLengthRight](_bytes_.md#const-setlengthright)
* [toBuffer](_bytes_.md#const-tobuffer)
* [toUnsigned](_bytes_.md#const-tounsigned)
* [unpadArray](_bytes_.md#const-unpadarray)
* [unpadBuffer](_bytes_.md#const-unpadbuffer)
* [unpadHexString](_bytes_.md#const-unpadhexstring)
* [zeros](_bytes_.md#const-zeros)

## Type aliases

###  ToBufferInputTypes

Ƭ **ToBufferInputTypes**: *[PrefixedHexString](_types_.md#prefixedhexstring) | number | BN | Buffer | Uint8Array | number[] | [TransformableToArray](../interfaces/_types_.transformabletoarray.md) | [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md) | null | undefined*

*Defined in [bytes.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L108)*

## Functions

### `Const` addHexPrefix

▸ **addHexPrefix**(`str`: string): *string*

*Defined in [bytes.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L205)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

### `Const` baToJSON

▸ **baToJSON**(`ba`: any): *any*

*Defined in [bytes.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L218)*

Converts a `Buffer` or `Array` to JSON.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`ba` | any | (Buffer|Array) |

**Returns:** *any*

(Array|String|null)

___

### `Const` bufferToHex

▸ **bufferToHex**(`buf`: Buffer): *string*

*Defined in [bytes.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L181)*

Converts a `Buffer` into a `0x`-prefixed hex `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert  |

**Returns:** *string*

___

### `Const` bufferToInt

▸ **bufferToInt**(`buf`: Buffer): *number*

*Defined in [bytes.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L173)*

Converts a `Buffer` to a `Number`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert |

**Returns:** *number*

___

### `Const` fromSigned

▸ **fromSigned**(`num`: Buffer): *BN*

*Defined in [bytes.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L190)*

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | Buffer | Signed integer value  |

**Returns:** *BN*

___

### `Const` setLengthLeft

▸ **setLengthLeft**(`msg`: Buffer, `length`: number): *Buffer‹›*

*Defined in [bytes.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L46)*

Left Pads a `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | Buffer | the value to pad (Buffer) |
`length` | number | the number of bytes the output should be |

**Returns:** *Buffer‹›*

(Buffer)

___

### `Const` setLengthRight

▸ **setLengthRight**(`msg`: Buffer, `length`: number): *Buffer‹›*

*Defined in [bytes.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L58)*

Right Pads a `Buffer` with trailing zeros till it has `length` bytes.
it truncates the end if it exceeds.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | Buffer | the value to pad (Buffer) |
`length` | number | the number of bytes the output should be |

**Returns:** *Buffer‹›*

(Buffer)

___

### `Const` toBuffer

▸ **toBuffer**(`v`: [ToBufferInputTypes](_bytes_.md#tobufferinputtypes)): *Buffer*

*Defined in [bytes.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L126)*

Attempts to turn a value into a `Buffer`.
Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BN` and other objects
with a `toArray()` or `toBuffer()` method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | [ToBufferInputTypes](_bytes_.md#tobufferinputtypes) | the value  |

**Returns:** *Buffer*

___

### `Const` toUnsigned

▸ **toUnsigned**(`num`: BN): *Buffer*

*Defined in [bytes.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L198)*

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | BN |   |

**Returns:** *Buffer*

___

### `Const` unpadArray

▸ **unpadArray**(`a`: number[]): *number[]*

*Defined in [bytes.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L92)*

Trims leading zeros from an `Array` (of numbers).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | number[] | (number[]) |

**Returns:** *number[]*

(number[])

___

### `Const` unpadBuffer

▸ **unpadBuffer**(`a`: Buffer): *Buffer*

*Defined in [bytes.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L82)*

Trims leading zeros from a `Buffer`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | Buffer | (Buffer) |

**Returns:** *Buffer*

(Buffer)

___

### `Const` unpadHexString

▸ **unpadHexString**(`a`: string): *string*

*Defined in [bytes.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L102)*

Trims leading zeros from a hex-prefixed `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | string | (String) |

**Returns:** *string*

(String)

___

### `Const` zeros

▸ **zeros**(`bytes`: number): *Buffer*

*Defined in [bytes.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L10)*

Returns a buffer filled with 0s.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | number | the number of bytes the buffer should be  |

**Returns:** *Buffer*
