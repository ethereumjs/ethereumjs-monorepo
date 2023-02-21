[@ethereumjs/blockchain](../README.md) / BlockchainInterface

# Interface: BlockchainInterface

## Implemented by

- [`Blockchain`](../classes/Blockchain.md)

## Table of contents

### Properties

- [consensus](BlockchainInterface.md#consensus)

### Methods

- [copy](BlockchainInterface.md#copy)
- [delBlock](BlockchainInterface.md#delblock)
- [genesisState](BlockchainInterface.md#genesisstate)
- [getBlock](BlockchainInterface.md#getblock)
- [getCanonicalHeadBlock](BlockchainInterface.md#getcanonicalheadblock)
- [getIteratorHead](BlockchainInterface.md#getiteratorhead)
- [getTotalDifficulty](BlockchainInterface.md#gettotaldifficulty)
- [iterator](BlockchainInterface.md#iterator)
- [putBlock](BlockchainInterface.md#putblock)
- [validateHeader](BlockchainInterface.md#validateheader)

## Properties

### consensus

• **consensus**: [`Consensus`](Consensus.md)

#### Defined in

[types.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L10)

## Methods

### copy

▸ **copy**(): [`BlockchainInterface`](BlockchainInterface.md)

Returns a copy of the blockchain

#### Returns

[`BlockchainInterface`](BlockchainInterface.md)

#### Defined in

[types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L50)

___

### delBlock

▸ **delBlock**(`blockHash`): `Promise`<`void`\>

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | `Buffer` | The hash of the block to be deleted |

#### Returns

`Promise`<`void`\>

#### Defined in

[types.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L24)

___

### genesisState

▸ `Optional` **genesisState**(): `GenesisState`

Returns the genesis state of the blockchain.
All values are provided as hex-prefixed strings.

#### Returns

`GenesisState`

#### Defined in

[types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L75)

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`<`Block`\>

Returns a block by its hash or number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Buffer` |

#### Returns

`Promise`<`Block`\>

#### Defined in

[types.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L29)

___

### getCanonicalHeadBlock

▸ `Optional` **getCanonicalHeadBlock**(): `Promise`<`Block`\>

Returns the latest full block in the canonical chain.

#### Returns

`Promise`<`Block`\>

#### Defined in

[types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L80)

___

### getIteratorHead

▸ `Optional` **getIteratorHead**(`name?`): `Promise`<`Block`\>

Returns the specified iterator head.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`<`Block`\>

#### Defined in

[types.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L64)

___

### getTotalDifficulty

▸ `Optional` **getTotalDifficulty**(`hash`, `number?`): `Promise`<`bigint`\>

Gets total difficulty for a block specified by hash and number

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `Buffer` |
| `number?` | `bigint` |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[types.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L69)

___

### iterator

▸ **iterator**(`name`, `onBlock`, `maxBlocks?`, `releaseLockOnCallback?`): `Promise`<`number`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the state root head |
| `onBlock` | `OnBlock` | Function called on each block with params (block: Block, |
| `maxBlocks?` | `number` | optional maximum number of blocks to iterate through reorg: boolean) |
| `releaseLockOnCallback?` | `boolean` | - |

#### Returns

`Promise`<`number`\>

#### Defined in

[types.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L40)

___

### putBlock

▸ **putBlock**(`block`): `Promise`<`void`\>

Adds a block to the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | The block to be added to the blockchain. |

#### Returns

`Promise`<`void`\>

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L16)

___

### validateHeader

▸ **validateHeader**(`header`, `height?`): `Promise`<`void`\>

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | header to be validated |
| `height?` | `bigint` | If this is an uncle header, this is the height of the block that is including it |

#### Returns

`Promise`<`void`\>

#### Defined in

[types.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L57)
