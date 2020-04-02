[merkle-patricia-tree](../README.md) › ["baseTrie"](../modules/_basetrie_.md) › [Trie](_basetrie_.trie.md)

# Class: Trie

Use `require('merkel-patricia-tree').BaseTrie` for the base interface. In Ethereum applications
stick with the Secure Trie Overlay `require('merkel-patricia-tree').SecureTrie`.
The API for the raw and the secure interface are about the same.

**`param`** A [levelup](https://github.com/Level/levelup) instance. By default creates an in-memory [memdown](https://github.com/Level/memdown) instance.
If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/Level/memdown)

**`param`** A hex `String` or `Buffer` for the root of a previously stored trie

**`prop`** {Buffer} root The current root of the `trie`

**`prop`** {Buffer} EMPTY_TRIE_ROOT the Root for an empty trie

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

*Defined in [baseTrie.ts:47](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`db?` | LevelUp &#124; null |
`root?` | Buffer |

**Returns:** *[Trie](_basetrie_.trie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Defined in [baseTrie.ts:44](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L44)*

___

###  db

• **db**: *DB*

*Defined in [baseTrie.ts:45](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L45)*

## Accessors

###  root

• **get root**(): *Buffer*

*Defined in [baseTrie.ts:107](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L107)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Defined in [baseTrie.ts:103](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:696](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L696)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[]): *Promise‹void›*

*Defined in [baseTrie.ts:579](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L579)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |

**Returns:** *Promise‹void›*

___

###  _findDbNodes

▸ **_findDbNodes**(`onFound`: FoundNode): *Promise‹void›*

*Defined in [baseTrie.ts:320](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L320)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _findValueNodes

▸ **_findValueNodes**(`onFound`: FoundNode): *Promise‹void›*

*Defined in [baseTrie.ts:293](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L293)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | FoundNode |

**Returns:** *Promise‹void›*

___

###  _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer | null | Buffer‹› | Buffer‹›[][]*

*Defined in [baseTrie.ts:707](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L707)*

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

*Defined in [baseTrie.ts:201](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L201)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | Buffer &#124; Buffer[] |

**Returns:** *Promise‹TrieNode | null›*

___

###  _putNode

▸ **_putNode**(`node`: TrieNode): *Promise‹void›*

*Defined in [baseTrie.ts:219](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L219)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | TrieNode |

**Returns:** *Promise‹void›*

___

### `Private` _saveStack

▸ **_saveStack**(`key`: number[], `stack`: TrieNode[], `opStack`: BatchDBOp[]): *Promise‹void›*

*Defined in [baseTrie.ts:547](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L547)*

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

*Defined in [baseTrie.ts:345](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L345)*

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

*Defined in [baseTrie.ts:450](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L450)*

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |
`onNode` | FoundNode |

**Returns:** *Promise‹void›*

___

###  batch

▸ **batch**(`ops`: BatchDBOp[]): *Promise‹void›*

*Defined in [baseTrie.ts:763](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L763)*

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

Name | Type |
------ | ------ |
`ops` | BatchDBOp[] |

**Returns:** *Promise‹void›*

___

###  checkRoot

▸ **checkRoot**(`root`: Buffer): *Promise‹boolean›*

*Defined in [baseTrie.ts:780](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L780)*

Checks if a given root exists

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  copy

▸ **copy**(): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:742](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L742)*

**Returns:** *[Trie](_basetrie_.trie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Defined in [baseTrie.ts:736](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L736)*

The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer): *Promise‹void›*

*Defined in [baseTrie.ts:184](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L184)*

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

*Defined in [baseTrie.ts:236](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L236)*

Tries to find a path to the node for the given key
It returns a `stack` of nodes to the closet node

**`method`** findPath

**`memberof`** Trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | the search key |

**Returns:** *Promise‹Path›*

- Returns promise resolving to interface Path

___

###  get

▸ **get**(`key`: Buffer): *Promise‹Buffer | null›*

*Defined in [baseTrie.ts:129](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L129)*

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

*Defined in [baseTrie.ts:152](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L152)*

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

*Defined in [baseTrie.ts:111](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `proofTrie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Defined in [baseTrie.ts:59](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`proofTrie?` | [Trie](_basetrie_.trie.md) |

**Returns:** *Promise‹[Trie](_basetrie_.trie.md)›*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹Buffer[]›*

*Defined in [baseTrie.ts:79](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) |
`key` | Buffer |

**Returns:** *Promise‹Buffer[]›*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proofNodes`: Buffer[]): *Promise‹Buffer | null›*

*Defined in [baseTrie.ts:89](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proofNodes` | Buffer[] |

**Returns:** *Promise‹Buffer | null›*
