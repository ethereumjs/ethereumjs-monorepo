[merkle-patricia-tree](../README.md) › ["baseTrie"](../modules/_basetrie_.md) › [Trie](_basetrie_.trie.md)

# Class: Trie

Use `import { BaseTrie as Trie } from 'merkle-patricia-tree'` for the base interface.
In Ethereum applications stick with the Secure Trie Overlay `import { SecureTrie as Trie } from 'merkle-patricia-tree'`.
The API for the base and the secure interface are about the same.

**`param`** A [levelup](https://github.com/Level/levelup) instance. By default creates an in-memory [memdown](https://github.com/Level/memdown) instance.
If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/Level/memdown)

**`param`** A `Buffer` for the root of a previously stored trie

**`prop`** {Buffer} root - The current root of the `trie`

**`prop`** {Buffer} EMPTY_TRIE_ROOT - The root for an empty trie

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

* [root](_basetrie_.trie.md#root)

### Methods

* [_createInitialNode](_basetrie_.trie.md#private-_createinitialnode)
* [_deleteNode](_basetrie_.trie.md#private-_deletenode)
* [_findDbNodes](_basetrie_.trie.md#_finddbnodes)
* [_findValueNodes](_basetrie_.trie.md#private-_findvaluenodes)
* [_formatNode](_basetrie_.trie.md#private-_formatnode)
* [_lookupNode](_basetrie_.trie.md#private-_lookupnode)
* [_putNode](_basetrie_.trie.md#private-_putnode)
* [_saveStack](_basetrie_.trie.md#private-_savestack)
* [_updateNode](_basetrie_.trie.md#private-_updatenode)
* [_walkTrie](_basetrie_.trie.md#private-_walktrie)
* [batch](_basetrie_.trie.md#batch)
* [checkRoot](_basetrie_.trie.md#checkroot)
* [copy](_basetrie_.trie.md#copy)
* [createReadStream](_basetrie_.trie.md#createreadstream)
* [del](_basetrie_.trie.md#del)
* [findPath](_basetrie_.trie.md#findpath)
* [get](_basetrie_.trie.md#get)
* [put](_basetrie_.trie.md#put)
* [setRoot](_basetrie_.trie.md#setroot)
* [createProof](_basetrie_.trie.md#static-createproof)
* [fromProof](_basetrie_.trie.md#static-fromproof)
* [prove](_basetrie_.trie.md#static-prove)
* [verifyProof](_basetrie_.trie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new Trie**(`db?`: LevelUp | null, `root?`: Buffer): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:45](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`db?` | LevelUp &#124; null |
`root?` | Buffer |

**Returns:** *[Trie](_basetrie_.trie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Defined in [baseTrie.ts:42](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L42)*

___

###  db

• **db**: *DB*

*Defined in [baseTrie.ts:43](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L43)*

## Accessors

###  root

• **get root**(): *Buffer*

*Defined in [baseTrie.ts:127](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L127)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Defined in [baseTrie.ts:123](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

### `Private` _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:683](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L683)*

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

*Defined in [baseTrie.ts:558](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L558)*

Deletes a node.

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

###  _findDbNodes

▸ **_findDbNodes**(`onFound`: FoundNode): *Promise‹void›*

*Defined in [baseTrie.ts:302](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L302)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

### `Private` _findValueNodes

▸ **_findValueNodes**(`onFound`: FoundNode): *Promise‹void›*

*Defined in [baseTrie.ts:280](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L280)*

Finds all nodes that store k,v values.

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

### `Private` _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer | null | Buffer‹› | Buffer‹›[][]*

*Defined in [baseTrie.ts:698](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L698)*

Formats node to be saved by `levelup.batch`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | TrieNode | - | the node to format. |
`topLevel` | boolean | - | if the node is at the top level. |
`opStack` | BatchDBOp[] | - | the opStack to push the node's data. |
`remove` | boolean | false | whether to remove the node (only used for CheckpointTrie). |

**Returns:** *Buffer | null | Buffer‹› | Buffer‹›[][]*

The node's hash used as the key or the rawNode.

___

### `Private` _lookupNode

▸ **_lookupNode**(`node`: Buffer | Buffer[]): *Promise‹TrieNode | null›*

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

*Defined in [baseTrie.ts:764](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L764)*

Checks if a given root exists.

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  copy

▸ **copy**(): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:730](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L730)*

Creates a new trie backed by the same db.

**Returns:** *[Trie](_basetrie_.trie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Defined in [baseTrie.ts:723](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L723)*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

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

*Defined in [baseTrie.ts:158](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L158)*

Stores a given `value` at the given `key`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | - |
`value` | Buffer |   |

**Returns:** *Promise‹void›*

___

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Defined in [baseTrie.ts:131](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` createProof

▸ **createProof**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹[Proof](../modules/_basetrie_.md#proof)›*

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
