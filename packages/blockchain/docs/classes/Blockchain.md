[@ethereumjs/blockchain](../README.md) / Blockchain

# Class: Blockchain

This class stores and interacts with blocks.

## Implements

- [`BlockchainInterface`](../interfaces/BlockchainInterface.md)

## Table of contents

### Properties

- [common](Blockchain.md#common)
- [consensus](Blockchain.md#consensus)
- [db](Blockchain.md#db)
- [dbManager](Blockchain.md#dbmanager)
- [events](Blockchain.md#events)

### Accessors

- [genesisBlock](Blockchain.md#genesisblock)

### Methods

- [checkAndTransitionHardForkByNumber](Blockchain.md#checkandtransitionhardforkbynumber)
- [createGenesisBlock](Blockchain.md#creategenesisblock)
- [delBlock](Blockchain.md#delblock)
- [getBlock](Blockchain.md#getblock)
- [getBlocks](Blockchain.md#getblocks)
- [getCanonicalHeadBlock](Blockchain.md#getcanonicalheadblock)
- [getCanonicalHeadHeader](Blockchain.md#getcanonicalheadheader)
- [getCanonicalHeader](Blockchain.md#getcanonicalheader)
- [getIteratorHead](Blockchain.md#getiteratorhead)
- [getIteratorHeadSafe](Blockchain.md#getiteratorheadsafe)
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
- [shallowCopy](Blockchain.md#shallowcopy)
- [validateBlock](Blockchain.md#validateblock)
- [validateHeader](Blockchain.md#validateheader)
- [create](Blockchain.md#create)
- [fromBlocksData](Blockchain.md#fromblocksdata)

## Properties

### common

• `Readonly` **common**: `Common`

#### Defined in

[blockchain.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L110)

___

### consensus

• **consensus**: [`Consensus`](../interfaces/Consensus.md)

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[consensus](../interfaces/BlockchainInterface.md#consensus)

#### Defined in

[blockchain.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L82)

___

### db

• **db**: `DB`<`string` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

#### Defined in

[blockchain.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L83)

___

### dbManager

• **dbManager**: `DBManager`

#### Defined in

[blockchain.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L84)

___

### events

• **events**: `AsyncEventEmitter`<[`BlockchainEvents`](../README.md#blockchainevents)\>

Optional events emitter

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[events](../interfaces/BlockchainInterface.md#events)

#### Defined in

[blockchain.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L85)

## Accessors

### genesisBlock

• `get` **genesisBlock**(): `Block`

The genesis Block for the blockchain.

#### Returns

`Block`

#### Defined in

[blockchain.ts:1404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1404)

## Methods

### checkAndTransitionHardForkByNumber

▸ **checkAndTransitionHardForkByNumber**(`number`, `td?`, `timestamp?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `BigIntLike` |
| `td?` | `BigIntLike` |
| `timestamp?` | `BigIntLike` |

#### Returns

`Promise`<`void`\>

#### Defined in

[blockchain.ts:1341](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1341)

___

### createGenesisBlock

▸ **createGenesisBlock**(`stateRoot`): `Block`

Creates a genesis Block for the blockchain with params from Common.genesis

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | `Uint8Array` | The genesis stateRoot |

#### Returns

`Block`

#### Defined in

[blockchain.ts:1413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1413)

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
| `blockHash` | `Uint8Array` | The hash of the block to be deleted |

#### Returns

`Promise`<`void`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[delBlock](../interfaces/BlockchainInterface.md#delblock)

#### Defined in

[blockchain.ts:923](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L923)

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`<`Block`\>

Gets a block by its hash or number.  If a number is provided, the returned
block will be the canonical block at that number in the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Uint8Array` | The block's hash or number. If a hash is provided, then this will be immediately looked up, otherwise it will wait until we have unlocked the DB |

#### Returns

`Promise`<`Block`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getBlock](../interfaces/BlockchainInterface.md#getblock)

#### Defined in

[blockchain.ts:791](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L791)

___

### getBlocks

▸ **getBlocks**(`blockId`, `maxBlocks`, `skip`, `reverse`): `Promise`<`Block`[]\>

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Uint8Array` | The block's hash or number |
| `maxBlocks` | `number` | Max number of blocks to return |
| `skip` | `number` | Number of blocks to skip apart |
| `reverse` | `boolean` | Fetch blocks in reverse |

#### Returns

`Promise`<`Block`[]\>

#### Defined in

[blockchain.ts:840](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L840)

___

### getCanonicalHeadBlock

▸ **getCanonicalHeadBlock**(): `Promise`<`Block`\>

Returns the latest full block in the canonical chain.

#### Returns

`Promise`<`Block`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getCanonicalHeadBlock](../interfaces/BlockchainInterface.md#getcanonicalheadblock)

#### Defined in

[blockchain.ts:386](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L386)

___

### getCanonicalHeadHeader

▸ **getCanonicalHeadHeader**(): `Promise`<`BlockHeader`\>

Returns the latest header in the canonical chain.

#### Returns

`Promise`<`BlockHeader`\>

#### Defined in

[blockchain.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L375)

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

[blockchain.ts:1382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1382)

___

### getIteratorHead

▸ **getIteratorHead**(`name?`): `Promise`<`Block`\>

Returns the specified iterator head.

This function replaces the old Blockchain.getHead() method. Note that
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

[blockchain.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L345)

___

### getIteratorHeadSafe

▸ **getIteratorHeadSafe**(`name?`): `Promise`<`undefined` \| `Block`\>

This method differs from `getIteratorHead`. If the head is not found, it returns `undefined`.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `'vm'` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`<`undefined` \| `Block`\>

#### Defined in

[blockchain.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L356)

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

[blockchain.ts:826](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L826)

___

### getTotalDifficulty

▸ **getTotalDifficulty**(`hash`, `number?`): `Promise`<`bigint`\>

Gets total difficulty for a block specified by hash and number

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `Uint8Array` |
| `number?` | `bigint` |

#### Returns

`Promise`<`bigint`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getTotalDifficulty](../interfaces/BlockchainInterface.md#gettotaldifficulty)

#### Defined in

[blockchain.ts:812](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L812)

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
| `onBlock` | [`OnBlock`](../README.md#onblock) | Function called on each block with params (block, reorg) |
| `maxBlocks?` | `number` | How many blocks to run. By default, run all unprocessed blocks in the canonical chain. |
| `releaseLockOnCallback?` | `boolean` | Do not lock the blockchain for running the callback (default: `false`) |

#### Returns

`Promise`<`number`\>

number of blocks actually iterated

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[iterator](../interfaces/BlockchainInterface.md#iterator)

#### Defined in

[blockchain.ts:1029](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1029)

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

[blockchain.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L416)

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

[blockchain.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L402)

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

[blockchain.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L443)

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

[blockchain.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L429)

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

[blockchain.ts:455](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L455)

___

### safeNumberToHash

▸ **safeNumberToHash**(`number`): `Promise`<``false`` \| `Uint8Array`\>

This method either returns a Uint8Array if there exists one in the DB or if it
does not exist then return false If DB throws
any other error, this function throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |

#### Returns

`Promise`<``false`` \| `Uint8Array`\>

#### Defined in

[blockchain.ts:1396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1396)

___

### selectNeededHashes

▸ **selectNeededHashes**(`hashes`): `Promise`<`Uint8Array`[]\>

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hashes` | `Uint8Array`[] | Ordered array of hashes (ordered on `number`). |

#### Returns

`Promise`<`Uint8Array`[]\>

#### Defined in

[blockchain.ts:882](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L882)

___

### setIteratorHead

▸ **setIteratorHead**(`tag`, `headHash`): `Promise`<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | `string` | The tag to save the headHash to |
| `headHash` | `Uint8Array` | The head hash to save |

#### Returns

`Promise`<`void`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[setIteratorHead](../interfaces/BlockchainInterface.md#setiteratorhead)

#### Defined in

[blockchain.ts:1112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1112)

___

### shallowCopy

▸ **shallowCopy**(): [`Blockchain`](Blockchain.md)

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

[BlockchainInterface](../interfaces/BlockchainInterface.md).[shallowCopy](../interfaces/BlockchainInterface.md#shallowcopy)

#### Defined in

[blockchain.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L309)

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

[blockchain.ts:694](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L694)

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

[blockchain.ts:627](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L627)

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

[blockchain.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L129)

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

[blockchain.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L211)
