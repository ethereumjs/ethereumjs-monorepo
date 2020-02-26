[ethereumjs-blockchain](../README.md) › ["index"](../modules/_index_.md) › [Blockchain](_index_.blockchain.md)

# Class: Blockchain

This class stores and interacts with blocks.

## Hierarchy

- **Blockchain**

## Implements

- [BlockchainInterface](../interfaces/_index_.blockchaininterface.md)

## Index

### Constructors

- [constructor](_index_.blockchain.md#constructor)

### Properties

- [db](_index_.blockchain.md#db)
- [dbManager](_index_.blockchain.md#dbmanager)
- [ethash](_index_.blockchain.md#ethash)
- [validate](_index_.blockchain.md#validate)

### Accessors

- [meta](_index_.blockchain.md#meta)

### Methods

- [delBlock](_index_.blockchain.md#delblock)
- [getBlock](_index_.blockchain.md#getblock)
- [getBlocks](_index_.blockchain.md#getblocks)
- [getDetails](_index_.blockchain.md#getdetails)
- [getHead](_index_.blockchain.md#gethead)
- [getLatestBlock](_index_.blockchain.md#getlatestblock)
- [getLatestHeader](_index_.blockchain.md#getlatestheader)
- [iterator](_index_.blockchain.md#iterator)
- [putBlock](_index_.blockchain.md#putblock)
- [putBlocks](_index_.blockchain.md#putblocks)
- [putGenesis](_index_.blockchain.md#putgenesis)
- [putHeader](_index_.blockchain.md#putheader)
- [putHeaders](_index_.blockchain.md#putheaders)
- [selectNeededHashes](_index_.blockchain.md#selectneededhashes)

## Constructors

### constructor

\+ **new Blockchain**(`opts`: [BlockchainOptions](../interfaces/_index_.blockchainoptions.md)): _[Blockchain](\_index_.blockchain.md)\_

_Defined in [index.ts:184](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L184)_

Creates new Blockchain object

**Parameters:**

| Name   | Type                                                            | Default | Description                                                                                                                  |
| ------ | --------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `opts` | [BlockchainOptions](../interfaces/_index_.blockchainoptions.md) | {}      | An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/_index_.blockchainoptions.md). |

**Returns:** _[Blockchain](\_index_.blockchain.md)\_

## Properties

### db

• **db**: _any_

_Defined in [index.ts:172](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L172)_

---

### dbManager

• **dbManager**: _DBManager_

_Defined in [index.ts:173](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L173)_

---

### ethash

• **ethash**: _any_

_Defined in [index.ts:174](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L174)_

---

### validate

• **validate**: _boolean_ = true

_Defined in [index.ts:181](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L181)_

This field is always `true`. It's here only for backwards compatibility.

**`deprecated`**

## Accessors

### meta

• **get meta**(): _object_

_Defined in [index.ts:242](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L242)_

Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.

**Returns:** _object_

- **genesis**: _any_ = this.\_genesis

- **heads**: _any_ = this.\_heads

- **rawHead**: _any_ = this.\_headHeader

## Methods

### delBlock

▸ **delBlock**(`blockHash`: Buffer, `cb`: any): _void_

_Implementation of [BlockchainInterface](../interfaces/\_index_.blockchaininterface.md)\_

_Defined in [index.ts:890](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L890)_

Deletes a block from the blockchain. All child blocks in the chain are deleted and any
encountered heads are set to the parent block.

**Parameters:**

| Name        | Type   | Description                         |
| ----------- | ------ | ----------------------------------- |
| `blockHash` | Buffer | The hash of the block to be deleted |
| `cb`        | any    | A callback.                         |

**Returns:** _void_

---

### getBlock

▸ **getBlock**(`blockTag`: Buffer | number | BN, `cb`: any): _void_

_Defined in [index.ts:627](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L627)_

Gets a block by its hash.

**Parameters:**

| Name       | Type                           | Description                                                                                                                                  |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `blockTag` | Buffer &#124; number &#124; BN | The block's hash or number                                                                                                                   |
| `cb`       | any                            | The callback. It is given two parameters `err` and the found `block` (an instance of https://github.com/ethereumjs/ethereumjs-block) if any. |

**Returns:** _void_

---

### getBlocks

▸ **getBlocks**(`blockId`: Buffer | number, `maxBlocks`: number, `skip`: number, `reverse`: boolean, `cb`: any): _void_

_Defined in [index.ts:650](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L650)_

Looks up many blocks relative to blockId

**Parameters:**

| Name        | Type                 | Description                                                                   |
| ----------- | -------------------- | ----------------------------------------------------------------------------- |
| `blockId`   | Buffer &#124; number | The block's hash or number                                                    |
| `maxBlocks` | number               | Max number of blocks to return                                                |
| `skip`      | number               | Number of blocks to skip apart                                                |
| `reverse`   | boolean              | Fetch blocks in reverse                                                       |
| `cb`        | any                  | The callback. It is given two parameters `err` and the found `blocks` if any. |

**Returns:** _void_

---

### getDetails

▸ **getDetails**(`_`: string, `cb`: any): _void_

_Implementation of [BlockchainInterface](../interfaces/\_index_.blockchaininterface.md)\_

_Defined in [index.ts:691](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L691)_

This method used to return block details by its hash. It's only here for backwards compatibility.

**`deprecated`**

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `_`  | string |
| `cb` | any    |

**Returns:** _void_

---

### getHead

▸ **getHead**(`name`: any, `cb?`: any): _void_

_Defined in [index.ts:338](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L338)_

Returns the specified iterator head.

**Parameters:**

| Name   | Type | Description                                                             |
| ------ | ---- | ----------------------------------------------------------------------- |
| `name` | any  | Optional name of the state root head (default: 'vm')                    |
| `cb?`  | any  | The callback. It is given two parameters `err` and the returned `block` |

**Returns:** _void_

---

### getLatestBlock

▸ **getLatestBlock**(`cb`: any): _void_

_Defined in [index.ts:378](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L378)_

Returns the latest full block in the canonical chain.

**Parameters:**

| Name | Type | Description                                                             |
| ---- | ---- | ----------------------------------------------------------------------- |
| `cb` | any  | The callback. It is given two parameters `err` and the returned `block` |

**Returns:** _void_

---

### getLatestHeader

▸ **getLatestHeader**(`cb`: any): _void_

_Defined in [index.ts:361](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L361)_

Returns the latest header in the canonical chain.

**Parameters:**

| Name | Type | Description                                                              |
| ---- | ---- | ------------------------------------------------------------------------ |
| `cb` | any  | The callback. It is given two parameters `err` and the returned `header` |

**Returns:** _void_

---

### iterator

▸ **iterator**(`name`: string, `onBlock`: any, `cb`: any): _void_

_Implementation of [BlockchainInterface](../interfaces/\_index_.blockchaininterface.md)\_

_Defined in [index.ts:1024](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L1024)_

Iterates through blocks starting at the specified iterator head and calls the onBlock function
on each block. The current location of an iterator head can be retrieved using the `getHead()`
method.

**Parameters:**

| Name      | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| `name`    | string | Name of the state root head                                  |
| `onBlock` | any    | Function called on each block with params (block, reorg, cb) |
| `cb`      | any    | A callback function                                          |

**Returns:** _void_

---

### putBlock

▸ **putBlock**(`block`: object, `cb`: any, `isGenesis?`: undefined | false | true): _void_

_Defined in [index.ts:407](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L407)_

Adds a block to the blockchain.

**Parameters:**

| Name         | Type                               | Description                                                          |
| ------------ | ---------------------------------- | -------------------------------------------------------------------- |
| `block`      | object                             | The block to be added to the blockchain                              |
| `cb`         | any                                | The callback. It is given two parameters `err` and the saved `block` |
| `isGenesis?` | undefined &#124; false &#124; true | -                                                                    |

**Returns:** _void_

---

### putBlocks

▸ **putBlocks**(`blocks`: Array‹any›, `cb`: any): _void_

_Defined in [index.ts:391](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L391)_

Adds many blocks to the blockchain.

**Parameters:**

| Name     | Type       | Description                                                                       |
| -------- | ---------- | --------------------------------------------------------------------------------- |
| `blocks` | Array‹any› | The blocks to be added to the blockchain                                          |
| `cb`     | any        | The callback. It is given two parameters `err` and the last of the saved `blocks` |

**Returns:** _void_

---

### putGenesis

▸ **putGenesis**(`genesis`: any, `cb`: any): _void_

_Defined in [index.ts:328](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L328)_

Puts the genesis block in the database

**Parameters:**

| Name      | Type | Description                                                          |
| --------- | ---- | -------------------------------------------------------------------- |
| `genesis` | any  | The genesis block to be added                                        |
| `cb`      | any  | The callback. It is given two parameters `err` and the saved `block` |

**Returns:** _void_

---

### putHeader

▸ **putHeader**(`header`: object, `cb`: any): _void_

_Defined in [index.ts:439](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L439)_

Adds a header to the blockchain.

**Parameters:**

| Name     | Type   | Description                                                           |
| -------- | ------ | --------------------------------------------------------------------- |
| `header` | object | The header to be added to the blockchain                              |
| `cb`     | any    | The callback. It is given two parameters `err` and the saved `header` |

**Returns:** _void_

---

### putHeaders

▸ **putHeaders**(`headers`: Array‹any›, `cb`: any): _void_

_Defined in [index.ts:423](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L423)_

Adds many headers to the blockchain.

**Parameters:**

| Name      | Type       | Description                                                                        |
| --------- | ---------- | ---------------------------------------------------------------------------------- |
| `headers` | Array‹any› | The headers to be added to the blockchain                                          |
| `cb`      | any        | The callback. It is given two parameters `err` and the last of the saved `headers` |

**Returns:** _void_

---

### selectNeededHashes

▸ **selectNeededHashes**(`hashes`: Array‹any›, `cb`: any): _void_

_Defined in [index.ts:701](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L701)_

Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.

**Parameters:**

| Name     | Type       | Description                                                      |
| -------- | ---------- | ---------------------------------------------------------------- |
| `hashes` | Array‹any› | Ordered array of hashes                                          |
| `cb`     | any        | The callback. It is given two parameters `err` and hashes found. |

**Returns:** _void_
