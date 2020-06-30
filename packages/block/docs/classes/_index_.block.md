[@ethereumjs/block](../README.md) › ["index"](../modules/_index_.md) › [Block](_index_.block.md)

# Class: Block

An object that represents the block

## Hierarchy

* **Block**

## Index

### Constructors

* [constructor](_index_.block.md#constructor)

### Properties

* [header](_index_.block.md#header)
* [transactions](_index_.block.md#transactions)
* [txTrie](_index_.block.md#txtrie)
* [uncleHeaders](_index_.block.md#uncleheaders)

### Accessors

* [raw](_index_.block.md#raw)

### Methods

* [genTxTrie](_index_.block.md#gentxtrie)
* [hash](_index_.block.md#hash)
* [isGenesis](_index_.block.md#isgenesis)
* [serialize](_index_.block.md#serialize)
* [setGenesisParams](_index_.block.md#setgenesisparams)
* [toJSON](_index_.block.md#tojson)
* [validate](_index_.block.md#validate)
* [validateTransactions](_index_.block.md#validatetransactions)
* [validateTransactionsTrie](_index_.block.md#validatetransactionstrie)
* [validateUncles](_index_.block.md#validateuncles)
* [validateUnclesHash](_index_.block.md#validateuncleshash)

## Constructors

###  constructor

\+ **new Block**(`data`: Buffer | [Buffer[], Buffer[], Buffer[]] | [BlockData](../interfaces/_index_.blockdata.md), `chainOptions`: [ChainOptions](../interfaces/_index_.chainoptions.md)): *[Block](_index_.block.md)*

*Defined in [block.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L17)*

Creates a new block object

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer &#124; [Buffer[], Buffer[], Buffer[]] &#124; [BlockData](../interfaces/_index_.blockdata.md) | {} | The block's data. |
`chainOptions` | [ChainOptions](../interfaces/_index_.chainoptions.md) | {} | The network options for this block, and its header, uncle headers and txs.  |

**Returns:** *[Block](_index_.block.md)*

## Properties

###  header

• **header**: *[BlockHeader](_header_.blockheader.md)*

*Defined in [block.ts:12](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L12)*

___

###  transactions

• **transactions**: *Transaction[]* = []

*Defined in [block.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L13)*

___

###  txTrie

• **txTrie**: *Trie‹›* = new Trie()

*Defined in [block.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L15)*

___

###  uncleHeaders

• **uncleHeaders**: *[BlockHeader](_header_.blockheader.md)[]* = []

*Defined in [block.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L14)*

## Accessors

###  raw

• **get raw**(): *[Buffer[], Buffer[], Buffer[]]*

*Defined in [block.ts:84](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L84)*

**Returns:** *[Buffer[], Buffer[], Buffer[]]*

## Methods

###  genTxTrie

▸ **genTxTrie**(): *Promise‹void›*

*Defined in [block.ts:133](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L133)*

Generate transaction trie. The tx trie must be generated before the transaction trie can
be validated with `validateTransactionTrie`

**Returns:** *Promise‹void›*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [block.ts:91](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L91)*

Produces a hash the RLP of the block

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [block.ts:98](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L98)*

Determines if this block is the genesis block

**Returns:** *boolean*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [block.ts:116](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L116)*

Produces a serialization of the block.

**Returns:** *Buffer*

▸ **serialize**(`rlpEncode`: true): *Buffer*

*Defined in [block.ts:117](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`rlpEncode` | true |

**Returns:** *Buffer*

▸ **serialize**(`rlpEncode`: false): *[Buffer[], Buffer[], Buffer[]]*

*Defined in [block.ts:118](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L118)*

**Parameters:**

Name | Type |
------ | ------ |
`rlpEncode` | false |

**Returns:** *[Buffer[], Buffer[], Buffer[]]*

___

###  setGenesisParams

▸ **setGenesisParams**(): *void*

*Defined in [block.ts:105](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L105)*

Turns the block into the canonical genesis block

**Returns:** *void*

___

###  toJSON

▸ **toJSON**(`labeled`: boolean): *any*

*Defined in [block.ts:242](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L242)*

Returns the block in JSON format

**`see`** [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`labeled` | boolean | false |

**Returns:** *any*

___

###  validate

▸ **validate**(`blockChain`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:182](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L182)*

Validates the entire block, throwing if invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockChain` | [Blockchain](../interfaces/_index_.blockchain.md) | the blockchain that this block wants to be part of  |

**Returns:** *Promise‹void›*

___

###  validateTransactions

▸ **validateTransactions**(): *boolean*

*Defined in [block.ts:157](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L157)*

Validates the transactions

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: false): *boolean*

*Defined in [block.ts:158](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: true): *string*

*Defined in [block.ts:159](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L159)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string*

___

###  validateTransactionsTrie

▸ **validateTransactionsTrie**(): *boolean*

*Defined in [block.ts:143](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L143)*

Validates the transaction trie

**Returns:** *boolean*

___

###  validateUncles

▸ **validateUncles**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:217](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L217)*

Validates the uncles that are in the block, if any. This method throws if they are invalid.

**Parameters:**

Name | Type |
------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) |

**Returns:** *Promise‹void›*

___

###  validateUnclesHash

▸ **validateUnclesHash**(): *boolean*

*Defined in [block.ts:206](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L206)*

Validates the uncle's hash

**Returns:** *boolean*
