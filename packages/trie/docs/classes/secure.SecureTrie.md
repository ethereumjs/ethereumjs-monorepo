[merkle-patricia-tree](../README.md) / [Exports](../modules.md) / [secure](../modules/secure.md) / SecureTrie

# Class: SecureTrie

[secure](../modules/secure.md).SecureTrie

You can create a secure Trie where the keys are automatically hashed
using **keccak256** by using `import { SecureTrie as Trie } from 'merkle-patricia-tree'`.
It has the same methods and constructor as `Trie`.

## Hierarchy

- [`CheckpointTrie`](checkpointTrie.CheckpointTrie.md)

  ↳ **`SecureTrie`**

## Table of contents

### Constructors

- [constructor](secure.SecureTrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](secure.SecureTrie.md#empty_trie_root)
- [db](secure.SecureTrie.md#db)

### Accessors

- [isCheckpoint](secure.SecureTrie.md#ischeckpoint)
- [root](secure.SecureTrie.md#root)

### Methods

- [batch](secure.SecureTrie.md#batch)
- [checkRoot](secure.SecureTrie.md#checkroot)
- [checkpoint](secure.SecureTrie.md#checkpoint)
- [commit](secure.SecureTrie.md#commit)
- [copy](secure.SecureTrie.md#copy)
- [createReadStream](secure.SecureTrie.md#createreadstream)
- [del](secure.SecureTrie.md#del)
- [findPath](secure.SecureTrie.md#findpath)
- [get](secure.SecureTrie.md#get)
- [lookupNode](secure.SecureTrie.md#lookupnode)
- [put](secure.SecureTrie.md#put)
- [revert](secure.SecureTrie.md#revert)
- [setRoot](secure.SecureTrie.md#setroot)
- [walkTrie](secure.SecureTrie.md#walktrie)
- [createProof](secure.SecureTrie.md#createproof)
- [fromProof](secure.SecureTrie.md#fromproof)
- [prove](secure.SecureTrie.md#prove)
- [verifyProof](secure.SecureTrie.md#verifyproof)

## Constructors

### constructor

• **new SecureTrie**(...`args`)

test

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[constructor](checkpointTrie.CheckpointTrie.md#constructor)

#### Defined in

[secure.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L14)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[EMPTY_TRIE_ROOT](checkpointTrie.CheckpointTrie.md#empty_trie_root)

#### Defined in

[baseTrie.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L44)

___

### db

• **db**: `CheckpointDB`

The backend DB

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[db](checkpointTrie.CheckpointTrie.md#db)

#### Defined in

[checkpointTrie.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L8)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[checkpointTrie.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L18)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Defined in

[baseTrie.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L86)

• `set` **root**(`value`): `void`

Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Buffer` |

#### Returns

`void`

#### Defined in

[baseTrie.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L75)

## Methods

### batch

▸ **batch**(`ops`): `Promise`<`void`\>

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
| `ops` | `BatchDBOp`[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[batch](checkpointTrie.CheckpointTrie.md#batch)

#### Defined in

[baseTrie.ts:634](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L634)

___

### checkRoot

▸ **checkRoot**(`root`): `Promise`<`boolean`\>

Checks if a given root exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Buffer` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[checkRoot](checkpointTrie.CheckpointTrie.md#checkroot)

#### Defined in

[baseTrie.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L104)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[checkpoint](checkpointTrie.CheckpointTrie.md#checkpoint)

#### Defined in

[checkpointTrie.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L26)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

**`throws`** If not during a checkpoint phase

#### Returns

`Promise`<`void`\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[commit](checkpointTrie.CheckpointTrie.md#commit)

#### Defined in

[checkpointTrie.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L35)

___

### copy

▸ **copy**(`includeCheckpoints?`): [`SecureTrie`](secure.SecureTrie.md)

Returns a copy of the underlying trie with the interface of SecureTrie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

#### Returns

[`SecureTrie`](secure.SecureTrie.md)

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[copy](checkpointTrie.CheckpointTrie.md#copy)

#### Defined in

[secure.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L90)

___

### createReadStream

▸ **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[createReadStream](checkpointTrie.CheckpointTrie.md#createreadstream)

#### Defined in

[baseTrie.ts:726](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L726)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

Deletes a value given a `key`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[del](checkpointTrie.CheckpointTrie.md#del)

#### Defined in

[secure.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L48)

___

### findPath

▸ **findPath**(`key`, `throwIfMissing?`): `Promise`<`Path`\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Buffer` | `undefined` | the search key |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<`Path`\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[findPath](checkpointTrie.CheckpointTrie.md#findpath)

#### Defined in

[baseTrie.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L186)

___

### get

▸ **get**(`key`): `Promise`<``null`` \| `Buffer`\>

Gets a value given a `key`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Buffer` | the key to search for |

#### Returns

`Promise`<``null`` \| `Buffer`\>

A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[get](checkpointTrie.CheckpointTrie.md#get)

#### Defined in

[secure.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L23)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<``null`` \| `TrieNode`\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Buffer` \| `Buffer`[] |

#### Returns

`Promise`<``null`` \| `TrieNode`\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[lookupNode](checkpointTrie.CheckpointTrie.md#lookupnode)

#### Defined in

[baseTrie.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L284)

___

### put

▸ **put**(`key`, `val`): `Promise`<`void`\>

Stores a given `value` at the given `key`.
For a falsey value, use the original key to avoid double hashing the key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |
| `val` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[put](checkpointTrie.CheckpointTrie.md#put)

#### Defined in

[secure.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L35)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[revert](checkpointTrie.CheckpointTrie.md#revert)

#### Defined in

[checkpointTrie.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L50)

___

### setRoot

▸ **setRoot**(`value?`): `void`

This method is deprecated.
Please use [Trie.root](baseTrie.Trie.md#root) instead.

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `Buffer` |

#### Returns

`void`

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[setRoot](checkpointTrie.CheckpointTrie.md#setroot)

#### Defined in

[baseTrie.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L97)

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Buffer` |  |
| `onFound` | [`FoundNodeFunction`](../modules/baseTrie.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[walkTrie](checkpointTrie.CheckpointTrie.md#walktrie)

#### Defined in

[baseTrie.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L257)

___

### createProof

▸ `Static` **createProof**(`trie`, `key`): `Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

Creates a proof that can be verified using [SecureTrie.verifyProof](secure.SecureTrie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`SecureTrie`](secure.SecureTrie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[createProof](checkpointTrie.CheckpointTrie.md#createproof)

#### Defined in

[secure.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L68)

___

### fromProof

▸ `Static` **fromProof**(`proof`, `trie?`): `Promise`<[`Trie`](baseTrie.Trie.md)\>

Saves the nodes from a proof into the trie. If no trie is provided a new one wil be instantiated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../modules/baseTrie.md#proof) |
| `trie?` | [`Trie`](baseTrie.Trie.md) |

#### Returns

`Promise`<[`Trie`](baseTrie.Trie.md)\>

#### Inherited from

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[fromProof](checkpointTrie.CheckpointTrie.md#fromproof)

#### Defined in

[baseTrie.ts:652](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L652)

___

### prove

▸ `Static` **prove**(`trie`, `key`): `Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

prove has been renamed to [SecureTrie.createProof](secure.SecureTrie.md#createproof).

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`SecureTrie`](secure.SecureTrie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[prove](checkpointTrie.CheckpointTrie.md#prove)

#### Defined in

[secure.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L59)

___

### verifyProof

▸ `Static` **verifyProof**(`rootHash`, `key`, `proof`): `Promise`<``null`` \| `Buffer`\>

Verifies a proof.

**`throws`** If proof is found to be invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Buffer` |
| `key` | `Buffer` |
| `proof` | [`Proof`](../modules/baseTrie.md#proof) |

#### Returns

`Promise`<``null`` \| `Buffer`\>

The value from the key.

#### Overrides

[CheckpointTrie](checkpointTrie.CheckpointTrie.md).[verifyProof](checkpointTrie.CheckpointTrie.md#verifyproof)

#### Defined in

[secure.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L81)
