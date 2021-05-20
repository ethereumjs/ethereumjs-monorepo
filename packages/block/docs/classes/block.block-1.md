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

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `header?` | [*BlockHeader*](header.blockheader.md) | - |
| `transactions` | TypedTransaction[] | [] |
| `uncleHeaders` | [*BlockHeader*](header.blockheader.md)[] | [] |
| `opts` | [*BlockOptions*](../interfaces/types.blockoptions.md) | {} |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L131)

## Properties

### \_common

• `Readonly` **\_common**: *default*

Defined in: [block.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L24)

___

### header

• `Readonly` **header**: [*BlockHeader*](header.blockheader.md)

Defined in: [block.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L20)

___

### transactions

• `Readonly` **transactions**: TypedTransaction[]= []

Defined in: [block.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L21)

___

### txTrie

• `Readonly` **txTrie**: *Trie*

Defined in: [block.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L23)

___

### uncleHeaders

• `Readonly` **uncleHeaders**: [*BlockHeader*](header.blockheader.md)[]= []

Defined in: [block.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L22)

## Methods

### canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`: [*Block*](block.block-1.md)): *BN*

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [*Block*](block.block-1.md) | the parent of this `Block` |

**Returns:** *BN*

Defined in: [block.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L345)

___

### genTxTrie

▸ **genTxTrie**(): *Promise*<void\>

Generates transaction trie for validation.

**Returns:** *Promise*<void\>

Defined in: [block.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L194)

___

### hash

▸ **hash**(): *Buffer*

Produces a hash the RLP of the block.

**Returns:** *Buffer*

Defined in: [block.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L173)

___

### isGenesis

▸ **isGenesis**(): *boolean*

Determines if this block is the genesis block.

**Returns:** *boolean*

Defined in: [block.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L180)

___

### raw

▸ **raw**(): [*BlockBuffer*](../modules/types.md#blockbuffer)

Returns a Buffer Array of the raw Buffers of this block, in order.

**Returns:** [*BlockBuffer*](../modules/types.md#blockbuffer)

Defined in: [block.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L160)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the rlp encoding of the block.

**Returns:** *Buffer*

Defined in: [block.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L187)

___

### toJSON

▸ **toJSON**(): [*JsonBlock*](../interfaces/types.jsonblock.md)

Returns the block in JSON format.

**Returns:** [*JsonBlock*](../interfaces/types.jsonblock.md)

Defined in: [block.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L371)

___

### validate

▸ **validate**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md)): *Promise*<void\>

Performs the following consistency checks on the block:

- Value checks on the header fields
- Signature and gasLimit validation for included txs
- Validation of the tx trie
- Consistency checks and header validation of included uncles

Throws if invalid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) | validate against a @ethereumjs/blockchain |

**Returns:** *Promise*<void\>

Defined in: [block.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L267)

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

Defined in: [block.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L280)

___

### validateDifficulty

▸ **validateDifficulty**(`parentBlock`: [*Block*](block.block-1.md)): *boolean*

Checks that the block's `difficulty` matches the canonical difficulty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [*Block*](block.block-1.md) | the parent of this `Block` |

**Returns:** *boolean*

Defined in: [block.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L354)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlock`: [*Block*](block.block-1.md)): *boolean*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [*Block*](block.block-1.md) | the parent of this `Block` |

**Returns:** *boolean*

Defined in: [block.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L364)

___

### validateTransactions

▸ **validateTransactions**(): *boolean*

Validates transaction signatures and minimum gas requirements.

**Returns:** *boolean*

Defined in: [block.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L227)

▸ **validateTransactions**(`stringError`: ``false``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

**Returns:** *boolean*

Defined in: [block.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L228)

▸ **validateTransactions**(`stringError`: ``true``): *string*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

**Returns:** *string*[]

Defined in: [block.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L229)

___

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): *Promise*<boolean\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

**Returns:** *Promise*<boolean\>

Defined in: [block.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L208)

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) | additionally validate against an @ethereumjs/blockchain instance |

**Returns:** *Promise*<void\>

Defined in: [block.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L321)

___

### validateUnclesHash

▸ **validateUnclesHash**(): *boolean*

Validates the uncle's hash.

**Returns:** *boolean*

Defined in: [block.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L300)

___

### fromBlockData

▸ `Static` **fromBlockData**(`blockData?`: [*BlockData*](../interfaces/types.blockdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Static constructor to create a block from a block data dictionary

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `blockData` | [*BlockData*](../interfaces/types.blockdata.md) | {} |
| `opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) | - |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L32)

___

### fromRLPSerializedBlock

▸ `Static` **fromRLPSerializedBlock**(`serialized`: *Buffer*, `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | *Buffer* |
| `opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L71)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`: [*BlockBuffer*](../modules/types.md#blockbuffer), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Static constructor to create a block from an array of Buffer values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [*BlockBuffer*](../modules/types.md#blockbuffer) |
| `opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L87)

___

### genesis

▸ `Static` **genesis**(`blockData?`: [*BlockData*](../interfaces/types.blockdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](block.block-1.md)

Alias for Block.fromBlockData() with initWithGenesisHeader set to true.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `blockData` | [*BlockData*](../interfaces/types.blockdata.md) | {} |
| `opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) | - |

**Returns:** [*Block*](block.block-1.md)

Defined in: [block.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L128)
