[ethereumjs-blockchain](../README.md) > [Blockchain](../classes/blockchain.md)

# Class: Blockchain

This class stores and interacts with blocks.

_**remarks**_: This class performs write operations. Making a backup of your data before trying this module is recommended. Otherwise, you can end up with a compromised DB state.

_**example**_: The following is an example to iterate through an existing Geth DB (needs `level` to be installed separately).

```javascript
const level = require('level')
const Blockchain = require('ethereumjs-blockchain')
const utils = require('ethereumjs-util')

const gethDbPath = './chaindata' // Add your own path here. It will get modified, see remarks.
const db = level(gethDbPath)

new Blockchain({ db: db }).iterator(
  'i',
  (block, reorg, cb) => {
    const blockNumber = utils.bufferToInt(block.header.number)
    const blockHash = block.hash().toString('hex')
    console.log(`BLOCK ${blockNumber}: ${blockHash}`)
    cb()
  },
  err => console.log(err \|\| 'Done.'),
)
```

## Hierarchy

**Blockchain**

## Index

### Constructors

- [constructor](blockchain.md#constructor)

### Properties

- [db](blockchain.md#db)
- [dbManager](blockchain.md#dbmanager)
- [ethash](blockchain.md#ethash)
- [validate](blockchain.md#validate)

### Accessors

- [meta](blockchain.md#meta)

### Methods

- [delBlock](blockchain.md#delblock)
- [getBlock](blockchain.md#getblock)
- [getBlocks](blockchain.md#getblocks)
- [getDetails](blockchain.md#getdetails)
- [getHead](blockchain.md#gethead)
- [getLatestBlock](blockchain.md#getlatestblock)
- [getLatestHeader](blockchain.md#getlatestheader)
- [iterator](blockchain.md#iterator)
- [putBlock](blockchain.md#putblock)
- [putBlocks](blockchain.md#putblocks)
- [putGenesis](blockchain.md#putgenesis)
- [putHeader](blockchain.md#putheader)
- [putHeaders](blockchain.md#putheaders)
- [selectNeededHashes](blockchain.md#selectneededhashes)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Blockchain**(opts?: _`any`_): [Blockchain](blockchain.md)

_Defined in [index.ts:73](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L73)_

Creates new Blockchain object

This constructor receives an object with different options, all of them are optional:

- `opts.chain` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))** The chain for the block \[default: 'mainnet'\]
- `opts.hardfork` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Hardfork for the block \[default: null, block number-based behavior\]
- `opts.common` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Alternatively pass a Common instance (ethereumjs-common) instead of setting chain/hardfork directly
- `opts.db` - Database to store blocks and metadata. Should be a [levelup](https://github.com/rvagg/node-levelup) instance.
- `opts.validate` - this the flag to validate blocks (e.g. Proof-of-Work), latest HF rules supported: `Constantinople`.

**Deprecation note**:

The old separated DB constructor parameters `opts.blockDB` and `opts.detailsDB` from before the Geth DB-compatible `v3.0.0` release are deprecated and continued usage is discouraged. When provided `opts.blockDB` will be used as `opts.db` and `opts.detailsDB` is ignored. On the storage level the DB formats are not compatible and it is not possible to load an old-format DB state into a post-`v3.0.0` `Blockchain` object.

**Parameters:**

| Name                 | Type  | Default value | Description              |
| -------------------- | ----- | ------------- | ------------------------ |
| `Default value` opts | `any` | {}            | See above documentation. |

**Returns:** [Blockchain](blockchain.md)

---

## Properties

<a id="db"></a>

### db

**● db**: _`any`_

_Defined in [index.ts:66](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L66)_

---

<a id="dbmanager"></a>

### dbManager

**● dbManager**: _`DBManager`_

_Defined in [index.ts:67](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L67)_

---

<a id="ethash"></a>

### ethash

**● ethash**: _`any`_

_Defined in [index.ts:68](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L68)_

---

<a id="validate"></a>

### validate

**● validate**: _`boolean`_

_Defined in [index.ts:73](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L73)_

A flag indicating if this Blockchain validates blocks or not.

---

## Accessors

<a id="meta"></a>

### meta

**get meta**(): `object`

_Defined in [index.ts:136](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L136)_

Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.

**Returns:** `object`

---

## Methods

<a id="delblock"></a>

### delBlock

▸ **delBlock**(blockHash: _`Buffer`_, cb: _`any`_): `void`

_Defined in [index.ts:762](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L762)_

Deletes a block from the blockchain. All child blocks in the chain are deleted and any encountered heads are set to the parent block.

**Parameters:**

| Name      | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| blockHash | `Buffer` | The hash of the block to be deleted |
| cb        | `any`    | A callback.                         |

**Returns:** `void`

---

<a id="getblock"></a>

### getBlock

▸ **getBlock**(blockTag: _`Buffer` \| `number` \| `BN`_, cb: _`any`_): `void`

_Defined in [index.ts:514](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L514)_

Gets a block by its hash.

**Parameters:**

| Name     | Type                         | Description                                                                                                                                                                                        |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blockTag | `Buffer` \| `number` \| `BN` | The block's hash or number                                                                                                                                                                         |
| cb       | `any`                        | The callback. It is given two parameters \`err\` and the found \`block\` (an instance of [https://github.com/ethereumjs/ethereumjs-block](https://github.com/ethereumjs/ethereumjs-block)) if any. |

**Returns:** `void`

---

<a id="getblocks"></a>

### getBlocks

▸ **getBlocks**(blockId: _`Buffer` \| `number`_, maxBlocks: _`number`_, skip: _`number`_, reverse: _`boolean`_, cb: _`any`_): `void`

_Defined in [index.ts:534](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L534)_

Looks up many blocks relative to blockId

**Parameters:**

| Name      | Type                 | Description                                                                       |
| --------- | -------------------- | --------------------------------------------------------------------------------- |
| blockId   | `Buffer` \| `number` | The block's hash or number                                                        |
| maxBlocks | `number`             | Max number of blocks to return                                                    |
| skip      | `number`             | Number of blocks to skip                                                          |
| reverse   | `boolean`            | Fetch blocks in reverse                                                           |
| cb        | `any`                | The callback. It is given two parameters \`err\` and the found \`blocks\` if any. |

**Returns:** `void`

---

<a id="getdetails"></a>

### getDetails

▸ **getDetails**(\_: _`string`_, cb: _`any`_): `void`

_Defined in [index.ts:575](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L575)_

This method used to return block details by its hash. It's only here for backwards compatibility.

_**deprecated**_:

**Parameters:**

| Name | Type     |
| ---- | -------- |
| \_   | `string` |
| cb   | `any`    |

**Returns:** `void`

---

<a id="gethead"></a>

### getHead

▸ **getHead**(name: _`any`_, cb?: _`any`_): `void`

_Defined in [index.ts:228](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L228)_

Returns the specified iterator head.

**Parameters:**

| Name          | Type  | Description                                                                 |
| ------------- | ----- | --------------------------------------------------------------------------- |
| name          | `any` | Optional name of the state root head (default: 'vm')                        |
| `Optional` cb | `any` | The callback. It is given two parameters \`err\` and the returned \`block\` |

**Returns:** `void`

---

<a id="getlatestblock"></a>

### getLatestBlock

▸ **getLatestBlock**(cb: _`any`_): `void`

_Defined in [index.ts:268](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L268)_

Returns the latest full block in the canonical chain.

**Parameters:**

| Name | Type  | Description                                                                 |
| ---- | ----- | --------------------------------------------------------------------------- |
| cb   | `any` | The callback. It is given two parameters \`err\` and the returned \`block\` |

**Returns:** `void`

---

<a id="getlatestheader"></a>

### getLatestHeader

▸ **getLatestHeader**(cb: _`any`_): `void`

_Defined in [index.ts:251](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L251)_

Returns the latest header in the canonical chain.

**Parameters:**

| Name | Type  | Description                                                                  |
| ---- | ----- | ---------------------------------------------------------------------------- |
| cb   | `any` | The callback. It is given two parameters \`err\` and the returned \`header\` |

**Returns:** `void`

---

<a id="iterator"></a>

### iterator

▸ **iterator**(name: _`string`_, onBlock: _`any`_, cb: _`any`_): `void`

_Defined in [index.ts:890](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L890)_

Iterates through blocks starting at the specified iterator head and calls the onBlock function on each block. The current location of an iterator head can be retrieved using the `getHead()` method.

**Parameters:**

| Name    | Type     | Description                                                  |
| ------- | -------- | ------------------------------------------------------------ |
| name    | `string` | Name of the state root head                                  |
| onBlock | `any`    | Function called on each block with params (block, reorg, cb) |
| cb      | `any`    | A callback function                                          |

**Returns:** `void`

---

<a id="putblock"></a>

### putBlock

▸ **putBlock**(block: _`object`_, cb: _`any`_, isGenesis?: _`undefined` \| `false` \| `true`_): `void`

_Defined in [index.ts:297](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L297)_

Adds a block to the blockchain.

**Parameters:**

| Name                 | Type                             | Description                                                              |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| block                | `object`                         | The block to be added to the blockchain                                  |
| cb                   | `any`                            | The callback. It is given two parameters \`err\` and the saved \`block\` |
| `Optional` isGenesis | `undefined` \| `false` \| `true` |

**Returns:** `void`

---

<a id="putblocks"></a>

### putBlocks

▸ **putBlocks**(blocks: _`Array`<`any`>_, cb: _`any`_): `void`

_Defined in [index.ts:281](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L281)_

Adds many blocks to the blockchain.

**Parameters:**

| Name   | Type           | Description                                                                           |
| ------ | -------------- | ------------------------------------------------------------------------------------- |
| blocks | `Array`<`any`> | The blocks to be added to the blockchain                                              |
| cb     | `any`          | The callback. It is given two parameters \`err\` and the last of the saved \`blocks\` |

**Returns:** `void`

---

<a id="putgenesis"></a>

### putGenesis

▸ **putGenesis**(genesis: _`any`_, cb: _`any`_): `void`

_Defined in [index.ts:218](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L218)_

Puts the genesis block in the database

**Parameters:**

| Name    | Type  | Description                                                              |
| ------- | ----- | ------------------------------------------------------------------------ |
| genesis | `any` | The genesis block to be added                                            |
| cb      | `any` | The callback. It is given two parameters \`err\` and the saved \`block\` |

**Returns:** `void`

---

<a id="putheader"></a>

### putHeader

▸ **putHeader**(header: _`object`_, cb: _`any`_): `void`

_Defined in [index.ts:329](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L329)_

Adds a header to the blockchain.

**Parameters:**

| Name   | Type     | Description                                                               |
| ------ | -------- | ------------------------------------------------------------------------- |
| header | `object` | The header to be added to the blockchain                                  |
| cb     | `any`    | The callback. It is given two parameters \`err\` and the saved \`header\` |

**Returns:** `void`

---

<a id="putheaders"></a>

### putHeaders

▸ **putHeaders**(headers: _`Array`<`any`>_, cb: _`any`_): `void`

_Defined in [index.ts:313](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L313)_

Adds many headers to the blockchain.

**Parameters:**

| Name    | Type           | Description                                                                            |
| ------- | -------------- | -------------------------------------------------------------------------------------- |
| headers | `Array`<`any`> | The headers to be added to the blockchain                                              |
| cb      | `any`          | The callback. It is given two parameters \`err\` and the last of the saved \`headers\` |

**Returns:** `void`

---

<a id="selectneededhashes"></a>

### selectNeededHashes

▸ **selectNeededHashes**(hashes: _`Array`<`any`>_, cb: _`any`_): `void`

_Defined in [index.ts:585](https://github.com/ethereumjs/ethereumjs-blockchain/blob/6e88434/src/index.ts#L585)_

Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.

**Parameters:**

| Name   | Type           | Description                                                        |
| ------ | -------------- | ------------------------------------------------------------------ |
| hashes | `Array`<`any`> | Ordered array of hashes                                            |
| cb     | `any`          | The callback. It is given two parameters \`err\` and hashes found. |

**Returns:** `void`

---
