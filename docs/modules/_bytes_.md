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

*Defined in [bytes.ts:176](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L176)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

### `Const` baToJSON

▸ **baToJSON**(`ba`: any): *any*

*Defined in [bytes.ts:189](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L189)*

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

*Defined in [bytes.ts:152](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L152)*

Converts a `Buffer` into a `0x`-prefixed hex `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert  |

**Returns:** *string*

___

### `Const` bufferToInt

▸ **bufferToInt**(`buf`: Buffer): *number*

*Defined in [bytes.ts:144](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L144)*

Converts a `Buffer` to a `Number`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert |

**Returns:** *number*

___

### `Const` fromSigned

▸ **fromSigned**(`num`: Buffer): *BN*

*Defined in [bytes.ts:161](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L161)*

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | Buffer | Signed integer value  |

**Returns:** *BN*

___

### `Const` setLengthLeft

▸ **setLengthLeft**(`msg`: Buffer, `length`: number): *Buffer‹›*

*Defined in [bytes.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L20)*

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

*Defined in [bytes.ts:32](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L32)*

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

▸ **toBuffer**(`v`: any): *Buffer*

*Defined in [bytes.ts:111](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L111)*

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | any | the value  |

**Returns:** *Buffer*

___

### `Const` toUnsigned

▸ **toUnsigned**(`num`: BN): *Buffer*

*Defined in [bytes.ts:169](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L169)*

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | BN |   |

**Returns:** *Buffer*

___

### `Const` unpadArray

▸ **unpadArray**(`a`: number[]): *number[]*

*Defined in [bytes.ts:77](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L77)*

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

*Defined in [bytes.ts:67](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L67)*

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

*Defined in [bytes.ts:87](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L87)*

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

*Defined in [bytes.ts:9](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L9)*

Returns a buffer filled with 0s.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | number | the number of bytes the buffer should be  |

**Returns:** *Buffer*
