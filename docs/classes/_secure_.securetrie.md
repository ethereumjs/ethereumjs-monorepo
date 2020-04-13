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
* [findPath](_secure_.securetrie.md#findpath)
* [get](_secure_.securetrie.md#get)
* [put](_secure_.securetrie.md#put)
* [revert](_secure_.securetrie.md#revert)
* [setRoot](_secure_.securetrie.md#setroot)
* [fromProof](_secure_.securetrie.md#static-fromproof)
* [prove](_secure_.securetrie.md#static-prove)
* [verifyProof](_secure_.securetrie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new SecureTrie**(...`args`: any): *[SecureTrie](_secure_.securetrie.md)*

*Overrides [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[constructor](_checkpointtrie_.checkpointtrie.md#constructor)*

*Defined in [secure.ts:12](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any |

**Returns:** *[SecureTrie](_secure_.securetrie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[EMPTY_TRIE_ROOT](_basetrie_.trie.md#empty_trie_root)*

*Defined in [baseTrie.ts:39](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L39)*

___

###  _checkpoints

• **_checkpoints**: *Buffer[]*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_checkpoints](_checkpointtrie_.checkpointtrie.md#_checkpoints)*

*Defined in [checkpointTrie.ts:11](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L11)*

___

###  _mainDB

• **_mainDB**: *DB*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_mainDB](_checkpointtrie_.checkpointtrie.md#_maindb)*

*Defined in [checkpointTrie.ts:9](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L9)*

___

###  _scratch

• **_scratch**: *ScratchDB | null*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_scratch](_checkpointtrie_.checkpointtrie.md#_scratch)*

*Defined in [checkpointTrie.ts:10](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L10)*

___

###  db

• **db**: *DB*

*Inherited from [Trie](_basetrie_.trie.md).[db](_basetrie_.trie.md#db)*

*Defined in [baseTrie.ts:40](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L40)*

## Accessors

###  isCheckpoint

• **get isCheckpoint**(): *boolean*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[isCheckpoint](_checkpointtrie_.checkpointtrie.md#ischeckpoint)*

*Defined in [checkpointTrie.ts:26](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L26)*

Is the trie during a checkpoint phase?

**Returns:** *boolean*

___

###  root

• **get root**(): *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:100](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L100)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:96](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_createInitialNode](_basetrie_.trie.md#_createinitialnode)*

*Defined in [baseTrie.ts:651](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L651)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

### `Private` _createScratchReadStream

▸ **_createScratchReadStream**(`scratchDb?`: ScratchDB): *ScratchReadStream‹›*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_createScratchReadStream](_checkpointtrie_.checkpointtrie.md#private-_createscratchreadstream)*

*Defined in [checkpointTrie.ts:137](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L137)*

Returns a `ScratchReadStream` based on the state updates
since checkpoint.

**`method`** createScratchReadStream

**Parameters:**

Name | Type |
------ | ------ |
`scratchDb?` | ScratchDB |

**Returns:** *ScratchReadStream‹›*

___

###  _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_deleteNode](_basetrie_.trie.md#_deletenode)*

*Defined in [baseTrie.ts:529](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L529)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

### `Private` _enterCpMode

▸ **_enterCpMode**(): *void*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_enterCpMode](_checkpointtrie_.checkpointtrie.md#private-_entercpmode)*

*Defined in [checkpointTrie.ts:106](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L106)*

Enter into checkpoint mode.

**Returns:** *void*

___

### `Private` _exitCpMode

▸ **_exitCpMode**(`commitState`: boolean): *Promise‹void›*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_exitCpMode](_checkpointtrie_.checkpointtrie.md#private-_exitcpmode)*

*Defined in [checkpointTrie.ts:115](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L115)*

Exit from checkpoint mode.

**Parameters:**

Name | Type |
------ | ------ |
`commitState` | boolean |

**Returns:** *Promise‹void›*

___

###  _findDbNodes

▸ **_findDbNodes**(`onFound`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_findDbNodes](_basetrie_.trie.md#_finddbnodes)*

*Defined in [baseTrie.ts:279](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L279)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _findValueNodes

▸ **_findValueNodes**(`onFound`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_findValueNodes](_basetrie_.trie.md#_findvaluenodes)*

*Defined in [baseTrie.ts:257](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L257)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[_formatNode](_checkpointtrie_.checkpointtrie.md#_formatnode)*

*Overrides [Trie](_basetrie_.trie.md).[_formatNode](_basetrie_.trie.md#_formatnode)*

*Defined in [checkpointTrie.ts:149](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L149)*

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

▸ **_lookupNode**(`node`: Buffer | Buffer[]): *Promise‹TrieNode | null›*

*Inherited from [Trie](_basetrie_.trie.md).[_lookupNode](_basetrie_.trie.md#_lookupnode)*

*Defined in [baseTrie.ts:172](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L172)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |

**Returns:** *Promise‹TrieNode | null›*

___

###  _putNode

▸ **_putNode**(`node`: TrieNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_putNode](_basetrie_.trie.md#_putnode)*

*Defined in [baseTrie.ts:190](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TrieNode |

**Returns:** *Promise‹void›*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: number[], `stack`: TrieNode[], `opStack`: BatchDBOp[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_saveStack](_basetrie_.trie.md#private-_savestack)*

*Defined in [baseTrie.ts:500](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L500)*

saves a stack

**`method`** _saveStack

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | number[] | the key. Should follow the stack |
`stack` | TrieNode[] | a stack of nodes to the value given by the key |
`opStack` | BatchDBOp[] | a stack of levelup operations to commit at the end of this funciton |

**Returns:** *Promise‹void›*

___

### `Private` _updateNode

▸ **_updateNode**(`k`: Buffer, `value`: Buffer, `keyRemainder`: number[], `stack`: TrieNode[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_updateNode](_basetrie_.trie.md#private-_updatenode)*

*Defined in [baseTrie.ts:299](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L299)*

Updates a node

**`method`** _updateNode

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`value` | Buffer |
`keyRemainder` | number[] |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

###  _walkTrie

▸ **_walkTrie**(`root`: Buffer, `onNode`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_walkTrie](_basetrie_.trie.md#_walktrie)*

*Defined in [baseTrie.ts:399](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L399)*

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |
`onNode` | FoundNode |

**Returns:** *Promise‹void›*

___

###  batch

▸ **batch**(`ops`: BatchDBOp[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[batch](_basetrie_.trie.md#batch)*

*Defined in [baseTrie.ts:713](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L713)*

The given hash of operations (key additions or deletions) are executed on the DB

**`method`** batch

**`memberof`** Trie

**`example`** 
const ops = [
   { type: 'del', key: Buffer.from('father') }
 , { type: 'put', key: Buffer.from('name'), value: Buffer.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Buffer.from('dob'), value: Buffer.from('16 February 1941') }
 , { type: 'put', key: Buffer.from('spouse'), value: Buffer.from('Kim Young-sook') }
 , { type: 'put', key: Buffer.from('occupation'), value: Buffer.from('Clown') }
]
await trie.batch(ops)

**Parameters:**

Name | Type |
------ | ------ |
`ops` | BatchDBOp[] |

**Returns:** *Promise‹void›*

___

###  checkRoot

▸ **checkRoot**(`root`: Buffer): *Promise‹boolean›*

*Inherited from [Trie](_basetrie_.trie.md).[checkRoot](_basetrie_.trie.md#checkroot)*

*Defined in [baseTrie.ts:729](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L729)*

Checks if a given root exists.

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *void*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[checkpoint](_checkpointtrie_.checkpointtrie.md#checkpoint)*

*Defined in [checkpointTrie.ts:36](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L36)*

Creates a checkpoint that can later be reverted to or committed.
After this is called, no changes to the trie will be permanently saved
until `commit` is called. Calling `putRaw` overrides the checkpointing
mechanism and would directly write to db.

**Returns:** *void*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[commit](_checkpointtrie_.checkpointtrie.md#commit)*

*Defined in [checkpointTrie.ts:53](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L53)*

Commits a checkpoint to disk, if current checkpoint is not nested. If
nested, only sets the parent checkpoint as current checkpoint.

**`method`** commit

**`throws`** If not during a checkpoint phase

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[SecureTrie](_secure_.securetrie.md)*

*Overrides [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[copy](_checkpointtrie_.checkpointtrie.md#copy)*

*Defined in [secure.ts:27](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L27)*

**Returns:** *[SecureTrie](_secure_.securetrie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Inherited from [Trie](_basetrie_.trie.md).[createReadStream](_basetrie_.trie.md#createreadstream)*

*Defined in [baseTrie.ts:686](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L686)*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

*Overrides [Trie](_basetrie_.trie.md).[del](_basetrie_.trie.md#del)*

*Defined in [secure.ts:52](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |

**Returns:** *Promise‹void›*

___

###  findPath

▸ **findPath**(`key`: Buffer): *Promise‹Path›*

*Inherited from [Trie](_basetrie_.trie.md).[findPath](_basetrie_.trie.md#findpath)*

*Defined in [baseTrie.ts:204](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L204)*

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closet node.

**`method`** findPath

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the search key |

**Returns:** *Promise‹Path›*

___

###  get

▸ **get**(`key`: Buffer): *Promise‹Buffer | null›*

*Overrides [Trie](_basetrie_.trie.md).[get](_basetrie_.trie.md#get)*

*Defined in [secure.ts:33](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |

**Returns:** *Promise‹Buffer | null›*

___

###  put

▸ **put**(`key`: Buffer, `val`: Buffer): *Promise‹void›*

*Overrides [Trie](_basetrie_.trie.md).[put](_basetrie_.trie.md#put)*

*Defined in [secure.ts:43](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L43)*

For a falsey value, use the original key
to avoid double hashing the key.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`val` | Buffer |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Inherited from [CheckpointTrie](_checkpointtrie_.checkpointtrie.md).[revert](_checkpointtrie_.checkpointtrie.md#revert)*

*Defined in [checkpointTrie.ts:73](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L73)*

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

**Returns:** *Promise‹void›*

___

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[setRoot](_basetrie_.trie.md#setroot)*

*Defined in [baseTrie.ts:104](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L104)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `proofTrie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Inherited from [Trie](_basetrie_.trie.md).[fromProof](_basetrie_.trie.md#static-fromproof)*

*Defined in [baseTrie.ts:54](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L54)*

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

*Defined in [secure.ts:17](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L17)*

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

*Defined in [secure.ts:22](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/secure.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proof` | Buffer[] |

**Returns:** *Promise‹Buffer | null›*
