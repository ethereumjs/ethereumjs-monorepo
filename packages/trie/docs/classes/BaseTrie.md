[@ethereumjs/trie](../README.md) / BaseTrie

# Class: BaseTrie

The basic trie interface, use with `import { BaseTrie as Trie } from '@ethereumjs/trie'`.
In Ethereum applications stick with the [SecureTrie](SecureTrie.md) overlay.
The API for the base and the secure interface are about the same.

## Hierarchy

- **`BaseTrie`**

  ↳ [`CheckpointTrie`](CheckpointTrie.md)

## Table of contents

### Constructors

- [constructor](BaseTrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](BaseTrie.md#empty_trie_root)
- [db](BaseTrie.md#db)

### Accessors

- [isCheckpoint](BaseTrie.md#ischeckpoint)
- [root](BaseTrie.md#root)

### Methods

- [batch](BaseTrie.md#batch)
- [checkRoot](BaseTrie.md#checkroot)
- [copy](BaseTrie.md#copy)
- [createReadStream](BaseTrie.md#createreadstream)
- [del](BaseTrie.md#del)
- [findPath](BaseTrie.md#findpath)
- [get](BaseTrie.md#get)
- [lookupNode](BaseTrie.md#lookupnode)
- [put](BaseTrie.md#put)
- [setRoot](BaseTrie.md#setroot)
- [walkTrie](BaseTrie.md#walktrie)
- [createProof](BaseTrie.md#createproof)
- [fromProof](BaseTrie.md#fromproof)
- [prove](BaseTrie.md#prove)
- [verifyProof](BaseTrie.md#verifyproof)
- [verifyRangeProof](BaseTrie.md#verifyrangeproof)

## Constructors

### constructor

• **new BaseTrie**(`db?`, `root?`, `deleteFromDB?`)

test

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `db?` | ``null`` \| `LevelUp`<`AbstractLevelDOWN`<`any`, `any`\>, `AbstractIterator`<`any`, `any`\>\> | `undefined` | A [levelup](https://github.com/Level/levelup) instance. By default (if the db is `null` or left undefined) creates an in-memory [memdown](https://github.com/Level/memdown) instance. |
| `root?` | `Buffer` | `undefined` | A `Buffer` for the root of a previously stored trie |
| `deleteFromDB` | `boolean` | `false` | Delete nodes from DB on delete operations (disallows switching to an older state root) (default: `false`) |

#### Defined in

[baseTrie.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L60)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Defined in

[baseTrie.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L45)

___

### db

• **db**: `DB`

The backend DB

#### Defined in

[baseTrie.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L49)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

BaseTrie has no checkpointing so return false

#### Returns

`boolean`

#### Defined in

[baseTrie.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L121)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

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

#### Defined in

[baseTrie.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L105)

___

### copy

▸ **copy**(): [`BaseTrie`](BaseTrie.md)

Creates a new trie backed by the same db.

#### Returns

[`BaseTrie`](BaseTrie.md)

#### Defined in

[baseTrie.ts:755](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L755)

___

### createReadStream

▸ **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

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

#### Defined in

[baseTrie.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L147)

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

#### Defined in

[baseTrie.ts:704](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L704)

___

### verifyRangeProof

▸ `Static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

[verifyRangeProof](BaseTrie.md#verifyrangeproof)

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

#### Defined in

[baseTrie.ts:726](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L726)
