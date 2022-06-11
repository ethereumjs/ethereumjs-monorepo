[@ethereumjs/trie](../README.md) / CheckpointTrie

# Class: CheckpointTrie

Adds checkpointing to the [BaseTrie](BaseTrie.md)

## Hierarchy

- [`BaseTrie`](BaseTrie.md)

  ↳ **`CheckpointTrie`**

  ↳↳ [`SecureTrie`](SecureTrie.md)

## Table of contents

### Constructors

- [constructor](CheckpointTrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](CheckpointTrie.md#empty_trie_root)
- [db](CheckpointTrie.md#db)

### Accessors

- [isCheckpoint](CheckpointTrie.md#ischeckpoint)
- [root](CheckpointTrie.md#root)

### Methods

- [batch](CheckpointTrie.md#batch)
- [checkRoot](CheckpointTrie.md#checkroot)
- [checkpoint](CheckpointTrie.md#checkpoint)
- [commit](CheckpointTrie.md#commit)
- [copy](CheckpointTrie.md#copy)
- [createReadStream](CheckpointTrie.md#createreadstream)
- [del](CheckpointTrie.md#del)
- [findPath](CheckpointTrie.md#findpath)
- [get](CheckpointTrie.md#get)
- [lookupNode](CheckpointTrie.md#lookupnode)
- [put](CheckpointTrie.md#put)
- [revert](CheckpointTrie.md#revert)
- [setRoot](CheckpointTrie.md#setroot)
- [walkTrie](CheckpointTrie.md#walktrie)
- [createProof](CheckpointTrie.md#createproof)
- [fromProof](CheckpointTrie.md#fromproof)
- [prove](CheckpointTrie.md#prove)
- [verifyProof](CheckpointTrie.md#verifyproof)
- [verifyRangeProof](CheckpointTrie.md#verifyrangeproof)

## Constructors

### constructor

• **new CheckpointTrie**(...`args`)

test

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Overrides

[BaseTrie](BaseTrie.md).[constructor](BaseTrie.md#constructor)

#### Defined in

[checkpointTrie.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L10)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[BaseTrie](BaseTrie.md).[EMPTY_TRIE_ROOT](BaseTrie.md#empty_trie_root)

#### Defined in

[baseTrie.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L45)

___

### db

• **db**: `CheckpointDB`

The backend DB

#### Overrides

[BaseTrie](BaseTrie.md).[db](BaseTrie.md#db)

#### Defined in

[checkpointTrie.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L8)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Overrides

BaseTrie.isCheckpoint

#### Defined in

[checkpointTrie.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L18)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Inherited from

BaseTrie.root

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

BaseTrie.root

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

[BaseTrie](BaseTrie.md).[batch](BaseTrie.md#batch)

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

[BaseTrie](BaseTrie.md).[checkRoot](BaseTrie.md#checkroot)

#### Defined in

[baseTrie.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L105)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

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

#### Defined in

[checkpointTrie.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L35)

___

### copy

▸ **copy**(`includeCheckpoints?`): [`CheckpointTrie`](CheckpointTrie.md)

Returns a copy of the underlying trie with the interface of CheckpointTrie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

#### Returns

[`CheckpointTrie`](CheckpointTrie.md)

#### Overrides

[BaseTrie](BaseTrie.md).[copy](BaseTrie.md#copy)

#### Defined in

[checkpointTrie.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L64)

___

### createReadStream

▸ **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Inherited from

[BaseTrie](BaseTrie.md).[createReadStream](BaseTrie.md#createreadstream)

#### Defined in

[baseTrie.ts:748](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L748)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is deleted.

#### Inherited from

[BaseTrie](BaseTrie.md).[del](BaseTrie.md#del)

#### Defined in

[baseTrie.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L172)

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

[BaseTrie](BaseTrie.md).[findPath](BaseTrie.md#findpath)

#### Defined in

[baseTrie.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L187)

___

### get

▸ **get**(`key`, `throwIfMissing?`): `Promise`<``null`` \| `Buffer`\>

Gets a value given a `key`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Buffer` | `undefined` | the key to search for |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<``null`` \| `Buffer`\>

A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.

#### Inherited from

[BaseTrie](BaseTrie.md).[get](BaseTrie.md#get)

#### Defined in

[baseTrie.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L131)

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

[BaseTrie](BaseTrie.md).[lookupNode](BaseTrie.md#lookupnode)

#### Defined in

[baseTrie.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L285)

___

### put

▸ **put**(`key`, `value`): `Promise`<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is stored.

#### Inherited from

[BaseTrie](BaseTrie.md).[put](BaseTrie.md#put)

#### Defined in

[baseTrie.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L147)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

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

[BaseTrie](BaseTrie.md).[setRoot](BaseTrie.md#setroot)

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

[BaseTrie](BaseTrie.md).[walkTrie](BaseTrie.md#walktrie)

#### Defined in

[baseTrie.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L258)

___

### createProof

▸ `Static` **createProof**(`trie`, `key`): `Promise`<`Proof`\>

Creates a proof from a trie and key that can be verified using {@link Trie.verifyProof}.

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`BaseTrie`](BaseTrie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<`Proof`\>

#### Inherited from

[BaseTrie](BaseTrie.md).[createProof](BaseTrie.md#createproof)

#### Defined in

[baseTrie.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L688)

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

[BaseTrie](BaseTrie.md).[fromProof](BaseTrie.md#fromproof)

#### Defined in

[baseTrie.ts:653](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L653)

___

### prove

▸ `Static` **prove**(`trie`, `key`): `Promise`<`Proof`\>

prove has been renamed to {@link Trie.createProof}.

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`BaseTrie`](BaseTrie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<`Proof`\>

#### Inherited from

[BaseTrie](BaseTrie.md).[prove](BaseTrie.md#prove)

#### Defined in

[baseTrie.ts:679](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L679)

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

The value from the key, or null if valid proof of non-existence.

#### Inherited from

[BaseTrie](BaseTrie.md).[verifyProof](BaseTrie.md#verifyproof)

#### Defined in

[baseTrie.ts:704](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L704)

___

### verifyRangeProof

▸ `Static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

[verifyRangeProof](CheckpointTrie.md#verifyrangeproof)

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

#### Inherited from

[BaseTrie](BaseTrie.md).[verifyRangeProof](BaseTrie.md#verifyrangeproof)

#### Defined in

[baseTrie.ts:726](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L726)
