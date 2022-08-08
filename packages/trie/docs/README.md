@ethereumjs/trie

# @ethereumjs/trie

## Table of contents

### Classes

- [BranchNode](classes/BranchNode.md)
- [CheckpointDB](classes/CheckpointDB.md)
- [CheckpointTrie](classes/CheckpointTrie.md)
- [ExtensionNode](classes/ExtensionNode.md)
- [LeafNode](classes/LeafNode.md)
- [LevelDB](classes/LevelDB.md)
- [PrioritizedTaskExecutor](classes/PrioritizedTaskExecutor.md)
- [SecureTrie](classes/SecureTrie.md)
- [Trie](classes/Trie.md)
- [TrieReadStream](classes/TrieReadStream.md)
- [WalkController](classes/WalkController.md)

### Interfaces

- [DB](interfaces/DB.md)
- [DelBatch](interfaces/DelBatch.md)
- [PutBatch](interfaces/PutBatch.md)
- [TrieOpts](interfaces/TrieOpts.md)

### Type Aliases

- [BatchDBOp](README.md#batchdbop)
- [Checkpoint](README.md#checkpoint)
- [EmbeddedNode](README.md#embeddednode)
- [FoundNodeFunction](README.md#foundnodefunction)
- [HashFunc](README.md#hashfunc)
- [Nibbles](README.md#nibbles)
- [Proof](README.md#proof)
- [TrieNode](README.md#trienode)

### Variables

- [ENCODING\_OPTS](README.md#encoding_opts)
- [ROOT\_DB\_KEY](README.md#root_db_key)

### Functions

- [decodeNode](README.md#decodenode)
- [decodeRawNode](README.md#decoderawnode)
- [isRawNode](README.md#israwnode)
- [verifyRangeProof](README.md#verifyrangeproof)

## Type Aliases

### BatchDBOp

Ƭ **BatchDBOp**: [`PutBatch`](interfaces/PutBatch.md) \| [`DelBatch`](interfaces/DelBatch.md)

#### Defined in

[packages/trie/src/types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L49)

___

### Checkpoint

Ƭ **Checkpoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keyValueMap` | `Map`<`string`, `Buffer` \| ``null``\> |
| `root` | `Buffer` |

#### Defined in

[packages/trie/src/types.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L96)

___

### EmbeddedNode

Ƭ **EmbeddedNode**: `Buffer` \| `Buffer`[]

#### Defined in

[packages/trie/src/types.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L10)

___

### FoundNodeFunction

Ƭ **FoundNodeFunction**: (`nodeRef`: `Buffer`, `node`: [`TrieNode`](README.md#trienode) \| ``null``, `key`: [`Nibbles`](README.md#nibbles), `walkController`: [`WalkController`](classes/WalkController.md)) => `void`

#### Type declaration

▸ (`nodeRef`, `node`, `key`, `walkController`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `nodeRef` | `Buffer` |
| `node` | [`TrieNode`](README.md#trienode) \| ``null`` |
| `key` | [`Nibbles`](README.md#nibbles) |
| `walkController` | [`WalkController`](classes/WalkController.md) |

##### Returns

`void`

#### Defined in

[packages/trie/src/types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L14)

___

### HashFunc

Ƭ **HashFunc**: (`msg`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`msg`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/types.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L21)

___

### Nibbles

Ƭ **Nibbles**: `number`[]

#### Defined in

[packages/trie/src/types.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L6)

___

### Proof

Ƭ **Proof**: `Buffer`[]

#### Defined in

[packages/trie/src/types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L12)

___

### TrieNode

Ƭ **TrieNode**: [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/types.ts:4](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L4)

## Variables

### ENCODING\_OPTS

• `Const` **ENCODING\_OPTS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keyEncoding` | `string` |
| `valueEncoding` | `string` |

#### Defined in

[packages/trie/src/db/level.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L8)

___

### ROOT\_DB\_KEY

• `Const` **ROOT\_DB\_KEY**: `Buffer`

#### Defined in

[packages/trie/src/types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L103)

## Functions

### decodeNode

▸ **decodeNode**(`raw`): [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `Buffer` |

#### Returns

[`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/trie/node/util.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/util.ts#L24)

___

### decodeRawNode

▸ **decodeRawNode**(`raw`): [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `Buffer`[] |

#### Returns

[`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/trie/node/util.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/util.ts#L10)

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

[packages/trie/src/trie/node/util.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/util.ts#L32)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `hash`): `Promise`<`boolean`\>

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

- Two edge elements proof. In this case two existent or non-existent proof(fisrt and last) should be provided.

NOTE: Currently only supports verification when the length of firstKey and lastKey are the same.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Buffer` | root hash. |
| `firstKey` | ``null`` \| [`Nibbles`](README.md#nibbles) | first key. |
| `lastKey` | ``null`` \| [`Nibbles`](README.md#nibbles) | last key. |
| `keys` | [`Nibbles`](README.md#nibbles)[] | key list. |
| `values` | `Buffer`[] | value list, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Buffer`[] | proof node list, if proof is null, both `firstKey` and `lastKey` must be null |
| `hash` | [`HashFunc`](README.md#hashfunc) | - |

#### Returns

`Promise`<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

[packages/trie/src/proof/range.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/proof/range.ts#L409)
