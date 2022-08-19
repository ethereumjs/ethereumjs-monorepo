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
- [dbStorage](SecureTrie.md#dbstorage)

### Accessors

- [isCheckpoint](SecureTrie.md#ischeckpoint)
- [root](SecureTrie.md#root)

### Methods

- [batch](SecureTrie.md#batch)
- [checkRoot](SecureTrie.md#checkroot)
- [checkpoint](SecureTrie.md#checkpoint)
- [commit](SecureTrie.md#commit)
- [copy](SecureTrie.md#copy)
- [createProof](SecureTrie.md#createproof)
- [createReadStream](SecureTrie.md#createreadstream)
- [del](SecureTrie.md#del)
- [findPath](SecureTrie.md#findpath)
- [fromProof](SecureTrie.md#fromproof)
- [get](SecureTrie.md#get)
- [lookupNode](SecureTrie.md#lookupnode)
- [persistRoot](SecureTrie.md#persistroot)
- [prove](SecureTrie.md#prove)
- [put](SecureTrie.md#put)
- [revert](SecureTrie.md#revert)
- [verifyProof](SecureTrie.md#verifyproof)
- [verifyRangeProof](SecureTrie.md#verifyrangeproof)
- [walkTrie](SecureTrie.md#walktrie)
- [create](SecureTrie.md#create)

## Constructors

### constructor

• **new SecureTrie**(`opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[constructor](CheckpointTrie.md#constructor)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L14)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[EMPTY_TRIE_ROOT](CheckpointTrie.md#empty_trie_root)

#### Defined in

[packages/trie/src/trie/trie.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L40)

___

### db

• **db**: [`CheckpointDB`](CheckpointDB.md)

The backend DB

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[db](CheckpointTrie.md#db)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L11)

___

### dbStorage

• **dbStorage**: [`DB`](../interfaces/DB.md)

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[dbStorage](CheckpointTrie.md#dbstorage)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L12)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Inherited from

CheckpointTrie.isCheckpoint

#### Defined in

[packages/trie/src/trie/checkpoint.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L23)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Inherited from

CheckpointTrie.root

#### Defined in

[packages/trie/src/trie/trie.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L97)

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

[packages/trie/src/trie/trie.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L85)

## Methods

### batch

▸ **batch**(`ops`): `Promise`<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

**`Example`**

```ts
const ops = [
   { type: 'del', key: Buffer.from('father') }
 , { type: 'put', key: Buffer.from('name'), value: Buffer.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Buffer.from('dob'), value: Buffer.from('16 February 1941') }
 , { type: 'put', key: Buffer.from('spouse'), value: Buffer.from('Kim Young-sook') }
 , { type: 'put', key: Buffer.from('occupation'), value: Buffer.from('Clown') }
]
await trie.batch(ops)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | [`BatchDBOp`](../README.md#batchdbop)[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[batch](CheckpointTrie.md#batch)

#### Defined in

[packages/trie/src/trie/trie.ts:623](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L623)

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

[packages/trie/src/trie/trie.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L104)

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

[packages/trie/src/trie/checkpoint.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L31)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

**`Throws`**

If not during a checkpoint phase

#### Returns

`Promise`<`void`\>

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[commit](CheckpointTrie.md#commit)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L40)

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

[packages/trie/src/trie/secure.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L107)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof that can be verified using [verifyProof](SecureTrie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[createProof](CheckpointTrie.md#createproof)

#### Defined in

[packages/trie/src/trie/secure.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L66)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[createReadStream](CheckpointTrie.md#createreadstream)

#### Defined in

[packages/trie/src/trie/trie.ts:733](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L733)

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

[packages/trie/src/trie/secure.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L49)

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

[packages/trie/src/trie/trie.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L192)

___

### fromProof

▸ **fromProof**(`proof`): `Promise`<`void`\>

Saves the nodes from a proof into the trie.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[fromProof](CheckpointTrie.md#fromproof)

#### Defined in

[packages/trie/src/trie/trie.ts:641](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L641)

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

[packages/trie/src/trie/secure.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L23)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<``null`` \| [`TrieNode`](../README.md#trienode)\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Buffer` \| `Buffer`[] |

#### Returns

`Promise`<``null`` \| [`TrieNode`](../README.md#trienode)\>

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[lookupNode](CheckpointTrie.md#lookupnode)

#### Defined in

[packages/trie/src/trie/trie.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L283)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[persistRoot](CheckpointTrie.md#persistroot)

#### Defined in

[packages/trie/src/trie/secure.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L124)

___

### prove

▸ **prove**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

prove has been renamed to [createProof](SecureTrie.md#createproof).

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[prove](CheckpointTrie.md#prove)

#### Defined in

[packages/trie/src/trie/secure.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L58)

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

[packages/trie/src/trie/secure.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L33)

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

[packages/trie/src/trie/checkpoint.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L56)

___

### verifyProof

▸ **verifyProof**(`rootHash`, `key`, `proof`): `Promise`<``null`` \| `Buffer`\>

Verifies a proof.

**`Throws`**

If proof is found to be invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Buffer` |
| `key` | `Buffer` |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<``null`` \| `Buffer`\>

The value from the key.

#### Overrides

[CheckpointTrie](CheckpointTrie.md).[verifyProof](CheckpointTrie.md#verifyproof)

#### Defined in

[packages/trie/src/trie/secure.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L78)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

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

[packages/trie/src/trie/secure.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/secure.ts#L85)

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Buffer` |  |
| `onFound` | [`FoundNodeFunction`](../README.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[walkTrie](CheckpointTrie.md#walktrie)

#### Defined in

[packages/trie/src/trie/trie.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L263)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`Trie`](Trie.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

#### Inherited from

[CheckpointTrie](CheckpointTrie.md).[create](CheckpointTrie.md#create)

#### Defined in

[packages/trie/src/trie/trie.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L70)
