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

[types.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L11)

## Methods

### copy

▸ **copy**(): [`BlockchainInterface`](BlockchainInterface.md)

Returns a copy of the blockchain

#### Returns

[`BlockchainInterface`](BlockchainInterface.md)

#### Defined in

[types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L46)

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

[types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L25)

___

### genesisState

▸ `Optional` **genesisState**(): `GenesisState`

Returns the genesis state of the blockchain.
All values are provided as hex-prefixed strings.

#### Returns

`GenesisState`

#### Defined in

[types.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L71)

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`<``null`` \| `Block`\>

Returns a block by its hash or number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Buffer` |

#### Returns

`Promise`<``null`` \| `Block`\>

#### Defined in

[types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L30)

___

### getCanonicalHeadBlock

▸ `Optional` **getCanonicalHeadBlock**(): `Promise`<`Block`\>

Returns the latest full block in the canonical chain.

#### Returns

`Promise`<`Block`\>

#### Defined in

[types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L76)

___

### getIteratorHead

▸ `Optional` **getIteratorHead**(`name?`): `Promise`<`Block`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |

#### Returns

`Promise`<`Block`\>

#### Defined in

[types.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L60)

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

[types.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L65)

___

### iterator

▸ **iterator**(`name`, `onBlock`, `maxBlocks?`): `Promise`<`number`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the state root head |
| `onBlock` | `OnBlock` | Function called on each block with params (block: Block, |
| `maxBlocks?` | `number` | optional maximum number of blocks to iterate through reorg: boolean) |

#### Returns

`Promise`<`number`\>

#### Defined in

[types.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L41)

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

[types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L17)

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

[types.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L59)
