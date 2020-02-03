[ethereumjs-util](../README.md) › ["bytes"](_bytes_.md)

# Module: "bytes"

## Index

### Variables

* [setLength](_bytes_.md#const-setlength)
* [stripZeros](_bytes_.md#const-stripzeros)

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
* [unpad](_bytes_.md#const-unpad)
* [zeros](_bytes_.md#const-zeros)

## Variables

### `Const` setLength

• **setLength**: *setLengthLeft* = setLengthLeft

*Defined in [bytes.ts:37](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L37)*

___

### `Const` stripZeros

• **stripZeros**: *unpad* = unpad

*Defined in [bytes.ts:64](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L64)*

## Functions

### `Const` addHexPrefix

▸ **addHexPrefix**(`str`: string): *string*

*Defined in [bytes.ts:135](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L135)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

### `Const` baToJSON

▸ **baToJSON**(`ba`: any): *any*

*Defined in [bytes.ts:148](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L148)*

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

*Defined in [bytes.ts:111](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L111)*

Converts a `Buffer` into a `0x`-prefixed hex `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert  |

**Returns:** *string*

___

### `Const` bufferToInt

▸ **bufferToInt**(`buf`: Buffer): *number*

*Defined in [bytes.ts:103](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L103)*

Converts a `Buffer` to a `Number`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | Buffer | `Buffer` object to convert |

**Returns:** *number*

___

### `Const` fromSigned

▸ **fromSigned**(`num`: Buffer): *BN*

*Defined in [bytes.ts:120](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L120)*

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | Buffer | Signed integer value  |

**Returns:** *BN*

___

### `Const` setLengthLeft

▸ **setLengthLeft**(`msg`: any, `length`: number, `right`: boolean): *any*

*Defined in [bytes.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L20)*

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`msg` | any | - | the value to pad (Buffer|Array) |
`length` | number | - | the number of bytes the output should be |
`right` | boolean | false | whether to start padding form the left or right |

**Returns:** *any*

(Buffer|Array)

___

### `Const` setLengthRight

▸ **setLengthRight**(`msg`: any, `length`: number): *any*

*Defined in [bytes.ts:46](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L46)*

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | any | the value to pad (Buffer|Array) |
`length` | number | the number of bytes the output should be |

**Returns:** *any*

(Buffer|Array)

___

### `Const` toBuffer

▸ **toBuffer**(`v`: any): *Buffer*

*Defined in [bytes.ts:70](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L70)*

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | any | the value  |

**Returns:** *Buffer*

___

### `Const` toUnsigned

▸ **toUnsigned**(`num`: BN): *Buffer*

*Defined in [bytes.ts:128](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L128)*

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | BN |   |

**Returns:** *Buffer*

___

### `Const` unpad

▸ **unpad**(`a`: any): *any*

*Defined in [bytes.ts:55](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L55)*

Trims leading zeros from a `Buffer` or an `Array`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | (Buffer|Array|String) |

**Returns:** *any*

(Buffer|Array|String)

___

### `Const` zeros

▸ **zeros**(`bytes`: number): *Buffer*

*Defined in [bytes.ts:8](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L8)*

Returns a buffer filled with 0s.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | number | the number of bytes the buffer should be  |

**Returns:** *Buffer*
