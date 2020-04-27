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
* [_formatNode](_checkpointtrie_.checkpointtrie.md#private-_formatnode)
* [_lookupNode](_checkpointtrie_.checkpointtrie.md#_lookupnode)
* [_putNode](_checkpointtrie_.checkpointtrie.md#_putnode)
* [_saveStack](_checkpointtrie_.checkpointtrie.md#private-_savestack)
* [_updateNode](_checkpointtrie_.checkpointtrie.md#private-_updatenode)
* [_walkTrie](_checkpointtrie_.checkpointtrie.md#private-_walktrie)
* [batch](_checkpointtrie_.checkpointtrie.md#batch)
* [checkRoot](_checkpointtrie_.checkpointtrie.md#checkroot)
* [checkpoint](_checkpointtrie_.checkpointtrie.md#checkpoint)
* [commit](_checkpointtrie_.checkpointtrie.md#commit)
* [copy](_checkpointtrie_.checkpointtrie.md#copy)
* [createReadStream](_checkpointtrie_.checkpointtrie.md#createreadstream)
* [del](_checkpointtrie_.checkpointtrie.md#del)
* [findPath](_checkpointtrie_.checkpointtrie.md#findpath)
* [get](_checkpointtrie_.checkpointtrie.md#get)
* [put](_checkpointtrie_.checkpointtrie.md#put)
* [revert](_checkpointtrie_.checkpointtrie.md#revert)
* [setRoot](_checkpointtrie_.checkpointtrie.md#setroot)
* [fromProof](_checkpointtrie_.checkpointtrie.md#static-fromproof)
* [prove](_checkpointtrie_.checkpointtrie.md#static-prove)
* [verifyProof](_checkpointtrie_.checkpointtrie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new CheckpointTrie**(...`args`: any): *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

*Overrides [Trie](_basetrie_.trie.md).[constructor](_basetrie_.trie.md#constructor)*

*Defined in [checkpointTrie.ts:11](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any |

**Returns:** *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[EMPTY_TRIE_ROOT](_basetrie_.trie.md#empty_trie_root)*

*Defined in [baseTrie.ts:40](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L40)*

___

###  _checkpoints

• **_checkpoints**: *Buffer[]*

*Defined in [checkpointTrie.ts:11](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L11)*

___

###  _mainDB

• **_mainDB**: *DB*

*Defined in [checkpointTrie.ts:9](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L9)*

___

###  _scratch

• **_scratch**: *ScratchDB | null*

*Defined in [checkpointTrie.ts:10](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L10)*

___

###  db

• **db**: *DB*

*Inherited from [Trie](_basetrie_.trie.md).[db](_basetrie_.trie.md#db)*

*Defined in [baseTrie.ts:41](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L41)*

## Accessors

###  isCheckpoint

• **get isCheckpoint**(): *boolean*

*Defined in [checkpointTrie.ts:26](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L26)*

Is the trie during a checkpoint phase?

**Returns:** *boolean*

___

###  root

• **get root**(): *Buffer*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L101)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:97](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_createInitialNode](_basetrie_.trie.md#_createinitialnode)*

*Defined in [baseTrie.ts:659](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L659)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

### `Private` _createScratchReadStream

▸ **_createScratchReadStream**(`scratchDb?`: ScratchDB): *ScratchReadStream‹›*

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

*Defined in [baseTrie.ts:537](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L537)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

### `Private` _enterCpMode

▸ **_enterCpMode**(): *void*

*Defined in [checkpointTrie.ts:106](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L106)*

Enter into checkpoint mode.

**Returns:** *void*

___

### `Private` _exitCpMode

▸ **_exitCpMode**(`commitState`: boolean): *Promise‹void›*

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

*Defined in [baseTrie.ts:280](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L280)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _findValueNodes

▸ **_findValueNodes**(`onFound`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_findValueNodes](_basetrie_.trie.md#_findvaluenodes)*

*Defined in [baseTrie.ts:258](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L258)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

### `Private` _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

*Overrides [Trie](_basetrie_.trie.md).[_formatNode](_basetrie_.trie.md#private-_formatnode)*

*Defined in [checkpointTrie.ts:157](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L157)*

Formats node to be saved by levelup.batch.

**`method`** _formatNode

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | TrieNode | - | the node to format |
`topLevel` | boolean | - | if the node is at the top level |
`opStack` | BatchDBOp[] | - | the opStack to push the node's data |
`remove` | boolean | false | whether to remove the node (only used for CheckpointTrie) |

**Returns:** *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

- the node's hash used as the key or the rawNode

___

###  _lookupNode

▸ **_lookupNode**(`node`: Buffer | Buffer[]): *Promise‹TrieNode | null›*

*Inherited from [Trie](_basetrie_.trie.md).[_lookupNode](_basetrie_.trie.md#_lookupnode)*

*Defined in [baseTrie.ts:173](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |

**Returns:** *Promise‹TrieNode | null›*

___

###  _putNode

▸ **_putNode**(`node`: TrieNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_putNode](_basetrie_.trie.md#_putnode)*

*Defined in [baseTrie.ts:191](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TrieNode |

**Returns:** *Promise‹void›*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: Nibbles, `stack`: TrieNode[], `opStack`: BatchDBOp[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_saveStack](_basetrie_.trie.md#private-_savestack)*

*Defined in [baseTrie.ts:508](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L508)*

saves a stack

**`method`** _saveStack

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Nibbles | the key. Should follow the stack |
`stack` | TrieNode[] | a stack of nodes to the value given by the key |
`opStack` | BatchDBOp[] | a stack of levelup operations to commit at the end of this funciton |

**Returns:** *Promise‹void›*

___

### `Private` _updateNode

▸ **_updateNode**(`k`: Buffer, `value`: Buffer, `keyRemainder`: Nibbles, `stack`: TrieNode[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_updateNode](_basetrie_.trie.md#private-_updatenode)*

*Defined in [baseTrie.ts:300](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L300)*

Updates a node

**`method`** _updateNode

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`value` | Buffer |
`keyRemainder` | Nibbles |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

### `Private` _walkTrie

▸ **_walkTrie**(`root`: Buffer, `onNode`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_walkTrie](_basetrie_.trie.md#private-_walktrie)*

*Defined in [baseTrie.ts:407](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L407)*

Walks a trie until finished.

**`method`** _walkTrie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`root` | Buffer | - |
`onNode` | FoundNode | callback to call when a node is found |

**Returns:** *Promise‹void›*

- returns when finished walking trie

___

###  batch

▸ **batch**(`ops`: BatchDBOp[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[batch](_basetrie_.trie.md#batch)*

*Defined in [baseTrie.ts:729](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L729)*

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

*Defined in [baseTrie.ts:745](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L745)*

Checks if a given root exists.

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *void*

*Defined in [checkpointTrie.ts:36](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L36)*

Creates a checkpoint that can later be reverted to or committed.
After this is called, no changes to the trie will be permanently saved
until `commit` is called. Calling `putRaw` overrides the checkpointing
mechanism and would directly write to db.

**Returns:** *void*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Defined in [checkpointTrie.ts:53](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L53)*

Commits a checkpoint to disk, if current checkpoint is not nested. If
nested, only sets the parent checkpoint as current checkpoint.

**`method`** commit

**`throws`** If not during a checkpoint phase

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(`includeCheckpoints`: boolean): *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

*Overrides [Trie](_basetrie_.trie.md).[copy](_basetrie_.trie.md#copy)*

*Defined in [checkpointTrie.ts:91](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L91)*

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

*Defined in [baseTrie.ts:702](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L702)*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[del](_basetrie_.trie.md#del)*

*Defined in [baseTrie.ts:163](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L163)*

deletes a value given a `key`

**`method`** del

**`memberof`** Trie

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |

**Returns:** *Promise‹void›*

___

###  findPath

▸ **findPath**(`key`: Buffer): *Promise‹Path›*

*Inherited from [Trie](_basetrie_.trie.md).[findPath](_basetrie_.trie.md#findpath)*

*Defined in [baseTrie.ts:205](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L205)*

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

*Inherited from [Trie](_basetrie_.trie.md).[get](_basetrie_.trie.md#get)*

*Defined in [baseTrie.ts:120](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L120)*

Gets a value given a `key`

**`method`** get

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the key to search for |

**Returns:** *Promise‹Buffer | null›*

- Returns a promise that resolves to `Buffer` if a value was found or `null` if no value was found.

___

###  put

▸ **put**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[put](_basetrie_.trie.md#put)*

*Defined in [baseTrie.ts:137](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L137)*

Stores a given `value` at the given `key`

**`method`** put

**`memberof`** Trie

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Defined in [checkpointTrie.ts:73](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L73)*

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

**Returns:** *Promise‹void›*

___

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[setRoot](_basetrie_.trie.md#setroot)*

*Defined in [baseTrie.ts:105](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `proofTrie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Inherited from [Trie](_basetrie_.trie.md).[fromProof](_basetrie_.trie.md#static-fromproof)*

*Defined in [baseTrie.ts:55](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`proofTrie?` | [Trie](_basetrie_.trie.md) |

**Returns:** *Promise‹[Trie](_basetrie_.trie.md)›*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹Buffer[]›*

*Inherited from [Trie](_basetrie_.trie.md).[prove](_basetrie_.trie.md#static-prove)*

*Defined in [baseTrie.ts:75](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) |
`key` | Buffer |

**Returns:** *Promise‹Buffer[]›*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proofNodes`: Buffer[]): *Promise‹Buffer | null›*

*Inherited from [Trie](_basetrie_.trie.md).[verifyProof](_basetrie_.trie.md#static-verifyproof)*

*Defined in [baseTrie.ts:83](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L83)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proofNodes` | Buffer[] |

**Returns:** *Promise‹Buffer | null›*
