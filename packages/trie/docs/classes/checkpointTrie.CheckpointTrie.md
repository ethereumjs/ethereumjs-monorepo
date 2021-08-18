[merkle-patricia-tree](../README.md) / [Exports](../modules.md) / [checkpointTrie](../modules/checkpointTrie.md) / CheckpointTrie

# Class: CheckpointTrie

[checkpointTrie](../modules/checkpointTrie.md).CheckpointTrie

Adds checkpointing to the {@link BaseTrie}

## Hierarchy

- [`Trie`](baseTrie.Trie.md)

  ↳ **`CheckpointTrie`**

  ↳↳ [`SecureTrie`](secure.SecureTrie.md)

## Table of contents

### Constructors

- [constructor](checkpointTrie.CheckpointTrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](checkpointTrie.CheckpointTrie.md#empty_trie_root)
- [db](checkpointTrie.CheckpointTrie.md#db)

### Accessors

- [isCheckpoint](checkpointTrie.CheckpointTrie.md#ischeckpoint)
- [root](checkpointTrie.CheckpointTrie.md#root)

### Methods

- [batch](checkpointTrie.CheckpointTrie.md#batch)
- [checkRoot](checkpointTrie.CheckpointTrie.md#checkroot)
- [checkpoint](checkpointTrie.CheckpointTrie.md#checkpoint)
- [commit](checkpointTrie.CheckpointTrie.md#commit)
- [copy](checkpointTrie.CheckpointTrie.md#copy)
- [createReadStream](checkpointTrie.CheckpointTrie.md#createreadstream)
- [del](checkpointTrie.CheckpointTrie.md#del)
- [findPath](checkpointTrie.CheckpointTrie.md#findpath)
- [get](checkpointTrie.CheckpointTrie.md#get)
- [lookupNode](checkpointTrie.CheckpointTrie.md#lookupnode)
- [put](checkpointTrie.CheckpointTrie.md#put)
- [revert](checkpointTrie.CheckpointTrie.md#revert)
- [setRoot](checkpointTrie.CheckpointTrie.md#setroot)
- [walkTrie](checkpointTrie.CheckpointTrie.md#walktrie)
- [createProof](checkpointTrie.CheckpointTrie.md#createproof)
- [fromProof](checkpointTrie.CheckpointTrie.md#fromproof)
- [prove](checkpointTrie.CheckpointTrie.md#prove)
- [verifyProof](checkpointTrie.CheckpointTrie.md#verifyproof)

## Constructors

### constructor

• **new CheckpointTrie**(...`args`)

test

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

#### Overrides

[Trie](baseTrie.Trie.md).[constructor](baseTrie.Trie.md#constructor)

#### Defined in

[checkpointTrie.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/checkpointTrie.ts#L10)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[Trie](baseTrie.Trie.md).[EMPTY_TRIE_ROOT](baseTrie.Trie.md#empty_trie_root)

#### Defined in

[baseTrie.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L44)

___

### db

• **db**: `CheckpointDB`

The backend DB

#### Overrides

[Trie](baseTrie.Trie.md).[db](baseTrie.Trie.md#db)

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

[Trie](baseTrie.Trie.md).[batch](baseTrie.Trie.md#batch)

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

[Trie](baseTrie.Trie.md).[checkRoot](baseTrie.Trie.md#checkroot)

#### Defined in

[baseTrie.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L104)

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

▸ **copy**(`includeCheckpoints?`): [`CheckpointTrie`](checkpointTrie.CheckpointTrie.md)

Returns a copy of the underlying trie with the interface of CheckpointTrie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

#### Returns

[`CheckpointTrie`](checkpointTrie.CheckpointTrie.md)

#### Overrides

[Trie](baseTrie.Trie.md).[copy](baseTrie.Trie.md#copy)

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

[Trie](baseTrie.Trie.md).[createReadStream](baseTrie.Trie.md#createreadstream)

#### Defined in

[baseTrie.ts:726](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L726)

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

[Trie](baseTrie.Trie.md).[del](baseTrie.Trie.md#del)

#### Defined in

[baseTrie.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L171)

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

[Trie](baseTrie.Trie.md).[findPath](baseTrie.Trie.md#findpath)

#### Defined in

[baseTrie.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L186)

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

[Trie](baseTrie.Trie.md).[get](baseTrie.Trie.md#get)

#### Defined in

[baseTrie.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L130)

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

[Trie](baseTrie.Trie.md).[lookupNode](baseTrie.Trie.md#lookupnode)

#### Defined in

[baseTrie.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L284)

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

[Trie](baseTrie.Trie.md).[put](baseTrie.Trie.md#put)

#### Defined in

[baseTrie.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L146)

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
Please use [Trie.root](baseTrie.Trie.md#root) instead.

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `Buffer` |

#### Returns

`void`

#### Inherited from

[Trie](baseTrie.Trie.md).[setRoot](baseTrie.Trie.md#setroot)

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

[Trie](baseTrie.Trie.md).[walkTrie](baseTrie.Trie.md#walktrie)

#### Defined in

[baseTrie.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L257)

___

### createProof

▸ `Static` **createProof**(`trie`, `key`): `Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

Creates a proof from a trie and key that can be verified using [Trie.verifyProof](baseTrie.Trie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`Trie`](baseTrie.Trie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

#### Inherited from

[Trie](baseTrie.Trie.md).[createProof](baseTrie.Trie.md#createproof)

#### Defined in

[baseTrie.ts:687](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L687)

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

[Trie](baseTrie.Trie.md).[fromProof](baseTrie.Trie.md#fromproof)

#### Defined in

[baseTrie.ts:652](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L652)

___

### prove

▸ `Static` **prove**(`trie`, `key`): `Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

prove has been renamed to [Trie.createProof](baseTrie.Trie.md#createproof).

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `trie` | [`Trie`](baseTrie.Trie.md) |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../modules/baseTrie.md#proof)\>

#### Inherited from

[Trie](baseTrie.Trie.md).[prove](baseTrie.Trie.md#prove)

#### Defined in

[baseTrie.ts:678](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L678)

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

The value from the key, or null if valid proof of non-existence.

#### Inherited from

[Trie](baseTrie.Trie.md).[verifyProof](baseTrie.Trie.md#verifyproof)

#### Defined in

[baseTrie.ts:703](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L703)
