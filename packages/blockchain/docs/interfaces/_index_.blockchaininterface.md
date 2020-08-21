[@ethereumjs/blockchain](../README.md) › ["index"](../modules/_index_.md) › [BlockchainInterface](_index_.blockchaininterface.md)

# Interface: BlockchainInterface

## Hierarchy

* **BlockchainInterface**

## Implemented by

* [Blockchain](../classes/_index_.blockchain.md)

## Index

### Methods

* [delBlock](_index_.blockchaininterface.md#delblock)
* [getBlock](_index_.blockchaininterface.md#getblock)
* [iterator](_index_.blockchaininterface.md#iterator)
* [putBlock](_index_.blockchaininterface.md#putblock)

## Methods

###  delBlock

▸ **delBlock**(`blockHash`: Buffer): *Promise‹void›*

*Defined in [index.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L39)*

Deletes a block from the blockchain. All child blocks in the chain are deleted and any
encountered heads are set to the parent block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockHash` | Buffer | The hash of the block to be deleted  |

**Returns:** *Promise‹void›*

___

###  getBlock

▸ **getBlock**(`blockId`: Buffer | number | BN): *Promise‹Block | null›*

*Defined in [index.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L44)*

Returns a block by its hash or number.

**Parameters:**

Name | Type |
------ | ------ |
`blockId` | Buffer &#124; number &#124; BN |

**Returns:** *Promise‹Block | null›*

___

###  iterator

▸ **iterator**(`name`: string, `onBlock`: OnBlock): *Promise‹void›*

*Defined in [index.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L53)*

Iterates through blocks starting at the specified iterator head and calls the onBlock function
on each block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Name of the state root head |
`onBlock` | OnBlock | Function called on each block with params (block: Block, reorg: boolean)  |

**Returns:** *Promise‹void›*

___

###  putBlock

▸ **putBlock**(`block`: Block, `isGenesis?`: undefined | false | true): *Promise‹void›*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L31)*

Adds a block to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Block | The block to be added to the blockchain. |
`isGenesis?` | undefined &#124; false &#124; true | True if block is the genesis block.  |

**Returns:** *Promise‹void›*
