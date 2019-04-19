[ethereumjs-blockchain](../README.md) > [Blockchain](../classes/blockchain.md)

# Class: Blockchain

This class stores and interacts with blocks.

## Hierarchy

**Blockchain**

## Index

### Constructors

* [constructor](blockchain.md#constructor)

### Properties

* [db](blockchain.md#db)
* [dbManager](blockchain.md#dbmanager)
* [ethash](blockchain.md#ethash)
* [validate](blockchain.md#validate)

### Accessors

* [meta](blockchain.md#meta)

### Methods

* [delBlock](blockchain.md#delblock)
* [getBlock](blockchain.md#getblock)
* [getBlocks](blockchain.md#getblocks)
* [getDetails](blockchain.md#getdetails)
* [getHead](blockchain.md#gethead)
* [getLatestBlock](blockchain.md#getlatestblock)
* [getLatestHeader](blockchain.md#getlatestheader)
* [iterator](blockchain.md#iterator)
* [putBlock](blockchain.md#putblock)
* [putBlocks](blockchain.md#putblocks)
* [putGenesis](blockchain.md#putgenesis)
* [putHeader](blockchain.md#putheader)
* [putHeaders](blockchain.md#putheaders)
* [selectNeededHashes](blockchain.md#selectneededhashes)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Blockchain**(opts?: *[BlockchainOptions](../interfaces/blockchainoptions.md)*): [Blockchain](blockchain.md)

*Defined in [index.ts:117](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L117)*

Creates new Blockchain object

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` opts | [BlockchainOptions](../interfaces/blockchainoptions.md) |  {} |  An object with the options that this constructor takes. See [BlockchainOptions](../interfaces/blockchainoptions.md). |

**Returns:** [Blockchain](blockchain.md)

___

## Properties

<a id="db"></a>

###  db

**● db**: *`any`*

*Defined in [index.ts:110](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L110)*

___
<a id="dbmanager"></a>

###  dbManager

**● dbManager**: *`DBManager`*

*Defined in [index.ts:111](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L111)*

___
<a id="ethash"></a>

###  ethash

**● ethash**: *`any`*

*Defined in [index.ts:112](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L112)*

___
<a id="validate"></a>

###  validate

**● validate**: *`boolean`*

*Defined in [index.ts:117](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L117)*

A flag indicating if this Blockchain validates blocks or not.

___

## Accessors

<a id="meta"></a>

###  meta

**get meta**(): `object`

*Defined in [index.ts:164](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L164)*

Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.

**Returns:** `object`

___

## Methods

<a id="delblock"></a>

###  delBlock

▸ **delBlock**(blockHash: *`Buffer`*, cb: *`any`*): `void`

*Defined in [index.ts:812](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L812)*

Deletes a block from the blockchain. All child blocks in the chain are deleted and any encountered heads are set to the parent block.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockHash | `Buffer` |  The hash of the block to be deleted |
| cb | `any` |  A callback. |

**Returns:** `void`

___
<a id="getblock"></a>

###  getBlock

▸ **getBlock**(blockTag: *`Buffer` \| `number` \| `BN`*, cb: *`any`*): `void`

*Defined in [index.ts:549](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L549)*

Gets a block by its hash.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockTag | `Buffer` \| `number` \| `BN` |  The block's hash or number |
| cb | `any` |  The callback. It is given two parameters \`err\` and the found \`block\` (an instance of [https://github.com/ethereumjs/ethereumjs-block](https://github.com/ethereumjs/ethereumjs-block)) if any. |

**Returns:** `void`

___
<a id="getblocks"></a>

###  getBlocks

▸ **getBlocks**(blockId: *`Buffer` \| `number`*, maxBlocks: *`number`*, skip: *`number`*, reverse: *`boolean`*, cb: *`any`*): `void`

*Defined in [index.ts:572](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L572)*

Looks up many blocks relative to blockId

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockId | `Buffer` \| `number` |  The block's hash or number |
| maxBlocks | `number` |  Max number of blocks to return |
| skip | `number` |  Number of blocks to skip |
| reverse | `boolean` |  Fetch blocks in reverse |
| cb | `any` |  The callback. It is given two parameters \`err\` and the found \`blocks\` if any. |

**Returns:** `void`

___
<a id="getdetails"></a>

###  getDetails

▸ **getDetails**(_: *`string`*, cb: *`any`*): `void`

*Defined in [index.ts:613](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L613)*

This method used to return block details by its hash. It's only here for backwards compatibility.

*__deprecated__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| _ | `string` |
| cb | `any` |

**Returns:** `void`

___
<a id="gethead"></a>

###  getHead

▸ **getHead**(name: *`any`*, cb?: *`any`*): `void`

*Defined in [index.ts:260](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L260)*

Returns the specified iterator head.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `any` |  Optional name of the state root head (default: 'vm') |
| `Optional` cb | `any` |  The callback. It is given two parameters \`err\` and the returned \`block\` |

**Returns:** `void`

___
<a id="getlatestblock"></a>

###  getLatestBlock

▸ **getLatestBlock**(cb: *`any`*): `void`

*Defined in [index.ts:300](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L300)*

Returns the latest full block in the canonical chain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  The callback. It is given two parameters \`err\` and the returned \`block\` |

**Returns:** `void`

___
<a id="getlatestheader"></a>

###  getLatestHeader

▸ **getLatestHeader**(cb: *`any`*): `void`

*Defined in [index.ts:283](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L283)*

Returns the latest header in the canonical chain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  The callback. It is given two parameters \`err\` and the returned \`header\` |

**Returns:** `void`

___
<a id="iterator"></a>

###  iterator

▸ **iterator**(name: *`string`*, onBlock: *`any`*, cb: *`any`*): `void`

*Defined in [index.ts:946](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L946)*

Iterates through blocks starting at the specified iterator head and calls the onBlock function on each block. The current location of an iterator head can be retrieved using the `getHead()` method.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  Name of the state root head |
| onBlock | `any` |  Function called on each block with params (block, reorg, cb) |
| cb | `any` |  A callback function |

**Returns:** `void`

___
<a id="putblock"></a>

###  putBlock

▸ **putBlock**(block: *`object`*, cb: *`any`*, isGenesis?: *`undefined` \| `false` \| `true`*): `void`

*Defined in [index.ts:329](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L329)*

Adds a block to the blockchain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| block | `object` |  The block to be added to the blockchain |
| cb | `any` |  The callback. It is given two parameters \`err\` and the saved \`block\` |
| `Optional` isGenesis | `undefined` \| `false` \| `true` |

**Returns:** `void`

___
<a id="putblocks"></a>

###  putBlocks

▸ **putBlocks**(blocks: *`Array`<`any`>*, cb: *`any`*): `void`

*Defined in [index.ts:313](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L313)*

Adds many blocks to the blockchain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blocks | `Array`<`any`> |  The blocks to be added to the blockchain |
| cb | `any` |  The callback. It is given two parameters \`err\` and the last of the saved \`blocks\` |

**Returns:** `void`

___
<a id="putgenesis"></a>

###  putGenesis

▸ **putGenesis**(genesis: *`any`*, cb: *`any`*): `void`

*Defined in [index.ts:250](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L250)*

Puts the genesis block in the database

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| genesis | `any` |  The genesis block to be added |
| cb | `any` |  The callback. It is given two parameters \`err\` and the saved \`block\` |

**Returns:** `void`

___
<a id="putheader"></a>

###  putHeader

▸ **putHeader**(header: *`object`*, cb: *`any`*): `void`

*Defined in [index.ts:361](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L361)*

Adds a header to the blockchain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| header | `object` |  The header to be added to the blockchain |
| cb | `any` |  The callback. It is given two parameters \`err\` and the saved \`header\` |

**Returns:** `void`

___
<a id="putheaders"></a>

###  putHeaders

▸ **putHeaders**(headers: *`Array`<`any`>*, cb: *`any`*): `void`

*Defined in [index.ts:345](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L345)*

Adds many headers to the blockchain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| headers | `Array`<`any`> |  The headers to be added to the blockchain |
| cb | `any` |  The callback. It is given two parameters \`err\` and the last of the saved \`headers\` |

**Returns:** `void`

___
<a id="selectneededhashes"></a>

###  selectNeededHashes

▸ **selectNeededHashes**(hashes: *`Array`<`any`>*, cb: *`any`*): `void`

*Defined in [index.ts:623](https://github.com/ethereumjs/ethereumjs-blockchain/blob/8190375/src/index.ts#L623)*

Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| hashes | `Array`<`any`> |  Ordered array of hashes |
| cb | `any` |  The callback. It is given two parameters \`err\` and hashes found. |

**Returns:** `void`

___

