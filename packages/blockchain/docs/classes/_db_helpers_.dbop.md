[@ethereumjs/blockchain](../README.md) › ["db/helpers"](../modules/_db_helpers_.md) › [DBOp](_db_helpers_.dbop.md)

# Class: DBOp

The DBOp class aids creating database operations which is used by `level` using a more high-level interface

## Hierarchy

* **DBOp**

## Index

### Properties

* [baseDBOp](_db_helpers_.dbop.md#basedbop)
* [cacheString](_db_helpers_.dbop.md#cachestring)
* [operationTarget](_db_helpers_.dbop.md#operationtarget)

### Methods

* [updateCache](_db_helpers_.dbop.md#updatecache)
* [del](_db_helpers_.dbop.md#static-del)
* [get](_db_helpers_.dbop.md#static-get)
* [set](_db_helpers_.dbop.md#static-set)

## Properties

###  baseDBOp

• **baseDBOp**: *DBOpData*

*Defined in [db/operation.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L49)*

___

###  cacheString

• **cacheString**: *string | undefined*

*Defined in [db/operation.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L50)*

___

###  operationTarget

• **operationTarget**: *[DBTarget](../enums/_db_operation_.dbtarget.md)*

*Defined in [db/operation.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L48)*

## Methods

###  updateCache

▸ **updateCache**(`cacheMap`: [CacheMap](../modules/_db_manager_.md#cachemap)): *void*

*Defined in [db/operation.ts:128](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`cacheMap` | [CacheMap](../modules/_db_manager_.md#cachemap) |

**Returns:** *void*

___

### `Static` del

▸ **del**(`operationTarget`: [DBTarget](../enums/_db_operation_.dbtarget.md), `key?`: [DatabaseKey](../modules/_db_operation_.md#databasekey)): *[DBOp](_db_helpers_.dbop.md)*

*Defined in [db/operation.ts:122](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`operationTarget` | [DBTarget](../enums/_db_operation_.dbtarget.md) |
`key?` | [DatabaseKey](../modules/_db_operation_.md#databasekey) |

**Returns:** *[DBOp](_db_helpers_.dbop.md)*

___

### `Static` get

▸ **get**(`operationTarget`: [DBTarget](../enums/_db_operation_.dbtarget.md), `key?`: [DatabaseKey](../modules/_db_operation_.md#databasekey)): *[DBOp](_db_helpers_.dbop.md)*

*Defined in [db/operation.ts:103](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`operationTarget` | [DBTarget](../enums/_db_operation_.dbtarget.md) |
`key?` | [DatabaseKey](../modules/_db_operation_.md#databasekey) |

**Returns:** *[DBOp](_db_helpers_.dbop.md)*

___

### `Static` set

▸ **set**(`operationTarget`: [DBTarget](../enums/_db_operation_.dbtarget.md), `value`: Buffer | object, `key?`: [DatabaseKey](../modules/_db_operation_.md#databasekey)): *[DBOp](_db_helpers_.dbop.md)*

*Defined in [db/operation.ts:108](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/db/operation.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`operationTarget` | [DBTarget](../enums/_db_operation_.dbtarget.md) |
`value` | Buffer &#124; object |
`key?` | [DatabaseKey](../modules/_db_operation_.md#databasekey) |

**Returns:** *[DBOp](_db_helpers_.dbop.md)*
