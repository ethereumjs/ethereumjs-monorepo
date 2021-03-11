[ethereumjs-util](../README.md) › ["bytes"](_bytes_.md)

# Module: "bytes"

## Index

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

## Functions

### `Const` addHexPrefix

▸ **addHexPrefix**(`str`: string): *string*

*Defined in [bytes.ts:204](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L204)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

### `Const` baToJSON

▸ **baToJSON**(`ba`: any): *any*

*Defined in [bytes.ts:217](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L217)*

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

*Defined in [bytes.ts:180](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L180)*

Converts a `Buffer` into a `0x`-prefixed hex `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert  |

**Returns:** *string*

___

### `Const` bufferToInt

▸ **bufferToInt**(`buf`: Buffer): *number*

*Defined in [bytes.ts:172](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L172)*

Converts a `Buffer` to a `Number`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert |

**Returns:** *number*

___

### `Const` fromSigned

▸ **fromSigned**(`num`: Buffer): *BN*

*Defined in [bytes.ts:189](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L189)*

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | Buffer | Signed integer value  |

**Returns:** *BN*

___

### `Const` setLengthLeft

▸ **setLengthLeft**(`msg`: Buffer, `length`: number): *Buffer‹›*

*Defined in [bytes.ts:21](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L21)*

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

*Defined in [bytes.ts:33](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L33)*

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

▸ **toBuffer**(`v`: string | number | BN | Buffer | Uint8Array | number[] | [TransformableToArray](../interfaces/_types_.transformabletoarray.md) | [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md) | null | undefined): *Buffer*

*Defined in [bytes.ts:113](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L113)*

Attempts to turn a value into a `Buffer`.
Inputs supported: `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` or `toBuffer()` method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | string &#124; number &#124; BN &#124; Buffer &#124; Uint8Array &#124; number[] &#124; [TransformableToArray](../interfaces/_types_.transformabletoarray.md) &#124; [TransformableToBuffer](../interfaces/_types_.transformabletobuffer.md) &#124; null &#124; undefined | the value  |

**Returns:** *Buffer*

___

### `Const` toUnsigned

▸ **toUnsigned**(`num`: BN): *Buffer*

*Defined in [bytes.ts:197](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L197)*

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | BN |   |

**Returns:** *Buffer*

___

### `Const` unpadArray

▸ **unpadArray**(`a`: number[]): *number[]*

*Defined in [bytes.ts:78](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L78)*

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

*Defined in [bytes.ts:68](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L68)*

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

*Defined in [bytes.ts:88](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L88)*

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

*Defined in [bytes.ts:10](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L10)*

Returns a buffer filled with 0s.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | number | the number of bytes the buffer should be  |

**Returns:** *Buffer*
