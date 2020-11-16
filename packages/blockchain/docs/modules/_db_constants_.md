[@ethereumjs/blockchain](../README.md) › ["db/constants"](_db_constants_.md)

# Module: "db/constants"

## Index

### Variables

* [HEADS_KEY](_db_constants_.md#const-heads_key)
* [HEAD_BLOCK_KEY](_db_constants_.md#const-head_block_key)
* [HEAD_HEADER_KEY](_db_constants_.md#const-head_header_key)

### Functions

* [bodyKey](_db_constants_.md#const-bodykey)
* [bufBE8](_db_constants_.md#const-bufbe8)
* [hashToNumberKey](_db_constants_.md#const-hashtonumberkey)
* [headerKey](_db_constants_.md#const-headerkey)
* [numberToHashKey](_db_constants_.md#const-numbertohashkey)
* [tdKey](_db_constants_.md#const-tdkey)

## Variables

### `Const` HEADS_KEY

• **HEADS_KEY**: *"heads"* = "heads"

*Defined in [db/constants.ts:5](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L5)*

___

### `Const` HEAD_BLOCK_KEY

• **HEAD_BLOCK_KEY**: *"LastBlock"* = "LastBlock"

*Defined in [db/constants.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L15)*

Current canonical head for full sync

___

### `Const` HEAD_HEADER_KEY

• **HEAD_HEADER_KEY**: *"LastHeader"* = "LastHeader"

*Defined in [db/constants.ts:10](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L10)*

Current canonical head for light sync

## Functions

### `Const` bodyKey

▸ **bodyKey**(`n`: BN, `hash`: Buffer): *Buffer‹›*

*Defined in [db/constants.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | BN |
`hash` | Buffer |

**Returns:** *Buffer‹›*

___

### `Const` bufBE8

▸ **bufBE8**(`n`: BN): *Buffer‹›*

*Defined in [db/constants.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L47)*

Convert BN to big endian Buffer

**Parameters:**

Name | Type |
------ | ------ |
`n` | BN |

**Returns:** *Buffer‹›*

___

### `Const` hashToNumberKey

▸ **hashToNumberKey**(`hash`: Buffer): *Buffer‹›*

*Defined in [db/constants.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | Buffer |

**Returns:** *Buffer‹›*

___

### `Const` headerKey

▸ **headerKey**(`n`: BN, `hash`: Buffer): *Buffer‹›*

*Defined in [db/constants.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | BN |
`hash` | Buffer |

**Returns:** *Buffer‹›*

___

### `Const` numberToHashKey

▸ **numberToHashKey**(`n`: BN): *Buffer‹›*

*Defined in [db/constants.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | BN |

**Returns:** *Buffer‹›*

___

### `Const` tdKey

▸ **tdKey**(`n`: BN, `hash`: Buffer): *Buffer‹›*

*Defined in [db/constants.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/constants.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | BN |
`hash` | Buffer |

**Returns:** *Buffer‹›*
