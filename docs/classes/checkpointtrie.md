[merkle-patricia-tree](../README.md) › [CheckpointTrie](checkpointtrie.md)

# Class: CheckpointTrie

## Hierarchy

* [Trie](trie.md)

  ↳ **CheckpointTrie**

  ↳ [SecureTrie](securetrie.md)

## Index

### Constructors

* [constructor](checkpointtrie.md#constructor)

### Properties

* [EMPTY_TRIE_ROOT](checkpointtrie.md#empty_trie_root)
* [_checkpoints](checkpointtrie.md#_checkpoints)
* [_mainDB](checkpointtrie.md#_maindb)
* [_scratch](checkpointtrie.md#_scratch)
* [db](checkpointtrie.md#db)
* [sem](checkpointtrie.md#protected-sem)

### Accessors

* [isCheckpoint](checkpointtrie.md#ischeckpoint)
* [root](checkpointtrie.md#root)

### Methods

* [_createInitialNode](checkpointtrie.md#_createinitialnode)
* [_createScratchReadStream](checkpointtrie.md#private-_createscratchreadstream)
* [_deleteNode](checkpointtrie.md#_deletenode)
* [_enterCpMode](checkpointtrie.md#private-_entercpmode)
* [_exitCpMode](checkpointtrie.md#private-_exitcpmode)
* [_findDbNodes](checkpointtrie.md#_finddbnodes)
* [_findValueNodes](checkpointtrie.md#_findvaluenodes)
* [_formatNode](checkpointtrie.md#_formatnode)
* [_lookupNode](checkpointtrie.md#_lookupnode)
* [_putNode](checkpointtrie.md#_putnode)
* [_saveStack](checkpointtrie.md#private-_savestack)
* [_updateNode](checkpointtrie.md#private-_updatenode)
* [_walkTrie](checkpointtrie.md#_walktrie)
* [batch](checkpointtrie.md#batch)
* [checkRoot](checkpointtrie.md#checkroot)
* [checkpoint](checkpointtrie.md#checkpoint)
* [commit](checkpointtrie.md#commit)
* [copy](checkpointtrie.md#copy)
* [createReadStream](checkpointtrie.md#createreadstream)
* [del](checkpointtrie.md#del)
* [delRaw](checkpointtrie.md#delraw)
* [findPath](checkpointtrie.md#findpath)
* [get](checkpointtrie.md#get)
* [getRaw](checkpointtrie.md#getraw)
* [put](checkpointtrie.md#put)
* [putRaw](checkpointtrie.md#putraw)
* [revert](checkpointtrie.md#revert)
* [setRoot](checkpointtrie.md#setroot)
* [fromProof](checkpointtrie.md#static-fromproof)
* [prove](checkpointtrie.md#static-prove)
* [verifyProof](checkpointtrie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new CheckpointTrie**(...`args`: any): *[CheckpointTrie](checkpointtrie.md)*

*Overrides [Trie](trie.md).[constructor](trie.md#constructor)*

*Defined in [checkpointTrie.ts:14](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any |

**Returns:** *[CheckpointTrie](checkpointtrie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Inherited from [Trie](trie.md).[EMPTY_TRIE_ROOT](trie.md#empty_trie_root)*

*Defined in [baseTrie.ts:34](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L34)*

___

###  _checkpoints

• **_checkpoints**: *Buffer[]*

*Defined in [checkpointTrie.ts:14](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L14)*

___

###  _mainDB

• **_mainDB**: *[DB](db.md)*

*Defined in [checkpointTrie.ts:12](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L12)*

___

###  _scratch

• **_scratch**: *[ScratchDB](scratchdb.md) | null*

*Defined in [checkpointTrie.ts:13](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L13)*

___

###  db

• **db**: *[DB](db.md)*

*Inherited from [Trie](trie.md).[db](trie.md#db)*

*Defined in [baseTrie.ts:35](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L35)*

___

### `Protected` sem

• **sem**: *any*

*Inherited from [Trie](trie.md).[sem](trie.md#protected-sem)*

*Defined in [baseTrie.ts:36](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L36)*

## Accessors

###  isCheckpoint

• **get isCheckpoint**(): *boolean*

*Defined in [checkpointTrie.ts:29](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L29)*

Is the trie during a checkpoint phase?

**Returns:** *boolean*

___

###  root

• **get root**(): *Buffer*

*Inherited from [Trie](trie.md).[root](trie.md#root)*

*Defined in [baseTrie.ts:103](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L103)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Inherited from [Trie](trie.md).[root](trie.md#root)*

*Defined in [baseTrie.ts:99](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[_createInitialNode](trie.md#_createinitialnode)*

*Defined in [baseTrie.ts:735](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L735)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |
`cb` | [ErrorCallback](../README.md#errorcallback) |

**Returns:** *void*

___

### `Private` _createScratchReadStream

▸ **_createScratchReadStream**(`scratch`: [ScratchDB](scratchdb.md)): *[ScratchReadStream](scratchreadstream.md)‹›*

*Defined in [checkpointTrie.ts:154](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L154)*

Returns a `ScratchReadStream` based on the state updates
since checkpoint.

**`method`** createScratchReadStream

**Parameters:**

Name | Type |
------ | ------ |
`scratch` | [ScratchDB](scratchdb.md) |

**Returns:** *[ScratchReadStream](scratchreadstream.md)‹›*

___

###  _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: [TrieNode](../README.md#trienode)[], `cb`: Function): *any*

*Inherited from [Trie](trie.md).[_deleteNode](trie.md#_deletenode)*

*Defined in [baseTrie.ts:617](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L617)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | [TrieNode](../README.md#trienode)[] |
`cb` | Function |

**Returns:** *any*

___

### `Private` _enterCpMode

▸ **_enterCpMode**(): *void*

*Defined in [checkpointTrie.ts:125](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L125)*

Enter into checkpoint mode.

**Returns:** *void*

___

### `Private` _exitCpMode

▸ **_exitCpMode**(`commitState`: boolean, `cb`: Function): *void*

*Defined in [checkpointTrie.ts:134](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L134)*

Exit from checkpoint mode.

**Parameters:**

Name | Type |
------ | ------ |
`commitState` | boolean |
`cb` | Function |

**Returns:** *void*

___

###  _findDbNodes

▸ **_findDbNodes**(`onFound`: Function, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[_findDbNodes](trie.md#_finddbnodes)*

*Defined in [baseTrie.ts:346](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L346)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | Function |
`cb` | Function |

**Returns:** *void*

___

###  _findValueNodes

▸ **_findValueNodes**(`onFound`: Function, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[_findValueNodes](trie.md#_findvaluenodes)*

*Defined in [baseTrie.ts:320](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L320)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | Function |
`cb` | Function |

**Returns:** *void*

___

###  _formatNode

▸ **_formatNode**(`node`: [TrieNode](../README.md#trienode), `topLevel`: boolean, `opStack`: [BatchDBOp](../README.md#batchdbop)[], `remove`: boolean): *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

*Overrides [Trie](trie.md).[_formatNode](trie.md#_formatnode)*

*Defined in [checkpointTrie.ts:163](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L163)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`node` | [TrieNode](../README.md#trienode) | - |
`topLevel` | boolean | - |
`opStack` | [BatchDBOp](../README.md#batchdbop)[] | - |
`remove` | boolean | false |

**Returns:** *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

___

###  _lookupNode

▸ **_lookupNode**(`node`: Buffer | Buffer[], `cb`: Function): *void*

*Inherited from [Trie](trie.md).[_lookupNode](trie.md#_lookupnode)*

*Defined in [baseTrie.ts:230](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L230)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |
`cb` | Function |

**Returns:** *void*

___

###  _putNode

▸ **_putNode**(`node`: [TrieNode](../README.md#trienode), `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[_putNode](trie.md#_putnode)*

*Defined in [baseTrie.ts:247](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L247)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [TrieNode](../README.md#trienode) |
`cb` | [ErrorCallback](../README.md#errorcallback) |

**Returns:** *void*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: number[], `stack`: [TrieNode](../README.md#trienode)[], `opStack`: [BatchDBOp](../README.md#batchdbop)[], `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[_saveStack](trie.md#private-_savestack)*

*Defined in [baseTrie.ts:588](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L588)*

saves a stack

**`method`** _saveStack

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | number[] | the key. Should follow the stack |
`stack` | [TrieNode](../README.md#trienode)[] | a stack of nodes to the value given by the key |
`opStack` | [BatchDBOp](../README.md#batchdbop)[] | a stack of levelup operations to commit at the end of this funciton |
`cb` | [ErrorCallback](../README.md#errorcallback) |   |

**Returns:** *void*

___

### `Private` _updateNode

▸ **_updateNode**(`k`: Buffer, `value`: Buffer, `keyRemainder`: number[], `stack`: [TrieNode](../README.md#trienode)[], `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[_updateNode](trie.md#private-_updatenode)*

*Defined in [baseTrie.ts:370](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L370)*

Updates a node

**`method`** _updateNode

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`k` | Buffer | - |
`value` | Buffer | - |
`keyRemainder` | number[] | - |
`stack` | [TrieNode](../README.md#trienode)[] | - |
`cb` | [ErrorCallback](../README.md#errorcallback) | the callback  |

**Returns:** *void*

___

###  _walkTrie

▸ **_walkTrie**(`root`: Buffer, `onNode`: Function, `onDone`: Function): *any*

*Inherited from [Trie](trie.md).[_walkTrie](trie.md#_walktrie)*

*Defined in [baseTrie.ts:473](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L473)*

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |
`onNode` | Function |
`onDone` | Function |

**Returns:** *any*

___

###  batch

▸ **batch**(`ops`: [BatchDBOp](../README.md#batchdbop)[], `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[batch](trie.md#batch)*

*Defined in [baseTrie.ts:799](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L799)*

The given hash of operations (key additions or deletions) are executed on the DB

**`method`** batch

**`memberof`** Trie

**`example`** 
var ops = [
   { type: 'del', key: Buffer.from('father') }
 , { type: 'put', key: Buffer.from('name'), value: Buffer.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Buffer.from('dob'), value: Buffer.from('16 February 1941') }
 , { type: 'put', key: Buffer.from('spouse'), value: Buffer.from('Kim Young-sook') }
 , { type: 'put', key: Buffer.from('occupation'), value: Buffer.from('Clown') }
]
trie.batch(ops)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`ops` | [BatchDBOp](../README.md#batchdbop)[] | - |
`cb` | [ErrorCallback](../README.md#errorcallback) |   |

**Returns:** *void*

___

###  checkRoot

▸ **checkRoot**(`root`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[checkRoot](trie.md#checkroot)*

*Defined in [baseTrie.ts:819](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L819)*

Checks if a given root exists

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |
`cb` | Function |

**Returns:** *void*

___

###  checkpoint

▸ **checkpoint**(): *void*

*Defined in [checkpointTrie.ts:39](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L39)*

Creates a checkpoint that can later be reverted to or committed.
After this is called, no changes to the trie will be permanently saved
until `commit` is called. Calling `putRaw` overrides the checkpointing
mechanism and would directly write to db.

**Returns:** *void*

___

###  commit

▸ **commit**(`cb`: Function): *void*

*Defined in [checkpointTrie.ts:56](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L56)*

Commits a checkpoint to disk, if current checkpoint is not nested. If
nested, only sets the parent checkpoint as current checkpoint.

**`method`** commit

**`throws`** If not during a checkpoint phase

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | Function | the callback |

**Returns:** *void*

___

###  copy

▸ **copy**(`includeCheckpoints`: boolean): *[CheckpointTrie](checkpointtrie.md)*

*Overrides [Trie](trie.md).[copy](trie.md#copy)*

*Defined in [checkpointTrie.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L101)*

Returns a copy of the underlying trie with the interface
of CheckpointTrie. If during a checkpoint, the copy will
contain the checkpointing metadata (incl. reference to the same scratch).

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeCheckpoints` | boolean | true | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.  |

**Returns:** *[CheckpointTrie](checkpointtrie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Inherited from [Trie](trie.md).[createReadStream](trie.md#createreadstream)*

*Defined in [baseTrie.ts:772](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L772)*

The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[del](trie.md#del)*

*Defined in [baseTrie.ts:183](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L183)*

deletes a value given a `key`

**`method`** del

**`memberof`** Trie

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | Function |

**Returns:** *void*

___

###  delRaw

▸ **delRaw**(`key`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[delRaw](trie.md#delraw)*

*Defined in [baseTrie.ts:225](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L225)*

Deletes key directly from underlying key/value db.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | [ErrorCallback](../README.md#errorcallback) |

**Returns:** *void*

___

###  findPath

▸ **findPath**(`key`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[findPath](trie.md#findpath)*

*Defined in [baseTrie.ts:266](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L266)*

Tries to find a path to the node for the given key
It returns a `stack` of nodes to the closet node

**`method`** findPath

**`memberof`** Trie

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | Function |

**Returns:** *void*

___

###  get

▸ **get**(`key`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[get](trie.md#get)*

*Defined in [baseTrie.ts:125](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L125)*

Gets a value given a `key`

**`method`** get

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the key to search for |
`cb` | Function | A callback `Function` which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`  |

**Returns:** *void*

___

###  getRaw

▸ **getRaw**(`key`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[getRaw](trie.md#getraw)*

*Defined in [baseTrie.ts:208](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L208)*

Retrieves a value directly from key/value db.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | Function |

**Returns:** *void*

___

###  put

▸ **put**(`key`: Buffer, `value`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Inherited from [Trie](trie.md).[put](trie.md#put)*

*Defined in [baseTrie.ts:147](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L147)*

Stores a given `value` at the given `key`

**`method`** put

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | - |
`value` | Buffer | - |
`cb` | [ErrorCallback](../README.md#errorcallback) | A callback `Function` which is given the argument `err` - for errors that may have occured  |

**Returns:** *void*

___

###  putRaw

▸ **putRaw**(`key`: Buffer, `value`: Buffer, `cb`: [ErrorCallback](../README.md#errorcallback)): *void*

*Overrides [Trie](trie.md).[putRaw](trie.md#putraw)*

*Defined in [checkpointTrie.ts:117](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L117)*

Writes a value under given key directly to the
key/value db, disregarding checkpoints.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |
`cb` | [ErrorCallback](../README.md#errorcallback) |

**Returns:** *void*

___

###  revert

▸ **revert**(`cb`: Function): *void*

*Defined in [checkpointTrie.ts:78](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L78)*

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

**Parameters:**

Name | Type |
------ | ------ |
`cb` | Function |

**Returns:** *void*

___

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Inherited from [Trie](trie.md).[setRoot](trie.md#setroot)*

*Defined in [baseTrie.ts:107](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `cb`: Function, `proofTrie?`: [Trie](trie.md)): *void*

*Inherited from [Trie](trie.md).[fromProof](trie.md#static-fromproof)*

*Defined in [baseTrie.ts:49](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`cb` | Function |
`proofTrie?` | [Trie](trie.md) |

**Returns:** *void*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](trie.md), `key`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](trie.md).[prove](trie.md#static-prove)*

*Defined in [baseTrie.ts:70](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [Trie](trie.md) |
`key` | Buffer |
`cb` | Function |

**Returns:** *void*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proofNodes`: Buffer[], `cb`: Function): *void*

*Inherited from [Trie](trie.md).[verifyProof](trie.md#static-verifyproof)*

*Defined in [baseTrie.ts:85](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proofNodes` | Buffer[] |
`cb` | Function |

**Returns:** *void*
