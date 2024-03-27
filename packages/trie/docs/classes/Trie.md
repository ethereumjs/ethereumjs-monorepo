[@ethereumjs/trie](../README.md) / Trie

# Class: Trie

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.

## Table of contents

### Constructors

- [constructor](Trie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](Trie.md#empty_trie_root)
- [walkTrieIterable](Trie.md#walktrieiterable)

### Methods

- [batch](Trie.md#batch)
- [checkRoot](Trie.md#checkroot)
- [checkpoint](Trie.md#checkpoint)
- [commit](Trie.md#commit)
- [createProof](Trie.md#createproof)
- [createReadStream](Trie.md#createreadstream)
- [database](Trie.md#database)
- [del](Trie.md#del)
- [findPath](Trie.md#findpath)
- [flushCheckpoints](Trie.md#flushcheckpoints)
- [fromProof](Trie.md#fromproof)
- [get](Trie.md#get)
- [hasCheckpoints](Trie.md#hascheckpoints)
- [lookupNode](Trie.md#lookupnode)
- [persistRoot](Trie.md#persistroot)
- [put](Trie.md#put)
- [revert](Trie.md#revert)
- [root](Trie.md#root)
- [saveStack](Trie.md#savestack)
- [shallowCopy](Trie.md#shallowcopy)
- [updateFromProof](Trie.md#updatefromproof)
- [verifyProof](Trie.md#verifyproof)
- [verifyPrunedIntegrity](Trie.md#verifyprunedintegrity)
- [verifyRangeProof](Trie.md#verifyrangeproof)
- [walkAllNodes](Trie.md#walkallnodes)
- [walkAllValueNodes](Trie.md#walkallvaluenodes)
- [walkTrie](Trie.md#walktrie)
- [create](Trie.md#create)
- [createFromProof](Trie.md#createfromproof)
- [fromProof](Trie.md#fromproof-1)
- [verifyProof](Trie.md#verifyproof-1)
- [verifyRangeProof](Trie.md#verifyrangeproof-1)

## Constructors

### constructor

• **new Trie**(`opts?`)

Creates a new trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | Options for instantiating the trie  Note: in most cases, the static [create](Trie.md#create) constructor should be used.  It uses the same API but provides sensible defaults |

#### Defined in

[packages/trie/src/trie.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L85)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Uint8Array`

The root for an empty trie

#### Defined in

[packages/trie/src/trie.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L66)

___

### walkTrieIterable

• **walkTrieIterable**: (...`args`: [nodeHash: Uint8Array, currentKey: number[], onFound: OnFound, filter: NodeFilter, visited: Set<string\>]) => `AsyncIterable`<{ `currentKey`: `number`[] ; `node`: [`TrieNode`](../README.md#trienode)  }\>

#### Type declaration

▸ (...`args`): `AsyncIterable`<{ `currentKey`: `number`[] ; `node`: [`TrieNode`](../README.md#trienode)  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [nodeHash: Uint8Array, currentKey: number[], onFound: OnFound, filter: NodeFilter, visited: Set<string\>] |

##### Returns

`AsyncIterable`<{ `currentKey`: `number`[] ; `node`: [`TrieNode`](../README.md#trienode)  }\>

#### Defined in

[packages/trie/src/trie.ts:738](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L738)

## Methods

### batch

▸ **batch**(`ops`, `skipKeyTransform?`): `Promise`<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

**`Example`**

```ts
const ops = [
   { type: 'del', key: Uint8Array.from('father') }
 , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
 , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') }
 , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
]
await trie.batch(ops)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | `BatchDBOp`<`Uint8Array`, `Uint8Array`\>[] |
| `skipKeyTransform?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1139)

___

### checkRoot

▸ **checkRoot**(`root`): `Promise`<`boolean`\>

Checks if a given root exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:458](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L458)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1306)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

**`Throws`**

If not during a checkpoint phase

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1316)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof from a trie and key that can be verified using [verifyProof](Trie.md#verifyproof-1). An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
serialized branch, extension, and/or leaf nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | key to create a proof for |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[packages/trie/src/trie.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L269)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

[packages/trie/src/trie.ts:1211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1211)

___

### database

▸ **database**(`db?`, `valueEncoding?`): [`CheckpointDB`](CheckpointDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `db?` | `DB`<`string`, `string` \| `Uint8Array`\> |
| `valueEncoding?` | `ValueEncoding` |

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Defined in

[packages/trie/src/trie.ts:423](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L423)

___

### del

▸ **del**(`key`, `skipKeyTransform?`): `Promise`<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` |
| `skipKeyTransform` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is deleted.

#### Defined in

[packages/trie/src/trie.ts:559](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L559)

___

### findPath

▸ **findPath**(`key`, `throwIfMissing?`, `partialPath?`): `Promise`<[`Path`](../interfaces/Path.md)\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | the search key |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |
| `partialPath` | `Object` | `undefined` | - |
| `partialPath.stack` | [`TrieNode`](../README.md#trienode)[] | `undefined` | - |

#### Returns

`Promise`<[`Path`](../interfaces/Path.md)\>

#### Defined in

[packages/trie/src/trie.ts:599](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L599)

___

### flushCheckpoints

▸ **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1348](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1348)

___

### fromProof

▸ **fromProof**(`proof`): `Promise`<`void`\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. An EIP-1186 proof contains the encoded trie nodes from the root
node to the leaf node storing state data. This function does not check if the proof has the same expected root. A static version of this function exists
with the same name.

**`Deprecated`**

Use `updateFromProof`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | an EIP-1186 proof to update the trie from |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:369](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L369)

___

### get

▸ **get**(`key`, `throwIfMissing?`): `Promise`<``null`` \| `Uint8Array`\>

Gets a value given a `key`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | the key to search for |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<``null`` \| `Uint8Array`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

#### Defined in

[packages/trie/src/trie.ts:477](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L477)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/trie.ts:1298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1298)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<[`TrieNode`](../README.md#trienode)\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

`Promise`<[`TrieNode`](../README.md#trienode)\>

#### Defined in

[packages/trie/src/trie.ts:787](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L787)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1245)

___

### put

▸ **put**(`key`, `value`, `skipKeyTransform?`): `Promise`<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` |
| `value` | ``null`` \| `Uint8Array` | `undefined` |
| `skipKeyTransform` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is stored.

#### Defined in

[packages/trie/src/trie.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L495)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1332)

___

### root

▸ **root**(`value?`): `Uint8Array`

Gets and/or Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | ``null`` \| `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/trie.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L438)

___

### saveStack

▸ **saveStack**(`key`, `stack`, `opStack`): `Promise`<`void`\>

Saves a stack of nodes to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) | the key. Should follow the stack |
| `stack` | [`TrieNode`](../README.md#trienode)[] | a stack of nodes to the value given by the key |
| `opStack` | `BatchDBOp`<`Uint8Array`, `Uint8Array`\>[] | a stack of levelup operations to commit at the end of this function |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1053](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1053)

___

### shallowCopy

▸ **shallowCopy**(`includeCheckpoints?`, `opts?`): [`Trie`](Trie.md)

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |
| `opts?` | [`TrieShallowCopyOpts`](../interfaces/TrieShallowCopyOpts.md) | `undefined` | - |

#### Returns

[`Trie`](Trie.md)

#### Defined in

[packages/trie/src/trie.ts:1228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1228)

___

### updateFromProof

▸ **updateFromProof**(`proof`, `shouldVerifyRoot?`): `Promise`<`undefined` \| `Uint8Array`\>

Updates a trie from a proof by putting all the nodes in the proof into the trie. If a trie is being updated with multiple proofs, {@param shouldVerifyRoot} can
be passed as false in order to not immediately throw on an unexpected root, so that root verification can happen after all proofs and their nodes have been added.
An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | `undefined` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from. |
| `shouldVerifyRoot` | `boolean` | `false` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`<`undefined` \| `Uint8Array`\>

The root of the proof

#### Defined in

[packages/trie/src/trie.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L287)

___

### verifyProof

▸ **verifyProof**(`rootHash`, `key`, `proof`): `Promise`<``null`` \| `Uint8Array`\>

Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
contains the encoded trie nodes from the root node to the leaf node storing state data. A static version of this function exists with the same name.

**`Throws`**

If proof is found to be invalid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | Root hash of the trie that this proof was created from and is being verified for |
| `key` | `Uint8Array` | Key that is being verified and that the proof is created for |
| `proof` | [`Proof`](../README.md#proof) | an EIP-1186 proof to verify the key against |

#### Returns

`Promise`<``null`` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Defined in

[packages/trie/src/trie.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L322)

___

### verifyPrunedIntegrity

▸ **verifyPrunedIntegrity**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:1157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1157)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](../README.md#verifyrangeproof). A static
version of this function also exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | ``null`` \| `Uint8Array` | first key of range being proven. |
| `lastKey` | ``null`` \| `Uint8Array` | last key of range being proven. |
| `keys` | `Uint8Array`[] | key list of leaf data being proven. |
| `values` | `Uint8Array`[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Uint8Array`[] | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |

#### Returns

`Promise`<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

[packages/trie/src/trie.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L244)

___

### walkAllNodes

▸ **walkAllNodes**(`onFound`): `Promise`<`void`\>

Executes a callback for each node in the trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Defined in

[packages/trie/src/trie.ts:745](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L745)

___

### walkAllValueNodes

▸ **walkAllValueNodes**(`onFound`): `Promise`<`void`\>

Executes a callback for each value node in the trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Defined in

[packages/trie/src/trie.ts:756](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L756)

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Uint8Array` |  |
| `onFound` | [`FoundNodeFunction`](../README.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Defined in

[packages/trie/src/trie.ts:734](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L734)

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

[packages/trie/src/trie.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L382)

___

### createFromProof

▸ `Static` **createFromProof**(`proof`, `trieOpts?`, `shouldVerifyRoot?`): `Promise`<[`Trie`](Trie.md)\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | `undefined` | an EIP-1186 proof to create trie from |
| `trieOpts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | `undefined` | trie opts to be applied to returned trie |
| `shouldVerifyRoot` | `boolean` | `false` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

new trie created from given proof

#### Defined in

[packages/trie/src/trie.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L144)

___

### fromProof

▸ `Static` **fromProof**(`proof`, `opts?`): `Promise`<[`Trie`](Trie.md)\>

Static version of fromProof function. If a root is provided in the opts param, the proof will be checked to have the same expected root. An
(EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

**`Deprecated`**

Use `createFromProof`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data. |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | - |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

#### Defined in

[packages/trie/src/trie.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L220)

___

### verifyProof

▸ `Static` **verifyProof**(`key`, `proof`, `opts?`): `Promise`<``null`` \| `Uint8Array`\>

Static version of verifyProof function with the same behavior. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

**`Throws`**

If proof is found to be invalid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | Key that is being verified and that the proof is created for |
| `proof` | [`Proof`](../README.md#proof) | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data. |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | optional, the opts may include a custom hashing function to use with the trie for proof verification |

#### Returns

`Promise`<``null`` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Defined in

[packages/trie/src/trie.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L166)

___

### verifyRangeProof

▸ `Static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `opts?`): `Promise`<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](../README.md#verifyrangeproof). A static
version of this function also exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | ``null`` \| `Uint8Array` | first key of range being proven. |
| `lastKey` | ``null`` \| `Uint8Array` | last key of range being proven. |
| `keys` | `Uint8Array`[] | key list of leaf data being proven. |
| `values` | `Uint8Array`[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Uint8Array`[] | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | optional, the opts may include a custom hashing function to use with the trie for proof verification |

#### Returns

`Promise`<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

[packages/trie/src/trie.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L194)
