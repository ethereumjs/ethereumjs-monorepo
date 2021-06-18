[@ethereumjs/blockchain](../README.md) / BlockchainInterface

# Interface: BlockchainInterface

## Implemented by

- [*default*](../classes/default.md)

## Table of contents

### Methods

- [delBlock](blockchaininterface.md#delblock)
- [getBlock](blockchaininterface.md#getblock)
- [iterator](blockchaininterface.md#iterator)
- [putBlock](blockchaininterface.md#putblock)

## Methods

### delBlock

▸ **delBlock**(`blockHash`: *Buffer*): *Promise*<void\>

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | *Buffer* | The hash of the block to be deleted |

**Returns:** *Promise*<void\>

Defined in: [index.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L42)

___

### getBlock

▸ **getBlock**(`blockId`: *number* \| *Buffer* \| *BN*): *Promise*<``null`` \| Block\>

Returns a block by its hash or number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | *number* \| *Buffer* \| *BN* |

**Returns:** *Promise*<``null`` \| Block\>

Defined in: [index.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L47)

___

### iterator

▸ **iterator**(`name`: *string*, `onBlock`: OnBlock): *Promise*<number \| void\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | *string* | Name of the state root head |
| `onBlock` | OnBlock | Function called on each block with params (block: Block, reorg: boolean) |

**Returns:** *Promise*<number \| void\>

Defined in: [index.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L57)

___

### putBlock

▸ **putBlock**(`block`: *Block*): *Promise*<void\>

Adds a block to the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | *Block* | The block to be added to the blockchain. |

**Returns:** *Promise*<void\>

Defined in: [index.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L34)
