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
* [delRaw](_basetrie_.trie.md#delraw)
* [findPath](_basetrie_.trie.md#findpath)
* [get](_basetrie_.trie.md#get)
* [getRaw](_basetrie_.trie.md#getraw)
* [put](_basetrie_.trie.md#put)
* [putRaw](_basetrie_.trie.md#putraw)
* [setRoot](_basetrie_.trie.md#setroot)
* [fromProof](_basetrie_.trie.md#static-fromproof)
* [prove](_basetrie_.trie.md#static-prove)
* [verifyProof](_basetrie_.trie.md#static-verifyproof)

## Constructors

###  constructor

\+ **new Trie**(`db?`: LevelUp | null, `root?`: Buffer): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:38](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`db?` | LevelUp &#124; null |
`root?` | Buffer |

**Returns:** *[Trie](_basetrie_.trie.md)*

## Properties

###  EMPTY_TRIE_ROOT

• **EMPTY_TRIE_ROOT**: *Buffer*

*Defined in [baseTrie.ts:35](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L35)*

___

###  db

• **db**: *DB*

*Defined in [baseTrie.ts:36](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L36)*

## Accessors

###  root

• **get root**(): *Buffer*

*Defined in [baseTrie.ts:105](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L105)*

**Returns:** *Buffer*

• **set root**(`value`: Buffer): *void*

*Defined in [baseTrie.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Buffer |

**Returns:** *void*

## Methods

###  _createInitialNode

▸ **_createInitialNode**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Defined in [baseTrie.ts:737](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L737)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |
`cb` | ErrorCallback |

**Returns:** *void*

___

###  _deleteNode

▸ **_deleteNode**(`k`: Buffer, `stack`: TrieNode[], `cb`: Function): *any*

*Defined in [baseTrie.ts:619](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L619)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | Buffer |
`stack` | TrieNode[] |
`cb` | Function |

**Returns:** *any*

___

###  _findDbNodes

▸ **_findDbNodes**(`onFound`: Function, `cb`: Function): *void*

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

*Defined in [baseTrie.ts:322](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L322)*

**Parameters:**

Name | Type |
------ | ------ |
`onFound` | Function |
`cb` | Function |

**Returns:** *void*

___

###  _formatNode

▸ **_formatNode**(`node`: TrieNode, `topLevel`: boolean, `opStack`: BatchDBOp[], `remove`: boolean): *Buffer | null | Buffer‹› | Buffer‹›[][]*

*Defined in [baseTrie.ts:745](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L745)*

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

▸ **_lookupNode**(`node`: Buffer | Buffer[], `cb`: Function): *void*

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

*Defined in [baseTrie.ts:821](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L821)*

Checks if a given root exists

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer |
`cb` | Function |

**Returns:** *void*

___

###  copy

▸ **copy**(): *[Trie](_basetrie_.trie.md)*

*Defined in [baseTrie.ts:780](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L780)*

**Returns:** *[Trie](_basetrie_.trie.md)*

___

###  createReadStream

▸ **createReadStream**(): *ReadStream*

*Defined in [baseTrie.ts:774](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L774)*

The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

**`method`** createReadStream

**`memberof`** Trie

**Returns:** *ReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

___

###  del

▸ **del**(`key`: Buffer, `cb`: ErrorCallback): *void*

*Defined in [baseTrie.ts:185](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L185)*

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

*Defined in [baseTrie.ts:127](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L127)*

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

▸ **put**(`key`: Buffer, `value`: Buffer, `cb`: ErrorCallback): *void*

*Defined in [baseTrie.ts:149](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L149)*

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

*Defined in [baseTrie.ts:219](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L219)*

Writes a value under given key directly to the
key/value db.

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |
`value` | Buffer |
`cb` | ErrorCallback |

**Returns:** *void*

___

###  setRoot

▸ **setRoot**(`value?`: Buffer): *void*

*Defined in [baseTrie.ts:109](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | Buffer |

**Returns:** *void*

___

### `Static` fromProof

▸ **fromProof**(`proofNodes`: Buffer[], `proofTrie?`: [Trie](_basetrie_.trie.md)): *Promise‹[Trie](_basetrie_.trie.md)›*

*Defined in [baseTrie.ts:50](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`proofNodes` | Buffer[] |
`proofTrie?` | [Trie](_basetrie_.trie.md) |

**Returns:** *Promise‹[Trie](_basetrie_.trie.md)›*

___

### `Static` prove

▸ **prove**(`trie`: [Trie](_basetrie_.trie.md), `key`: Buffer): *Promise‹Buffer[]›*

*Defined in [baseTrie.ts:70](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`trie` | [Trie](_basetrie_.trie.md) |
`key` | Buffer |

**Returns:** *Promise‹Buffer[]›*

___

### `Static` verifyProof

▸ **verifyProof**(`rootHash`: Buffer, `key`: Buffer, `proofNodes`: Buffer[]): *Promise‹Buffer | null›*

*Defined in [baseTrie.ts:87](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`rootHash` | Buffer |
`key` | Buffer |
`proofNodes` | Buffer[] |

**Returns:** *Promise‹Buffer | null›*
