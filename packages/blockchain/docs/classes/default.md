[@ethereumjs/blockchain](../README.md) / default

# Class: default

This class stores and interacts with blocks.

## Implements

- [`BlockchainInterface`](../interfaces/BlockchainInterface.md)

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
- [cliqueSignerInTurn](default.md#cliquesignerinturn)
- [copy](default.md#copy)
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

• **new default**(`opts?`)

Creates new Blockchain object

**`deprecated`** - The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async {@link Blockchain.create} constructor instead (same API).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`BlockchainOptions`](../interfaces/BlockchainOptions.md) | An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/BlockchainOptions.md). |

#### Defined in

[index.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L245)

## Properties

### \_ethash

• `Optional` **\_ethash**: `default`

#### Defined in

[index.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L152)

___

### db

• **db**: `LevelUp`<`AbstractLevelDOWN`<`any`, `any`\>, `AbstractIterator`<`any`, `any`\>\>

#### Defined in

[index.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L128)

___

### dbManager

• **dbManager**: `DBManager`

#### Defined in

[index.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L129)

___

### initPromise

• **initPromise**: `Promise`<`void`\>

#### Defined in

[index.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L144)

## Accessors

### meta

• `get` **meta**(): `Object`

Returns an object with metadata about the Blockchain. It's defined for
backwards compatibility.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `genesis` | `undefined` \| `Buffer` |
| `heads` | `Object` |
| `rawHead` | `undefined` \| `Buffer` |

#### Defined in

[index.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L303)

## Methods

### cliqueActiveSigners

▸ **cliqueActiveSigners**(): `Address`[]

Returns a list with the current block signers
(only clique PoA, throws otherwise)

#### Returns

`Address`[]

#### Defined in

[index.ts:721](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L721)

___

### cliqueSignerInTurn

▸ **cliqueSignerInTurn**(`signer`): `Promise`<`boolean`\>

Helper to determine if a signer is in or out of turn for the next block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Address` | The signer address |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[index.ts:1583](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1583)

___

### copy

▸ **copy**(): [`default`](default.md)

Returns a deep copy of this {@link Blockchain} instance.

#### Returns

[`default`](default.md)

#### Defined in

[index.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L314)

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

[index.ts:1159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1159)

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`<`Block`\>

Gets a block by its hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `Buffer` \| `BN` | The block's hash or number. If a hash is provided, then this will be immediately looked up, otherwise it will wait until we have unlocked the DB |

#### Returns

`Promise`<`Block`\>

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[getBlock](../interfaces/BlockchainInterface.md#getblock)

#### Defined in

[index.ts:1042](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1042)

___

### getBlocks

▸ **getBlocks**(`blockId`, `maxBlocks`, `skip`, `reverse`): `Promise`<`Block`[]\>

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `Buffer` \| `BN` | The block's hash or number |
| `maxBlocks` | `number` | Max number of blocks to return |
| `skip` | `number` | Number of blocks to skip apart |
| `reverse` | `boolean` | Fetch blocks in reverse |

#### Returns

`Promise`<`Block`[]\>

#### Defined in

[index.ts:1077](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1077)

___

### getHead

▸ **getHead**(`name?`): `Promise`<`Block`\>

Returns the specified iterator head.

**`deprecated`** use {@link Blockchain.getIteratorHead} instead.
Note that {@link Blockchain.getIteratorHead} doesn't return
the `headHeader` but the genesis hash as an initial iterator
head value (now matching the behavior of {@link Blockchain.iterator}
on a first run)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `'vm'` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`<`Block`\>

#### Defined in

[index.ts:775](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L775)

___

### getIteratorHead

▸ **getIteratorHead**(`name?`): `Promise`<`Block`\>

Returns the specified iterator head.

This function replaces the old {@link Blockchain.getHead} method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of {@link Blockchain.iterator}.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `'vm'` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`<`Block`\>

#### Defined in

[index.ts:751](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L751)

___

### getLatestBlock

▸ **getLatestBlock**(): `Promise`<`Block`\>

Returns the latest full block in the canonical chain.

#### Returns

`Promise`<`Block`\>

#### Defined in

[index.ts:804](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L804)

___

### getLatestHeader

▸ **getLatestHeader**(): `Promise`<`BlockHeader`\>

Returns the latest header in the canonical chain.

#### Returns

`Promise`<`BlockHeader`\>

#### Defined in

[index.ts:791](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L791)

___

### getTotalDifficulty

▸ **getTotalDifficulty**(`hash`, `number?`): `Promise`<`BN`\>

Gets total difficulty for a block specified by hash and number

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `Buffer` |
| `number?` | `BN` |

#### Returns

`Promise`<`BN`\>

#### Defined in

[index.ts:1062](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1062)

___

### iterator

▸ **iterator**(`name`, `onBlock`, `maxBlocks?`): `Promise`<`number`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using {@link Blockchain.getIteratorHead}.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the state root head |
| `onBlock` | `OnBlock` | Function called on each block with params (block, reorg) |
| `maxBlocks?` | `number` | How many blocks to run. By default, run all unprocessed blocks in the canonical chain. |

#### Returns

`Promise`<`number`\>

number of blocks actually iterated

#### Implementation of

[BlockchainInterface](../interfaces/BlockchainInterface.md).[iterator](../interfaces/BlockchainInterface.md#iterator)

#### Defined in

[index.ts:1257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1257)

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

[index.ts:839](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L839)

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

[index.ts:824](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L824)

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

[index.ts:868](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L868)

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

[index.ts:853](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L853)

___

### safeNumberToHash

▸ **safeNumberToHash**(`number`): `Promise`<``false`` \| `Buffer`\>

This method either returns a Buffer if there exists one in the DB or if it
does not exist (DB throws a `NotFoundError`) then return false If DB throws
any other error, this function throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `BN` |

#### Returns

`Promise`<``false`` \| `Buffer`\>

#### Defined in

[index.ts:1567](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1567)

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

[index.ts:1119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1119)

___

### setHead

▸ **setHead**(`tag`, `headHash`): `Promise`<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currenntly stored.

**`deprecated`** use {@link Blockchain.setIteratorHead()} instead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | `string` | The tag to save the headHash to |
| `headHash` | `Buffer` | The head hash to save |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:1322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1322)

___

### setIteratorHead

▸ **setIteratorHead**(`tag`, `headHash`): `Promise`<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currenntly stored.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | `string` | The tag to save the headHash to |
| `headHash` | `Buffer` | The head hash to save |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:1310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L1310)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`default`](default.md)\>

Safe creation of a new Blockchain object awaiting the initialization function,
encouraged method to use when creating a blockchain object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`BlockchainOptions`](../interfaces/BlockchainOptions.md) | Constructor options, see [BlockchainOptions](../interfaces/BlockchainOptions.md) |

#### Returns

`Promise`<[`default`](default.md)\>

#### Defined in

[index.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L208)

___

### fromBlocksData

▸ `Static` **fromBlocksData**(`blocksData`, `opts?`): `Promise`<[`default`](default.md)\>

Creates a blockchain from a list of block objects,
objects must be readable by {@link Block.fromBlockData}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocksData` | `BlockData`[] | - |
| `opts` | [`BlockchainOptions`](../interfaces/BlockchainOptions.md) | Constructor options, see [BlockchainOptions](../interfaces/BlockchainOptions.md) |

#### Returns

`Promise`<[`default`](default.md)\>

#### Defined in

[index.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L223)
