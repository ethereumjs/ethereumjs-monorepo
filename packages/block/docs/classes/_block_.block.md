[@ethereumjs/block](../README.md) › ["block"](../modules/_block_.md) › [Block](_block_.block.md)

# Class: Block

An object that represents the block.

## Hierarchy

* **Block**

## Index

### Constructors

* [constructor](_block_.block.md#constructor)

### Properties

* [_common](_block_.block.md#_common)
* [header](_block_.block.md#header)
* [transactions](_block_.block.md#transactions)
* [txTrie](_block_.block.md#txtrie)
* [uncleHeaders](_block_.block.md#uncleheaders)

### Methods

* [canonicalDifficulty](_block_.block.md#canonicaldifficulty)
* [genTxTrie](_block_.block.md#gentxtrie)
* [hash](_block_.block.md#hash)
* [isGenesis](_block_.block.md#isgenesis)
* [raw](_block_.block.md#raw)
* [serialize](_block_.block.md#serialize)
* [toJSON](_block_.block.md#tojson)
* [validate](_block_.block.md#validate)
* [validateData](_block_.block.md#validatedata)
* [validateDifficulty](_block_.block.md#validatedifficulty)
* [validateGasLimit](_block_.block.md#validategaslimit)
* [validateTransactions](_block_.block.md#validatetransactions)
* [validateTransactionsTrie](_block_.block.md#validatetransactionstrie)
* [validateUncles](_block_.block.md#validateuncles)
* [validateUnclesHash](_block_.block.md#validateuncleshash)
* [fromBlockData](_block_.block.md#static-fromblockdata)
* [fromRLPSerializedBlock](_block_.block.md#static-fromrlpserializedblock)
* [fromValuesArray](_block_.block.md#static-fromvaluesarray)
* [genesis](_block_.block.md#static-genesis)

## Constructors

###  constructor

\+ **new Block**(`header?`: [BlockHeader](_header_.blockheader.md), `transactions`: TypedTransaction[], `uncleHeaders`: [BlockHeader](_header_.blockheader.md)[], `opts`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)*

*Defined in [block.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L125)*

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`header?` | [BlockHeader](_header_.blockheader.md) | - |
`transactions` | TypedTransaction[] | [] |
`uncleHeaders` | [BlockHeader](_header_.blockheader.md)[] | [] |
`opts` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[Block](_block_.block.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [block.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L18)*

___

###  header

• **header**: *[BlockHeader](_header_.blockheader.md)*

*Defined in [block.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L14)*

___

###  transactions

• **transactions**: *TypedTransaction[]* = []

*Defined in [block.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L15)*

___

###  txTrie

• **txTrie**: *Trie‹›* = new Trie()

*Defined in [block.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L17)*

___

###  uncleHeaders

• **uncleHeaders**: *[BlockHeader](_header_.blockheader.md)[]* = []

*Defined in [block.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L16)*

## Methods

###  canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`: [Block](_block_.block.md)): *BN*

*Defined in [block.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L327)*

Returns the canonical difficulty for this block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent of this `Block`  |

**Returns:** *BN*

___

###  genTxTrie

▸ **genTxTrie**(): *Promise‹void›*

*Defined in [block.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L188)*

Generates transaction trie for validation.

**Returns:** *Promise‹void›*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [block.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L167)*

Produces a hash the RLP of the block.

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [block.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L174)*

Determines if this block is the genesis block.

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *[BlockBuffer](../modules/_index_.md#blockbuffer)*

*Defined in [block.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L154)*

Returns a Buffer Array of the raw Buffers of this block, in order.

**Returns:** *[BlockBuffer](../modules/_index_.md#blockbuffer)*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [block.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L181)*

Returns the rlp encoding of the block.

**Returns:** *Buffer*

___

###  toJSON

▸ **toJSON**(): *[JsonBlock](../interfaces/_index_.jsonblock.md)*

*Defined in [block.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L353)*

Returns the block in JSON format.

**Returns:** *[JsonBlock](../interfaces/_index_.jsonblock.md)*

___

###  validate

▸ **validate**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L249)*

Performs the following consistency checks on the block:

- Value checks on the header fields
- Signature and gasLimit validation for included txs
- Validation of the tx trie
- Consistency checks and header validation of included uncles

Throws if invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | validate against a @ethereumjs/blockchain  |

**Returns:** *Promise‹void›*

___

###  validateData

▸ **validateData**(): *Promise‹void›*

*Defined in [block.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L262)*

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

**Returns:** *Promise‹void›*

___

###  validateDifficulty

▸ **validateDifficulty**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [block.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L336)*

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent of this `Block`  |

**Returns:** *boolean*

___

###  validateGasLimit

▸ **validateGasLimit**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [block.ts:346](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L346)*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent of this `Block`  |

**Returns:** *boolean*

___

###  validateTransactions

▸ **validateTransactions**(): *boolean*

*Defined in [block.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L221)*

Validates transaction signatures and minimum gas requirements.

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: false): *boolean*

*Defined in [block.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L222)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: true): *string[]*

*Defined in [block.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L223)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string[]*

___

###  validateTransactionsTrie

▸ **validateTransactionsTrie**(): *Promise‹boolean›*

*Defined in [block.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L202)*

Validates the transaction trie by generating a trie
and do a check on the root hash.

**Returns:** *Promise‹boolean›*

___

###  validateUncles

▸ **validateUncles**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L303)*

Consistency checks and header validation for uncles included,
in the block, if any.

Throws if invalid.

The rules of uncles are the following:
Uncle Header is a valid header.
Uncle Header is an orphan, i.e. it is not one of the headers of the canonical chain.
Uncle Header has a parentHash which points to the canonical chain. This parentHash is within the last 7 blocks.
Uncle Header is not already included as uncle in another block.
Header has at most 2 uncles.
Header does not count an uncle twice.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | additionally validate against an @ethereumjs/blockchain instance  |

**Returns:** *Promise‹void›*

___

###  validateUnclesHash

▸ **validateUnclesHash**(): *boolean*

*Defined in [block.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L282)*

Validates the uncle's hash.

**Returns:** *boolean*

___

### `Static` fromBlockData

▸ **fromBlockData**(`blockData`: [BlockData](../interfaces/_index_.blockdata.md), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L26)*

Static constructor to create a block from a block data dictionary

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`blockData` | [BlockData](../interfaces/_index_.blockdata.md) | {} | - |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |   |

**Returns:** *[Block](_block_.block.md)‹›*

___

### `Static` fromRLPSerializedBlock

▸ **fromRLPSerializedBlock**(`serialized`: Buffer, `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L65)*

Static constructor to create a block from a RLP-serialized block

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serialized` | Buffer | - |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) |   |

**Returns:** *[Block](_block_.block.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: [BlockBuffer](../modules/_index_.md#blockbuffer), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L81)*

Static constructor to create a block from an array of Buffer values

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`values` | [BlockBuffer](../modules/_index_.md#blockbuffer) | - |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) |   |

**Returns:** *[Block](_block_.block.md)‹›*

___

### `Static` genesis

▸ **genesis**(`blockData`: [BlockData](../interfaces/_index_.blockdata.md), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L122)*

Alias for Block.fromBlockData() with initWithGenesisHeader set to true.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`blockData` | [BlockData](../interfaces/_index_.blockdata.md) | {} |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |

**Returns:** *[Block](_block_.block.md)‹›*
