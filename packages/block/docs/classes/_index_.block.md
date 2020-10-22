[@ethereumjs/block](../README.md) › ["index"](../modules/_index_.md) › [Block](_index_.block.md)

# Class: Block

An object that represents the block.

## Hierarchy

* **Block**

## Index

### Constructors

* [constructor](_index_.block.md#constructor)

### Properties

* [_common](_index_.block.md#_common)
* [header](_index_.block.md#header)
* [transactions](_index_.block.md#transactions)
* [txTrie](_index_.block.md#txtrie)
* [uncleHeaders](_index_.block.md#uncleheaders)

### Methods

* [canonicalDifficulty](_index_.block.md#canonicaldifficulty)
* [genTxTrie](_index_.block.md#gentxtrie)
* [hash](_index_.block.md#hash)
* [isGenesis](_index_.block.md#isgenesis)
* [raw](_index_.block.md#raw)
* [serialize](_index_.block.md#serialize)
* [toJSON](_index_.block.md#tojson)
* [validate](_index_.block.md#validate)
* [validateDifficulty](_index_.block.md#validatedifficulty)
* [validateGasLimit](_index_.block.md#validategaslimit)
* [validateTransactions](_index_.block.md#validatetransactions)
* [validateTransactionsTrie](_index_.block.md#validatetransactionstrie)
* [validateUncles](_index_.block.md#validateuncles)
* [validateUnclesHash](_index_.block.md#validateuncleshash)
* [fromBlockData](_index_.block.md#static-fromblockdata)
* [fromRLPSerializedBlock](_index_.block.md#static-fromrlpserializedblock)
* [fromValuesArray](_index_.block.md#static-fromvaluesarray)
* [genesis](_index_.block.md#static-genesis)

## Constructors

###  constructor

\+ **new Block**(`header?`: [BlockHeader](_index_.blockheader.md), `transactions`: Transaction[], `uncleHeaders`: [BlockHeader](_header_.blockheader.md)[], `opts`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_index_.block.md)*

*Defined in [block.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L82)*

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`header?` | [BlockHeader](_index_.blockheader.md) | - |
`transactions` | Transaction[] | [] |
`uncleHeaders` | [BlockHeader](_header_.blockheader.md)[] | [] |
`opts` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[Block](_index_.block.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [block.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L18)*

___

###  header

• **header**: *[BlockHeader](_header_.blockheader.md)*

*Defined in [block.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L14)*

___

###  transactions

• **transactions**: *Transaction[]* = []

*Defined in [block.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L15)*

___

###  txTrie

• **txTrie**: *Trie‹›* = new Trie()

*Defined in [block.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L17)*

___

###  uncleHeaders

• **uncleHeaders**: *[BlockHeader](_header_.blockheader.md)[]* = []

*Defined in [block.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L16)*

## Methods

###  canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`: [Block](_block_.block.md)): *BN*

*Defined in [block.ts:245](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L245)*

Returns the canonical difficulty for this block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent of this `Block`  |

**Returns:** *BN*

___

###  genTxTrie

▸ **genTxTrie**(): *Promise‹void›*

*Defined in [block.ts:137](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L137)*

Generates transaction trie for validation.

**Returns:** *Promise‹void›*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [block.ts:116](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L116)*

Produces a hash the RLP of the block.

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [block.ts:123](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L123)*

Determines if this block is the genesis block.

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *[BlockBuffer](../modules/_index_.md#blockbuffer)*

*Defined in [block.ts:105](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L105)*

 Returns a Buffer Array of the raw Buffers of this block, in order.

**Returns:** *[BlockBuffer](../modules/_index_.md#blockbuffer)*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [block.ts:130](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L130)*

Returns the rlp encoding of the block.

**Returns:** *Buffer*

___

###  toJSON

▸ **toJSON**(): *[JsonBlock](../interfaces/_index_.jsonblock.md)*

*Defined in [block.ts:270](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L270)*

Returns the block in JSON format.

**Returns:** *[JsonBlock](../interfaces/_index_.jsonblock.md)*

___

###  validate

▸ **validate**(`blockchain?`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:188](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L188)*

Validates the block, throwing if invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain?` | [Blockchain](../interfaces/_index_.blockchain.md) | additionally validate against a @ethereumjs/blockchain  |

**Returns:** *Promise‹void›*

___

###  validateDifficulty

▸ **validateDifficulty**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [block.ts:254](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L254)*

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent of this `Block`  |

**Returns:** *boolean*

___

###  validateGasLimit

▸ **validateGasLimit**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [block.ts:263](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L263)*

Validates the gasLimit.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent of this `Block`  |

**Returns:** *boolean*

___

###  validateTransactions

▸ **validateTransactions**(): *boolean*

*Defined in [block.ts:167](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L167)*

Validates the transactions.

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: false): *boolean*

*Defined in [block.ts:168](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: true): *string[]*

*Defined in [block.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string[]*

___

###  validateTransactionsTrie

▸ **validateTransactionsTrie**(): *Promise‹boolean›*

*Defined in [block.ts:150](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L150)*

Validates the transaction trie.

**Returns:** *Promise‹boolean›*

___

###  validateUncles

▸ **validateUncles**(`blockchain?`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:221](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L221)*

Validates the uncles that are in the block, if any. This method throws if they are invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain?` | [Blockchain](../interfaces/_index_.blockchain.md) | additionally validate against a @ethereumjs/blockchain  |

**Returns:** *Promise‹void›*

___

###  validateUnclesHash

▸ **validateUnclesHash**(): *boolean*

*Defined in [block.ts:211](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L211)*

Validates the uncle's hash.

**Returns:** *boolean*

___

### `Static` fromBlockData

▸ **fromBlockData**(`blockData`: [BlockData](../interfaces/_index_.blockdata.md), `opts`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L20)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`blockData` | [BlockData](../interfaces/_index_.blockdata.md) | {} |
`opts` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[Block](_block_.block.md)‹›*

___

### `Static` fromRLPSerializedBlock

▸ **fromRLPSerializedBlock**(`serialized`: Buffer, `opts`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L42)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`serialized` | Buffer | - |
`opts` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[Block](_block_.block.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: [BlockBuffer](../modules/_index_.md#blockbuffer), `opts`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L52)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`values` | [BlockBuffer](../modules/_index_.md#blockbuffer) | - |
`opts` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[Block](_block_.block.md)‹›*

___

### `Static` genesis

▸ **genesis**(`blockData`: [BlockData](../interfaces/_index_.blockdata.md), `opts`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)‹›*

*Defined in [block.ts:79](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L79)*

Alias for Block.fromBlockData() with initWithGenesisHeader set to true.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`blockData` | [BlockData](../interfaces/_index_.blockdata.md) | {} |
`opts` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[Block](_block_.block.md)‹›*
