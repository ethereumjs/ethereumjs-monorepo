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
- [CommonInterface](interfaces/CommonInterface.md)
- [Path](interfaces/Path.md)
- [TrieOpts](interfaces/TrieOpts.md)
- [TrieShallowCopyOpts](interfaces/TrieShallowCopyOpts.md)

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

- [byteTypeToNibbleType](README.md#bytetypetonibbletype)
- [bytesToNibbles](README.md#bytestonibbles)
- [compactBytesToNibbles](README.md#compactbytestonibbles)
- [decodeNode](README.md#decodenode)
- [decodeRawNode](README.md#decoderawnode)
- [genesisStateRoot](README.md#genesisstateroot)
- [hasTerminator](README.md#hasterminator)
- [hexToKeybytes](README.md#hextokeybytes)
- [isRawNode](README.md#israwnode)
- [mergeAndFormatKeyPaths](README.md#mergeandformatkeypaths)
- [nibbleTypeToByteType](README.md#nibbletypetobytetype)
- [nibbleTypeToPackedBytes](README.md#nibbletypetopackedbytes)
- [nibblesToBytes](README.md#nibblestobytes)
- [nibblesToCompactBytes](README.md#nibblestocompactbytes)
- [pathToHexKey](README.md#pathtohexkey)
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

[packages/trie/src/types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L135)

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

[packages/trie/src/types.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L29)

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

[packages/trie/src/types.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L36)

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

[packages/trie/src/types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L105)

## Variables

### ROOT\_DB\_KEY

• `Const` **ROOT\_DB\_KEY**: `Uint8Array`

#### Defined in

[packages/trie/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L142)

## Functions

### byteTypeToNibbleType

▸ **byteTypeToNibbleType**(`key`): [`Nibbles`](README.md#nibbles)

Turns each byte into a single nibble, only extracting the lower nibble of each byte

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | Uint8Array typed byte array |

#### Returns

[`Nibbles`](README.md#nibbles)

Nibble typed nibble array

#### Defined in

[packages/trie/src/util/encoding.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L144)

___

### bytesToNibbles

▸ **bytesToNibbles**(`str`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/util/encoding.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L77)

___

### compactBytesToNibbles

▸ **compactBytesToNibbles**(`compact`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `compact` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/util/encoding.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L91)

___

### decodeNode

▸ **decodeNode**(`node`): [`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` |

#### Returns

[`BranchNode`](classes/BranchNode.md) \| [`ExtensionNode`](classes/ExtensionNode.md) \| [`LeafNode`](classes/LeafNode.md)

#### Defined in

[packages/trie/src/node/util.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/util.ts#L30)

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

[packages/trie/src/node/util.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/util.ts#L12)

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

### hasTerminator

▸ **hasTerminator**(`nibbles`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nibbles` | `Uint8Array` |

#### Returns

`boolean`

boolean indicating if input hex nibble sequence has terminator indicating leaf-node
         terminator is represented with 16 because a nibble ranges from 0 - 15(f)

#### Defined in

[packages/trie/src/util/encoding.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L31)

___

### hexToKeybytes

▸ **hexToKeybytes**(`hex`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/util/encoding.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L41)

___

### isRawNode

▸ **isRawNode**(`n`): n is Uint8Array[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `Uint8Array` \| `NestedUint8Array` |

#### Returns

n is Uint8Array[]

#### Defined in

[packages/trie/src/node/util.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/util.ts#L26)

___

### mergeAndFormatKeyPaths

▸ **mergeAndFormatKeyPaths**(`pathStrings`): `Uint8Array`[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathStrings` | `string`[] |

#### Returns

`Uint8Array`[][]

#### Defined in

[packages/trie/src/util/encoding.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L175)

___

### nibbleTypeToByteType

▸ **nibbleTypeToByteType**(`arr`): `Uint8Array`

Converts each nibble into a single byte

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | [`Nibbles`](README.md#nibbles) | Nibble typed nibble array |

#### Returns

`Uint8Array`

Uint8Array typed byte array

#### Defined in

[packages/trie/src/util/encoding.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L128)

___

### nibbleTypeToPackedBytes

▸ **nibbleTypeToPackedBytes**(`arr`): `Uint8Array`

Packs every two nibbles into a single byte

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | [`Nibbles`](README.md#nibbles) | Nibble typed nibble array |

#### Returns

`Uint8Array`

Uint8Array typed byte array

#### Defined in

[packages/trie/src/util/encoding.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L112)

___

### nibblesToBytes

▸ **nibblesToBytes**(`nibbles`, `bytes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nibbles` | `Uint8Array` |
| `bytes` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/trie/src/util/encoding.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L35)

___

### nibblesToCompactBytes

▸ **nibblesToCompactBytes**(`nibbles`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nibbles` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/util/encoding.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L55)

___

### pathToHexKey

▸ **pathToHexKey**(`path`, `extension`, `retType`): `Uint8Array`

Takes a string path and extends it by the given extension nibbles

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | String node path |
| `extension` | [`Nibbles`](README.md#nibbles) | nibbles to extend by |
| `retType` | `string` | string indicating whether to return the key in "keybyte" or "hex" encoding |

#### Returns

`Uint8Array`

hex-encoded key

#### Defined in

[packages/trie/src/util/encoding.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/encoding.ts#L164)

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
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | ``null`` \| [`Nibbles`](README.md#nibbles) | first key of range being proven. |
| `lastKey` | ``null`` \| [`Nibbles`](README.md#nibbles) | last key of range being proven. |
| `keys` | [`Nibbles`](README.md#nibbles)[] | key list of leaf data being proven. |
| `values` | `Uint8Array`[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Uint8Array`[] | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |
| `useKeyHashingFunction` | [`HashKeysFunction`](README.md#hashkeysfunction) | - |

#### Returns

`Promise`<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

[packages/trie/src/proof/range.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/proof/range.ts#L411)
