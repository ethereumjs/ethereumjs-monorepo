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

* [_ethash](_index_.blockchain.md#optional-_ethash)
* [db](_index_.blockchain.md#db)
* [dbManager](_index_.blockchain.md#dbmanager)
* [initPromise](_index_.blockchain.md#initpromise)

### Accessors

* [meta](_index_.blockchain.md#meta)

### Methods

* [cliqueActiveSigners](_index_.blockchain.md#cliqueactivesigners)
* [delBlock](_index_.blockchain.md#delblock)
* [getBlock](_index_.blockchain.md#getblock)
* [getBlocks](_index_.blockchain.md#getblocks)
* [getHead](_index_.blockchain.md#gethead)
* [getIteratorHead](_index_.blockchain.md#getiteratorhead)
* [getLatestBlock](_index_.blockchain.md#getlatestblock)
* [getLatestHeader](_index_.blockchain.md#getlatestheader)
* [getTotalDifficulty](_index_.blockchain.md#gettotaldifficulty)
* [iterator](_index_.blockchain.md#iterator)
* [putBlock](_index_.blockchain.md#putblock)
* [putBlocks](_index_.blockchain.md#putblocks)
* [putHeader](_index_.blockchain.md#putheader)
* [putHeaders](_index_.blockchain.md#putheaders)
* [safeNumberToHash](_index_.blockchain.md#safenumbertohash)
* [selectNeededHashes](_index_.blockchain.md#selectneededhashes)
* [setHead](_index_.blockchain.md#sethead)
* [setIteratorHead](_index_.blockchain.md#setiteratorhead)
* [create](_index_.blockchain.md#static-create)
* [fromBlocksData](_index_.blockchain.md#static-fromblocksdata)

## Constructors

###  constructor

\+ **new Blockchain**(`opts`: [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)): *[Blockchain](_index_.blockchain.md)*

*Defined in [index.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L215)*

Creates new Blockchain object

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [BlockchainOptions](../interfaces/_index_.blockchainoptions.md) | {} | An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/_index_.blockchainoptions.md).  |

**Returns:** *[Blockchain](_index_.blockchain.md)*

## Properties

### `Optional` _ethash

• **_ethash**? : *Ethash*

*Defined in [index.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L134)*

___

###  db

• **db**: *LevelUp*

*Defined in [index.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L111)*

___

###  dbManager

• **dbManager**: *DBManager*

*Defined in [index.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L112)*

___

###  initPromise

• **initPromise**: *Promise‹void›*

*Defined in [index.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L127)*

## Accessors

###  meta

• **get meta**(): *object*

*Defined in [index.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L280)*

Returns an object with metadata about the Blockchain. It's defined for
backwards compatibility.

**Returns:** *object*

* **genesis**: *undefined | Buffer‹›* = this._genesis

* **heads**(): *object*

* **rawHead**: *undefined | Buffer‹›* = this._headHeaderHash

## Methods

###  cliqueActiveSigners

▸ **cliqueActiveSigners**(): *Address[]*

*Defined in [index.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L688)*

Returns a list with the current block signers
(only clique PoA, throws otherwise)

**Returns:** *Address[]*

___

###  delBlock

▸ **delBlock**(`blockHash`: Buffer): *Promise‹void›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:1112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1112)*

Completely deletes a block from the blockchain including any references to
this block. If this block was in the canonical chain, then also each child
block of this block is deleted Also, if this was a canonical block, each
head header which is part of this now stale chain will be set to the
parentHeader of this block An example reason to execute is when running the
block in the VM invalidates this block: this will then reset the canonical
head to the past block (which has been validated in the past by the VM, so
we can be sure it is correct).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockHash` | Buffer | The hash of the block to be deleted  |

**Returns:** *Promise‹void›*

___

###  getBlock

▸ **getBlock**(`blockId`: Buffer | number | BN): *Promise‹Block›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:995](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L995)*

Gets a block by its hash.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockId` | Buffer &#124; number &#124; BN | The block's hash or number. If a hash is provided, then this will be immediately looked up, otherwise it will wait until we have unlocked the DB  |

**Returns:** *Promise‹Block›*

___

###  getBlocks

▸ **getBlocks**(`blockId`: Buffer | BN | number, `maxBlocks`: number, `skip`: number, `reverse`: boolean): *Promise‹Block[]›*

*Defined in [index.ts:1030](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1030)*

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

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

*Defined in [index.ts:739](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L739)*

Returns the specified iterator head.

**`deprecated`** use `getIteratorHead()` instead. Note that `getIteratorHead()`
doesn't return the `headHeader` but the genesis hash as an initial
iterator head value (now matching the behavior of the `iterator()`
method on a first run)

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | string | "vm" | Optional name of the iterator head (default: 'vm')  |

**Returns:** *Promise‹Block›*

___

###  getIteratorHead

▸ **getIteratorHead**(`name`: string): *Promise‹Block›*

*Defined in [index.ts:716](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L716)*

Returns the specified iterator head.

This function replaces the old `getHead()` method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of the `iterator()`
method.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | string | "vm" | Optional name of the iterator head (default: 'vm')  |

**Returns:** *Promise‹Block›*

___

###  getLatestBlock

▸ **getLatestBlock**(): *Promise‹Block›*

*Defined in [index.ts:769](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L769)*

Returns the latest full block in the canonical chain.

**Returns:** *Promise‹Block›*

___

###  getLatestHeader

▸ **getLatestHeader**(): *Promise‹BlockHeader›*

*Defined in [index.ts:755](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L755)*

Returns the latest header in the canonical chain.

**Returns:** *Promise‹BlockHeader›*

___

###  getTotalDifficulty

▸ **getTotalDifficulty**(`hash`: Buffer, `number?`: BN): *Promise‹BN›*

*Defined in [index.ts:1015](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1015)*

Gets total difficulty for a block specified by hash and number

**Parameters:**

Name | Type |
------ | ------ |
`hash` | Buffer |
`number?` | BN |

**Returns:** *Promise‹BN›*

___

###  iterator

▸ **iterator**(`name`: string, `onBlock`: OnBlock, `maxBlocks?`: undefined | number): *Promise‹number›*

*Defined in [index.ts:1210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1210)*

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using the `getHead()` method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Name of the state root head |
`onBlock` | OnBlock | Function called on each block with params (block, reorg) |
`maxBlocks?` | undefined &#124; number | How many blocks to run. By default, run all unprocessed blocks in the canonical chain. |

**Returns:** *Promise‹number›*

number of blocks actually iterated

___

###  putBlock

▸ **putBlock**(`block`: Block): *Promise‹void›*

*Implementation of [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)*

*Defined in [index.ts:804](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L804)*

Adds a block to the blockchain.

If the block is valid and has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | Block | The block to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  putBlocks

▸ **putBlocks**(`blocks`: Block[]): *Promise‹void›*

*Defined in [index.ts:789](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L789)*

Adds blocks to the blockchain.

If an invalid block is met the function will throw, blocks before will
nevertheless remain in the DB. If any of the saved blocks has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blocks` | Block[] | The blocks to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  putHeader

▸ **putHeader**(`header`: BlockHeader): *Promise‹void›*

*Defined in [index.ts:833](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L833)*

Adds a header to the blockchain.

If this header is valid and it has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`header` | BlockHeader | The header to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  putHeaders

▸ **putHeaders**(`headers`: Array‹any›): *Promise‹void›*

*Defined in [index.ts:818](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L818)*

Adds many headers to the blockchain.

If an invalid header is met the function will throw, headers before will
nevertheless remain in the DB. If any of the saved headers has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`headers` | Array‹any› | The headers to be added to the blockchain  |

**Returns:** *Promise‹void›*

___

###  safeNumberToHash

▸ **safeNumberToHash**(`number`: BN): *Promise‹Buffer | false›*

*Defined in [index.ts:1478](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1478)*

This method either returns a Buffer if there exists one in the DB or if it
does not exist (DB throws a `NotFoundError`) then return false If DB throws
any other error, this function throws.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`number` | BN |   |

**Returns:** *Promise‹Buffer | false›*

___

###  selectNeededHashes

▸ **selectNeededHashes**(`hashes`: Array‹Buffer›): *Promise‹Buffer[]›*

*Defined in [index.ts:1072](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1072)*

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hashes` | Array‹Buffer› | Ordered array of hashes (ordered on `number`).  |

**Returns:** *Promise‹Buffer[]›*

___

###  setHead

▸ **setHead**(`tag`: string, `headHash`: Buffer): *Promise‹void›*

*Defined in [index.ts:1277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1277)*

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currenntly stored.

**`deprecated`** use `setIteratorHead()` instead

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tag` | string | The tag to save the headHash to |
`headHash` | Buffer | The head hash to save  |

**Returns:** *Promise‹void›*

___

###  setIteratorHead

▸ **setIteratorHead**(`tag`: string, `headHash`: Buffer): *Promise‹void›*

*Defined in [index.ts:1265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1265)*

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currenntly stored.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tag` | string | The tag to save the headHash to |
`headHash` | Buffer | The head hash to save  |

**Returns:** *Promise‹void›*

___

### `Static` create

▸ **create**(`opts`: [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)): *Promise‹[Blockchain](_index_.blockchain.md)‹››*

*Defined in [index.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L190)*

Safe creation of a new Blockchain object awaiting the initialization function,
encouraged method to use when creating a blockchain object.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [BlockchainOptions](../interfaces/_index_.blockchainoptions.md) | {} | Constructor options, see [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)  |

**Returns:** *Promise‹[Blockchain](_index_.blockchain.md)‹››*

___

### `Static` fromBlocksData

▸ **fromBlocksData**(`blocksData`: BlockData[], `opts`: [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)): *Promise‹[Blockchain](_index_.blockchain.md)‹››*

*Defined in [index.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L205)*

Creates a blockchain from a list of block objects,
objects must be readable by the `Block.fromBlockData()` method

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`blocksData` | BlockData[] | - | - |
`opts` | [BlockchainOptions](../interfaces/_index_.blockchainoptions.md) | {} | Constructor options, see [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)  |

**Returns:** *Promise‹[Blockchain](_index_.blockchain.md)‹››*
