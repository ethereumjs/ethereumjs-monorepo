[ethereumjs-util](../README.md) › ["helpers"](_helpers_.md)

# Module: "helpers"

## Index

### Functions

* [assertIsArray](_helpers_.md#const-assertisarray)
* [assertIsBuffer](_helpers_.md#const-assertisbuffer)
* [assertIsHexString](_helpers_.md#const-assertishexstring)
* [assertIsString](_helpers_.md#const-assertisstring)
* [bnToRlp](_helpers_.md#bntorlp)

## Functions

### `Const` assertIsArray

▸ **assertIsArray**(`input`: number[]): *void*

*Defined in [helpers.ts:31](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/helpers.ts#L31)*

Throws if input is not an array

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | number[] | value to check  |

**Returns:** *void*

___

### `Const` assertIsBuffer

▸ **assertIsBuffer**(`input`: Buffer): *void*

*Defined in [helpers.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/helpers.ts#L20)*

Throws if input is not a buffer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | Buffer | value to check  |

**Returns:** *void*

___

### `Const` assertIsHexString

▸ **assertIsHexString**(`input`: string): *void*

*Defined in [helpers.ts:9](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/helpers.ts#L9)*

Throws if a string is not hex prefixed

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | string | string to check hex prefix of  |

**Returns:** *void*

___

### `Const` assertIsString

▸ **assertIsString**(`input`: string): *void*

*Defined in [helpers.ts:42](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/helpers.ts#L42)*

Throws if input is not a string

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | string | value to check  |

**Returns:** *void*

___

###  bnToRlp

▸ **bnToRlp**(`value`: BN): *Buffer*

*Defined in [helpers.ts:53](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/helpers.ts#L53)*

Convert value from BN to RLP (unpadded buffer)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | BN | value to convert  |

**Returns:** *Buffer*
