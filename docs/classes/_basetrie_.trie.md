[merkle-patricia-tree](../README.md) › ["baseTrie"](../modules/_basetrie_.md) › [Trie](_basetrie_.trie.md)

# Class: Trie

The basic trie interface, use with `import { BaseTrie as Trie } from 'merkle-patricia-tree'`.
In Ethereum applications stick with the [SecureTrie](_secure_.securetrie.md) overlay.
The API for the base and the secure interface are about the same.

## Hierarchy

* **Trie**

  ↳ [CheckpointTrie](_checkpointtrie_.checkpointtrie.md)

## Index

### Constructors

* [constructor](_basetrie_.trie.md#constructor)

### Properties

* [EMPTY_TRIE_ROOT](_basetrie_.trie.md#empty_trie_root)
* [db](_basetrie_.trie.md#db)

### Accessors

* [isCheckpoint](_basetrie_.trie.md#ischeckpoint)
* [root](_basetrie_.trie.md#root)

### Methods

* [_createInitialNode](_basetrie_.trie.md#private-_createinitialnode)
* [_deleteNode](_basetrie_.trie.md#private-_deletenode)
* [_findDbNodes](_basetrie_.trie.md#private-_finddbnodes)
* [_findValueNodes](_basetrie_.trie.md#private-_findvaluenodes)
* [_formatNode](_basetrie_.trie.md#private-_formatnode)
* [_saveStack](_basetrie_.trie.md#private-_savestack)
* [_setRoot](_basetrie_.trie.md#_setroot)
* [_updateNode](_basetrie_.trie.md#private-_updatenode)
* [batch](_basetrie_.trie.md#batch)
* [checkRoot](_basetrie_.trie.md#checkroot)
* [copy](_basetrie_.trie.md#copy)
* [createReadStream](_basetrie_.trie.md#createreadstream)
* [del](_basetrie_.trie.md#del)
* [findPath](_basetrie_.trie.md#findpath)
* [get](_basetrie_.trie.md#get)
* [lookupNode](_basetrie_.trie.md#lookupnode)
* [put](_basetrie_.trie.md#put)
* [walkTrie](_basetrie_.trie.md#walktrie)
* [createProof](_basetrie_.trie.md#static-createproof)
* [fromProof](_basetrie_.trie.md#static-fromproof)
* [prove](_basetrie_.trie.md#static-prove)
* [verifyProof](_basetrie_.trie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new Trie**(`db?`: LevelUp | null, `root?`: Buffer): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:47](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L47)*

test

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`db?` | LevelUp &#124; null | A [levelup](https://github.com/Level/levelup) instance. By default (if the db is `null` or left undefined) creates an in-memory [memdown](https://github.com/Level/memdown) instance. |
`root?` | Buffer | A `Buffer` for the root of a previously stored trie  |

**Returns:** *[Trie](_basetrie_.trie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Defined in [baseTrie.ts:45](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L45)*

The root for an empty trie

___

###  db

• **db**: *DB*

*Defined in [baseTrie.ts:43](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L43)*

The backend DB

## Accessors

###  isCheckpoint

• **get isCheckpoint**(): *boolean*

*Defined in [baseTrie.ts:94](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L94)*

BaseTrie has no checkpointing so return false

**Returns:** *boolean*

___

###  root

• **get root**(): *Buffer*

*Defined in [baseTrie.ts:71](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L71)*

Gets the current root of the `trie`

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Defined in [baseTrie.ts:66](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L66)*

Sets the current root of the `trie`

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

### `Private` _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:238](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L238)*

Creates the initial node from an empty tree.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

### `Private` _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[]): *Promise‹void›*

*Defined in [baseTrie.ts:381](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L381)*

Deletes a node from the database.

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

### `Private` _findDbNodes

▸ **_findDbNodes**(`onFound`: [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction)): *Promise‹void›*

*Defined in [baseTrie.ts:697](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L697)*

Finds all nodes that are stored directly in the db
(some nodes are stored raw inside other nodes)
called by {@link ScratchReadStream}

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction) |

**Returns:** *Promise‹void›*

___

### `Private` _findValueNodes

▸ **_findValueNodes**(`onFound`: [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction)): *Promise‹void›*

*Defined in [baseTrie.ts:715](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L715)*

Finds all nodes that store k,v values
called by {@link TrieReadStream}

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction) |

**Returns:** *Promise‹void›*

___

### `Private` _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer | (null | Buffer‹› | Buffer‹›[])[]*

*Defined in [baseTrie.ts:549](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L549)*

Formats node to be saved by `levelup.batch`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | TrieNode | - | the node to format. |
`topLevel` | boolean | - | if the node is at the top level. |
`opStack` | BatchDBOp[] | - | the opStack to push the node's data. |
`remove` | boolean | false | whether to remove the node (only used for CheckpointTrie). |

**Returns:** *Buffer | (null | Buffer‹› | Buffer‹›[])[]*

The node's hash used as the key or the rawNode.

___

### `Private` _saveStack

▸ **_saveStack**(`key`: Nibbles, `stack`: TrieNode[], `opStack`: BatchDBOp[]): *Promise‹void›*

*Defined in [baseTrie.ts:511](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L511)*

Saves a stack of nodes to the database.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Nibbles | the key. Should follow the stack |
`stack` | TrieNode[] | a stack of nodes to the value given by the key |
`opStack` | BatchDBOp[] | a stack of levelup operations to commit at the end of this funciton  |

**Returns:** *Promise‹void›*

___

###  _setRoot

▸ **_setRoot**(`value?`: Buffer): *void*

*Defined in [baseTrie.ts:75](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Private` _updateNode

▸ **_updateNode**(`k`: Buffer, `value`: Buffer, `keyRemainder`: Nibbles, `stack`: TrieNode[]): *Promise‹void›*

*Defined in [baseTrie.ts:278](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L278)*

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

###  batch

▸ **batch**(`ops`: BatchDBOp[]): *Promise‹void›*

*Defined in [baseTrie.ts:594](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L594)*

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

*Defined in [baseTrie.ts:86](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L86)*

Checks if a given root exists.

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  copy

▸ **copy**(): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:686](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L686)*

Creates a new trie backed by the same db.

**Returns:** *[Trie](_basetrie_.trie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Defined in [baseTrie.ts:679](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L679)*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:143](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L143)*

Deletes a value given a `key`.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |

**Returns:** *Promise‹void›*

A Promise that resolves once value is deleted.

___

###  findPath

▸ **findPath**(`key`: Buffer): *Promise‹Path›*

*Defined in [baseTrie.ts:157](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L157)*

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the search key  |

**Returns:** *Promise‹Path›*

___

###  get

▸ **get**(`key`: Buffer): *Promise‹Buffer | null›*

*Defined in [baseTrie.ts:103](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L103)*

Gets a value given a `key`

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the key to search for |

**Returns:** *Promise‹Buffer | null›*

A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.

___

###  lookupNode

▸ **lookupNode**(`node`: Buffer | Buffer[]): *Promise‹TrieNode | null›*

*Defined in [baseTrie.ts:247](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L247)*

Retrieves a node from db by hash.

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |

**Returns:** *Promise‹TrieNode | null›*

___

###  put

▸ **put**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:118](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L118)*

Stores a given `value` at the given `key`.

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

A Promise that resolves once value is stored.

___

###  walkTrie

▸ **walkTrie**(`root`: Buffer, `onFound`: [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction)): *Promise‹void›*

*Defined in [baseTrie.ts:220](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L220)*

Walks a trie until finished.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`root` | Buffer | - |
`onFound` | [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

**Returns:** *Promise‹void›*

Resolves when finished walking trie.

___

### `Static` createProof

▸ **createProof**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹[Proof](../modules/_basetrie_.md#proof)›*

*Defined in [baseTrie.ts:649](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L649)*

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

*Defined in [baseTrie.ts:614](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L614)*

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

*Defined in [baseTrie.ts:640](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L640)*

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

*Defined in [baseTrie.ts:665](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L665)*

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
