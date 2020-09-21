[@ethereumjs/block](../README.md) › ["index"](../modules/_index_.md) › [BlockHeader](_index_.blockheader.md)

# Class: BlockHeader

An object that represents the block header

## Hierarchy

* **BlockHeader**

## Index

### Constructors

* [constructor](_index_.blockheader.md#constructor)

### Properties

* [_common](_index_.blockheader.md#_common)
* [bloom](_index_.blockheader.md#bloom)
* [coinbase](_index_.blockheader.md#coinbase)
* [difficulty](_index_.blockheader.md#difficulty)
* [extraData](_index_.blockheader.md#extradata)
* [gasLimit](_index_.blockheader.md#gaslimit)
* [gasUsed](_index_.blockheader.md#gasused)
* [mixHash](_index_.blockheader.md#mixhash)
* [nonce](_index_.blockheader.md#nonce)
* [number](_index_.blockheader.md#number)
* [parentHash](_index_.blockheader.md#parenthash)
* [raw](_index_.blockheader.md#raw)
* [receiptTrie](_index_.blockheader.md#receipttrie)
* [stateRoot](_index_.blockheader.md#stateroot)
* [timestamp](_index_.blockheader.md#timestamp)
* [transactionsTrie](_index_.blockheader.md#transactionstrie)
* [uncleHash](_index_.blockheader.md#unclehash)

### Methods

* [_setGenesisParams](_index_.blockheader.md#_setgenesisparams)
* [canonicalDifficulty](_index_.blockheader.md#canonicaldifficulty)
* [hash](_index_.blockheader.md#hash)
* [isGenesis](_index_.blockheader.md#isgenesis)
* [serialize](_index_.blockheader.md#serialize)
* [toJSON](_index_.blockheader.md#tojson)
* [validate](_index_.blockheader.md#validate)
* [validateDifficulty](_index_.blockheader.md#validatedifficulty)
* [validateGasLimit](_index_.blockheader.md#validategaslimit)

## Constructors

###  constructor

\+ **new BlockHeader**(`data`: Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [BlockHeaderData](../interfaces/_index_.blockheaderdata.md), `options`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_index_.blockheader.md)*

*Defined in [header.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L43)*

Creates a new block header.

Please solely use this constructor to pass in block header data
and don't modfiy header data after initialization since this can lead to
undefined behavior regarding HF rule implemenations within the class.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer &#124; [PrefixedHexString](../modules/_index_.md#prefixedhexstring) &#124; [BufferLike](../modules/_index_.md#bufferlike)[] &#124; [BlockHeaderData](../interfaces/_index_.blockheaderdata.md) | {} | The data of the block header. |
`options` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} | - |

**Returns:** *[BlockHeader](_index_.blockheader.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [header.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L43)*

___

###  bloom

• **bloom**: *Buffer*

*Defined in [header.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L33)*

___

###  coinbase

• **coinbase**: *Buffer*

*Defined in [header.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L29)*

___

###  difficulty

• **difficulty**: *Buffer*

*Defined in [header.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L34)*

___

###  extraData

• **extraData**: *Buffer*

*Defined in [header.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L39)*

___

###  gasLimit

• **gasLimit**: *Buffer*

*Defined in [header.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L36)*

___

###  gasUsed

• **gasUsed**: *Buffer*

*Defined in [header.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L37)*

___

###  mixHash

• **mixHash**: *Buffer*

*Defined in [header.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L40)*

___

###  nonce

• **nonce**: *Buffer*

*Defined in [header.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L41)*

___

###  number

• **number**: *Buffer*

*Defined in [header.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L35)*

___

###  parentHash

• **parentHash**: *Buffer*

*Defined in [header.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L27)*

___

###  raw

• **raw**: *Buffer[]*

*Defined in [header.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L26)*

___

###  receiptTrie

• **receiptTrie**: *Buffer*

*Defined in [header.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L32)*

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [header.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L30)*

___

###  timestamp

• **timestamp**: *Buffer*

*Defined in [header.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L38)*

___

###  transactionsTrie

• **transactionsTrie**: *Buffer*

*Defined in [header.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L31)*

___

###  uncleHash

• **uncleHash**: *Buffer*

*Defined in [header.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L28)*

## Methods

###  _setGenesisParams

▸ **_setGenesisParams**(): *void*

*Defined in [header.ts:374](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L374)*

Turns the header into the canonical genesis block header.

**Returns:** *void*

___

###  canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`: [Block](_block_.block.md)): *BN*

*Defined in [header.ts:171](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L171)*

Returns the canonical difficulty for this block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | the parent `Block` of this header  |

**Returns:** *BN*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [header.ts:360](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L360)*

Returns the hash of the block header.

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [header.ts:367](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L367)*

Checks if the block header is a genesis header.

**Returns:** *boolean*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [header.ts:392](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L392)*

Returns the rlp encoding of the block header

**Returns:** *Buffer*

___

###  toJSON

▸ **toJSON**(`_labels`: boolean): *object | string[]*

*Defined in [header.ts:402](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L402)*

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

*Defined in [header.ts:304](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L304)*

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

*Defined in [header.ts:262](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L262)*

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | this block's parent  |

**Returns:** *boolean*

___

###  validateGasLimit

▸ **validateGasLimit**(`parentBlock`: [Block](_block_.block.md)): *boolean*

*Defined in [header.ts:272](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L272)*

Validates the gasLimit.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlock` | [Block](_block_.block.md) | this block's parent  |

**Returns:** *boolean*
