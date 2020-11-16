[@ethereumjs/blockchain](../README.md) › ["db/helpers"](_db_helpers_.md)

# Module: "db/helpers"

## Index

### Classes

* [DBOp](../classes/_db_helpers_.dbop.md)

### Functions

* [DBSaveLookups](_db_helpers_.md#dbsavelookups)
* [DBSetBlockOrHeader](_db_helpers_.md#dbsetblockorheader)
* [DBSetHashToNumber](_db_helpers_.md#dbsethashtonumber)
* [DBSetTD](_db_helpers_.md#dbsettd)

## Functions

###  DBSaveLookups

▸ **DBSaveLookups**(`blockHash`: Buffer, `blockNumber`: BN): *[DBOp](../classes/_db_helpers_.dbop.md)[]*

*Defined in [db/helpers.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/helpers.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`blockHash` | Buffer |
`blockNumber` | BN |

**Returns:** *[DBOp](../classes/_db_helpers_.dbop.md)[]*

___

###  DBSetBlockOrHeader

▸ **DBSetBlockOrHeader**(`blockBody`: Block | BlockHeader): *[DBOp](../classes/_db_helpers_.dbop.md)[]*

*Defined in [db/helpers.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/helpers.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`blockBody` | Block &#124; BlockHeader |

**Returns:** *[DBOp](../classes/_db_helpers_.dbop.md)[]*

___

###  DBSetHashToNumber

▸ **DBSetHashToNumber**(`blockHash`: Buffer, `blockNumber`: BN): *[DBOp](../classes/_db_helpers_.dbop.md)*

*Defined in [db/helpers.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/helpers.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`blockHash` | Buffer |
`blockNumber` | BN |

**Returns:** *[DBOp](../classes/_db_helpers_.dbop.md)*

___

###  DBSetTD

▸ **DBSetTD**(`TD`: BN, `blockNumber`: BN, `blockHash`: Buffer): *[DBOp](../classes/_db_helpers_.dbop.md)*

*Defined in [db/helpers.ts:11](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/helpers.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`TD` | BN |
`blockNumber` | BN |
`blockHash` | Buffer |

**Returns:** *[DBOp](../classes/_db_helpers_.dbop.md)*
