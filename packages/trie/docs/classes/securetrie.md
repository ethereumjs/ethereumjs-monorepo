[merkle-patricia-tree](../README.md) / SecureTrie

# Class: SecureTrie

You can create a secure Trie where the keys are automatically hashed
using **keccak256** by using `import { SecureTrie as Trie } from 'merkle-patricia-tree'`.
It has the same methods and constructor as `Trie`.

## Hierarchy

- [*CheckpointTrie*](checkpointtrie.md)

  ↳ **SecureTrie**

## Table of contents

### Constructors

- [constructor](securetrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](securetrie.md#empty_trie_root)
- [db](securetrie.md#db)

### Accessors

- [isCheckpoint](securetrie.md#ischeckpoint)
- [root](securetrie.md#root)

### Methods

- [batch](securetrie.md#batch)
- [checkRoot](securetrie.md#checkroot)
- [checkpoint](securetrie.md#checkpoint)
- [commit](securetrie.md#commit)
- [copy](securetrie.md#copy)
- [createReadStream](securetrie.md#createreadstream)
- [del](securetrie.md#del)
- [findPath](securetrie.md#findpath)
- [get](securetrie.md#get)
- [lookupNode](securetrie.md#lookupnode)
- [put](securetrie.md#put)
- [revert](securetrie.md#revert)
- [setRoot](securetrie.md#setroot)
- [walkTrie](securetrie.md#walktrie)
- [createProof](securetrie.md#createproof)
- [fromProof](securetrie.md#fromproof)
- [prove](securetrie.md#prove)
- [verifyProof](securetrie.md#verifyproof)

## Constructors

### constructor

\+ **new SecureTrie**(...`args`: *any*): [*SecureTrie*](securetrie.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | *any* |

**Returns:** [*SecureTrie*](securetrie.md)

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L13)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: *Buffer*

The root for an empty trie

Inherited from: [CheckpointTrie](checkpointtrie.md).[EMPTY_TRIE_ROOT](checkpointtrie.md#empty_trie_root)

Defined in: [baseTrie.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L43)

___

### db

• **db**: *CheckpointDB*

The backend DB

Inherited from: [CheckpointTrie](checkpointtrie.md).[db](checkpointtrie.md#db)

Defined in: [checkpointTrie.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L8)

## Accessors

### isCheckpoint

• get **isCheckpoint**(): *boolean*

Is the trie during a checkpoint phase?

**Returns:** *boolean*

Defined in: [checkpointTrie.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L18)

___

### root

• get **root**(): *Buffer*

Gets the current root of the `trie`

**Returns:** *Buffer*

Defined in: [baseTrie.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L77)

• set **root**(`value`: *Buffer*): *void*

Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *Buffer* |

**Returns:** *void*

Defined in: [baseTrie.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L72)

## Methods

### batch

▸ **batch**(`ops`: BatchDBOp[]): *Promise*<void\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

**`example`**
const ops = [
   { type: 'del', key: Buffer.from('father') }
 , { type: 'put', key: Buffer.from('name'), value: Buffer.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Buffer.from('dob'), value: Buffer.from('16 February 1941') }
 , { type: 'put', key: Buffer.from('spouse'), value: Buffer.from('Kim Young-sook') }
 , { type: 'put', key: Buffer.from('occupation'), value: Buffer.from('Clown') }
]
await trie.batch(ops)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | BatchDBOp[] |

**Returns:** *Promise*<void\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:612](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L612)

___

### checkRoot

▸ **checkRoot**(`root`: *Buffer*): *Promise*<boolean\>

Checks if a given root exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | *Buffer* |

**Returns:** *Promise*<boolean\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L99)

___

### checkpoint

▸ **checkpoint**(): *void*

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

**Returns:** *void*

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [checkpointTrie.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L26)

___

### commit

▸ **commit**(): *Promise*<void\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

**`throws`** If not during a checkpoint phase

**Returns:** *Promise*<void\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [checkpointTrie.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L35)

___

### copy

▸ **copy**(`includeCheckpoints?`: *boolean*): [*SecureTrie*](securetrie.md)

Returns a copy of the underlying trie with the interface of SecureTrie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | *boolean* | true | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

**Returns:** [*SecureTrie*](securetrie.md)

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L91)

___

### createReadStream

▸ **createReadStream**(): *TrieReadStream*

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

**Returns:** *TrieReadStream*

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:697](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L697)

___

### del

▸ **del**(`key`: *Buffer*): *Promise*<void\>

Deletes a value given a `key`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | *Buffer* |

**Returns:** *Promise*<void\>

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L49)

___

### findPath

▸ **findPath**(`key`: *Buffer*): *Promise*<Path\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | *Buffer* | the search key |

**Returns:** *Promise*<Path\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L172)

___

### get

▸ **get**(`key`: *Buffer*): *Promise*<``null`` \| Buffer\>

Gets a value given a `key`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | *Buffer* | the key to search for |

**Returns:** *Promise*<``null`` \| Buffer\>

A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L23)

___

### lookupNode

▸ **lookupNode**(`node`: *Buffer* \| *Buffer*[]): *Promise*<``null`` \| BranchNode \| ExtensionNode \| LeafNode\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | *Buffer* \| *Buffer*[] |

**Returns:** *Promise*<``null`` \| BranchNode \| ExtensionNode \| LeafNode\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L262)

___

### put

▸ **put**(`key`: *Buffer*, `val`: *Buffer*): *Promise*<void\>

Stores a given `value` at the given `key`.
For a falsey value, use the original key to avoid double hashing the key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | *Buffer* |
| `val` | *Buffer* |

**Returns:** *Promise*<void\>

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L35)

___

### revert

▸ **revert**(): *Promise*<void\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

**Returns:** *Promise*<void\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [checkpointTrie.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L50)

___

### setRoot

▸ **setRoot**(`value?`: *Buffer*): *void*

This method is deprecated.
Please use `Trie.root(value)` instead.

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | *Buffer* |

**Returns:** *void*

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L88)

___

### walkTrie

▸ **walkTrie**(`root`: *Buffer*, `onFound`: FoundNodeFunction): *Promise*<void\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | *Buffer* |  |
| `onFound` | FoundNodeFunction | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

**Returns:** *Promise*<void\>

Resolves when finished walking trie.

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L235)

___

### createProof

▸ `Static` **createProof**(`trie`: [*SecureTrie*](securetrie.md), `key`: *Buffer*): *Promise*<Proof\>

Creates a proof that can be verified using [SecureTrie.verifyProof](securetrie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [*SecureTrie*](securetrie.md) |
| `key` | *Buffer* |

**Returns:** *Promise*<Proof\>

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L69)

___

### fromProof

▸ `Static` **fromProof**(`proof`: Proof, `trie?`: [*BaseTrie*](basetrie.md)): *Promise*<[*BaseTrie*](basetrie.md)\>

Saves the nodes from a proof into the trie. If no trie is provided a new one wil be instantiated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | Proof |
| `trie?` | [*BaseTrie*](basetrie.md) |

**Returns:** *Promise*<[*BaseTrie*](basetrie.md)\>

Inherited from: [CheckpointTrie](checkpointtrie.md)

Defined in: [baseTrie.ts:632](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L632)

___

### prove

▸ `Static` **prove**(`trie`: [*SecureTrie*](securetrie.md), `key`: *Buffer*): *Promise*<Proof\>

prove has been renamed to [SecureTrie.createProof](securetrie.md#createproof).

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [*SecureTrie*](securetrie.md) |
| `key` | *Buffer* |

**Returns:** *Promise*<Proof\>

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L60)

___

### verifyProof

▸ `Static` **verifyProof**(`rootHash`: *Buffer*, `key`: *Buffer*, `proof`: Proof): *Promise*<``null`` \| Buffer\>

Verifies a proof.

**`throws`** If proof is found to be invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | *Buffer* |
| `key` | *Buffer* |
| `proof` | Proof |

**Returns:** *Promise*<``null`` \| Buffer\>

The value from the key.

Overrides: [CheckpointTrie](checkpointtrie.md)

Defined in: [secure.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L82)
