[ethereumjs-util](../README.md) › ["hash"](_hash_.md)

# Module: "hash"

## Index

### Functions

* [keccak](_hash_.md#const-keccak)
* [keccak256](_hash_.md#const-keccak256)
* [keccakFromArray](_hash_.md#const-keccakfromarray)
* [keccakFromHexString](_hash_.md#const-keccakfromhexstring)
* [keccakFromString](_hash_.md#const-keccakfromstring)
* [ripemd160](_hash_.md#const-ripemd160)
* [ripemd160FromArray](_hash_.md#const-ripemd160fromarray)
* [ripemd160FromString](_hash_.md#const-ripemd160fromstring)
* [rlphash](_hash_.md#const-rlphash)
* [sha256](_hash_.md#const-sha256)
* [sha256FromArray](_hash_.md#const-sha256fromarray)
* [sha256FromString](_hash_.md#const-sha256fromstring)

## Functions

### `Const` keccak

▸ **keccak**(`a`: Buffer, `bits`: number): *Buffer*

*Defined in [hash.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L12)*

Creates Keccak hash of a Buffer input

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`a` | Buffer | - | The input data (Buffer) |
`bits` | number | 256 | (number = 256) The Keccak width  |

**Returns:** *Buffer*

___

### `Const` keccak256

▸ **keccak256**(`a`: Buffer): *Buffer*

*Defined in [hash.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L37)*

Creates Keccak-256 hash of the input, alias for keccak(a, 256).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | Buffer | The input data (Buffer)  |

**Returns:** *Buffer*

___

### `Const` keccakFromArray

▸ **keccakFromArray**(`a`: number[], `bits`: number): *Buffer‹›*

*Defined in [hash.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L67)*

Creates Keccak hash of a number array input

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`a` | number[] | - | The input data (number[]) |
`bits` | number | 256 | (number = 256) The Keccak width  |

**Returns:** *Buffer‹›*

___

### `Const` keccakFromHexString

▸ **keccakFromHexString**(`a`: string, `bits`: number): *Buffer‹›*

*Defined in [hash.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L57)*

Creates Keccak hash of an 0x-prefixed string input

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`a` | string | - | The input data (String) |
`bits` | number | 256 | (number = 256) The Keccak width  |

**Returns:** *Buffer‹›*

___

### `Const` keccakFromString

▸ **keccakFromString**(`a`: string, `bits`: number): *Buffer‹›*

*Defined in [hash.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L46)*

Creates Keccak hash of a utf-8 string input

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`a` | string | - | The input data (String) |
`bits` | number | 256 | (number = 256) The Keccak width  |

**Returns:** *Buffer‹›*

___

### `Const` ripemd160

▸ **ripemd160**(`a`: Buffer, `padded`: boolean): *Buffer*

*Defined in [hash.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L128)*

Creates RIPEMD160 hash of a Buffer input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | Buffer | The input data (Buffer) |
`padded` | boolean | Whether it should be padded to 256 bits or not  |

**Returns:** *Buffer*

___

### `Const` ripemd160FromArray

▸ **ripemd160FromArray**(`a`: number[], `padded`: boolean): *Buffer*

*Defined in [hash.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L148)*

Creates RIPEMD160 hash of a number[] input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | number[] | The input data (number[]) |
`padded` | boolean | Whether it should be padded to 256 bits or not  |

**Returns:** *Buffer*

___

### `Const` ripemd160FromString

▸ **ripemd160FromString**(`a`: string, `padded`: boolean): *Buffer*

*Defined in [hash.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L138)*

Creates RIPEMD160 hash of a string input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | string | The input data (String) |
`padded` | boolean | Whether it should be padded to 256 bits or not  |

**Returns:** *Buffer*

___

### `Const` rlphash

▸ **rlphash**(`a`: rlp.Input): *Buffer*

*Defined in [hash.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L157)*

Creates SHA-3 hash of the RLP encoded version of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | rlp.Input | The input data  |

**Returns:** *Buffer*

___

### `Const` sha256

▸ **sha256**(`a`: Buffer): *Buffer*

*Defined in [hash.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L85)*

Creates SHA256 hash of a Buffer input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | Buffer | The input data (Buffer)  |

**Returns:** *Buffer*

___

### `Const` sha256FromArray

▸ **sha256FromArray**(`a`: number[]): *Buffer*

*Defined in [hash.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L103)*

Creates SHA256 hash of a number[] input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | number[] | The input data (number[])  |

**Returns:** *Buffer*

___

### `Const` sha256FromString

▸ **sha256FromString**(`a`: string): *Buffer*

*Defined in [hash.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L94)*

Creates SHA256 hash of a string input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | string | The input data (string)  |

**Returns:** *Buffer*
