[@ethereumjs/trie](../README.md) / Trie

# Class: Trie

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.
In Ethereum applications stick with the [SecureTrie](SecureTrie.md) overlay.
The API for the base and the secure interface are about the same.

## Hierarchy

- **`Trie`**

  ↳ [`CheckpointTrie`](CheckpointTrie.md)

## Table of contents

### Constructors

- [constructor](Trie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](Trie.md#empty_trie_root)
- [db](Trie.md#db)

### Accessors

- [isCheckpoint](Trie.md#ischeckpoint)
- [root](Trie.md#root)

### Methods

- [batch](Trie.md#batch)
- [checkRoot](Trie.md#checkroot)
- [copy](Trie.md#copy)
- [createProof](Trie.md#createproof)
- [createReadStream](Trie.md#createreadstream)
- [del](Trie.md#del)
- [findPath](Trie.md#findpath)
- [fromProof](Trie.md#fromproof)
- [get](Trie.md#get)
- [lookupNode](Trie.md#lookupnode)
- [persistRoot](Trie.md#persistroot)
- [prove](Trie.md#prove)
- [put](Trie.md#put)
- [verifyProof](Trie.md#verifyproof)
- [verifyRangeProof](Trie.md#verifyrangeproof)
- [walkTrie](Trie.md#walktrie)
- [create](Trie.md#create)

## Constructors

### constructor

• **new Trie**(`opts?`)

Create a new trie

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | Options for instantiating the trie |

#### Defined in

[packages/trie/src/trie/trie.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L53)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Defined in

[packages/trie/src/trie/trie.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L38)

___

### db

• **db**: [`DB`](../interfaces/DB.md)

The backend DB

#### Defined in

[packages/trie/src/trie/trie.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L42)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Trie has no checkpointing so return false

#### Returns

`boolean`

#### Defined in

[packages/trie/src/trie/trie.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L127)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/trie.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L104)

• `set` **root**(`value`): `void`

Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/trie.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L92)

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

#### Defined in

[packages/trie/src/trie/trie.ts:630](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L630)

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

[packages/trie/src/trie/trie.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L111)

___

### copy

▸ **copy**(): [`Trie`](Trie.md)

Creates a new trie backed by the same db.

#### Returns

[`Trie`](Trie.md)

#### Defined in

[packages/trie/src/trie/trie.ts:747](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L747)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof from a trie and key that can be verified using [verifyProof](Trie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[packages/trie/src/trie/trie.ts:679](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L679)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

[packages/trie/src/trie/trie.ts:740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L740)

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

[packages/trie/src/trie/trie.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L183)

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

[packages/trie/src/trie/trie.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L199)

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

#### Defined in

[packages/trie/src/trie/trie.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L648)

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

[packages/trie/src/trie/trie.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L137)

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

#### Defined in

[packages/trie/src/trie/trie.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L290)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie/trie.ts:760](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L760)

___

### prove

▸ **prove**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

prove has been renamed to [createProof](Trie.md#createproof).

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[packages/trie/src/trie/trie.ts:671](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L671)

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

[packages/trie/src/trie/trie.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L153)

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

The value from the key, or null if valid proof of non-existence.

#### Defined in

[packages/trie/src/trie/trie.ts:695](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L695)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

[verifyRangeProof](../README.md#verifyrangeproof)

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

[packages/trie/src/trie/trie.ts:717](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L717)

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

#### Defined in

[packages/trie/src/trie/trie.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L270)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`Trie`](Trie.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

#### Defined in

[packages/trie/src/trie/trie.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L73)
