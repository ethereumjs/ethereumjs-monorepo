[merkle-patricia-tree](../README.md) / [Exports](../modules.md) / [baseTrie](../modules/baseTrie.md) / Trie

# Class: Trie

[baseTrie](../modules/baseTrie.md).Trie

The basic trie interface, use with `import { BaseTrie as Trie } from 'merkle-patricia-tree'`.
In Ethereum applications stick with the [SecureTrie](secure.SecureTrie.md) overlay.
The API for the base and the secure interface are about the same.

## Hierarchy

- **`Trie`**

  ↳ [`CheckpointTrie`](checkpointTrie.CheckpointTrie.md)

## Table of contents

### Constructors

- [constructor](baseTrie.Trie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](baseTrie.Trie.md#empty_trie_root)
- [db](baseTrie.Trie.md#db)

### Accessors

- [isCheckpoint](baseTrie.Trie.md#ischeckpoint)
- [root](baseTrie.Trie.md#root)

### Methods

- [batch](baseTrie.Trie.md#batch)
- [checkRoot](baseTrie.Trie.md#checkroot)
- [copy](baseTrie.Trie.md#copy)
- [createReadStream](baseTrie.Trie.md#createreadstream)
- [del](baseTrie.Trie.md#del)
- [findPath](baseTrie.Trie.md#findpath)
- [get](baseTrie.Trie.md#get)
- [lookupNode](baseTrie.Trie.md#lookupnode)
- [put](baseTrie.Trie.md#put)
- [setRoot](baseTrie.Trie.md#setroot)
- [walkTrie](baseTrie.Trie.md#walktrie)
- [createProof](baseTrie.Trie.md#createproof)
- [fromProof](baseTrie.Trie.md#fromproof)
- [prove](baseTrie.Trie.md#prove)
- [verifyProof](baseTrie.Trie.md#verifyproof)

## Constructors

### constructor

• **new Trie**(`db?`, `root?`, `deleteFromDB?`)

test

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `db?` | ``null`` \| `LevelUp`<`AbstractLevelDOWN`<`any`, `any`\>, `AbstractIterator`<`any`, `any`\>\> | `undefined` | A [levelup](https://github.com/Level/levelup) instance. By default (if the db is `null` or left undefined) creates an in-memory [memdown](https://github.com/Level/memdown) instance. |
| `root?` | `Buffer` | `undefined` | A `Buffer` for the root of a previously stored trie |
| `deleteFromDB` | `boolean` | `false` | Delete nodes from DB on delete operations (disallows switching to an older state root) (default: `false`) |

#### Defined in

[baseTrie.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L59)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Defined in

[baseTrie.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L44)

___

### db

• **db**: `DB`

The backend DB

#### Defined in

[baseTrie.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L48)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

BaseTrie has no checkpointing so return false

#### Returns

`boolean`

#### Defined in

[baseTrie.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L120)

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

#### Defined in

[baseTrie.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L104)

___

### copy

▸ **copy**(): [`Trie`](baseTrie.Trie.md)

Creates a new trie backed by the same db.

#### Returns

[`Trie`](baseTrie.Trie.md)

#### Defined in

[baseTrie.ts:733](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L733)

___

### createReadStream

▸ **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

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

#### Defined in

[baseTrie.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L146)

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

#### Defined in

[baseTrie.ts:703](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/baseTrie.ts#L703)
