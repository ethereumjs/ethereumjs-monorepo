[ethereumjs-util](../README.md) › ["hash"](_hash_.md)

# Module: "hash"

## Index

### Functions

* [keccak](_hash_.md#const-keccak)
* [keccak256](_hash_.md#const-keccak256)
* [ripemd160](_hash_.md#const-ripemd160)
* [rlphash](_hash_.md#const-rlphash)
* [sha256](_hash_.md#const-sha256)

## Functions

### `Const` keccak

▸ **keccak**(`a`: any, `bits`: number): *Buffer*

*Defined in [hash.ts:13](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L13)*

Creates Keccak hash of the input

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`a` | any | - | The input data (Buffer|Array|String|Number) If the string is a 0x-prefixed hex value it's interpreted as hexadecimal, otherwise as utf8. |
`bits` | number | 256 | The Keccak width  |

**Returns:** *Buffer*

___

### `Const` keccak256

▸ **keccak256**(`a`: any): *Buffer*

*Defined in [hash.ts:31](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L31)*

Creates Keccak-256 hash of the input, alias for keccak(a, 256).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | The input data (Buffer|Array|String|Number)  |

**Returns:** *Buffer*

___

### `Const` ripemd160

▸ **ripemd160**(`a`: any, `padded`: boolean): *Buffer*

*Defined in [hash.ts:51](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L51)*

Creates RIPEMD160 hash of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | The input data (Buffer|Array|String|Number) |
`padded` | boolean | Whether it should be padded to 256 bits or not  |

**Returns:** *Buffer*

___

### `Const` rlphash

▸ **rlphash**(`a`: rlp.Input): *Buffer*

*Defined in [hash.ts:67](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L67)*

Creates SHA-3 hash of the RLP encoded version of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | rlp.Input | The input data  |

**Returns:** *Buffer*

___

### `Const` sha256

▸ **sha256**(`a`: any): *Buffer*

*Defined in [hash.ts:39](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L39)*

Creates SHA256 hash of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | The input data (Buffer|Array|String|Number)  |

**Returns:** *Buffer*
