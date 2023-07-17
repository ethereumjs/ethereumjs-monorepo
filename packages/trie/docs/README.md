@ethereumjs/trie

# @ethereumjs/trie

## Table of contents

### Classes

- [BranchNode](classes/BranchNode.md)
- [CheckpointDB](classes/CheckpointDB.md)
- [ExtensionNode](classes/ExtensionNode.md)
- [LeafNode](classes/LeafNode.md)
- [PrioritizedTaskExecutor](classes/PrioritizedTaskExecutor.md)
- [Trie](classes/Trie.md)
- [TrieReadStream](classes/TrieReadStream.md)
- [WalkController](classes/WalkController.md)

### Interfaces

- [CheckpointDBOpts](interfaces/CheckpointDBOpts.md)
- [TrieOpts](interfaces/TrieOpts.md)

### Type Aliases

- [Checkpoint](README.md#checkpoint)
- [EmbeddedNode](README.md#embeddednode)
- [FoundNodeFunction](README.md#foundnodefunction)
- [HashKeysFunction](README.md#hashkeysfunction)
- [Nibbles](README.md#nibbles)
- [Proof](README.md#proof)
- [TrieNode](README.md#trienode)
- [TrieOptsWithDefaults](README.md#trieoptswithdefaults)

### Variables

- [ROOT\_DB\_KEY](README.md#root_db_key)

### Functions

- [decodeNode](README.md#decodenode)
- [decodeRawNode](README.md#decoderawnode)
- [genesisStateRoot](README.md#genesisstateroot)
- [isRawNode](README.md#israwnode)
- [verifyRangeProof](README.md#verifyrangeproof)

## Type Aliases

### Checkpoint

Ƭ **Checkpoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keyValueMap` | `Map`<`string`, `Uint8Array` \| `undefined`\> |
| `root` | `Uint8Array` |

#### Defined in

[packages/trie/src/types.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L95)

___

### EmbeddedNode

Ƭ **EmbeddedNode**: `Uint8Array` \| `Uint8Array`[]

#### Defined in

[packages/trie/src/types.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L13)

___

### FoundNodeFunction

Ƭ **FoundNodeFunction**: (`nodeRef`: `Uint8Array`, `node`: [`TrieNode`](README.md#trienode) \| ``null``, `key`: [`Nibbles`](README.md#nibbles), `walkController`: [`WalkController`](classes/WalkController.md)) => `void`

#### Type declaration

▸ (`nodeRef`, `node`, `key`, `walkController`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `nodeRef` | `Uint8Array` |
| `node` | [`TrieNode`](README.md#trienode) \| ``null`` |
| `key` | [`Nibbles`](README.md#nibbles) |
| `walkController` | [`WalkController`](classes/WalkController.md) |

##### Returns

`void`

#### Defined in

[packages/trie/src/types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L17)

___

### HashKeysFunction

Ƭ **HashKeysFunction**: (`msg`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`msg`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/types.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L24)

___

### Nibbles

Ƭ **Nibbles**: `number`[]

#### Defined in

[packages/trie/src/types.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L9)

___

### Proof

Ƭ **Proof**: `Uint8Array`[]

#### Defined in

[packages/trie/src/types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L15)

___

### TrieNode

Ƭ **TrieNode**: [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/types.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L7)

___

### TrieOptsWithDefaults

Ƭ **TrieOptsWithDefaults**: [`TrieOpts`](interfaces/TrieOpts.md) & { `cacheSize`: `number` ; `useKeyHashing`: `boolean` ; `useKeyHashingFunction`: [`HashKeysFunction`](README.md#hashkeysfunction) ; `useNodePruning`: `boolean` ; `useRootPersistence`: `boolean`  }

#### Defined in

[packages/trie/src/types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L75)

## Variables

### ROOT\_DB\_KEY

• `Const` **ROOT\_DB\_KEY**: `Uint8Array`

#### Defined in

[packages/trie/src/types.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L102)

## Functions

### decodeNode

▸ **decodeNode**(`raw`): [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `Uint8Array` |

#### Returns

[`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/node/util.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/util.ts#L24)

___

### decodeRawNode

▸ **decodeRawNode**(`raw`): [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `Uint8Array`[] |

#### Returns

[`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/node/util.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/util.ts#L10)

___

### genesisStateRoot

▸ **genesisStateRoot**(`genesisState`): `Promise`<`Uint8Array`\>

Derives the stateRoot of the genesis block based on genesis allocations

#### Parameters

| Name | Type |
| :------ | :------ |
| `genesisState` | `GenesisState` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[packages/trie/src/util/genesisState.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/genesisState.ts#L12)

___

### isRawNode

▸ **isRawNode**(`n`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/trie/src/node/util.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/util.ts#L32)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `useKeyHashingFunction`): `Promise`<`boolean`\>

verifyRangeProof checks whether the given leaf nodes and edge proof
can prove the given trie leaves range is matched with the specific root.

There are four situations:

- All elements proof. In this case the proof can be null, but the range should
  be all the leaves in the trie.

- One element proof. In this case no matter the edge proof is a non-existent
  proof or not, we can always verify the correctness of the proof.

- Zero element proof. In this case a single non-existent proof is enough to prove.
  Besides, if there are still some other leaves available on the right side, then
  an error will be returned.

- Two edge elements proof. In this case two existent or non-existent proof(first and last) should be provided.

NOTE: Currently only supports verification when the length of firstKey and lastKey are the same.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | root hash. |
| `firstKey` | ``null`` \| [`Nibbles`](README.md#nibbles) | first key. |
| `lastKey` | ``null`` \| [`Nibbles`](README.md#nibbles) | last key. |
| `keys` | [`Nibbles`](README.md#nibbles)[] | key list. |
| `values` | `Uint8Array`[] | value list, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Uint8Array`[] | proof node list, if proof is null, both `firstKey` and `lastKey` must be null |
| `useKeyHashingFunction` | [`HashKeysFunction`](README.md#hashkeysfunction) | - |

#### Returns

`Promise`<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

[packages/trie/src/proof/range.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/proof/range.ts#L413)
