[ethereumjs-blockchain](../README.md) > [Blockchain](../classes/blockchain.md)

# Class: Blockchain

This class stores and interacts with blocks.

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

⊕ **new Blockchain**(opts?: _[BlockchainOptions](../interfaces/blockchainoptions.md)_): [Blockchain](blockchain.md)

_Defined in [index.ts:117](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L117)_

Creates new Blockchain object

**Parameters:**

| Name                 | Type                                                    | Default value | Description                                                                                                          |
| -------------------- | ------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Default value` opts | [BlockchainOptions](../interfaces/blockchainoptions.md) | {}            | An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/blockchainoptions.md). |

**Returns:** [Blockchain](blockchain.md)

---

## Properties

<a id="db"></a>

### db

**● db**: _`any`_

_Defined in [index.ts:110](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L110)_

---

<a id="dbmanager"></a>

### dbManager

**● dbManager**: _`DBManager`_

_Defined in [index.ts:111](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L111)_

---

<a id="ethash"></a>

### ethash

**● ethash**: _`any`_

_Defined in [index.ts:112](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L112)_

---

<a id="validate"></a>

### validate

**● validate**: _`boolean`_

_Defined in [index.ts:117](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L117)_

A flag indicating if this Blockchain validates blocks or not.

---

## Accessors

<a id="meta"></a>

### meta

**get meta**(): `object`

_Defined in [index.ts:164](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L164)_

Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.

**Returns:** `object`

---

## Methods

<a id="delblock"></a>

### delBlock

▸ **delBlock**(blockHash: _`Buffer`_, cb: _`any`_): `void`

_Defined in [index.ts:812](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L812)_

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

_Defined in [index.ts:549](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L549)_

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

_Defined in [index.ts:572](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L572)_

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

_Defined in [index.ts:613](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L613)_

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

_Defined in [index.ts:260](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L260)_

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

_Defined in [index.ts:300](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L300)_

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

_Defined in [index.ts:283](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L283)_

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

_Defined in [index.ts:946](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L946)_

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

_Defined in [index.ts:329](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L329)_

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

_Defined in [index.ts:313](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L313)_

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

_Defined in [index.ts:250](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L250)_

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

_Defined in [index.ts:361](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L361)_

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

_Defined in [index.ts:345](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L345)_

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

_Defined in [index.ts:623](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L623)_

Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.

**Parameters:**

| Name   | Type           | Description                                                        |
| ------ | -------------- | ------------------------------------------------------------------ |
| hashes | `Array`<`any`> | Ordered array of hashes                                            |
| cb     | `any`          | The callback. It is given two parameters \`err\` and hashes found. |

**Returns:** `void`

---
