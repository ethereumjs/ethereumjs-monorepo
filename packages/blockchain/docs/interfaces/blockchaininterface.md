[@ethereumjs/blockchain](../README.md) / BlockchainInterface

# Interface: BlockchainInterface

## Implemented by

- [`default`](../classes/default.md)

## Table of contents

### Methods

- [delBlock](BlockchainInterface.md#delblock)
- [getBlock](BlockchainInterface.md#getblock)
- [iterator](BlockchainInterface.md#iterator)
- [putBlock](BlockchainInterface.md#putblock)

## Methods

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

[index.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L43)

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`<``null`` \| `Block`\>

Returns a block by its hash or number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `number` \| `Buffer` \| `BN` |

#### Returns

`Promise`<``null`` \| `Block`\>

#### Defined in

[index.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L48)

___

### iterator

▸ **iterator**(`name`, `onBlock`): `Promise`<`number` \| `void`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the state root head |
| `onBlock` | `OnBlock` | Function called on each block with params (block: Block, reorg: boolean) |

#### Returns

`Promise`<`number` \| `void`\>

#### Defined in

[index.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L58)

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

[index.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L35)
