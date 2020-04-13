[merkle-patricia-tree](../README.md) › ["baseTrie"](../modules/_basetrie_.md) › [Trie](_basetrie_.trie.md)

# Class: Trie

Use `import { BaseTrie as Trie } from 'merkle-patricia-tree'` for the base interface.
In Ethereum applications stick with the Secure Trie Overlay `import { SecureTrie } from 'merkle-patricia-tree'`.
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

* [_createInitialNode](_basetrie_.trie.md#_createinitialnode)
* [_deleteNode](_basetrie_.trie.md#_deletenode)
* [_findDbNodes](_basetrie_.trie.md#_finddbnodes)
* [_findValueNodes](_basetrie_.trie.md#_findvaluenodes)
* [_formatNode](_basetrie_.trie.md#_formatnode)
* [_lookupNode](_basetrie_.trie.md#_lookupnode)
* [_putNode](_basetrie_.trie.md#_putnode)
* [_saveStack](_basetrie_.trie.md#private-_savestack)
* [_updateNode](_basetrie_.trie.md#private-_updatenode)
* [_walkTrie](_basetrie_.trie.md#_walktrie)
* [batch](_basetrie_.trie.md#batch)
* [checkRoot](_basetrie_.trie.md#checkroot)
* [copy](_basetrie_.trie.md#copy)
* [createReadStream](_basetrie_.trie.md#createreadstream)
* [del](_basetrie_.trie.md#del)
* [findPath](_basetrie_.trie.md#findpath)
* [get](_basetrie_.trie.md#get)
* [put](_basetrie_.trie.md#put)
* [setRoot](_basetrie_.trie.md#setroot)
* [fromProof](_basetrie_.trie.md#static-fromproof)
* [prove](_basetrie_.trie.md#static-prove)
* [verifyProof](_basetrie_.trie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new Trie**(`db?`: LevelUp | null, `root?`: Buffer): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:42](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`db?` | LevelUp &#124; null |
`root?` | Buffer |

**Returns:** *[Trie](_basetrie_.trie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Defined in [baseTrie.ts:39](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L39)*

___

###  db

• **db**: *DB*

*Defined in [baseTrie.ts:40](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L40)*

## Accessors

###  root

• **get root**(): *Buffer*

*Defined in [baseTrie.ts:100](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L100)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Defined in [baseTrie.ts:96](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:651](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L651)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[]): *Promise‹void›*

*Defined in [baseTrie.ts:529](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L529)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

###  _findDbNodes

▸ **_findDbNodes**(`onFound`: FoundNode): *Promise‹void›*

*Defined in [baseTrie.ts:279](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L279)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _findValueNodes

▸ **_findValueNodes**(`onFound`: FoundNode): *Promise‹void›*

*Defined in [baseTrie.ts:257](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L257)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer | null | Buffer‹› | Buffer‹›[][]*

*Defined in [baseTrie.ts:659](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L659)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`node` | TrieNode | - |
`topLevel` | boolean | - |
`opStack` | BatchDBOp[] | - |
`remove` | boolean | false |

**Returns:** *Buffer | null | Buffer‹› | Buffer‹›[][]*

___

###  _lookupNode

▸ **_lookupNode**(`node`: Buffer | Buffer[]): *Promise‹TrieNode | null›*

*Defined in [baseTrie.ts:172](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L172)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |

**Returns:** *Promise‹TrieNode | null›*

___

###  _putNode

▸ **_putNode**(`node`: TrieNode): *Promise‹void›*

*Defined in [baseTrie.ts:190](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TrieNode |

**Returns:** *Promise‹void›*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: number[], `stack`: TrieNode[], `opStack`: BatchDBOp[]): *Promise‹void›*

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

*Defined in [baseTrie.ts:729](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L729)*

Checks if a given root exists.

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  copy

▸ **copy**(): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:692](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L692)*

**Returns:** *[Trie](_basetrie_.trie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Defined in [baseTrie.ts:686](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L686)*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:162](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L162)*

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

*Defined in [baseTrie.ts:119](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L119)*

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

*Defined in [baseTrie.ts:136](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L136)*

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

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Defined in [baseTrie.ts:104](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L104)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `proofTrie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Defined in [baseTrie.ts:54](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`proofTrie?` | [Trie](_basetrie_.trie.md) |

**Returns:** *Promise‹[Trie](_basetrie_.trie.md)›*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹Buffer[]›*

*Defined in [baseTrie.ts:74](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) |
`key` | Buffer |

**Returns:** *Promise‹Buffer[]›*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proofNodes`: Buffer[]): *Promise‹Buffer | null›*

*Defined in [baseTrie.ts:82](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proofNodes` | Buffer[] |

**Returns:** *Promise‹Buffer | null›*
