[ethereumjs-block](../README.md) › ["header"](../modules/_header_.md) › [BlockHeader](_header_.blockheader.md)

# Class: BlockHeader

An object that represents the block header

## Hierarchy

* **BlockHeader**

## Index

### Constructors

* [constructor](_header_.blockheader.md#constructor)

### Properties

* [bloom](_header_.blockheader.md#bloom)
* [coinbase](_header_.blockheader.md#coinbase)
* [difficulty](_header_.blockheader.md#difficulty)
* [extraData](_header_.blockheader.md#extradata)
* [gasLimit](_header_.blockheader.md#gaslimit)
* [gasUsed](_header_.blockheader.md#gasused)
* [mixHash](_header_.blockheader.md#mixhash)
* [nonce](_header_.blockheader.md#nonce)
* [number](_header_.blockheader.md#number)
* [parentHash](_header_.blockheader.md#parenthash)
* [raw](_header_.blockheader.md#raw)
* [receiptTrie](_header_.blockheader.md#receipttrie)
* [stateRoot](_header_.blockheader.md#stateroot)
* [timestamp](_header_.blockheader.md#timestamp)
* [transactionsTrie](_header_.blockheader.md#transactionstrie)
* [uncleHash](_header_.blockheader.md#unclehash)

### Methods

* [canonicalDifficulty](_header_.blockheader.md#canonicaldifficulty)
* [hash](_header_.blockheader.md#hash)
* [isGenesis](_header_.blockheader.md#isgenesis)
* [serialize](_header_.blockheader.md#serialize)
* [setGenesisParams](_header_.blockheader.md#setgenesisparams)
* [toJSON](_header_.blockheader.md#tojson)
* [validate](_header_.blockheader.md#validate)
* [validateDifficulty](_header_.blockheader.md#validatedifficulty)
* [validateGasLimit](_header_.blockheader.md#validategaslimit)

## Constructors

###  constructor

\+ **new BlockHeader**(`data`: Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [BlockHeaderData](../interfaces/_index_.blockheaderdata.md), `opts`: [ChainOptions](../interfaces/_index_.chainoptions.md)): *[BlockHeader](_header_.blockheader.md)*

*Defined in [header.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L29)*

Creates a new block header.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer &#124; [PrefixedHexString](../modules/_index_.md#prefixedhexstring) &#124; [BufferLike](../modules/_index_.md#bufferlike)[] &#124; [BlockHeaderData](../interfaces/_index_.blockheaderdata.md) | {} | The data of the block header. |
`opts` | [ChainOptions](../interfaces/_index_.chainoptions.md) | {} | The network options for this block, and its header, uncle headers and txs.  |

**Returns:** *[BlockHeader](_header_.blockheader.md)*

## Properties

###  bloom

• **bloom**: *Buffer*

*Defined in [header.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L19)*

___

###  coinbase

• **coinbase**: *Buffer*

*Defined in [header.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L15)*

___

###  difficulty

• **difficulty**: *Buffer*

*Defined in [header.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L20)*

___

###  extraData

• **extraData**: *Buffer*

*Defined in [header.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L25)*

___

###  gasLimit

• **gasLimit**: *Buffer*

*Defined in [header.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L22)*

___

###  gasUsed

• **gasUsed**: *Buffer*

*Defined in [header.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L23)*

___

###  mixHash

• **mixHash**: *Buffer*

*Defined in [header.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L26)*

___

###  nonce

• **nonce**: *Buffer*

*Defined in [header.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L27)*

___

###  number

• **number**: *Buffer*

*Defined in [header.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L21)*

___

###  parentHash

• **parentHash**: *Buffer*

*Defined in [header.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L13)*

___

###  raw

• **raw**: *Buffer[]*

*Defined in [header.ts:12](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L12)*

___

###  receiptTrie

• **receiptTrie**: *Buffer*

*Defined in [header.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L18)*

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [header.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L16)*

___

###  timestamp

• **timestamp**: *Buffer*

*Defined in [header.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L24)*

___

###  transactionsTrie

• **transactionsTrie**: *Buffer*

*Defined in [header.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L17)*

___

###  uncleHash

• **uncleHash**: *Buffer*

*Defined in [header.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L14)*

## Methods

###  canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`: [Block](_block_.block.md)): *BN*

*Defined in [header.ts:134](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L134)*

Returns the canonical difficulty for this block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent `Block` of this header  |

**Returns:** *BN*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [header.ts:303](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L303)*

Returns the hash of the block header.

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [header.ts:310](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L310)*

Checks if the block header is a genesis header.

**Returns:** *boolean*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [header.ts:330](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L330)*

Returns the rlp encoding of the block header

**Returns:** *Buffer*

___

###  setGenesisParams

▸ **setGenesisParams**(): *void*

*Defined in [header.ts:317](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L317)*

Turns the header into the canonical genesis block header.

**Returns:** *void*

___

###  toJSON

▸ **toJSON**(`_labels`: boolean): *object | string[]*

*Defined in [header.ts:340](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L340)*

Returns the block header in JSON format

**`see`** [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`_labels` | boolean | false |

**Returns:** *object | string[]*

___

###  validate

▸ **validate**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md), `height?`: BN): *Promise‹void›*

*Defined in [header.ts:255](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L255)*

Validates the entire block header, throwing if invalid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | the blockchain that this block is validating against |
`height?` | BN | If this is an uncle header, this is the height of the block that is including it  |

**Returns:** *Promise‹void›*

___

###  validateDifficulty

▸ **validateDifficulty**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [header.ts:221](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L221)*

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | this block's parent  |

**Returns:** *boolean*

___

###  validateGasLimit

▸ **validateGasLimit**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [header.ts:231](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L231)*

Validates the gasLimit.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | this block's parent  |

**Returns:** *boolean*
