[merkle-patricia-tree](../README.md) › [DB](db.md)

# Class: DB

DB is a thin wrapper around the underlying levelup db,
which validates inputs and sets encoding type.

## Hierarchy

* **DB**

  ↳ [ScratchDB](scratchdb.md)

## Index

### Constructors

* [constructor](db.md#constructor)

### Properties

* [_leveldb](db.md#_leveldb)

### Methods

* [batch](db.md#batch)
* [copy](db.md#copy)
* [del](db.md#del)
* [get](db.md#get)
* [put](db.md#put)

## Constructors

###  constructor

\+ **new DB**(`leveldb?`: LevelUp): *[DB](db.md)*

*Defined in [db.ts:23](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L23)*

Initialize a DB instance. If `leveldb` is not provided, DB
defaults to an [in-memory store](https://github.com/Level/memdown).

**Parameters:**

Name | Type |
------ | ------ |
`leveldb?` | LevelUp |

**Returns:** *[DB](db.md)*

## Properties

###  _leveldb

• **_leveldb**: *LevelUp*

*Defined in [db.ts:23](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L23)*

## Methods

###  batch

▸ **batch**(`opStack`: [BatchDBOp](../README.md#batchdbop)[], `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Defined in [db.ts:85](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L85)*

Performs a batch operation on db.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opStack` | [BatchDBOp](../README.md#batchdbop)[] | A stack of levelup operations |
`cb` | [ErrorCallback](../README.md#errorcallback) | A callback `Function`, which is given the argument `err` - for errors that may have occured  |

**Returns:** *void*

___

###  copy

▸ **copy**(): *[DB](db.md)*

*Defined in [db.ts:95](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L95)*

Returns a copy of the DB instance, with a reference
to the **same** underlying leveldb instance.

**Returns:** *[DB](db.md)*

___

###  del

▸ **del**(`key`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Defined in [db.ts:73](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L73)*

Removes a raw value in the underlying leveldb.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | - |
`cb` | [ErrorCallback](../README.md#errorcallback) | A callback `Function`, which is given the argument `err` - for errors that may have occured  |

**Returns:** *void*

___

###  get

▸ **get**(`key`: Buffer, `cb`: Function): *void*

*Defined in [db.ts:41](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L41)*

Retrieves a raw value from leveldb.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | - |
`cb` | Function | A callback `Function`, which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`.  |

**Returns:** *void*

___

###  put

▸ **put**(`key`: Buffer, `val`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Defined in [db.ts:60](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L60)*

Writes a value directly to leveldb.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | The key as a `Buffer` or `String` |
`val` | Buffer | - |
`cb` | [ErrorCallback](../README.md#errorcallback) | A callback `Function`, which is given the argument `err` - for errors that may have occured  |

**Returns:** *void*
