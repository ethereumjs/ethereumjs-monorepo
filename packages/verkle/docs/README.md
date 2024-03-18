@ethereumjs/verkle

# @ethereumjs/verkle

## Table of contents

### Enumerations

- [VerkleNodeType](enums/VerkleNodeType.md)

### Classes

- [BaseVerkleNode](classes/BaseVerkleNode.md)
- [CheckpointDB](classes/CheckpointDB.md)
- [InternalNode](classes/InternalNode.md)
- [LeafNode](classes/LeafNode.md)
- [PrioritizedTaskExecutor](classes/PrioritizedTaskExecutor.md)
- [VerkleTree](classes/VerkleTree.md)
- [WalkController](classes/WalkController.md)

### Interfaces

- [CheckpointDBOpts](interfaces/CheckpointDBOpts.md)
- [Fr](interfaces/Fr.md)
- [Point](interfaces/Point.md)
- [TypedVerkleNode](interfaces/TypedVerkleNode.md)
- [VerkleNodeInterface](interfaces/VerkleNodeInterface.md)
- [VerkleNodeOptions](interfaces/VerkleNodeOptions.md)
- [VerkleTreeOpts](interfaces/VerkleTreeOpts.md)

### Type Aliases

- [Checkpoint](README.md#checkpoint)
- [FoundNodeFunction](README.md#foundnodefunction)
- [Proof](README.md#proof)
- [VerkleNode](README.md#verklenode)
- [VerkleTreeOptsWithDefaults](README.md#verkletreeoptswithdefaults)

### Variables

- [NODE\_WIDTH](README.md#node_width)
- [POINT\_IDENTITY](README.md#point_identity)
- [ROOT\_DB\_KEY](README.md#root_db_key)

### Functions

- [decodeNode](README.md#decodenode)
- [decodeRawNode](README.md#decoderawnode)
- [getKey](README.md#getkey)
- [getStem](README.md#getstem)
- [isRawNode](README.md#israwnode)
- [matchingBytesLength](README.md#matchingbyteslength)
- [pedersenHash](README.md#pedersenhash)
- [verifyProof](README.md#verifyproof)
- [verifyUpdate](README.md#verifyupdate)

## Type Aliases

### Checkpoint

Ƭ **Checkpoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keyValueMap` | `Map`<`string`, `Uint8Array` \| `undefined`\> |
| `root` | `Uint8Array` |

#### Defined in

[types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L104)

___

### FoundNodeFunction

Ƭ **FoundNodeFunction**: (`nodeRef`: `Uint8Array`, `node`: [`VerkleNode`](README.md#verklenode) \| ``null``, `key`: `Uint8Array`, `walkController`: [`WalkController`](classes/WalkController.md)) => `void`

#### Type declaration

▸ (`nodeRef`, `node`, `key`, `walkController`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `nodeRef` | `Uint8Array` |
| `node` | [`VerkleNode`](README.md#verklenode) \| ``null`` |
| `key` | `Uint8Array` |
| `walkController` | [`WalkController`](classes/WalkController.md) |

##### Returns

`void`

#### Defined in

[types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L111)

___

### Proof

Ƭ **Proof**: `Uint8Array`[]

#### Defined in

[types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L61)

___

### VerkleNode

Ƭ **VerkleNode**: [`TypedVerkleNode`](interfaces/TypedVerkleNode.md)[[`VerkleNodeType`](enums/VerkleNodeType.md)]

#### Defined in

[node/types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/types.ts#L15)

___

### VerkleTreeOptsWithDefaults

Ƭ **VerkleTreeOptsWithDefaults**: [`VerkleTreeOpts`](interfaces/VerkleTreeOpts.md) & { `cacheSize`: `number` ; `useRootPersistence`: `boolean`  }

#### Defined in

[types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L87)

## Variables

### NODE\_WIDTH

• `Const` **NODE\_WIDTH**: ``256``

#### Defined in

[node/types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/types.ts#L49)

___

### POINT\_IDENTITY

• `Const` **POINT\_IDENTITY**: [`Point`](interfaces/Point.md)

#### Defined in

[util/crypto.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/crypto.ts#L81)

___

### ROOT\_DB\_KEY

• `Const` **ROOT\_DB\_KEY**: `Uint8Array`

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L118)

## Functions

### decodeNode

▸ **decodeNode**(`raw`): [`VerkleNode`](README.md#verklenode)

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `Uint8Array` |

#### Returns

[`VerkleNode`](README.md#verklenode)

#### Defined in

[node/util.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/util.ts#L20)

___

### decodeRawNode

▸ **decodeRawNode**(`raw`): [`VerkleNode`](README.md#verklenode)

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `Uint8Array`[] |

#### Returns

[`VerkleNode`](README.md#verklenode)

#### Defined in

[node/util.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/util.ts#L7)

___

### getKey

▸ **getKey**(`stem`, `subIndex`): `Uint8Array`

**`Dev`**

Returns the tree key for a given verkle tree stem, and sub index.

**`Dev`**

Assumes that the verkle node width = 256

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stem` | `Uint8Array` | The 31-bytes verkle tree stem as a Uint8Array. |
| `subIndex` | `Uint8Array` | The sub index of the tree to generate the key for as a Uint8Array. |

#### Returns

`Uint8Array`

The tree key as a Uint8Array.

#### Defined in

[util/crypto.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/crypto.ts#L67)

___

### getStem

▸ **getStem**(`address`, `treeIndex?`): `Uint8Array`

**`Dev`**

Returns the 31-bytes verkle tree stem for a given address and tree index.

**`Dev`**

Assumes that the verkle node width = 256

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `Address` | `undefined` | The address to generate the tree key for. |
| `treeIndex` | `number` \| `bigint` | `0` | The index of the tree to generate the key for. Defaults to 0. |

#### Returns

`Uint8Array`

The 31-bytes verkle tree stem as a Uint8Array.

#### Defined in

[util/crypto.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/crypto.ts#L43)

___

### isRawNode

▸ **isRawNode**(`node`): node is Uint8Array[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

node is Uint8Array[]

#### Defined in

[node/util.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/util.ts#L28)

___

### matchingBytesLength

▸ **matchingBytesLength**(`bytes1`, `bytes2`): `number`

Compares two byte arrays and returns the count of consecutively matching items from the start.

**`Function`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes1` | `Uint8Array` | The first Uint8Array to compare. |
| `bytes2` | `Uint8Array` | The second Uint8Array to compare. |

#### Returns

`number`

The count of consecutively matching items from the start.

#### Defined in

[util/bytes.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/bytes.ts#L9)

___

### pedersenHash

▸ **pedersenHash**(`input`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[util/crypto.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/crypto.ts#L14)

___

### verifyProof

▸ **verifyProof**(`root`, `proof`, `keyValues`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |
| `proof` | `Uint8Array` |
| `keyValues` | `Map`<`any`, `any`\> |

#### Returns

`Uint8Array`

#### Defined in

[util/crypto.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/crypto.ts#L72)

___

### verifyUpdate

▸ **verifyUpdate**(`root`, `proof`, `keyValues`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |
| `proof` | `Uint8Array` |
| `keyValues` | `Map`<`any`, `any`\> |

#### Returns

`Uint8Array`

#### Defined in

[util/crypto.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/crypto.ts#L28)
