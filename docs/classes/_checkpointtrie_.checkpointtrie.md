[merkle-patricia-tree](../README.md) › ["checkpointTrie"](../modules/_checkpointtrie_.md) › [CheckpointTrie](_checkpointtrie_.checkpointtrie.md)

# Class: CheckpointTrie

## Hierarchy

* [Trie](_basetrie_.trie.md)

  ↳ **CheckpointTrie**

  ↳ [SecureTrie](_secure_.securetrie.md)

## Index

### Constructors

* [constructor](_checkpointtrie_.checkpointtrie.md#constructor)

### Properties

* [EMPTY_TRIE_ROOT](_checkpointtrie_.checkpointtrie.md#empty_trie_root)
* [_checkpoints](_checkpointtrie_.checkpointtrie.md#_checkpoints)
* [_mainDB](_checkpointtrie_.checkpointtrie.md#_maindb)
* [_scratch](_checkpointtrie_.checkpointtrie.md#_scratch)
* [db](_checkpointtrie_.checkpointtrie.md#db)

### Accessors

* [isCheckpoint](_checkpointtrie_.checkpointtrie.md#ischeckpoint)
* [root](_checkpointtrie_.checkpointtrie.md#root)

### Methods

* [_createInitialNode](_checkpointtrie_.checkpointtrie.md#_createinitialnode)
* [_createScratchReadStream](_checkpointtrie_.checkpointtrie.md#private-_createscratchreadstream)
* [_deleteNode](_checkpointtrie_.checkpointtrie.md#_deletenode)
* [_enterCpMode](_checkpointtrie_.checkpointtrie.md#private-_entercpmode)
* [_exitCpMode](_checkpointtrie_.checkpointtrie.md#private-_exitcpmode)
* [_findDbNodes](_checkpointtrie_.checkpointtrie.md#_finddbnodes)
* [_findValueNodes](_checkpointtrie_.checkpointtrie.md#_findvaluenodes)
* [_formatNode](_checkpointtrie_.checkpointtrie.md#_formatnode)
* [_lookupNode](_checkpointtrie_.checkpointtrie.md#_lookupnode)
* [_putNode](_checkpointtrie_.checkpointtrie.md#_putnode)
* [_saveStack](_checkpointtrie_.checkpointtrie.md#private-_savestack)
* [_updateNode](_checkpointtrie_.checkpointtrie.md#private-_updatenode)
* [_walkTrie](_checkpointtrie_.checkpointtrie.md#_walktrie)
* [batch](_checkpointtrie_.checkpointtrie.md#batch)
* [checkRoot](_checkpointtrie_.checkpointtrie.md#checkroot)
* [checkpoint](_checkpointtrie_.checkpointtrie.md#checkpoint)
* [commit](_checkpointtrie_.checkpointtrie.md#commit)
* [copy](_checkpointtrie_.checkpointtrie.md#copy)
* [createReadStream](_checkpointtrie_.checkpointtrie.md#createreadstream)
* [del](_checkpointtrie_.checkpointtrie.md#del)
* [delRaw](_checkpointtrie_.checkpointtrie.md#delraw)
* [findPath](_checkpointtrie_.checkpointtrie.md#findpath)
* [get](_checkpointtrie_.checkpointtrie.md#get)
* [getRaw](_checkpointtrie_.checkpointtrie.md#getraw)
* [put](_checkpointtrie_.checkpointtrie.md#put)
* [putRaw](_checkpointtrie_.checkpointtrie.md#putraw)
* [revert](_checkpointtrie_.checkpointtrie.md#revert)
* [setRoot](_checkpointtrie_.checkpointtrie.md#setroot)
* [fromProof](_checkpointtrie_.checkpointtrie.md#static-fromproof)
* [prove](_checkpointtrie_.checkpointtrie.md#static-prove)
* [verifyProof](_checkpointtrie_.checkpointtrie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new CheckpointTrie**(...`args`: any): *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

*Overrides [Trie](_basetrie_.trie.md).[constructor](_basetrie_.trie.md#constructor)*

*Defined in [checkpointTrie.ts:14](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any |

**Returns:** *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[EMPTY_TRIE_ROOT](_basetrie_.trie.md#empty_trie_root)*

*Defined in [baseTrie.ts:34](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L34)*

___

###  _checkpoints

• **_checkpoints**: *Buffer[]*

*Defined in [checkpointTrie.ts:14](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L14)*

___

###  _mainDB

• **_mainDB**: *DB*

*Defined in [checkpointTrie.ts:12](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L12)*

___

###  _scratch

• **_scratch**: *ScratchDB | null*

*Defined in [checkpointTrie.ts:13](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L13)*

___

###  db

• **db**: *DB*

*Inherited from [Trie](_basetrie_.trie.md).[db](_basetrie_.trie.md#db)*

*Defined in [baseTrie.ts:35](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L35)*

## Accessors

###  isCheckpoint

• **get isCheckpoint**(): *boolean*

*Defined in [checkpointTrie.ts:29](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L29)*

Is the trie during a checkpoint phase?

**Returns:** *boolean*

___

###  root

• **get root**(): *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:103](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L103)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:99](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[_createInitialNode](_basetrie_.trie.md#_createinitialnode)*

*Defined in [baseTrie.ts:735](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L735)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |
`cb` | ErrorCallback |

**Returns:** *void*

___

### `Private` _createScratchReadStream

▸ **_createScratchReadStream**(`scratch`: ScratchDB): *ScratchReadStream‹›*

*Defined in [checkpointTrie.ts:152](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L152)*

Returns a `ScratchReadStream` based on the state updates
since checkpoint.

**`method`** createScratchReadStream

**Parameters:**

Name | Type |
------ | ------ |
`scratch` | ScratchDB |

**Returns:** *ScratchReadStream‹›*

___

###  _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[], `cb`: Function): *any*

*Inherited from [Trie](_basetrie_.trie.md).[_deleteNode](_basetrie_.trie.md#_deletenode)*

*Defined in [baseTrie.ts:617](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L617)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |
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

*Inherited from [Trie](_basetrie_.trie.md).[_findDbNodes](_basetrie_.trie.md#_finddbnodes)*

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

*Inherited from [Trie](_basetrie_.trie.md).[_findValueNodes](_basetrie_.trie.md#_findvaluenodes)*

*Defined in [baseTrie.ts:320](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L320)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | Function |
`cb` | Function |

**Returns:** *void*

___

###  _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

*Overrides [Trie](_basetrie_.trie.md).[_formatNode](_basetrie_.trie.md#_formatnode)*

*Defined in [checkpointTrie.ts:161](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L161)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`node` | TrieNode | - |
`topLevel` | boolean | - |
`opStack` | BatchDBOp[] | - |
`remove` | boolean | false |

**Returns:** *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

___

###  _lookupNode

▸ **_lookupNode**(`node`: Buffer | Buffer[], `cb`: Function): *void*

*Inherited from [Trie](_basetrie_.trie.md).[_lookupNode](_basetrie_.trie.md#_lookupnode)*

*Defined in [baseTrie.ts:230](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L230)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |
`cb` | Function |

**Returns:** *void*

___

###  _putNode

▸ **_putNode**(`node`: TrieNode, `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[_putNode](_basetrie_.trie.md#_putnode)*

*Defined in [baseTrie.ts:247](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L247)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TrieNode |
`cb` | ErrorCallback |

**Returns:** *void*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: number[], `stack`: TrieNode[], `opStack`: BatchDBOp[], `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[_saveStack](_basetrie_.trie.md#private-_savestack)*

*Defined in [baseTrie.ts:588](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L588)*

saves a stack

**`method`** _saveStack

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | number[] | the key. Should follow the stack |
`stack` | TrieNode[] | a stack of nodes to the value given by the key |
`opStack` | BatchDBOp[] | a stack of levelup operations to commit at the end of this funciton |
`cb` | ErrorCallback |   |

**Returns:** *void*

___

### `Private` _updateNode

▸ **_updateNode**(`k`: Buffer, `value`: Buffer, `keyRemainder`: number[], `stack`: TrieNode[], `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[_updateNode](_basetrie_.trie.md#private-_updatenode)*

*Defined in [baseTrie.ts:370](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L370)*

Updates a node

**`method`** _updateNode

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`k` | Buffer | - |
`value` | Buffer | - |
`keyRemainder` | number[] | - |
`stack` | TrieNode[] | - |
`cb` | ErrorCallback | the callback  |

**Returns:** *void*

___

###  _walkTrie

▸ **_walkTrie**(`root`: Buffer, `onNode`: Function, `onDone`: Function): *any*

*Inherited from [Trie](_basetrie_.trie.md).[_walkTrie](_basetrie_.trie.md#_walktrie)*

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

▸ **batch**(`ops`: BatchDBOp[], `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[batch](_basetrie_.trie.md#batch)*

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
`ops` | BatchDBOp[] | - |
`cb` | ErrorCallback |   |

**Returns:** *void*

___

###  checkRoot

▸ **checkRoot**(`root`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](_basetrie_.trie.md).[checkRoot](_basetrie_.trie.md#checkroot)*

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

▸ **copy**(`includeCheckpoints`: boolean): *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

*Overrides [Trie](_basetrie_.trie.md).[copy](_basetrie_.trie.md#copy)*

*Defined in [checkpointTrie.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L101)*

Returns a copy of the underlying trie with the interface
of CheckpointTrie. If during a checkpoint, the copy will
contain the checkpointing metadata (incl. reference to the same scratch).

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeCheckpoints` | boolean | true | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.  |

**Returns:** *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Inherited from [Trie](_basetrie_.trie.md).[createReadStream](_basetrie_.trie.md#createreadstream)*

*Defined in [baseTrie.ts:772](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L772)*

The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer, `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[del](_basetrie_.trie.md#del)*

*Defined in [baseTrie.ts:183](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L183)*

deletes a value given a `key`

**`method`** del

**`memberof`** Trie

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | ErrorCallback |

**Returns:** *void*

___

###  delRaw

▸ **delRaw**(`key`: Buffer, `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[delRaw](_basetrie_.trie.md#delraw)*

*Defined in [baseTrie.ts:225](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L225)*

Deletes key directly from underlying key/value db.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | ErrorCallback |

**Returns:** *void*

___

###  findPath

▸ **findPath**(`key`: Buffer, `cb`: Function): *void*

*Inherited from [Trie](_basetrie_.trie.md).[findPath](_basetrie_.trie.md#findpath)*

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

▸ **get**(`key`: Buffer, `cb`: BufferCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[get](_basetrie_.trie.md#get)*

*Defined in [baseTrie.ts:125](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L125)*

Gets a value given a `key`

**`method`** get

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the key to search for |
`cb` | BufferCallback | A callback `Function` which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`  |

**Returns:** *void*

___

###  getRaw

▸ **getRaw**(`key`: Buffer, `cb`: BufferCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[getRaw](_basetrie_.trie.md#getraw)*

*Defined in [baseTrie.ts:208](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L208)*

Retrieves a value directly from key/value db.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | BufferCallback |

**Returns:** *void*

___

###  put

▸ **put**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[put](_basetrie_.trie.md#put)*

*Defined in [baseTrie.ts:147](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L147)*

Stores a given `value` at the given `key`

**`method`** put

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | - |
`value` | Buffer | - |
`cb` | ErrorCallback | A callback `Function` which is given the argument `err` - for errors that may have occured  |

**Returns:** *void*

___

###  putRaw

▸ **putRaw**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Overrides [Trie](_basetrie_.trie.md).[putRaw](_basetrie_.trie.md#putraw)*

*Defined in [checkpointTrie.ts:117](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L117)*

Writes a value under given key directly to the
key/value db, disregarding checkpoints.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |
`cb` | ErrorCallback |

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

*Inherited from [Trie](_basetrie_.trie.md).[setRoot](_basetrie_.trie.md#setroot)*

*Defined in [baseTrie.ts:107](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `cb`: Function, `proofTrie?`: [Trie](_basetrie_.trie.md)): *void*

*Inherited from [Trie](_basetrie_.trie.md).[fromProof](_basetrie_.trie.md#static-fromproof)*

*Defined in [baseTrie.ts:49](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`cb` | Function |
`proofTrie?` | [Trie](_basetrie_.trie.md) |

**Returns:** *void*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer, `cb`: ProveCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[prove](_basetrie_.trie.md#static-prove)*

*Defined in [baseTrie.ts:70](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) |
`key` | Buffer |
`cb` | ProveCallback |

**Returns:** *void*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proofNodes`: Buffer[], `cb`: BufferCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[verifyProof](_basetrie_.trie.md#static-verifyproof)*

*Defined in [baseTrie.ts:85](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proofNodes` | Buffer[] |
`cb` | BufferCallback |

**Returns:** *void*
