[@ethereumjs/block](../README.md) › ["block"](../modules/_block_.md) › [Block](_block_.block.md)

# Class: Block

An object that represents the block

## Hierarchy

* **Block**

## Index

### Constructors

* [constructor](_block_.block.md#constructor)

### Properties

* [header](_block_.block.md#header)
* [transactions](_block_.block.md#transactions)
* [txTrie](_block_.block.md#txtrie)
* [uncleHeaders](_block_.block.md#uncleheaders)

### Accessors

* [raw](_block_.block.md#raw)

### Methods

* [genTxTrie](_block_.block.md#gentxtrie)
* [hash](_block_.block.md#hash)
* [isGenesis](_block_.block.md#isgenesis)
* [serialize](_block_.block.md#serialize)
* [toJSON](_block_.block.md#tojson)
* [validate](_block_.block.md#validate)
* [validateTransactions](_block_.block.md#validatetransactions)
* [validateTransactionsTrie](_block_.block.md#validatetransactionstrie)
* [validateUncles](_block_.block.md#validateuncles)
* [validateUnclesHash](_block_.block.md#validateuncleshash)

## Constructors

###  constructor

\+ **new Block**(`data`: Buffer | [Buffer[], Buffer[], Buffer[]] | [BlockData](../interfaces/_index_.blockdata.md), `options`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](_block_.block.md)*

*Defined in [block.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L24)*

Creates a new block object

Please solely use this constructor to pass in block header data
and don't modfiy header data after initialization since this can lead to
undefined behavior regarding HF rule implemenations within the class.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer &#124; [Buffer[], Buffer[], Buffer[]] &#124; [BlockData](../interfaces/_index_.blockdata.md) | {} | The block's data. |
`options` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} | The options for this block (like the chain setup)  |

**Returns:** *[Block](_block_.block.md)*

## Properties

###  header

• **header**: *[BlockHeader](_header_.blockheader.md)*

*Defined in [block.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L19)*

___

###  transactions

• **transactions**: *Transaction[]* = []

*Defined in [block.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L20)*

___

###  txTrie

• **txTrie**: *Trie‹›* = new Trie()

*Defined in [block.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L22)*

___

###  uncleHeaders

• **uncleHeaders**: *[BlockHeader](_header_.blockheader.md)[]* = []

*Defined in [block.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L21)*

## Accessors

###  raw

• **get raw**(): *[Buffer[], Buffer[], Buffer[]]*

*Defined in [block.ts:79](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L79)*

**Returns:** *[Buffer[], Buffer[], Buffer[]]*

## Methods

###  genTxTrie

▸ **genTxTrie**(): *Promise‹void›*

*Defined in [block.ts:121](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L121)*

Generate transaction trie. The tx trie must be generated before the transaction trie can
be validated with `validateTransactionTrie`

**Returns:** *Promise‹void›*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [block.ts:86](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L86)*

Produces a hash the RLP of the block

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [block.ts:93](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L93)*

Determines if this block is the genesis block

**Returns:** *boolean*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [block.ts:104](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L104)*

Produces a serialization of the block.

**Returns:** *Buffer*

▸ **serialize**(`rlpEncode`: true): *Buffer*

*Defined in [block.ts:105](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`rlpEncode` | true |

**Returns:** *Buffer*

▸ **serialize**(`rlpEncode`: false): *[Buffer[], Buffer[], Buffer[]]*

*Defined in [block.ts:106](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`rlpEncode` | false |

**Returns:** *[Buffer[], Buffer[], Buffer[]]*

___

###  toJSON

▸ **toJSON**(`labeled`: boolean): *any*

*Defined in [block.ts:233](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L233)*

Returns the block in JSON format

**`see`** [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`labeled` | boolean | false |

**Returns:** *any*

___

###  validate

▸ **validate**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L169)*

Validates the entire block, throwing if invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | the blockchain that this block wants to be part of  |

**Returns:** *Promise‹void›*

___

###  validateTransactions

▸ **validateTransactions**(): *boolean*

*Defined in [block.ts:144](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L144)*

Validates the transactions

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: false): *boolean*

*Defined in [block.ts:145](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validateTransactions**(`stringError`: true): *string*

*Defined in [block.ts:146](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L146)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string*

___

###  validateTransactionsTrie

▸ **validateTransactionsTrie**(): *boolean*

*Defined in [block.ts:131](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L131)*

Validates the transaction trie

**Returns:** *boolean*

___

###  validateUncles

▸ **validateUncles**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): *Promise‹void›*

*Defined in [block.ts:204](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L204)*

Validates the uncles that are in the block, if any. This method throws if they are invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | the blockchain that this block wants to be part of  |

**Returns:** *Promise‹void›*

___

###  validateUnclesHash

▸ **validateUnclesHash**(): *boolean*

*Defined in [block.ts:193](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L193)*

Validates the uncle's hash

**Returns:** *boolean*
