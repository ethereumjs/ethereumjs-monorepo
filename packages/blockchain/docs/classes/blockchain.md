[ethereumjs-blockchain](../README.md) > [Blockchain](../classes/blockchain.md)

# Class: Blockchain

## Hierarchy

**Blockchain**

## Implements

- [BlockchainInterface](../interfaces/blockchaininterface.md)

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

_Defined in [index.ts:184](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L184)_

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

_Defined in [index.ts:172](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L172)_

---

<a id="dbmanager"></a>

### dbManager

**● dbManager**: _`DBManager`_

_Defined in [index.ts:173](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L173)_

---

<a id="ethash"></a>

### ethash

**● ethash**: _`any`_

_Defined in [index.ts:174](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L174)_

---

<a id="validate"></a>

### validate

**● validate**: _`boolean`_ = true

_Defined in [index.ts:181](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L181)_

---

## Accessors

<a id="meta"></a>

### meta

**meta**:

_Defined in [index.ts:242](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L242)_

---

## Methods

<a id="delblock"></a>

### delBlock

▸ **delBlock**(blockHash: _`Buffer`_, cb: _`any`_): `void`

_Implementation of [BlockchainInterface](../interfaces/blockchaininterface.md).[delBlock](../interfaces/blockchaininterface.md#delblock)_

_Defined in [index.ts:890](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L890)_

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

_Defined in [index.ts:627](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L627)_

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

_Defined in [index.ts:650](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L650)_

**Parameters:**

| Name      | Type                 | Description                                                                       |
| --------- | -------------------- | --------------------------------------------------------------------------------- |
| blockId   | `Buffer` \| `number` | The block's hash or number                                                        |
| maxBlocks | `number`             | Max number of blocks to return                                                    |
| skip      | `number`             | Number of blocks to skip apart                                                    |
| reverse   | `boolean`            | Fetch blocks in reverse                                                           |
| cb        | `any`                | The callback. It is given two parameters \`err\` and the found \`blocks\` if any. |

**Returns:** `void`

---

<a id="getdetails"></a>

### getDetails

▸ **getDetails**(\_: _`string`_, cb: _`any`_): `void`

_Implementation of [BlockchainInterface](../interfaces/blockchaininterface.md).[getDetails](../interfaces/blockchaininterface.md#getdetails)_

_Defined in [index.ts:691](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L691)_

**Parameters:**

| Name | Type     |
| ---- | -------- |
| \_   | `string` |
| cb   | `any`    |

**Returns:** `void`

---

<a id="gethead"></a>

### getHead

▸ **getHead**(name: _`any`_, cb: _`any`_): `void`

_Defined in [index.ts:338](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L338)_

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

_Defined in [index.ts:378](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L378)_

**Parameters:**

| Name | Type  | Description                                                                 |
| ---- | ----- | --------------------------------------------------------------------------- |
| cb   | `any` | The callback. It is given two parameters \`err\` and the returned \`block\` |

**Returns:** `void`

---

<a id="getlatestheader"></a>

### getLatestHeader

▸ **getLatestHeader**(cb: _`any`_): `void`

_Defined in [index.ts:361](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L361)_

**Parameters:**

| Name | Type  | Description                                                                  |
| ---- | ----- | ---------------------------------------------------------------------------- |
| cb   | `any` | The callback. It is given two parameters \`err\` and the returned \`header\` |

**Returns:** `void`

---

<a id="iterator"></a>

### iterator

▸ **iterator**(name: _`string`_, onBlock: _`any`_, cb: _`any`_): `void`

_Implementation of [BlockchainInterface](../interfaces/blockchaininterface.md).[iterator](../interfaces/blockchaininterface.md#iterator)_

_Defined in [index.ts:1024](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L1024)_

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

▸ **putBlock**(block: _`object`_, cb: _`any`_, isGenesis: _`undefined` \| `false` \| `true`_): `void`

_Defined in [index.ts:407](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L407)_

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

_Defined in [index.ts:391](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L391)_

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

_Defined in [index.ts:328](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L328)_

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

_Defined in [index.ts:439](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L439)_

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

_Defined in [index.ts:423](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L423)_

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

_Defined in [index.ts:701](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/blockchain/src/index.ts#L701)_

**Parameters:**

| Name   | Type           | Description                                                        |
| ------ | -------------- | ------------------------------------------------------------------ |
| hashes | `Array`<`any`> | Ordered array of hashes                                            |
| cb     | `any`          | The callback. It is given two parameters \`err\` and hashes found. |

**Returns:** `void`

---
