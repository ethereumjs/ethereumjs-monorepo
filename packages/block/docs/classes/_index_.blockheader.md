[@ethereumjs/block](../README.md) › ["index"](../modules/_index_.md) › [BlockHeader](_index_.blockheader.md)

# Class: BlockHeader

An object that represents the block header.

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
* [receiptTrie](_index_.blockheader.md#receipttrie)
* [stateRoot](_index_.blockheader.md#stateroot)
* [timestamp](_index_.blockheader.md#timestamp)
* [transactionsTrie](_index_.blockheader.md#transactionstrie)
* [uncleHash](_index_.blockheader.md#unclehash)

### Methods

* [_validateBufferLengths](_index_.blockheader.md#_validatebufferlengths)
* [canonicalDifficulty](_index_.blockheader.md#canonicaldifficulty)
* [hash](_index_.blockheader.md#hash)
* [isGenesis](_index_.blockheader.md#isgenesis)
* [raw](_index_.blockheader.md#raw)
* [serialize](_index_.blockheader.md#serialize)
* [toJSON](_index_.blockheader.md#tojson)
* [validate](_index_.blockheader.md#validate)
* [validateDifficulty](_index_.blockheader.md#validatedifficulty)
* [validateGasLimit](_index_.blockheader.md#validategaslimit)
* [fromHeaderData](_index_.blockheader.md#static-fromheaderdata)
* [fromRLPSerializedHeader](_index_.blockheader.md#static-fromrlpserializedheader)
* [fromValuesArray](_index_.blockheader.md#static-fromvaluesarray)
* [genesis](_index_.blockheader.md#static-genesis)

## Constructors

###  constructor

\+ **new BlockHeader**(`parentHash`: Buffer, `uncleHash`: Buffer, `coinbase`: Address, `stateRoot`: Buffer, `transactionsTrie`: Buffer, `receiptTrie`: Buffer, `bloom`: Buffer, `difficulty`: BN, `number`: BN, `gasLimit`: BN, `gasUsed`: BN, `timestamp`: BN, `extraData`: Buffer, `mixHash`: Buffer, `nonce`: Buffer, `options`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_index_.blockheader.md)*

*Defined in [header.ts:138](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L138)*

This constructor takes the values, validates them, assigns them and freezes the object.
Use the public static factory methods to assist in creating a Header object from
varying data types.
For a default empty header, use `BlockHeader.fromHeaderData()`.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`parentHash` | Buffer | - |
`uncleHash` | Buffer | - |
`coinbase` | Address | - |
`stateRoot` | Buffer | - |
`transactionsTrie` | Buffer | - |
`receiptTrie` | Buffer | - |
`bloom` | Buffer | - |
`difficulty` | BN | - |
`number` | BN | - |
`gasLimit` | BN | - |
`gasUsed` | BN | - |
`timestamp` | BN | - |
`extraData` | Buffer | - |
`mixHash` | Buffer | - |
`nonce` | Buffer | - |
`options` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[BlockHeader](_index_.blockheader.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [header.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L38)*

___

###  bloom

• **bloom**: *Buffer*

*Defined in [header.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L28)*

___

###  coinbase

• **coinbase**: *Address*

*Defined in [header.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L24)*

___

###  difficulty

• **difficulty**: *BN*

*Defined in [header.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L29)*

___

###  extraData

• **extraData**: *Buffer*

*Defined in [header.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L34)*

___

###  gasLimit

• **gasLimit**: *BN*

*Defined in [header.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L31)*

___

###  gasUsed

• **gasUsed**: *BN*

*Defined in [header.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L32)*

___

###  mixHash

• **mixHash**: *Buffer*

*Defined in [header.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L35)*

___

###  nonce

• **nonce**: *Buffer*

*Defined in [header.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L36)*

___

###  number

• **number**: *BN*

*Defined in [header.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L30)*

___

###  parentHash

• **parentHash**: *Buffer*

*Defined in [header.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L22)*

___

###  receiptTrie

• **receiptTrie**: *Buffer*

*Defined in [header.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L27)*

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [header.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L25)*

___

###  timestamp

• **timestamp**: *BN*

*Defined in [header.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L33)*

___

###  transactionsTrie

• **transactionsTrie**: *Buffer*

*Defined in [header.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L26)*

___

###  uncleHash

• **uncleHash**: *Buffer*

*Defined in [header.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L23)*

## Methods

###  _validateBufferLengths

▸ **_validateBufferLengths**(): *void*

*Defined in [header.ts:242](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L242)*

Validates correct buffer lengths, throws if invalid.

**Returns:** *void*

___

###  canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlockHeader`: [BlockHeader](_header_.blockheader.md)): *BN*

*Defined in [header.ts:271](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L271)*

Returns the canonical difficulty for this block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlockHeader` | [BlockHeader](_header_.blockheader.md) | the header from the parent `Block` of this header  |

**Returns:** *BN*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [header.ts:469](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L469)*

Returns the hash of the block header.

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [header.ts:476](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L476)*

Checks if the block header is a genesis header.

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *[BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer)*

*Defined in [header.ts:446](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L446)*

Returns a Buffer Array of the raw Buffers in this header, in order.

**Returns:** *[BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer)*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [header.ts:483](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L483)*

Returns the rlp encoding of the block header.

**Returns:** *Buffer*

___

###  toJSON

▸ **toJSON**(): *[JsonHeader](../interfaces/_index_.jsonheader.md)*

*Defined in [header.ts:490](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L490)*

Returns the block header in JSON format.

**Returns:** *[JsonHeader](../interfaces/_index_.jsonheader.md)*

___

###  validate

▸ **validate**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md), `height?`: BN): *Promise‹void›*

*Defined in [header.ts:401](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L401)*

Validates the block header, throwing if invalid. It is being validated against the reported `parentHash`.
It verifies the current block against the `parentHash`:
- The `parentHash` is part of the blockchain (it is a valid header)
- Current block number is parent block number + 1
- Current block has a strictly higher timestamp
- Current block has valid difficulty and gas limit
- In case that the header is an uncle header, it should not be too old or young in the chain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | validate against a @ethereumjs/blockchain |
`height?` | BN | If this is an uncle header, this is the height of the block that is including it  |

**Returns:** *Promise‹void›*

___

###  validateDifficulty

▸ **validateDifficulty**(`parentBlockHeader`: [BlockHeader](_header_.blockheader.md)): *boolean*

*Defined in [header.ts:359](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L359)*

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlockHeader` | [BlockHeader](_header_.blockheader.md) | the header from the parent `Block` of this header  |

**Returns:** *boolean*

___

###  validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`: [BlockHeader](_header_.blockheader.md)): *boolean*

*Defined in [header.ts:372](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L372)*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlockHeader` | [BlockHeader](_header_.blockheader.md) | the header from the parent `Block` of this header  |

**Returns:** *boolean*

___

### `Static` fromHeaderData

▸ **fromHeaderData**(`headerData`: [HeaderData](../interfaces/_index_.headerdata.md), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L40)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`headerData` | [HeaderData](../interfaces/_index_.headerdata.md) | {} |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*

___

### `Static` fromRLPSerializedHeader

▸ **fromRLPSerializedHeader**(`serialized`: Buffer, `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:79](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`serialized` | Buffer |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: [BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`values` | [BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer) |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*

___

### `Static` genesis

▸ **genesis**(`headerData`: [HeaderData](../interfaces/_index_.headerdata.md), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:135](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L135)*

Alias for Header.fromHeaderData() with initWithGenesisHeader set to true.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`headerData` | [HeaderData](../interfaces/_index_.headerdata.md) | {} |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*
