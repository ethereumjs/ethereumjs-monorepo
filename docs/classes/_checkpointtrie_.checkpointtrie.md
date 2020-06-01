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

* [_createInitialNode](_checkpointtrie_.checkpointtrie.md#private-_createinitialnode)
* [_createScratchReadStream](_checkpointtrie_.checkpointtrie.md#private-_createscratchreadstream)
* [_deleteNode](_checkpointtrie_.checkpointtrie.md#private-_deletenode)
* [_enterCpMode](_checkpointtrie_.checkpointtrie.md#private-_entercpmode)
* [_exitCpMode](_checkpointtrie_.checkpointtrie.md#private-_exitcpmode)
* [_findDbNodes](_checkpointtrie_.checkpointtrie.md#_finddbnodes)
* [_findValueNodes](_checkpointtrie_.checkpointtrie.md#private-_findvaluenodes)
* [_formatNode](_checkpointtrie_.checkpointtrie.md#private-_formatnode)
* [_lookupNode](_checkpointtrie_.checkpointtrie.md#private-_lookupnode)
* [_putNode](_checkpointtrie_.checkpointtrie.md#private-_putnode)
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
* [createProof](_checkpointtrie_.checkpointtrie.md#static-createproof)
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

*Defined in [baseTrie.ts:42](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L42)*

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

*Defined in [baseTrie.ts:43](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L43)*

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

*Defined in [baseTrie.ts:127](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L127)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[root](_basetrie_.trie.md#root)*

*Defined in [baseTrie.ts:123](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

### `Private` _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_createInitialNode](_basetrie_.trie.md#private-_createinitialnode)*

*Defined in [baseTrie.ts:683](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L683)*

Creates the initial node from an empty tree.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

### `Private` _createScratchReadStream

▸ **_createScratchReadStream**(`scratchDb?`: ScratchDB): *ScratchReadStream‹›*

*Defined in [checkpointTrie.ts:130](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L130)*

Returns a `ScratchReadStream` based on the state updates
since checkpoint.

**Parameters:**

Name | Type |
------ | ------ |
`scratchDb?` | ScratchDB |

**Returns:** *ScratchReadStream‹›*

___

### `Private` _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_deleteNode](_basetrie_.trie.md#private-_deletenode)*

*Defined in [baseTrie.ts:558](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L558)*

Deletes a node.

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

### `Private` _enterCpMode

▸ **_enterCpMode**(): *void*

*Defined in [checkpointTrie.ts:100](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L100)*

Enter into checkpoint mode.

**Returns:** *void*

___

### `Private` _exitCpMode

▸ **_exitCpMode**(`commitState`: boolean): *Promise‹void›*

*Defined in [checkpointTrie.ts:109](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L109)*

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

*Defined in [baseTrie.ts:302](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L302)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

### `Private` _findValueNodes

▸ **_findValueNodes**(`onFound`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_findValueNodes](_basetrie_.trie.md#private-_findvaluenodes)*

*Defined in [baseTrie.ts:280](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L280)*

Finds all nodes that store k,v values.

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

### `Private` _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

*Overrides [Trie](_basetrie_.trie.md).[_formatNode](_basetrie_.trie.md#private-_formatnode)*

*Defined in [checkpointTrie.ts:149](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L149)*

Formats node to be saved by `levelup.batch`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | TrieNode | - | the node to format. |
`topLevel` | boolean | - | if the node is at the top level. |
`opStack` | BatchDBOp[] | - | the opStack to push the node's data. |
`remove` | boolean | false | whether to remove the node (only used for CheckpointTrie). |

**Returns:** *Buffer‹› | null | Buffer‹› | Buffer‹›[][]*

The node's hash used as the key or the rawNode.

___

### `Private` _lookupNode

▸ **_lookupNode**(`node`: Buffer | Buffer[]): *Promise‹TrieNode | null›*

*Inherited from [Trie](_basetrie_.trie.md).[_lookupNode](_basetrie_.trie.md#private-_lookupnode)*

*Defined in [baseTrie.ts:194](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L194)*

Retrieves a node from db by hash.

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |

**Returns:** *Promise‹TrieNode | null›*

___

### `Private` _putNode

▸ **_putNode**(`node`: TrieNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_putNode](_basetrie_.trie.md#private-_putnode)*

*Defined in [baseTrie.ts:215](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L215)*

Writes a single node to db.

**Parameters:**

Name | Type |
------ | ------ |
`node` | TrieNode |

**Returns:** *Promise‹void›*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: Nibbles, `stack`: TrieNode[], `opStack`: BatchDBOp[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_saveStack](_basetrie_.trie.md#private-_savestack)*

*Defined in [baseTrie.ts:525](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L525)*

Saves a stack.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Nibbles | the key. Should follow the stack |
`stack` | TrieNode[] | a stack of nodes to the value given by the key |
`opStack` | BatchDBOp[] | a stack of levelup operations to commit at the end of this funciton  |

**Returns:** *Promise‹void›*

___

### `Private` _updateNode

▸ **_updateNode**(`k`: Buffer, `value`: Buffer, `keyRemainder`: Nibbles, `stack`: TrieNode[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_updateNode](_basetrie_.trie.md#private-_updatenode)*

*Defined in [baseTrie.ts:320](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L320)*

Updates a node.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`k` | Buffer | - |
`value` | Buffer | - |
`keyRemainder` | Nibbles | - |
`stack` | TrieNode[] |   |

**Returns:** *Promise‹void›*

___

### `Private` _walkTrie

▸ **_walkTrie**(`root`: Buffer, `onNode`: FoundNode): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[_walkTrie](_basetrie_.trie.md#private-_walktrie)*

*Defined in [baseTrie.ts:426](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L426)*

Walks a trie until finished.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`root` | Buffer | - |
`onNode` | FoundNode | callback to call when a node is found |

**Returns:** *Promise‹void›*

Returns when finished walking trie.

___

###  batch

▸ **batch**(`ops`: BatchDBOp[]): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[batch](_basetrie_.trie.md#batch)*

*Defined in [baseTrie.ts:748](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L748)*

The given hash of operations (key additions or deletions) are executed on the DB

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

Name | Type | Description |
------ | ------ | ------ |
`ops` | BatchDBOp[] |   |

**Returns:** *Promise‹void›*

___

###  checkRoot

▸ **checkRoot**(`root`: Buffer): *Promise‹boolean›*

*Inherited from [Trie](_basetrie_.trie.md).[checkRoot](_basetrie_.trie.md#checkroot)*

*Defined in [baseTrie.ts:764](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L764)*

Checks if a given root exists.

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *void*

*Defined in [checkpointTrie.ts:35](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L35)*

Creates a checkpoint that can later be reverted to or committed.
After this is called, no changes to the trie will be permanently saved until `commit` is called.
To override the checkpointing mechanism use `_maindb.put` to write directly write to db.

**Returns:** *void*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Defined in [checkpointTrie.ts:50](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L50)*

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

**`throws`** If not during a checkpoint phase

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(`includeCheckpoints`: boolean): *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

*Overrides [Trie](_basetrie_.trie.md).[copy](_basetrie_.trie.md#copy)*

*Defined in [checkpointTrie.ts:85](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L85)*

Returns a copy of the underlying trie with the interface of CheckpointTrie.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeCheckpoints` | boolean | true | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.  |

**Returns:** *[CheckpointTrie](_checkpointtrie_.checkpointtrie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Inherited from [Trie](_basetrie_.trie.md).[createReadStream](_basetrie_.trie.md#createreadstream)*

*Defined in [baseTrie.ts:723](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L723)*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[del](_basetrie_.trie.md#del)*

*Defined in [baseTrie.ts:181](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L181)*

Deletes a value given a `key`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer |   |

**Returns:** *Promise‹void›*

___

###  findPath

▸ **findPath**(`key`: Buffer): *Promise‹Path›*

*Inherited from [Trie](_basetrie_.trie.md).[findPath](_basetrie_.trie.md#findpath)*

*Defined in [baseTrie.ts:226](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L226)*

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closet node.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the search key  |

**Returns:** *Promise‹Path›*

___

###  get

▸ **get**(`key`: Buffer): *Promise‹Buffer | null›*

*Inherited from [Trie](_basetrie_.trie.md).[get](_basetrie_.trie.md#get)*

*Defined in [baseTrie.ts:144](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L144)*

Gets a value given a `key`

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the key to search for |

**Returns:** *Promise‹Buffer | null›*

A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.

___

###  put

▸ **put**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Inherited from [Trie](_basetrie_.trie.md).[put](_basetrie_.trie.md#put)*

*Defined in [baseTrie.ts:158](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L158)*

Stores a given `value` at the given `key`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | - |
`value` | Buffer |   |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Defined in [checkpointTrie.ts:70](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L70)*

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

**Returns:** *Promise‹void›*

___

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Inherited from [Trie](_basetrie_.trie.md).[setRoot](_basetrie_.trie.md#setroot)*

*Defined in [baseTrie.ts:131](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` createProof

▸ **createProof**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹[Proof](../modules/_basetrie_.md#proof)›*

*Inherited from [Trie](_basetrie_.trie.md).[createProof](_basetrie_.trie.md#static-createproof)*

*Defined in [baseTrie.ts:97](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L97)*

Creates a proof from a trie and key that can be verified using [Trie.verifyProof](_basetrie_.trie.md#static-verifyproof).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) | - |
`key` | Buffer |   |

**Returns:** *Promise‹[Proof](../modules/_basetrie_.md#proof)›*

___

### `Static` fromProof

▸ **fromProof**(`proof`: [Proof](../modules/_basetrie_.md#proof), `trie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Inherited from [Trie](_basetrie_.trie.md).[fromProof](_basetrie_.trie.md#static-fromproof)*

*Defined in [baseTrie.ts:62](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L62)*

Saves the nodes from a proof into the trie. If no trie is provided a new one wil be instantiated.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proof` | [Proof](../modules/_basetrie_.md#proof) | - |
`trie?` | [Trie](_basetrie_.trie.md) |   |

**Returns:** *Promise‹[Trie](_basetrie_.trie.md)›*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹[Proof](../modules/_basetrie_.md#proof)›*

*Inherited from [Trie](_basetrie_.trie.md).[prove](_basetrie_.trie.md#static-prove)*

*Defined in [baseTrie.ts:88](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L88)*

prove has been renamed to [Trie.createProof](_basetrie_.trie.md#static-createproof).

**`deprecated`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) | - |
`key` | Buffer |   |

**Returns:** *Promise‹[Proof](../modules/_basetrie_.md#proof)›*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proof`: [Proof](../modules/_basetrie_.md#proof)): *Promise‹Buffer | null›*

*Inherited from [Trie](_basetrie_.trie.md).[verifyProof](_basetrie_.trie.md#static-verifyproof)*

*Defined in [baseTrie.ts:113](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L113)*

Verifies a proof.

**`throws`** If proof is found to be invalid.

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proof` | [Proof](../modules/_basetrie_.md#proof) |

**Returns:** *Promise‹Buffer | null›*

The value from the key.
