@ethereumjs/statemanager

# @ethereumjs/statemanager

## Table of contents

### Enumerations

- [AccessedStateType](enums/AccessedStateType.md)
- [CacheType](enums/CacheType.md)

### Classes

- [AccessWitness](classes/AccessWitness.md)
- [AccountCache](classes/AccountCache.md)
- [CodeCache](classes/CodeCache.md)
- [DefaultStateManager](classes/DefaultStateManager.md)
- [OriginalStorageCache](classes/OriginalStorageCache.md)
- [RPCBlockChain](classes/RPCBlockChain.md)
- [RPCStateManager](classes/RPCStateManager.md)
- [StatelessVerkleStateManager](classes/StatelessVerkleStateManager.md)
- [StorageCache](classes/StorageCache.md)

### Interfaces

- [CacheOpts](interfaces/CacheOpts.md)
- [DefaultStateManagerOpts](interfaces/DefaultStateManagerOpts.md)
- [EncodedVerkleProof](interfaces/EncodedVerkleProof.md)
- [RPCStateManagerOpts](interfaces/RPCStateManagerOpts.md)
- [StatelessVerkleStateManagerOpts](interfaces/StatelessVerkleStateManagerOpts.md)
- [VerkleState](interfaces/VerkleState.md)

### Type Aliases

- [AccessedStateWithAddress](README.md#accessedstatewithaddress)
- [Proof](README.md#proof)
- [StorageProof](README.md#storageproof)

### Variables

- [BALANCE\_LEAF\_KEY](README.md#balance_leaf_key)
- [CODEHASH\_PREFIX](README.md#codehash_prefix)
- [CODE\_KECCAK\_LEAF\_KEY](README.md#code_keccak_leaf_key)
- [CODE\_OFFSET](README.md#code_offset)
- [CODE\_SIZE\_LEAF\_KEY](README.md#code_size_leaf_key)
- [HEADER\_STORAGE\_OFFSET](README.md#header_storage_offset)
- [MAIN\_STORAGE\_OFFSET](README.md#main_storage_offset)
- [NONCE\_LEAF\_KEY](README.md#nonce_leaf_key)
- [VERKLE\_NODE\_WIDTH](README.md#verkle_node_width)
- [VERSION\_LEAF\_KEY](README.md#version_leaf_key)

### Functions

- [decodeAccessedState](README.md#decodeaccessedstate)
- [decodeValue](README.md#decodevalue)
- [getTreeIndexesForStorageSlot](README.md#gettreeindexesforstorageslot)
- [getTreeIndicesForCodeChunk](README.md#gettreeindicesforcodechunk)

## Type Aliases

### AccessedStateWithAddress

Ƭ **AccessedStateWithAddress**: `AccessedState` & { `address`: `Address` ; `chunkKey`: `PrefixedHexString`  }

#### Defined in

[accessWitness.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L69)

___

### Proof

Ƭ **Proof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accountProof` | `PrefixedHexString`[] |
| `address` | `PrefixedHexString` |
| `balance` | `PrefixedHexString` |
| `codeHash` | `PrefixedHexString` |
| `nonce` | `PrefixedHexString` |
| `storageHash` | `PrefixedHexString` |
| `storageProof` | [`StorageProof`](README.md#storageproof)[] |

#### Defined in

[stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L43)

___

### StorageProof

Ƭ **StorageProof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `PrefixedHexString` |
| `proof` | `PrefixedHexString`[] |
| `value` | `PrefixedHexString` |

#### Defined in

[stateManager.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L37)

## Variables

### BALANCE\_LEAF\_KEY

• `Const` **BALANCE\_LEAF\_KEY**: `Uint8Array`

#### Defined in

[accessWitness.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L14)

___

### CODEHASH\_PREFIX

• `Const` **CODEHASH\_PREFIX**: `Uint8Array`

Prefix to distinguish between a contract deployed with code `0x80`
and `RLP([])` (also having the value `0x80`).

Otherwise the creation of the code hash for the `0x80` contract
will be the same as the hash of the empty trie which leads to
misbehaviour in the underlying trie library.

#### Defined in

[stateManager.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L104)

___

### CODE\_KECCAK\_LEAF\_KEY

• `Const` **CODE\_KECCAK\_LEAF\_KEY**: `Uint8Array`

#### Defined in

[accessWitness.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L16)

___

### CODE\_OFFSET

• `Const` **CODE\_OFFSET**: ``128``

#### Defined in

[accessWitness.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L20)

___

### CODE\_SIZE\_LEAF\_KEY

• `Const` **CODE\_SIZE\_LEAF\_KEY**: `Uint8Array`

#### Defined in

[accessWitness.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L17)

___

### HEADER\_STORAGE\_OFFSET

• `Const` **HEADER\_STORAGE\_OFFSET**: ``64``

#### Defined in

[accessWitness.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L19)

___

### MAIN\_STORAGE\_OFFSET

• `Const` **MAIN\_STORAGE\_OFFSET**: `bigint`

#### Defined in

[accessWitness.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L24)

___

### NONCE\_LEAF\_KEY

• `Const` **NONCE\_LEAF\_KEY**: `Uint8Array`

#### Defined in

[accessWitness.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L15)

___

### VERKLE\_NODE\_WIDTH

• `Const` **VERKLE\_NODE\_WIDTH**: ``256``

#### Defined in

[accessWitness.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L21)

___

### VERSION\_LEAF\_KEY

• `Const` **VERSION\_LEAF\_KEY**: `Uint8Array`

Tree key constants.

#### Defined in

[accessWitness.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L13)

## Functions

### decodeAccessedState

▸ **decodeAccessedState**(`treeIndex`, `chunkIndex`): `AccessedState`

#### Parameters

| Name | Type |
| :------ | :------ |
| `treeIndex` | `number` \| `bigint` |
| `chunkIndex` | `number` |

#### Returns

`AccessedState`

#### Defined in

[accessWitness.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L378)

___

### decodeValue

▸ **decodeValue**(`type`, `value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`AccessedStateType`](enums/AccessedStateType.md) |
| `value` | ``null`` \| `string` |

#### Returns

`string`

#### Defined in

[accessWitness.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L413)

___

### getTreeIndexesForStorageSlot

▸ **getTreeIndexesForStorageSlot**(`storageKey`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `storageKey` | `bigint` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `subIndex` | `number` |
| `treeIndex` | `bigint` |

#### Defined in

[accessWitness.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L355)

___

### getTreeIndicesForCodeChunk

▸ **getTreeIndicesForCodeChunk**(`chunkId`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunkId` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `subIndex` | `number` |
| `treeIndex` | `number` |

#### Defined in

[accessWitness.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/accessWitness.ts#L372)
