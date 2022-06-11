[@ethereumjs/trie](../README.md) / SecureTrie

# Class: SecureTrie

You can create a secure Trie where the keys are automatically hashed
using **keccak256** by using `import { SecureTrie as Trie } from '@ethereumjs/trie'`.
It has the same methods and constructor as `Trie`.

## Hierarchy

- [`CheckpointTrie`](CheckpointTrie.md)

  ↳ **`SecureTrie`**

## Table of contents

### Constructors

- [constructor](SecureTrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](SecureTrie.md#empty_trie_root)
- [db](SecureTrie.md#db)

### Accessors

- [isCheckpoint](SecureTrie.md#ischeckpoint)
- [root](SecureTrie.md#root)

### Methods

- [batch](SecureTrie.md#batch)
- [checkRoot](SecureTrie.md#checkroot)
- [checkpoint](SecureTrie.md#checkpoint)
- [commit](SecureTrie.md#commit)
- [copy](SecureTrie.md#copy)
- [createReadStream](SecureTrie.md#createreadstream)
- [del](SecureTrie.md#del)
- [findPath](SecureTrie.md#findpath)
- [get](SecureTrie.md#get)
- [lookupNode](SecureTrie.md#lookupnode)
- [put](SecureTrie.md#put)
- [revert](SecureTrie.md#revert)
- [setRoot](SecureTrie.md#setroot)
- [walkTrie](SecureTrie.md#walktrie)
- [createProof](SecureTrie.md#createproof)
- [fromProof](SecureTrie.md#fromproof)
- [prove](SecureTrie.md#prove)
- [verifyProof](SecureTrie.md#verifyproof)
- [verifyRangeProof](SecureTrie.md#verifyrangeproof)

## Constructors

### constructor

• **new SecureTrie**(...`args`)

test

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[constructor](CheckpointTrie.md#constructor)

#### Defined in

[secure.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L14)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[EMPTY_TRIE_ROOT](CheckpointTrie.md#empty_trie_root)

#### Defined in

[baseTrie.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L45)

___

### db

• **db**: `CheckpointDB`

The backend DB

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[db](CheckpointTrie.md#db)

#### Defined in

[checkpointTrie.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L8)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Inherited from

CheckpointTrie.isCheckpoint

#### Defined in

[checkpointTrie.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L18)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Inherited from

CheckpointTrie.root

#### Defined in

[baseTrie.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L87)

• `set` **root**(`value`): `void`

Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Buffer` |

#### Returns

`void`

#### Inherited from

CheckpointTrie.root

#### Defined in

[baseTrie.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L76)

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

[CheckpointTrie](CheckpointTrie.md).[batch](CheckpointTrie.md#batch)

#### Defined in

[baseTrie.ts:635](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L635)

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

[CheckpointTrie](CheckpointTrie.md).[checkRoot](CheckpointTrie.md#checkroot)

#### Defined in

[baseTrie.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L105)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[checkpoint](CheckpointTrie.md#checkpoint)

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

[CheckpointTrie](CheckpointTrie.md).[commit](CheckpointTrie.md#commit)

#### Defined in

[checkpointTrie.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L35)

___

### copy

▸ **copy**(`includeCheckpoints?`): [`SecureTrie`](SecureTrie.md)

Returns a copy of the underlying trie with the interface of SecureTrie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

#### Returns

[`SecureTrie`](SecureTrie.md)

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[copy](CheckpointTrie.md#copy)

#### Defined in

[secure.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L111)

___

### createReadStream

▸ **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[createReadStream](CheckpointTrie.md#createreadstream)

#### Defined in

[baseTrie.ts:748](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L748)

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

[CheckpointTrie](CheckpointTrie.md).[del](CheckpointTrie.md#del)

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

[CheckpointTrie](CheckpointTrie.md).[findPath](CheckpointTrie.md#findpath)

#### Defined in

[baseTrie.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L187)

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

[CheckpointTrie](CheckpointTrie.md).[get](CheckpointTrie.md#get)

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

[CheckpointTrie](CheckpointTrie.md).[lookupNode](CheckpointTrie.md#lookupnode)

#### Defined in

[baseTrie.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L285)

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

[CheckpointTrie](CheckpointTrie.md).[put](CheckpointTrie.md#put)

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

[CheckpointTrie](CheckpointTrie.md).[revert](CheckpointTrie.md#revert)

#### Defined in

[checkpointTrie.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L50)

___

### setRoot

▸ **setRoot**(`value?`): `void`

This method is deprecated.
Please use {@link Trie.root} instead.

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `Buffer` |

#### Returns

`void`

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[setRoot](CheckpointTrie.md#setroot)

#### Defined in

[baseTrie.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L98)

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Buffer` |  |
| `onFound` | `FoundNodeFunction` | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[walkTrie](CheckpointTrie.md#walktrie)

#### Defined in

[baseTrie.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L258)

___

### createProof

▸ `Static` **createProof**(`trie`, `key`): `Promise`<`Proof`\>

Creates a proof that can be verified using [SecureTrie.verifyProof](SecureTrie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`SecureTrie`](SecureTrie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<`Proof`\>

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[createProof](CheckpointTrie.md#createproof)

#### Defined in

[secure.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L68)

___

### fromProof

▸ `Static` **fromProof**(`proof`, `trie?`): `Promise`<[`BaseTrie`](BaseTrie.md)\>

Saves the nodes from a proof into the trie. If no trie is provided a new one wil be instantiated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | `Proof` |
| `trie?` | [`BaseTrie`](BaseTrie.md) |

#### Returns

`Promise`<[`BaseTrie`](BaseTrie.md)\>

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[fromProof](CheckpointTrie.md#fromproof)

#### Defined in

[baseTrie.ts:653](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L653)

___

### prove

▸ `Static` **prove**(`trie`, `key`): `Promise`<`Proof`\>

prove has been renamed to [SecureTrie.createProof](SecureTrie.md#createproof).

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`SecureTrie`](SecureTrie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<`Proof`\>

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[prove](CheckpointTrie.md#prove)

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
| `proof` | `Proof` |

#### Returns

`Promise`<``null`` \| `Buffer`\>

The value from the key.

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[verifyProof](CheckpointTrie.md#verifyproof)

#### Defined in

[secure.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L81)

___

### verifyRangeProof

▸ `Static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

Verifies a range proof.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Buffer` |
| `firstKey` | ``null`` \| `Buffer` |
| `lastKey` | ``null`` \| `Buffer` |
| `keys` | `Buffer`[] |
| `values` | `Buffer`[] |
| `proof` | ``null`` \| `Buffer`[] |

#### Returns

`Promise`<`boolean`\>

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[verifyRangeProof](CheckpointTrie.md#verifyrangeproof)

#### Defined in

[secure.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/secure.ts#L89)
