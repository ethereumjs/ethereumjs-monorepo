[@ethereumjs/blockchain](../README.md) › ["index"](../modules/_index_.md) › [Blockchain](_index_.blockchain.md)

# Class: Blockchain

This class stores and interacts with blocks.

## Hierarchy

* **Blockchain**

## Implements

* [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)

## Index

### Constructors

* [constructor](_index_.blockchain.md#constructor)

### Properties

* [db](_index_.blockchain.md#db)
* [dbManager](_index_.blockchain.md#dbmanager)
* [ethash](_index_.blockchain.md#optional-ethash)

### Accessors

* [meta](_index_.blockchain.md#meta)

### Methods

* [delBlock](_index_.blockchain.md#delblock)
* [getBlock](_index_.blockchain.md#getblock)
* [getBlocks](_index_.blockchain.md#getblocks)
* [getHead](_index_.blockchain.md#gethead)
* [getLatestBlock](_index_.blockchain.md#getlatestblock)
* [getLatestHeader](_index_.blockchain.md#getlatestheader)
* [iterator](_index_.blockchain.md#iterator)
* [putBlock](_index_.blockchain.md#putblock)
* [putBlocks](_index_.blockchain.md#putblocks)
* [putGenesis](_index_.blockchain.md#putgenesis)
* [putHeader](_index_.blockchain.md#putheader)
* [putHeaders](_index_.blockchain.md#putheaders)
* [selectNeededHashes](_index_.blockchain.md#selectneededhashes)

## Constructors

###  constructor

\+ **new Blockchain**(`opts`: [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)): *[Blockchain](_index_.blockchain.md)*

*Defined in [index.ts:106](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L106)*

Creates new Blockchain object

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [BlockchainOptions](../interfaces/_index_.blockchainoptions.md) | {} | An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/_index_.blockchainoptions.md).  |

**Returns:** *[Blockchain](_index_.blockchain.md)*

## Properties

###  db

• **db**: *LevelUp*

*Defined in [index.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L90)*

___

###  dbManager

• **dbManager**: *DBManager*

*Defined in [index.ts:91](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L91)*

___

### `Optional` ethash

• **ethash**? : *Ethash*

*Defined in [index.ts:92](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L92)*

## Accessors

###  meta

• **get meta**(): *object*

*Defined in [index.ts:152](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L152)*

Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.

**Returns:** *object*

* **genesis**: *undefined | Buffer‹›* = this._genesis

* **heads**(): *object*

* **rawHead**: *undefined | Buffer‹›* = this._headHeader

## Methods

###  delBlock

▸ **delBlock**(`blockHash`: Buffer): *Promise‹void›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:701](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L701)*

Deletes a block from the blockchain. All child blocks in the chain are deleted and any
encountered heads are set to the parent block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockHash` | Buffer | The hash of the block to be deleted  |

**Returns:** *Promise‹void›*

___

###  getBlock

▸ **getBlock**(`blockId`: Buffer | number | BN): *Promise‹Block›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:454](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L454)*

Gets a block by its hash.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockId` | Buffer &#124; number &#124; BN | The block's hash or number  |

**Returns:** *Promise‹Block›*

___

###  getBlocks

▸ **getBlocks**(`blockId`: Buffer | BN | number, `maxBlocks`: number, `skip`: number, `reverse`: boolean): *Promise‹Block[]›*

*Defined in [index.ts:477](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L477)*

Looks up many blocks relative to blockId

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockId` | Buffer &#124; BN &#124; number | The block's hash or number |
`maxBlocks` | number | Max number of blocks to return |
`skip` | number | Number of blocks to skip apart |
`reverse` | boolean | Fetch blocks in reverse  |

**Returns:** *Promise‹Block[]›*

___

###  getHead

▸ **getHead**(`name`: string): *Promise‹Block›*

*Defined in [index.ts:243](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L243)*

Returns the specified iterator head.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | string | "vm" | Optional name of the state root head (default: 'vm')  |

**Returns:** *Promise‹Block›*

___

###  getLatestBlock

▸ **getLatestBlock**(): *Promise‹Block‹››*

*Defined in [index.ts:276](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L276)*

Returns the latest full block in the canonical chain.

**Returns:** *Promise‹Block‹››*

___

###  getLatestHeader

▸ **getLatestHeader**(): *Promise‹BlockHeader›*

*Defined in [index.ts:260](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L260)*

Returns the latest header in the canonical chain.

**Returns:** *Promise‹BlockHeader›*

___

###  iterator

▸ **iterator**(`name`: string, `onBlock`: OnBlock): *Promise‹void›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:814](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L814)*

Iterates through blocks starting at the specified iterator head and calls the onBlock function
on each block. The current location of an iterator head can be retrieved using the `getHead()`
method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Name of the state root head |
`onBlock` | OnBlock | Function called on each block with params (block, reorg)  |

**Returns:** *Promise‹void›*

___

###  putBlock

▸ **putBlock**(`block`: Block, `isGenesis?`: undefined | false | true): *Promise‹void›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:304](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L304)*

Adds a block to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Block | The block to be added to the blockchain  |
`isGenesis?` | undefined &#124; false &#124; true | - |

**Returns:** *Promise‹void›*

___

###  putBlocks

▸ **putBlocks**(`blocks`: Block[]): *Promise‹void›*

*Defined in [index.ts:293](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L293)*

Adds many blocks to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blocks` | Block[] | The blocks to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  putGenesis

▸ **putGenesis**(`genesis`: Block): *Promise‹void›*

*Defined in [index.ts:234](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L234)*

Puts the genesis block in the database

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`genesis` | Block | The genesis block to be added  |

**Returns:** *Promise‹void›*

___

###  putHeader

▸ **putHeader**(`header`: BlockHeader): *Promise‹void›*

*Defined in [index.ts:336](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L336)*

Adds a header to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`header` | BlockHeader | The header to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  putHeaders

▸ **putHeaders**(`headers`: Array‹any›): *Promise‹void›*

*Defined in [index.ts:325](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L325)*

Adds many headers to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`headers` | Array‹any› | The headers to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  selectNeededHashes

▸ **selectNeededHashes**(`hashes`: Array‹Buffer›): *Promise‹Buffer‹›[]›*

*Defined in [index.ts:516](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L516)*

Given an ordered array, returns an array of hashes that are not in the blockchain yet.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hashes` | Array‹Buffer› | Ordered array of hashes  |

**Returns:** *Promise‹Buffer‹›[]›*
