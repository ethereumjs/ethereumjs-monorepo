[merkle-patricia-tree](README.md)

# merkle-patricia-tree

## Index

### Classes

* [BranchNode](classes/branchnode.md)
* [CheckpointTrie](classes/checkpointtrie.md)
* [DB](classes/db.md)
* [ExtensionNode](classes/extensionnode.md)
* [LeafNode](classes/leafnode.md)
* [PrioritizedTaskExecutor](classes/prioritizedtaskexecutor.md)
* [ScratchDB](classes/scratchdb.md)
* [ScratchReadStream](classes/scratchreadstream.md)
* [SecureTrie](classes/securetrie.md)
* [Trie](classes/trie.md)
* [TrieReadStream](classes/triereadstream.md)

### Interfaces

* [DelBatch](interfaces/delbatch.md)
* [PutBatch](interfaces/putbatch.md)
* [Task](interfaces/task.md)

### Type aliases

* [BatchDBOp](README.md#batchdbop)
* [EmbeddedNode](README.md#embeddednode)
* [ErrorCallback](README.md#errorcallback)
* [Nibbles](README.md#nibbles)
* [TrieNode](README.md#trienode)

### Variables

* [Readable](README.md#const-readable)
* [WriteStream](README.md#const-writestream)
* [assert](README.md#const-assert)
* [async](README.md#const-async)
* [level](README.md#const-level)
* [semaphore](README.md#const-semaphore)

### Functions

* [addHexPrefix](README.md#addhexprefix)
* [asyncFirstSeries](README.md#asyncfirstseries)
* [callTogether](README.md#calltogether)
* [decodeNode](README.md#decodenode)
* [decodeRawNode](README.md#decoderawnode)
* [doKeysMatch](README.md#dokeysmatch)
* [isRawNode](README.md#israwnode)
* [isTerminator](README.md#private-isterminator)
* [matchingNibbleLength](README.md#private-matchingnibblelength)
* [nibblesToBuffer](README.md#private-nibblestobuffer)
* [removeHexPrefix](README.md#private-removehexprefix)
* [stringToNibbles](README.md#private-stringtonibbles)

### Object literals

* [ENCODING_OPTS](README.md#const-encoding_opts)

## Type aliases

###  BatchDBOp

Ƭ **BatchDBOp**: *[PutBatch](interfaces/putbatch.md) | [DelBatch](interfaces/delbatch.md)*

*Defined in [db.ts:7](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L7)*

___

###  EmbeddedNode

Ƭ **EmbeddedNode**: *Buffer | Buffer[]*

*Defined in [trieNode.ts:10](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L10)*

___

###  ErrorCallback

Ƭ **ErrorCallback**: *function*

*Defined in [types.ts:1](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/types.ts#L1)*

#### Type declaration:

▸ (`err?`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err?` | Error |

___

###  Nibbles

Ƭ **Nibbles**: *number[]*

*Defined in [trieNode.ts:7](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L7)*

___

###  TrieNode

Ƭ **TrieNode**: *[BranchNode](classes/branchnode.md) | [ExtensionNode](classes/extensionnode.md) | [LeafNode](classes/leafnode.md)*

*Defined in [trieNode.ts:6](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L6)*

## Variables

### `Const` Readable

• **Readable**: *any* = require('readable-stream').Readable

*Defined in [readStream.ts:4](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/readStream.ts#L4)*

*Defined in [scratchReadStream.ts:3](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/scratchReadStream.ts#L3)*

___

### `Const` WriteStream

• **WriteStream**: *any* = require('level-ws')

*Defined in [checkpointTrie.ts:9](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L9)*

___

### `Const` assert

• **assert**: *any* = require('assert')

*Defined in [baseTrie.ts:19](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L19)*

___

### `Const` async

• **async**: *any* = require('async')

*Defined in [util/async.ts:1](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/async.ts#L1)*

*Defined in [baseTrie.ts:20](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L20)*

*Defined in [checkpointTrie.ts:8](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/checkpointTrie.ts#L8)*

___

### `Const` level

• **level**: *any* = require('level-mem')

*Defined in [db.ts:3](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L3)*

___

### `Const` semaphore

• **semaphore**: *any* = require('semaphore')

*Defined in [baseTrie.ts:21](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/baseTrie.ts#L21)*

## Functions

###  addHexPrefix

▸ **addHexPrefix**(`key`: number[], `terminator`: boolean): *number[]*

*Defined in [util/hex.ts:7](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/hex.ts#L7)*

Prepends hex prefix to an array of nibbles.

**`method`** addHexPrefix

**Parameters:**

Name | Type |
------ | ------ |
`key` | number[] |
`terminator` | boolean |

**Returns:** *number[]*

- returns buffer of encoded data

___

###  asyncFirstSeries

▸ **asyncFirstSeries**(`array`: any[], `iterator`: Function, `cb`: Function): *void*

*Defined in [util/async.ts:32](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/async.ts#L32)*

Take a collection of async fns, call the cb on the first to return a truthy value.
If all run without a truthy result, return undefined

**Parameters:**

Name | Type |
------ | ------ |
`array` | any[] |
`iterator` | Function |
`cb` | Function |

**Returns:** *void*

___

###  callTogether

▸ **callTogether**(...`funcs`: Function[]): *(Anonymous function)*

*Defined in [util/async.ts:7](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/async.ts#L7)*

Take two or more functions and returns a function  that will execute all of
the given functions

**Parameters:**

Name | Type |
------ | ------ |
`...funcs` | Function[] |

**Returns:** *(Anonymous function)*

___

###  decodeNode

▸ **decodeNode**(`raw`: Buffer): *[TrieNode](README.md#trienode)*

*Defined in [trieNode.ts:12](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`raw` | Buffer |

**Returns:** *[TrieNode](README.md#trienode)*

___

###  decodeRawNode

▸ **decodeRawNode**(`raw`: Buffer[]): *[TrieNode](README.md#trienode)*

*Defined in [trieNode.ts:20](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`raw` | Buffer[] |

**Returns:** *[TrieNode](README.md#trienode)*

___

###  doKeysMatch

▸ **doKeysMatch**(`keyA`: number[], `keyB`: number[]): *boolean*

*Defined in [util/nibbles.ts:56](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/nibbles.ts#L56)*

Compare two nibble array keys.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keyA` | number[] | - |
`keyB` | number[] |   |

**Returns:** *boolean*

___

###  isRawNode

▸ **isRawNode**(`n`: any): *boolean*

*Defined in [trieNode.ts:34](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | any |

**Returns:** *boolean*

___

### `Private` isTerminator

▸ **isTerminator**(`key`: number[]): *boolean*

*Defined in [util/hex.ts:46](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/hex.ts#L46)*

Returns true if hexprefixed path is for a terminating (leaf) node.

**`method`** isTerminator

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | number[] | an hexprefixed array of nibbles |

**Returns:** *boolean*

___

### `Private` matchingNibbleLength

▸ **matchingNibbleLength**(`nib1`: number[], `nib2`: number[]): *number*

*Defined in [util/nibbles.ts:43](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/nibbles.ts#L43)*

Returns the number of in order matching nibbles of two give nibble arrays.

**`method`** matchingNibbleLength

**Parameters:**

Name | Type |
------ | ------ |
`nib1` | number[] |
`nib2` | number[] |

**Returns:** *number*

___

### `Private` nibblesToBuffer

▸ **nibblesToBuffer**(`arr`: number[]): *Buffer*

*Defined in [util/nibbles.ts:27](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/nibbles.ts#L27)*

Converts a nibble array into a buffer.

**`method`** nibblesToBuffer

**Parameters:**

Name | Type |
------ | ------ |
`arr` | number[] |

**Returns:** *Buffer*

___

### `Private` removeHexPrefix

▸ **removeHexPrefix**(`val`: number[]): *number[]*

*Defined in [util/hex.ts:30](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/hex.ts#L30)*

Removes hex prefix of an array of nibbles.

**`method`** removeHexPrefix

**Parameters:**

Name | Type |
------ | ------ |
`val` | number[] |

**Returns:** *number[]*

___

### `Private` stringToNibbles

▸ **stringToNibbles**(`key`: Buffer): *number[]*

*Defined in [util/nibbles.ts:7](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/nibbles.ts#L7)*

Converts a string OR a buffer to a nibble array.

**`method`** stringToNibbles

**Parameters:**

Name | Type |
------ | ------ |
`key` | Buffer |

**Returns:** *number[]*

## Object literals

### `Const` ENCODING_OPTS

### ▪ **ENCODING_OPTS**: *object*

*Defined in [db.ts:5](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L5)*

###  keyEncoding

• **keyEncoding**: *string* = "binary"

*Defined in [db.ts:5](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L5)*

###  valueEncoding

• **valueEncoding**: *string* = "binary"

*Defined in [db.ts:5](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/db.ts#L5)*
