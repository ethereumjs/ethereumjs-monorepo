[ethereumjs-blockchain](../README.md) › ["index"](../modules/_index_.md) › [BlockchainInterface](_index_.blockchaininterface.md)

# Interface: BlockchainInterface

## Hierarchy

* **BlockchainInterface**

## Implemented by

* [Blockchain](../classes/_index_.blockchain.md)

## Index

### Methods

* [delBlock](_index_.blockchaininterface.md#delblock)
* [getBlock](_index_.blockchaininterface.md#getblock)
* [getDetails](_index_.blockchaininterface.md#getdetails)
* [iterator](_index_.blockchaininterface.md#iterator)
* [putBlock](_index_.blockchaininterface.md#putblock)

## Methods

###  delBlock

▸ **delBlock**(`blockHash`: Buffer, `cb`: any): *void*

*Defined in [index.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L40)*

Deletes a block from the blockchain. All child blocks in the chain are deleted and any
encountered heads are set to the parent block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockHash` | Buffer | The hash of the block to be deleted |
`cb` | any | A callback.  |

**Returns:** *void*

___

###  getBlock

▸ **getBlock**(`blockTag`: Buffer | number | BN, `cb`: function): *void*

*Defined in [index.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L45)*

Returns a block by its hash or number.

**Parameters:**

▪ **blockTag**: *Buffer | number | BN*

▪ **cb**: *function*

▸ (`err`: Error | null, `block?`: Block): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`block?` | Block |

**Returns:** *void*

___

###  getDetails

▸ **getDetails**(`_`: string, `cb`: any): *void*

*Defined in [index.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L64)*

This method is only here for backwards compatibility. It can be removed once
[this PR](https://github.com/ethereumjs/ethereumjs-block/pull/72/files) gets merged, released,
and ethereumjs-block is updated here.

The method should just call `cb` with `null` as first argument.

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |
`cb` | any |

**Returns:** *void*

___

###  iterator

▸ **iterator**(`name`: string, `onBlock`: any, `cb`: any): *void*

*Defined in [index.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L55)*

Iterates through blocks starting at the specified iterator head and calls the onBlock function
on each block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Name of the state root head |
`onBlock` | any | Function called on each block with params (block, reorg, cb) |
`cb` | any | A callback function  |

**Returns:** *void*

___

###  putBlock

▸ **putBlock**(`block`: Block, `cb`: any, `isGenesis?`: undefined | false | true): *void*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L31)*

Adds a block to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Block | The block to be added to the blockchain. |
`cb` | any | The callback. It is given two parameters `err` and the saved `block` |
`isGenesis?` | undefined &#124; false &#124; true | True if block is the genesis block.  |

**Returns:** *void*
