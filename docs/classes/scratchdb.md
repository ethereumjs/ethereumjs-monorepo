[merkle-patricia-tree](../README.md) › [ScratchDB](scratchdb.md)

# Class: ScratchDB

An in-memory wrap over `DB` with an upstream DB
which will be queried when a key is not found
in the in-memory scratch. This class is used to implement
checkpointing functionality in CheckpointTrie.

## Hierarchy

* [DB](db.md)

  ↳ **ScratchDB**

## Index

### Constructors

* [constructor](scratchdb.md#constructor)

### Properties

* [_leveldb](scratchdb.md#_leveldb)
* [_upstream](scratchdb.md#private-_upstream)

### Methods

* [batch](scratchdb.md#batch)
* [copy](scratchdb.md#copy)
* [del](scratchdb.md#del)
* [get](scratchdb.md#get)
* [put](scratchdb.md#put)

## Constructors

###  constructor

\+ **new ScratchDB**(`upstreamDB`: [DB](db.md)): *[ScratchDB](scratchdb.md)*

*Overrides [DB](db.md).[constructor](db.md#constructor)*

*Defined in [scratch.ts:11](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/scratch.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`upstreamDB` | [DB](db.md) |

**Returns:** *[ScratchDB](scratchdb.md)*

## Properties

###  _leveldb

• **_leveldb**: *LevelUp*

*Inherited from [DB](db.md).[_leveldb](db.md#_leveldb)*

*Defined in [db.ts:23](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L23)*

___

### `Private` _upstream

• **_upstream**: *[DB](db.md)*

*Defined in [scratch.ts:11](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/scratch.ts#L11)*

## Methods

###  batch

▸ **batch**(`opStack`: [BatchDBOp](../README.md#batchdbop)[], `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [DB](db.md).[batch](db.md#batch)*

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

▸ **copy**(): *[ScratchDB](scratchdb.md)*

*Overrides [DB](db.md).[copy](db.md#copy)*

*Defined in [scratch.ts:39](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/scratch.ts#L39)*

**Returns:** *[ScratchDB](scratchdb.md)*

___

###  del

▸ **del**(`key`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [DB](db.md).[del](db.md#del)*

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

*Overrides [DB](db.md).[get](db.md#get)*

*Defined in [scratch.ts:22](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/scratch.ts#L22)*

Similar to `DB.get`, but first searches in-memory
scratch DB, if key not found, searches upstream DB.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | Function |

**Returns:** *void*

___

###  put

▸ **put**(`key`: Buffer, `val`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [DB](db.md).[put](db.md#put)*

*Defined in [db.ts:60](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L60)*

Writes a value directly to leveldb.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | The key as a `Buffer` or `String` |
`val` | Buffer | - |
`cb` | [ErrorCallback](../README.md#errorcallback) | A callback `Function`, which is given the argument `err` - for errors that may have occured  |

**Returns:** *void*
