[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / Blockchain

# Class: Blockchain

Defined in: [blockchain.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L59)

Blockchain implementation to create and maintain a valid canonical chain
of block headers or blocks with support for reorgs and the ability to provide
custom DB backends.

By default consensus validation is not provided since with the switch to
Proof-of-Stake consensus is validated by the Ethereum consensus layer.
If consensus validation is desired for Ethash or Clique blockchains the
optional `consensusDict` option can be used to pass in validation objects.

A Blockchain object can be created with the constructor method:

- [createBlockchain](../functions/createBlockchain.md)

## Implements

- [`BlockchainInterface`](../interfaces/BlockchainInterface.md)

## Constructors

### Constructor

> **new Blockchain**(`opts`): `Blockchain`

Defined in: [blockchain.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L113)

Creates new Blockchain object.

#### Parameters

##### opts

[`BlockchainOptions`](../interfaces/BlockchainOptions.md) = `{}`

An object with the options that this constructor takes. See
[BlockchainOptions](../interfaces/BlockchainOptions.md).

#### Returns

`Blockchain`

#### Deprecated

The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async [createBlockchain](../functions/createBlockchain.md) constructor instead (same API).

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [blockchain.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L87)

***

### db

> **db**: `DB`\<`string` \| `Uint8Array`\<`ArrayBufferLike`\>, `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| `DBObject`\>

Defined in: [blockchain.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L60)

***

### dbManager

> **dbManager**: `DBManager`

Defined in: [blockchain.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L61)

***

### events

> **events**: `EventEmitter`\<[`BlockchainEvent`](../type-aliases/BlockchainEvent.md)\>

Defined in: [blockchain.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L62)

Optional events emitter

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`events`](../interfaces/BlockchainInterface.md#events)

## Accessors

### consensus

#### Get Signature

> **get** **consensus**(): [`Consensus`](../interfaces/Consensus.md) \| `undefined`

Defined in: [blockchain.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L169)

Returns an eventual consensus object matching the current consensus algorithm from Common
or undefined if non available

##### Returns

[`Consensus`](../interfaces/Consensus.md) \| `undefined`

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`consensus`](../interfaces/BlockchainInterface.md#consensus)

***

### genesisBlock

#### Get Signature

> **get** **genesisBlock**(): `Block`

Defined in: [blockchain.ts:1308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1308)

The genesis Block for the blockchain.

##### Returns

`Block`

## Methods

### checkAndTransitionHardForkByNumber()

> **checkAndTransitionHardForkByNumber**(`number`, `timestamp?`): `Promise`\<`void`\>

Defined in: [blockchain.ts:1269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1269)

#### Parameters

##### number

`BigIntLike`

##### timestamp?

`BigIntLike`

#### Returns

`Promise`\<`void`\>

***

### createGenesisBlock()

> **createGenesisBlock**(`stateRoot`): `Block`

Defined in: [blockchain.ts:1318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1318)

Creates a genesis Block for the blockchain with params from Common.genesis

#### Parameters

##### stateRoot

`Uint8Array`

The genesis stateRoot

#### Returns

`Block`

***

### delBlock()

> **delBlock**(`blockHash`): `Promise`\<`void`\>

Defined in: [blockchain.ts:836](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L836)

Completely deletes a block from the blockchain including any references to
this block. If this block was in the canonical chain, then also each child
block of this block is deleted Also, if this was a canonical block, each
head header which is part of this now stale chain will be set to the
parentHeader of this block An example reason to execute is when running the
block in the VM invalidates this block: this will then reset the canonical
head to the past block (which has been validated in the past by the VM, so
we can be sure it is correct).

#### Parameters

##### blockHash

`Uint8Array`

The hash of the block to be deleted

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`delBlock`](../interfaces/BlockchainInterface.md#delblock)

***

### getBlock()

> **getBlock**(`blockId`): `Promise`\<`Block`\>

Defined in: [blockchain.ts:704](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L704)

Gets a block by its hash or number.  If a number is provided, the returned
block will be the canonical block at that number in the chain

#### Parameters

##### blockId

The block's hash or number. If a hash is provided, then
this will be immediately looked up, otherwise it will wait until we have
unlocked the DB

`number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`Block`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`getBlock`](../interfaces/BlockchainInterface.md#getblock)

***

### getBlocks()

> **getBlocks**(`blockId`, `maxBlocks`, `skip`, `reverse`): `Promise`\<`Block`[]\>

Defined in: [blockchain.ts:753](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L753)

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

##### blockId

The block's hash or number

`number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### maxBlocks

`number`

Max number of blocks to return

##### skip

`number`

Number of blocks to skip apart

##### reverse

`boolean`

Fetch blocks in reverse

#### Returns

`Promise`\<`Block`[]\>

***

### getCanonicalHeadBlock()

> **getCanonicalHeadBlock**(): `Promise`\<`Block`\>

Defined in: [blockchain.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L261)

Returns the latest full block in the canonical chain.

#### Returns

`Promise`\<`Block`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`getCanonicalHeadBlock`](../interfaces/BlockchainInterface.md#getcanonicalheadblock)

***

### getCanonicalHeader()

> **getCanonicalHeader**(`number`): `Promise`\<`BlockHeader`\>

Defined in: [blockchain.ts:1286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1286)

Gets a header by number. Header must be in the canonical chain

#### Parameters

##### number

`bigint`

#### Returns

`Promise`\<`BlockHeader`\>

***

### getCanonicalHeadHeader()

> **getCanonicalHeadHeader**(): `Promise`\<`BlockHeader`\>

Defined in: [blockchain.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L250)

Returns the latest header in the canonical chain.

#### Returns

`Promise`\<`BlockHeader`\>

***

### getIteratorHead()

> **getIteratorHead**(`name`): `Promise`\<`Block`\>

Defined in: [blockchain.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L220)

Returns the specified iterator head.

This function replaces the old Blockchain.getHead() method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of [Blockchain.iterator](#iterator).

#### Parameters

##### name

`string` = `'vm'`

Optional name of the iterator head (default: 'vm')

#### Returns

`Promise`\<`Block`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`getIteratorHead`](../interfaces/BlockchainInterface.md#getiteratorhead)

***

### getIteratorHeadSafe()

> **getIteratorHeadSafe**(`name`): `Promise`\<`Block` \| `undefined`\>

Defined in: [blockchain.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L231)

This method differs from `getIteratorHead`. If the head is not found, it returns `undefined`.

#### Parameters

##### name

`string` = `'vm'`

Optional name of the iterator head (default: 'vm')

#### Returns

`Promise`\<`Block` \| `undefined`\>

***

### getParentTD()

> **getParentTD**(`header`): `Promise`\<`bigint`\>

Defined in: [blockchain.ts:739](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L739)

Gets total difficulty for a header's parent, helpful for determining terminal block

#### Parameters

##### header

`BlockHeader`

Block header whose parent td is desired

#### Returns

`Promise`\<`bigint`\>

***

### getTotalDifficulty()

> **getTotalDifficulty**(`hash`, `number?`): `Promise`\<`bigint`\>

Defined in: [blockchain.ts:725](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L725)

Gets total difficulty for a block specified by hash and number

#### Parameters

##### hash

`Uint8Array`

##### number?

`bigint`

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`getTotalDifficulty`](../interfaces/BlockchainInterface.md#gettotaldifficulty)

***

### iterator()

> **iterator**(`name`, `onBlock`, `maxBlocks?`, `releaseLockOnCallback?`): `Promise`\<`number`\>

Defined in: [blockchain.ts:947](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L947)

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using [Blockchain.getIteratorHead](#getiteratorhead).

#### Parameters

##### name

`string`

Name of the state root head

##### onBlock

[`OnBlock`](../type-aliases/OnBlock.md)

Function called on each block with params (block, reorg)

##### maxBlocks?

`number`

How many blocks to run. By default, run all unprocessed blocks in the canonical chain.

##### releaseLockOnCallback?

`boolean`

Do not lock the blockchain for running the callback (default: `false`)

#### Returns

`Promise`\<`number`\>

number of blocks actually iterated

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`iterator`](../interfaces/BlockchainInterface.md#iterator)

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

Defined in: [blockchain.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L293)

Adds a block to the blockchain.

If the block is valid and has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

##### block

`Block`

The block to be added to the blockchain

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`putBlock`](../interfaces/BlockchainInterface.md#putblock)

***

### putBlocks()

> **putBlocks**(`blocks`): `Promise`\<`void`\>

Defined in: [blockchain.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L277)

Adds blocks to the blockchain.

If an invalid block is met the function will throw, blocks before will
nevertheless remain in the DB. If any of the saved blocks has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

##### blocks

`Block`[]

The blocks to be added to the blockchain

#### Returns

`Promise`\<`void`\>

***

### putHeader()

> **putHeader**(`header`): `Promise`\<`void`\>

Defined in: [blockchain.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L322)

Adds a header to the blockchain.

If this header is valid and it has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

##### header

`BlockHeader`

The header to be added to the blockchain

#### Returns

`Promise`\<`void`\>

***

### putHeaders()

> **putHeaders**(`headers`): `Promise`\<`void`\>

Defined in: [blockchain.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L306)

Adds many headers to the blockchain.

If an invalid header is met the function will throw, headers before will
nevertheless remain in the DB. If any of the saved headers has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

##### headers

`any`[]

The headers to be added to the blockchain

#### Returns

`Promise`\<`void`\>

***

### resetCanonicalHead()

> **resetCanonicalHead**(`canonicalHead`): `Promise`\<`void`\>

Defined in: [blockchain.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L334)

Resets the canonical chain to canonicalHead number

This updates the head hashes (if affected) to the hash corresponding to
canonicalHead and cleans up canonical references greater than canonicalHead

#### Parameters

##### canonicalHead

`bigint`

The number to which chain should be reset to

#### Returns

`Promise`\<`void`\>

***

### safeNumberToHash()

> **safeNumberToHash**(`number`): `Promise`\<`false` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [blockchain.ts:1300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1300)

This method either returns a Uint8Array if there exists one in the DB or if it
does not exist then return false If DB throws
any other error, this function throws.

#### Parameters

##### number

`bigint`

#### Returns

`Promise`\<`false` \| `Uint8Array`\<`ArrayBufferLike`\>\>

***

### selectNeededHashes()

> **selectNeededHashes**(`hashes`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

Defined in: [blockchain.ts:795](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L795)

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

#### Parameters

##### hashes

`Uint8Array`\<`ArrayBufferLike`\>[]

Ordered array of hashes (ordered on `number`).

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

***

### setIteratorHead()

> **setIteratorHead**(`tag`, `headHash`): `Promise`\<`void`\>

Defined in: [blockchain.ts:1030](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L1030)

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

##### tag

`string`

The tag to save the headHash to

##### headHash

`Uint8Array`

The head hash to save

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`setIteratorHead`](../interfaces/BlockchainInterface.md#setiteratorhead)

***

### shallowCopy()

> **shallowCopy**(): `Blockchain`

Defined in: [blockchain.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L184)

Returns a deep copy of this Blockchain instance.

Note: this does not make a copy of the underlying db
since it is unknown if the source is on disk or in memory.
This should not be a significant issue in most usage since
the queries will only reflect the instance's known data.
If you would like this copied blockchain to use another db
set the [db](#db) of this returned instance to a copy of
the original.

#### Returns

`Blockchain`

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`shallowCopy`](../interfaces/BlockchainInterface.md#shallowcopy)

***

### validateBlock()

> **validateBlock**(`block`): `Promise`\<`void`\>

Defined in: [blockchain.ts:605](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L605)

Validates a block, by validating the header against the current chain, any uncle headers, and then
whether the block is internally consistent

#### Parameters

##### block

`Block`

block to be validated

#### Returns

`Promise`\<`void`\>

***

### validateHeader()

> **validateHeader**(`header`, `height?`): `Promise`\<`void`\>

Defined in: [blockchain.ts:528](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/blockchain.ts#L528)

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

##### header

`BlockHeader`

header to be validated

##### height?

`bigint`

If this is an uncle header, this is the height of the block that is including it

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`BlockchainInterface`](../interfaces/BlockchainInterface.md).[`validateHeader`](../interfaces/BlockchainInterface.md#validateheader)
