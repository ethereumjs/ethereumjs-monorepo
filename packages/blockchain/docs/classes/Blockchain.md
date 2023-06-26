[@ethereumjs/blockchain](../README.md) / Blockchain

# Class: Blockchain

This class stores and interacts with blocks.

## Implements

- [`BlockchainInterface`](../interfaces/BlockchainInterface.md)

## Table of contents

### Properties

- [\_common](Blockchain.md#_common)
- [consensus](Blockchain.md#consensus)
- [db](Blockchain.md#db)
- [dbManager](Blockchain.md#dbmanager)

### Accessors

- [genesisBlock](Blockchain.md#genesisblock)

### Methods

- [checkAndTransitionHardForkByNumber](Blockchain.md#checkandtransitionhardforkbynumber)
- [copy](Blockchain.md#copy)
- [createGenesisBlock](Blockchain.md#creategenesisblock)
- [delBlock](Blockchain.md#delblock)
- [genesisState](Blockchain.md#genesisstate)
- [getBlock](Blockchain.md#getblock)
- [getBlocks](Blockchain.md#getblocks)
- [getCanonicalHeadBlock](Blockchain.md#getcanonicalheadblock)
- [getCanonicalHeadHeader](Blockchain.md#getcanonicalheadheader)
- [getCanonicalHeader](Blockchain.md#getcanonicalheader)
- [getHead](Blockchain.md#gethead)
- [getIteratorHead](Blockchain.md#getiteratorhead)
- [getParentTD](Blockchain.md#getparenttd)
- [getTotalDifficulty](Blockchain.md#gettotaldifficulty)
- [iterator](Blockchain.md#iterator)
- [putBlock](Blockchain.md#putblock)
- [putBlocks](Blockchain.md#putblocks)
- [putHeader](Blockchain.md#putheader)
- [putHeaders](Blockchain.md#putheaders)
- [resetCanonicalHead](Blockchain.md#resetcanonicalhead)
- [safeNumberToHash](Blockchain.md#safenumbertohash)
- [selectNeededHashes](Blockchain.md#selectneededhashes)
- [setIteratorHead](Blockchain.md#setiteratorhead)
- [validateBlock](Blockchain.md#validateblock)
- [validateHeader](Blockchain.md#validateheader)
- [create](Blockchain.md#create)
- [fromBlocksData](Blockchain.md#fromblocksdata)

## Properties

### \_common

• **\_common**: `Common`

#### Defined in

[blockchain.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L53)

___

### consensus

• **consensus**: [`Consensus`](../interfaces/Consensus.md)

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[consensus](../interfaces/BlockchainInterface.md#consensus)

#### Defined in

[blockchain.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L25)

___

### db

• **db**: `AbstractLevel`<`string` \| `Uint8Array` \| `Buffer`, `string` \| `Buffer`, `string` \| `Buffer`\>

#### Defined in

[blockchain.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L26)

___

### dbManager

• **dbManager**: `DBManager`

#### Defined in

[blockchain.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L27)

## Accessors

### genesisBlock

• `get` **genesisBlock**(): `Block`

The genesis Block for the blockchain.

#### Returns

`Block`

#### Defined in

[blockchain.ts:1299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1299)

## Methods

### checkAndTransitionHardForkByNumber

▸ **checkAndTransitionHardForkByNumber**(`number`, `td?`, `timestamp?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |
| `td?` | `BigIntLike` |
| `timestamp?` | `BigIntLike` |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:1236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1236)

___

### copy

▸ **copy**(): [`Blockchain`](Blockchain.md)

Returns a deep copy of this [Blockchain](Blockchain.md) instance.

Note: this does not make a copy of the underlying db
since it is unknown if the source is on disk or in memory.
This should not be a significant issue in most usage since
the queries will only reflect the instance's known data.
If you would like this copied blockchain to use another db
set the [db](Blockchain.md#db) of this returned instance to a copy of
the original.

#### Returns

[`Blockchain`](Blockchain.md)

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[copy](../interfaces/BlockchainInterface.md#copy)

#### Defined in

[blockchain.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L173)

___

### createGenesisBlock

▸ **createGenesisBlock**(`stateRoot`): `Block`

Creates a genesis Block for the blockchain with params from Common.genesis

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | `Buffer` | The genesis stateRoot |

#### Returns

`Block`

#### Defined in

[blockchain.ts:1308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1308)

___

### delBlock

▸ **delBlock**(`blockHash`): `Promise`<`void`\>

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
| `blockHash` | `Buffer` | The hash of the block to be deleted |

#### Returns

`Promise`<`void`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[delBlock](../interfaces/BlockchainInterface.md#delblock)

#### Defined in

[blockchain.ts:867](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L867)

___

### genesisState

▸ **genesisState**(): `GenesisState`

Returns the genesis state of the blockchain.
All values are provided as hex-prefixed strings.

#### Returns

`GenesisState`

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[genesisState](../interfaces/BlockchainInterface.md#genesisstate)

#### Defined in

[blockchain.ts:1342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1342)

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`<`Block`\>

Gets a block by its hash or number.  If a number is provided, the returned
block will be the canonical block at that number in the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Buffer` | The block's hash or number. If a hash is provided, then this will be immediately looked up, otherwise it will wait until we have unlocked the DB |

#### Returns

`Promise`<`Block`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getBlock](../interfaces/BlockchainInterface.md#getblock)

#### Defined in

[blockchain.ts:737](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L737)

___

### getBlocks

▸ **getBlocks**(`blockId`, `maxBlocks`, `skip`, `reverse`): `Promise`<`Block`[]\>

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Buffer` | The block's hash or number |
| `maxBlocks` | `number` | Max number of blocks to return |
| `skip` | `number` | Number of blocks to skip apart |
| `reverse` | `boolean` | Fetch blocks in reverse |

#### Returns

`Promise`<`Block`[]\>

#### Defined in

[blockchain.ts:785](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L785)

___

### getCanonicalHeadBlock

▸ **getCanonicalHeadBlock**(): `Promise`<`Block`\>

Returns the latest full block in the canonical chain.

#### Returns

`Promise`<`Block`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getCanonicalHeadBlock](../interfaces/BlockchainInterface.md#getcanonicalheadblock)

#### Defined in

[blockchain.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L356)

___

### getCanonicalHeadHeader

▸ **getCanonicalHeadHeader**(): `Promise`<`BlockHeader`\>

Returns the latest header in the canonical chain.

#### Returns

`Promise`<`BlockHeader`\>

#### Defined in

[blockchain.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L345)

___

### getCanonicalHeader

▸ **getCanonicalHeader**(`number`): `Promise`<`BlockHeader`\>

Gets a header by number. Header must be in the canonical chain

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |

#### Returns

`Promise`<`BlockHeader`\>

#### Defined in

[blockchain.ts:1273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1273)

___

### getHead

▸ **getHead**(`name?`): `Promise`<`Block`\>

Returns the specified iterator head.

**`Deprecated`**

use [getIteratorHead](Blockchain.md#getiteratorhead) instead.
Note that [getIteratorHead](Blockchain.md#getiteratorhead) doesn't return
the `headHeader` but the genesis hash as an initial iterator
head value (now matching the behavior of [iterator](Blockchain.md#iterator)
on a first run)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `'vm'` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`<`Block`\>

#### Defined in

[blockchain.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L332)

___

### getIteratorHead

▸ **getIteratorHead**(`name?`): `Promise`<`Block`\>

Returns the specified iterator head.

This function replaces the old [getHead](Blockchain.md#gethead) method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of [iterator](Blockchain.md#iterator).

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `'vm'` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`<`Block`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getIteratorHead](../interfaces/BlockchainInterface.md#getiteratorhead)

#### Defined in

[blockchain.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L312)

___

### getParentTD

▸ **getParentTD**(`header`): `Promise`<`bigint`\>

Gets total difficulty for a header's parent, helpful for determining terminal block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | Block header whose parent td is desired |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[blockchain.ts:771](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L771)

___

### getTotalDifficulty

▸ **getTotalDifficulty**(`hash`, `number?`): `Promise`<`bigint`\>

Gets total difficulty for a block specified by hash and number

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `Buffer` |
| `number?` | `bigint` |

#### Returns

`Promise`<`bigint`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getTotalDifficulty](../interfaces/BlockchainInterface.md#gettotaldifficulty)

#### Defined in

[blockchain.ts:760](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L760)

___

### iterator

▸ **iterator**(`name`, `onBlock`, `maxBlocks?`, `releaseLockOnCallback?`): `Promise`<`number`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using [getIteratorHead](Blockchain.md#getiteratorhead).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the state root head |
| `onBlock` | `OnBlock` | Function called on each block with params (block, reorg) |
| `maxBlocks?` | `number` | How many blocks to run. By default, run all unprocessed blocks in the canonical chain. |
| `releaseLockOnCallback?` | `boolean` | Do not lock the blockchain for running the callback (default: `false`) |

#### Returns

`Promise`<`number`\>

number of blocks actually iterated

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[iterator](../interfaces/BlockchainInterface.md#iterator)

#### Defined in

[blockchain.ts:965](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L965)

___

### putBlock

▸ **putBlock**(`block`): `Promise`<`void`\>

Adds a block to the blockchain.

If the block is valid and has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | The block to be added to the blockchain |

#### Returns

`Promise`<`void`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[putBlock](../interfaces/BlockchainInterface.md#putblock)

#### Defined in

[blockchain.ts:386](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L386)

___

### putBlocks

▸ **putBlocks**(`blocks`): `Promise`<`void`\>

Adds blocks to the blockchain.

If an invalid block is met the function will throw, blocks before will
nevertheless remain in the DB. If any of the saved blocks has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocks` | `Block`[] | The blocks to be added to the blockchain |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L372)

___

### putHeader

▸ **putHeader**(`header`): `Promise`<`void`\>

Adds a header to the blockchain.

If this header is valid and it has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | The header to be added to the blockchain |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L413)

___

### putHeaders

▸ **putHeaders**(`headers`): `Promise`<`void`\>

Adds many headers to the blockchain.

If an invalid header is met the function will throw, headers before will
nevertheless remain in the DB. If any of the saved headers has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headers` | `any`[] | The headers to be added to the blockchain |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:399](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L399)

___

### resetCanonicalHead

▸ **resetCanonicalHead**(`canonicalHead`): `Promise`<`void`\>

Resets the canonical chain to canonicalHead number

This updates the head hashes (if affected) to the hash corresponding to
canonicalHead and cleans up canonical references greater than canonicalHead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canonicalHead` | `bigint` | The number to which chain should be reset to |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:425](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L425)

___

### safeNumberToHash

▸ **safeNumberToHash**(`number`): `Promise`<``false`` \| `Buffer`\>

This method either returns a Buffer if there exists one in the DB or if it
does not exist (DB throws a `NotFoundError`) then return false If DB throws
any other error, this function throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |

#### Returns

`Promise`<``false`` \| `Buffer`\>

#### Defined in

[blockchain.ts:1284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1284)

___

### selectNeededHashes

▸ **selectNeededHashes**(`hashes`): `Promise`<`Buffer`[]\>

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hashes` | `Buffer`[] | Ordered array of hashes (ordered on `number`). |

#### Returns

`Promise`<`Buffer`[]\>

#### Defined in

[blockchain.ts:827](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L827)

___

### setIteratorHead

▸ **setIteratorHead**(`tag`, `headHash`): `Promise`<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | `string` | The tag to save the headHash to |
| `headHash` | `Buffer` | The head hash to save |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:1028](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1028)

___

### validateBlock

▸ **validateBlock**(`block`): `Promise`<`void`\>

Validates a block, by validating the header against the current chain, any uncle headers, and then
whether the block is internally consistent

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | block to be validated |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:640](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L640)

___

### validateHeader

▸ **validateHeader**(`header`, `height?`): `Promise`<`void`\>

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.
It verifies the current block against the `parentHash`:
- The `parentHash` is part of the blockchain (it is a valid header)
- Current block number is parent block number + 1
- Current block has a strictly higher timestamp
- Additional PoW checks ->
  - Current block has valid difficulty and gas limit
  - In case that the header is an uncle header, it should not be too old or young in the chain.
- Additional PoA clique checks ->
  - Checks on coinbase and mixHash
  - Current block has a timestamp diff greater or equal to PERIOD
  - Current block has difficulty correctly marked as INTURN or NOTURN

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | header to be validated |
| `height?` | `bigint` | If this is an uncle header, this is the height of the block that is including it |

#### Returns

`Promise`<`void`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[validateHeader](../interfaces/BlockchainInterface.md#validateheader)

#### Defined in

[blockchain.ts:580](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L580)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`Blockchain`](Blockchain.md)\>

Safe creation of a new Blockchain object awaiting the initialization function,
encouraged method to use when creating a blockchain object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`BlockchainOptions`](../interfaces/BlockchainOptions.md) | Constructor options, see [BlockchainOptions](../interfaces/BlockchainOptions.md) |

#### Returns

`Promise`<[`Blockchain`](Blockchain.md)\>

#### Defined in

[blockchain.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L65)

___

### fromBlocksData

▸ `Static` **fromBlocksData**(`blocksData`, `opts?`): `Promise`<[`Blockchain`](Blockchain.md)\>

Creates a blockchain from a list of block objects,
objects must be readable by Block.fromBlockData

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocksData` | `BlockData`[] | - |
| `opts` | [`BlockchainOptions`](../interfaces/BlockchainOptions.md) | Constructor options, see [BlockchainOptions](../interfaces/BlockchainOptions.md) |

#### Returns

`Promise`<[`Blockchain`](Blockchain.md)\>

#### Defined in

[blockchain.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L78)
