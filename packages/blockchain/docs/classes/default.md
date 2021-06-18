[@ethereumjs/blockchain](../README.md) / default

# Class: default

This class stores and interacts with blocks.

## Implements

- [*BlockchainInterface*](../interfaces/blockchaininterface.md)

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [\_ethash](default.md#_ethash)
- [db](default.md#db)
- [dbManager](default.md#dbmanager)
- [initPromise](default.md#initpromise)

### Accessors

- [meta](default.md#meta)

### Methods

- [cliqueActiveSigners](default.md#cliqueactivesigners)
- [delBlock](default.md#delblock)
- [getBlock](default.md#getblock)
- [getBlocks](default.md#getblocks)
- [getHead](default.md#gethead)
- [getIteratorHead](default.md#getiteratorhead)
- [getLatestBlock](default.md#getlatestblock)
- [getLatestHeader](default.md#getlatestheader)
- [getTotalDifficulty](default.md#gettotaldifficulty)
- [iterator](default.md#iterator)
- [putBlock](default.md#putblock)
- [putBlocks](default.md#putblocks)
- [putHeader](default.md#putheader)
- [putHeaders](default.md#putheaders)
- [safeNumberToHash](default.md#safenumbertohash)
- [selectNeededHashes](default.md#selectneededhashes)
- [setHead](default.md#sethead)
- [setIteratorHead](default.md#setiteratorhead)
- [create](default.md#create)
- [fromBlocksData](default.md#fromblocksdata)

## Constructors

### constructor

\+ **new default**(`opts?`: [*BlockchainOptions*](../interfaces/blockchainoptions.md)): [*default*](default.md)

Creates new Blockchain object

**`deprecated`** - The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async `Blockchain.create()` constructor instead (same API).

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `opts` | [*BlockchainOptions*](../interfaces/blockchainoptions.md) | {} | An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/blockchainoptions.md). |

**Returns:** [*default*](default.md)

Defined in: [index.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L228)

## Properties

### \_ethash

• `Optional` **\_ethash**: *default*

Defined in: [index.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L147)

___

### db

• **db**: *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Defined in: [index.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L123)

___

### dbManager

• **dbManager**: *DBManager*

Defined in: [index.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L124)

___

### initPromise

• **initPromise**: *Promise*<void\>

Defined in: [index.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L139)

## Accessors

### meta

• get **meta**(): *object*

Returns an object with metadata about the Blockchain. It's defined for
backwards compatibility.

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `genesis` | *undefined* \| *Buffer* |
| `heads` | *object* |
| `rawHead` | *undefined* \| *Buffer* |

Defined in: [index.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L298)

## Methods

### cliqueActiveSigners

▸ **cliqueActiveSigners**(): *Address*[]

Returns a list with the current block signers
(only clique PoA, throws otherwise)

**Returns:** *Address*[]

Defined in: [index.ts:708](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L708)

___

### delBlock

▸ **delBlock**(`blockHash`: *Buffer*): *Promise*<void\>

Completely deletes a block from the blockchain including any references to
this block. If this block was in the canonical chain, then also each child
block of this block is deleted Also, if this was a canonical block, each
head header which is part of this now stale chain will be set to the
parentHeader of this block An example reason to execute is when running the
block in the VM invalidates this block: this will then reset the canonical
head to the past block (which has been validated in the past by the VM, so
we can be sure it is correct).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | *Buffer* | The hash of the block to be deleted |

**Returns:** *Promise*<void\>

Implementation of: [BlockchainInterface](../interfaces/blockchaininterface.md)

Defined in: [index.ts:1135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1135)

___

### getBlock

▸ **getBlock**(`blockId`: *number* \| *Buffer* \| *BN*): *Promise*<Block\>

Gets a block by its hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | *number* \| *Buffer* \| *BN* | The block's hash or number. If a hash is provided, then this will be immediately looked up, otherwise it will wait until we have unlocked the DB |

**Returns:** *Promise*<Block\>

Implementation of: [BlockchainInterface](../interfaces/blockchaininterface.md)

Defined in: [index.ts:1018](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1018)

___

### getBlocks

▸ **getBlocks**(`blockId`: *number* \| *Buffer* \| *BN*, `maxBlocks`: *number*, `skip`: *number*, `reverse`: *boolean*): *Promise*<Block[]\>

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | *number* \| *Buffer* \| *BN* | The block's hash or number |
| `maxBlocks` | *number* | Max number of blocks to return |
| `skip` | *number* | Number of blocks to skip apart |
| `reverse` | *boolean* | Fetch blocks in reverse |

**Returns:** *Promise*<Block[]\>

Defined in: [index.ts:1053](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1053)

___

### getHead

▸ **getHead**(`name?`: *string*): *Promise*<Block\>

Returns the specified iterator head.

**`deprecated`** use `getIteratorHead()` instead. Note that `getIteratorHead()`
doesn't return the `headHeader` but the genesis hash as an initial
iterator head value (now matching the behavior of the `iterator()`
method on a first run)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | *string* | 'vm' | Optional name of the iterator head (default: 'vm') |

**Returns:** *Promise*<Block\>

Defined in: [index.ts:759](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L759)

___

### getIteratorHead

▸ **getIteratorHead**(`name?`: *string*): *Promise*<Block\>

Returns the specified iterator head.

This function replaces the old `getHead()` method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of the `iterator()`
method.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | *string* | 'vm' | Optional name of the iterator head (default: 'vm') |

**Returns:** *Promise*<Block\>

Defined in: [index.ts:736](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L736)

___

### getLatestBlock

▸ **getLatestBlock**(): *Promise*<Block\>

Returns the latest full block in the canonical chain.

**Returns:** *Promise*<Block\>

Defined in: [index.ts:789](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L789)

___

### getLatestHeader

▸ **getLatestHeader**(): *Promise*<BlockHeader\>

Returns the latest header in the canonical chain.

**Returns:** *Promise*<BlockHeader\>

Defined in: [index.ts:775](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L775)

___

### getTotalDifficulty

▸ **getTotalDifficulty**(`hash`: *Buffer*, `number?`: *BN*): *Promise*<BN\>

Gets total difficulty for a block specified by hash and number

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | *Buffer* |
| `number?` | *BN* |

**Returns:** *Promise*<BN\>

Defined in: [index.ts:1038](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1038)

___

### iterator

▸ **iterator**(`name`: *string*, `onBlock`: OnBlock, `maxBlocks?`: *number*): *Promise*<number\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using the `getHead()` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | *string* | Name of the state root head |
| `onBlock` | OnBlock | Function called on each block with params (block, reorg) |
| `maxBlocks?` | *number* | How many blocks to run. By default, run all unprocessed blocks in the canonical chain. |

**Returns:** *Promise*<number\>

number of blocks actually iterated

Implementation of: [BlockchainInterface](../interfaces/blockchaininterface.md)

Defined in: [index.ts:1233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1233)

___

### putBlock

▸ **putBlock**(`block`: *Block*): *Promise*<void\>

Adds a block to the blockchain.

If the block is valid and has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | *Block* | The block to be added to the blockchain |

**Returns:** *Promise*<void\>

Implementation of: [BlockchainInterface](../interfaces/blockchaininterface.md)

Defined in: [index.ts:824](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L824)

___

### putBlocks

▸ **putBlocks**(`blocks`: *Block*[]): *Promise*<void\>

Adds blocks to the blockchain.

If an invalid block is met the function will throw, blocks before will
nevertheless remain in the DB. If any of the saved blocks has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocks` | *Block*[] | The blocks to be added to the blockchain |

**Returns:** *Promise*<void\>

Defined in: [index.ts:809](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L809)

___

### putHeader

▸ **putHeader**(`header`: *BlockHeader*): *Promise*<void\>

Adds a header to the blockchain.

If this header is valid and it has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | *BlockHeader* | The header to be added to the blockchain |

**Returns:** *Promise*<void\>

Defined in: [index.ts:853](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L853)

___

### putHeaders

▸ **putHeaders**(`headers`: *any*[]): *Promise*<void\>

Adds many headers to the blockchain.

If an invalid header is met the function will throw, headers before will
nevertheless remain in the DB. If any of the saved headers has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headers` | *any*[] | The headers to be added to the blockchain |

**Returns:** *Promise*<void\>

Defined in: [index.ts:838](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L838)

___

### safeNumberToHash

▸ **safeNumberToHash**(`number`: *BN*): *Promise*<``false`` \| Buffer\>

This method either returns a Buffer if there exists one in the DB or if it
does not exist (DB throws a `NotFoundError`) then return false If DB throws
any other error, this function throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | *BN* |

**Returns:** *Promise*<``false`` \| Buffer\>

Defined in: [index.ts:1499](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1499)

___

### selectNeededHashes

▸ **selectNeededHashes**(`hashes`: *Buffer*[]): *Promise*<Buffer[]\>

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hashes` | *Buffer*[] | Ordered array of hashes (ordered on `number`). |

**Returns:** *Promise*<Buffer[]\>

Defined in: [index.ts:1095](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1095)

___

### setHead

▸ **setHead**(`tag`: *string*, `headHash`: *Buffer*): *Promise*<void\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currenntly stored.

**`deprecated`** use `setIteratorHead()` instead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | *string* | The tag to save the headHash to |
| `headHash` | *Buffer* | The head hash to save |

**Returns:** *Promise*<void\>

Defined in: [index.ts:1298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1298)

___

### setIteratorHead

▸ **setIteratorHead**(`tag`: *string*, `headHash`: *Buffer*): *Promise*<void\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currenntly stored.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | *string* | The tag to save the headHash to |
| `headHash` | *Buffer* | The head hash to save |

**Returns:** *Promise*<void\>

Defined in: [index.ts:1286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1286)

___

### create

▸ `Static` **create**(`opts?`: [*BlockchainOptions*](../interfaces/blockchainoptions.md)): *Promise*<[*default*](default.md)\>

Safe creation of a new Blockchain object awaiting the initialization function,
encouraged method to use when creating a blockchain object.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `opts` | [*BlockchainOptions*](../interfaces/blockchainoptions.md) | {} | Constructor options, see [BlockchainOptions](../interfaces/blockchainoptions.md) |

**Returns:** *Promise*<[*default*](default.md)\>

Defined in: [index.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L203)

___

### fromBlocksData

▸ `Static` **fromBlocksData**(`blocksData`: BlockData[], `opts?`: [*BlockchainOptions*](../interfaces/blockchainoptions.md)): *Promise*<[*default*](default.md)\>

Creates a blockchain from a list of block objects,
objects must be readable by the `Block.fromBlockData()` method

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `blocksData` | BlockData[] | - | - |
| `opts` | [*BlockchainOptions*](../interfaces/blockchainoptions.md) | {} | Constructor options, see [BlockchainOptions](../interfaces/blockchainoptions.md) |

**Returns:** *Promise*<[*default*](default.md)\>

Defined in: [index.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L218)
