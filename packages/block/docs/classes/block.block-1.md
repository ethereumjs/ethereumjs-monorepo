[@ethereumjs/block](../README.md) / [block](../modules/block.md) / Block

# Class: Block

[block](../modules/block.md).Block

An object that represents the block.

## Table of contents

### Constructors

- [constructor](block.block-1.md#constructor)

### Properties

- [\_common](block.block-1.md#_common)
- [header](block.block-1.md#header)
- [transactions](block.block-1.md#transactions)
- [txTrie](block.block-1.md#txtrie)
- [uncleHeaders](block.block-1.md#uncleheaders)

### Methods

- [canonicalDifficulty](block.block-1.md#canonicaldifficulty)
- [genTxTrie](block.block-1.md#gentxtrie)
- [hash](block.block-1.md#hash)
- [isGenesis](block.block-1.md#isgenesis)
- [raw](block.block-1.md#raw)
- [serialize](block.block-1.md#serialize)
- [toJSON](block.block-1.md#tojson)
- [validate](block.block-1.md#validate)
- [validateData](block.block-1.md#validatedata)
- [validateDifficulty](block.block-1.md#validatedifficulty)
- [validateGasLimit](block.block-1.md#validategaslimit)
- [validateTransactions](block.block-1.md#validatetransactions)
- [validateTransactionsTrie](block.block-1.md#validatetransactionstrie)
- [validateUncles](block.block-1.md#validateuncles)
- [validateUnclesHash](block.block-1.md#validateuncleshash)
- [fromBlockData](block.block-1.md#fromblockdata)
- [fromRLPSerializedBlock](block.block-1.md#fromrlpserializedblock)
- [fromValuesArray](block.block-1.md#fromvaluesarray)
- [genesis](block.block-1.md#genesis)

## Constructors

### constructor

\+ **new Block**(`header?`: [*BlockHeader*](header.blockheader.md), `transactions?`: TypedTransaction[], `uncleHeaders?`: [*BlockHeader*](header.blockheader.md)[], `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters:

Name | Type |
:------ | :------ |
`header?` | [*BlockHeader*](header.blockheader.md) |
`transactions` | TypedTransaction[] |
`uncleHeaders` | [*BlockHeader*](header.blockheader.md)[] |
`opts` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L125)

## Properties

### \_common

• `Readonly` **\_common**: *default*

Defined in: [block.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L18)

___

### header

• `Readonly` **header**: [*BlockHeader*](header.blockheader.md)

Defined in: [block.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L14)

___

### transactions

• `Readonly` **transactions**: TypedTransaction[]

Defined in: [block.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L15)

___

### txTrie

• `Readonly` **txTrie**: *Trie*

Defined in: [block.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L17)

___

### uncleHeaders

• `Readonly` **uncleHeaders**: [*BlockHeader*](header.blockheader.md)[]

Defined in: [block.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L16)

## Methods

### canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`: [*Block*](block.block-1.md)): *BN*

Returns the canonical difficulty for this block.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parentBlock` | [*Block*](block.block-1.md) | the parent of this `Block`    |

**Returns:** *BN*

Defined in: [block.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L327)

___

### genTxTrie

▸ **genTxTrie**(): *Promise*<void\>

Generates transaction trie for validation.

**Returns:** *Promise*<void\>

Defined in: [block.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L188)

___

### hash

▸ **hash**(): *Buffer*

Produces a hash the RLP of the block.

**Returns:** *Buffer*

Defined in: [block.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L167)

___

### isGenesis

▸ **isGenesis**(): *boolean*

Determines if this block is the genesis block.

**Returns:** *boolean*

Defined in: [block.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L174)

___

### raw

▸ **raw**(): [*BlockBuffer*](../modules/types.md#blockbuffer)

Returns a Buffer Array of the raw Buffers of this block, in order.

**Returns:** [*BlockBuffer*](../modules/types.md#blockbuffer)

Defined in: [block.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L154)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the rlp encoding of the block.

**Returns:** *Buffer*

Defined in: [block.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L181)

___

### toJSON

▸ **toJSON**(): [*JsonBlock*](../interfaces/types.jsonblock.md)

Returns the block in JSON format.

**Returns:** [*JsonBlock*](../interfaces/types.jsonblock.md)

Defined in: [block.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L353)

___

### validate

▸ **validate**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md)): *Promise*<void\>

Performs the following consistency checks on the block:

- Value checks on the header fields
- Signature and gasLimit validation for included txs
- Validation of the tx trie
- Consistency checks and header validation of included uncles

Throws if invalid.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) | validate against a @ethereumjs/blockchain    |

**Returns:** *Promise*<void\>

Defined in: [block.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L249)

___

### validateData

▸ **validateData**(): *Promise*<void\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

**Returns:** *Promise*<void\>

Defined in: [block.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L262)

___

### validateDifficulty

▸ **validateDifficulty**(`parentBlock`: [*Block*](block.block-1.md)): *boolean*

Checks that the block's `difficulty` matches the canonical difficulty.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parentBlock` | [*Block*](block.block-1.md) | the parent of this `Block`    |

**Returns:** *boolean*

Defined in: [block.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L336)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlock`: [*Block*](block.block-1.md)): *boolean*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parentBlock` | [*Block*](block.block-1.md) | the parent of this `Block`    |

**Returns:** *boolean*

Defined in: [block.ts:346](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L346)

___

### validateTransactions

▸ **validateTransactions**(): *boolean*

Validates transaction signatures and minimum gas requirements.

**Returns:** *boolean*

Defined in: [block.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L221)

▸ **validateTransactions**(`stringError`: *false*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`stringError` | *false* |

**Returns:** *boolean*

Defined in: [block.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L222)

▸ **validateTransactions**(`stringError`: *true*): *string*[]

#### Parameters:

Name | Type |
:------ | :------ |
`stringError` | *true* |

**Returns:** *string*[]

Defined in: [block.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L223)

___

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): *Promise*<boolean\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

**Returns:** *Promise*<boolean\>

Defined in: [block.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L202)

___

### validateUncles

▸ **validateUncles**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md)): *Promise*<void\>

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

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) | additionally validate against an @ethereumjs/blockchain instance    |

**Returns:** *Promise*<void\>

Defined in: [block.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L303)

___

### validateUnclesHash

▸ **validateUnclesHash**(): *boolean*

Validates the uncle's hash.

**Returns:** *boolean*

Defined in: [block.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L282)

___

### fromBlockData

▸ `Static`**fromBlockData**(`blockData?`: [*BlockData*](../interfaces/types.blockdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Static constructor to create a block from a block data dictionary

#### Parameters:

Name | Type |
:------ | :------ |
`blockData` | [*BlockData*](../interfaces/types.blockdata.md) |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L26)

___

### fromRLPSerializedBlock

▸ `Static`**fromRLPSerializedBlock**(`serialized`: *Buffer*, `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters:

Name | Type |
:------ | :------ |
`serialized` | *Buffer* |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L65)

___

### fromValuesArray

▸ `Static`**fromValuesArray**(`values`: [*BlockBuffer*](../modules/types.md#blockbuffer), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Static constructor to create a block from an array of Buffer values

#### Parameters:

Name | Type |
:------ | :------ |
`values` | [*BlockBuffer*](../modules/types.md#blockbuffer) |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L81)

___

### genesis

▸ `Static`**genesis**(`blockData?`: [*BlockData*](../interfaces/types.blockdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Alias for Block.fromBlockData() with initWithGenesisHeader set to true.

#### Parameters:

Name | Type |
:------ | :------ |
`blockData` | [*BlockData*](../interfaces/types.blockdata.md) |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L122)
