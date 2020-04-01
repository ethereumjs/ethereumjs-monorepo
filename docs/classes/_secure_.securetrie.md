[merkle-patricia-tree](../README.md) › ["secure"](../modules/_secure_.md) › [SecureTrie](_secure_.securetrie.md)

# Class: SecureTrie

You can create a secure Trie where the keys are automatically hashed
using **keccak256** by using `require('merkle-patricia-tree/secure')`.
It has the same methods and constructor as `Trie`.

**`class`** SecureTrie

**`extends`** Trie

## Hierarchy

  ↳ [CheckpointTrie](_checkpointtrie_.checkpointtrie.md)

  ↳ **SecureTrie**

## Index

### Constructors

* [constructor](_secure_.securetrie.md#constructor)

### Properties

* [EMPTY_TRIE_ROOT](_secure_.securetrie.md#empty_trie_root)
* [_checkpoints](_secure_.securetrie.md#_checkpoints)
* [_mainDB](_secure_.securetrie.md#_maindb)
* [_scratch](_secure_.securetrie.md#_scratch)
* [db](_secure_.securetrie.md#db)

### Accessors

* [isCheckpoint](_secure_.securetrie.md#ischeckpoint)
* [root](_secure_.securetrie.md#root)

### Methods

* [_createInitialNode](_secure_.securetrie.md#_createinitialnode)
* [_createScratchReadStream](_secure_.securetrie.md#private-_createscratchreadstream)
* [_deleteNode](_secure_.securetrie.md#_deletenode)
* [_enterCpMode](_secure_.securetrie.md#private-_entercpmode)
* [_exitCpMode](_secure_.securetrie.md#private-_exitcpmode)
* [_findDbNodes](_secure_.securetrie.md#_finddbnodes)
* [_findValueNodes](_secure_.securetrie.md#_findvaluenodes)
* [_formatNode](_secure_.securetrie.md#_formatnode)
* [_lookupNode](_secure_.securetrie.md#_lookupnode)
* [_putNode](_secure_.securetrie.md#_putnode)
* [_saveStack](_secure_.securetrie.md#private-_savestack)
* [_updateNode](_secure_.securetrie.md#private-_updatenode)
* [_walkTrie](_secure_.securetrie.md#_walktrie)
* [batch](_secure_.securetrie.md#batch)
* [checkRoot](_secure_.securetrie.md#checkroot)
* [checkpoint](_secure_.securetrie.md#checkpoint)
* [commit](_secure_.securetrie.md#commit)
* [copy](_secure_.securetrie.md#copy)
* [createReadStream](_secure_.securetrie.md#createreadstream)
* [del](_secure_.securetrie.md#del)
* [delRaw](_secure_.securetrie.md#delraw)
* [findPath](_secure_.securetrie.md#findpath)
* [get](_secure_.securetrie.md#get)
* [getRaw](_secure_.securetrie.md#getraw)
* [put](_secure_.securetrie.md#put)
* [putRaw](_secure_.securetrie.md#putraw)
* [revert](_secure_.securetrie.md#revert)
* [setRoot](_secure_.securetrie.md#setroot)
* [fromProof](_secure_.securetrie.md#static-fromproof)
* [prove](_secure_.securetrie.md#static-prove)
* [verifyProof](_secure_.securetrie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new SecureTrie**(...`args`: any): *[SecureTrie](_secure_.securetrie.md)*

*Overrides [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[constructor](_checkpointtrie_.checkpointtrie.md#constructor)*

*Defined in [secure.ts:13](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any |

**Returns:** *[SecureTrie](_secure_.securetrie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[EMPTY_TRIE_ROOT](_basetrie_.trie.md#empty_trie_root)*

*Defined in [baseTrie.ts:35](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L35)*

___

###  _checkpoints

• **_checkpoints**: *Buffer[]*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_checkpoints](_checkpointtrie_.checkpointtrie.md#_checkpoints)*

*Defined in [checkpointTrie.ts:14](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L14)*

___

###  _mainDB

• **_mainDB**: *DB*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_mainDB](_checkpointtrie_.checkpointtrie.md#_maindb)*

*Defined in [checkpointTrie.ts:12](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L12)*

___

###  _scratch

• **_scratch**: *ScratchDB | null*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_scratch](_checkpointtrie_.checkpointtrie.md#_scratch)*

*Defined in [checkpointTrie.ts:13](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L13)*

___

###  db

• **db**: *DB*

*Inherited from [Trie](_basetrie_.trie.md).[db](_basetrie_.trie.md#db)*

*Defined in [baseTrie.ts:36](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L36)*

## Accessors

###  isCheckpoint

• **get isCheckpoint**(): *boolean*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[isCheckpoint](_checkpointtrie_.checkpointtrie.md#ischeckpoint)*

*Defined in [checkpointTrie.ts:29](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L29)*

Is the trie during a checkpoint phase?

**Returns:** *boolean*

___

###  root

• **get root**(): *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:105](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L105)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[_createInitialNode](_basetrie_.trie.md#_createinitialnode)*

*Defined in [baseTrie.ts:737](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L737)*

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

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_createScratchReadStream](_checkpointtrie_.checkpointtrie.md#private-_createscratchreadstream)*

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

*Defined in [baseTrie.ts:619](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L619)*

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

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_enterCpMode](_checkpointtrie_.checkpointtrie.md#private-_entercpmode)*

*Defined in [checkpointTrie.ts:125](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L125)*

Enter into checkpoint mode.

**Returns:** *void*

___

### `Private` _exitCpMode

▸ **_exitCpMode**(`commitState`: boolean, `cb`: Function): *void*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_exitCpMode](_checkpointtrie_.checkpointtrie.md#private-_exitcpmode)*

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

*Defined in [baseTrie.ts:348](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L348)*

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

*Defined in [baseTrie.ts:322](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L322)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | Function |
`cb` | Function |

**Returns:** *void*

___

###  _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_formatNode](_checkpointtrie_.checkpointtrie.md#_formatnode)*

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

*Defined in [baseTrie.ts:232](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L232)*

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

*Defined in [baseTrie.ts:249](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L249)*

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

*Defined in [baseTrie.ts:590](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L590)*

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

*Defined in [baseTrie.ts:372](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L372)*

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

*Defined in [baseTrie.ts:475](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L475)*

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

*Defined in [baseTrie.ts:801](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L801)*

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

*Defined in [baseTrie.ts:821](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L821)*

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

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[checkpoint](_checkpointtrie_.checkpointtrie.md#checkpoint)*

*Defined in [checkpointTrie.ts:39](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L39)*

Creates a checkpoint that can later be reverted to or committed.
After this is called, no changes to the trie will be permanently saved
until `commit` is called. Calling `putRaw` overrides the checkpointing
mechanism and would directly write to db.

**Returns:** *void*

___

###  commit

▸ **commit**(`cb`: Function): *void*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[commit](_checkpointtrie_.checkpointtrie.md#commit)*

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

▸ **copy**(): *[SecureTrie](_secure_.securetrie.md)*

*Overrides [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[copy](_checkpointtrie_.checkpointtrie.md#copy)*

*Defined in [secure.ts:28](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L28)*

**Returns:** *[SecureTrie](_secure_.securetrie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Inherited from [Trie](_basetrie_.trie.md).[createReadStream](_basetrie_.trie.md#createreadstream)*

*Defined in [baseTrie.ts:774](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L774)*

The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer, `cb`: ErrorCallback): *void*

*Overrides [Trie](_basetrie_.trie.md).[del](_basetrie_.trie.md#del)*

*Defined in [secure.ts:52](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L52)*

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

*Defined in [baseTrie.ts:227](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L227)*

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

*Defined in [baseTrie.ts:268](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L268)*

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

*Overrides [Trie](_basetrie_.trie.md).[get](_basetrie_.trie.md#get)*

*Defined in [secure.ts:34](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`cb` | BufferCallback |

**Returns:** *void*

___

###  getRaw

▸ **getRaw**(`key`: Buffer, `cb`: BufferCallback): *void*

*Inherited from [Trie](_basetrie_.trie.md).[getRaw](_basetrie_.trie.md#getraw)*

*Defined in [baseTrie.ts:210](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L210)*

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

▸ **put**(`key`: Buffer, `val`: Buffer, `cb`: ErrorCallback): *void*

*Overrides [Trie](_basetrie_.trie.md).[put](_basetrie_.trie.md#put)*

*Defined in [secure.ts:43](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L43)*

For a falsey value, use the original key
to avoid double hashing the key.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`val` | Buffer |
`cb` | ErrorCallback |

**Returns:** *void*

___

###  putRaw

▸ **putRaw**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[putRaw](_checkpointtrie_.checkpointtrie.md#putraw)*

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

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[revert](_checkpointtrie_.checkpointtrie.md#revert)*

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

*Defined in [baseTrie.ts:109](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `proofTrie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Inherited from [Trie](_basetrie_.trie.md).[fromProof](_basetrie_.trie.md#static-fromproof)*

*Defined in [baseTrie.ts:50](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`proofTrie?` | [Trie](_basetrie_.trie.md) |

**Returns:** *Promise‹[Trie](_basetrie_.trie.md)›*

___

### `Static` prove

▸ **prove**(`trie`: [SecureTrie](_secure_.securetrie.md), `key`: Buffer): *Promise‹Buffer[]›*

*Overrides [Trie](_basetrie_.trie.md).[prove](_basetrie_.trie.md#static-prove)*

*Defined in [secure.ts:18](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [SecureTrie](_secure_.securetrie.md) |
`key` | Buffer |

**Returns:** *Promise‹Buffer[]›*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proof`: Buffer[]): *Promise‹Buffer | null›*

*Overrides [Trie](_basetrie_.trie.md).[verifyProof](_basetrie_.trie.md#static-verifyproof)*

*Defined in [secure.ts:23](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proof` | Buffer[] |

**Returns:** *Promise‹Buffer | null›*
