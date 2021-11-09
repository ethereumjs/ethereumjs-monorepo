[@ethereumjs/block](../README.md) / Block

# Class: Block

An object that represents the block.

## Table of contents

### Constructors

- [constructor](Block.md#constructor)

### Properties

- [\_common](Block.md#_common)
- [header](Block.md#header)
- [transactions](Block.md#transactions)
- [txTrie](Block.md#txtrie)
- [uncleHeaders](Block.md#uncleheaders)

### Methods

- [canonicalDifficulty](Block.md#canonicaldifficulty)
- [errorStr](Block.md#errorstr)
- [genTxTrie](Block.md#gentxtrie)
- [hash](Block.md#hash)
- [isGenesis](Block.md#isgenesis)
- [raw](Block.md#raw)
- [serialize](Block.md#serialize)
- [toJSON](Block.md#tojson)
- [validate](Block.md#validate)
- [validateData](Block.md#validatedata)
- [validateDifficulty](Block.md#validatedifficulty)
- [validateGasLimit](Block.md#validategaslimit)
- [validateTransactions](Block.md#validatetransactions)
- [validateTransactionsTrie](Block.md#validatetransactionstrie)
- [validateUncles](Block.md#validateuncles)
- [validateUnclesHash](Block.md#validateuncleshash)
- [fromBlockData](Block.md#fromblockdata)
- [fromRLPSerializedBlock](Block.md#fromrlpserializedblock)
- [fromValuesArray](Block.md#fromvaluesarray)
- [genesis](Block.md#genesis)

## Constructors

### constructor

• **new Block**(`header?`, `transactions?`, `uncleHeaders?`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `header?` | [`BlockHeader`](BlockHeader.md) | `undefined` |
| `transactions` | `TypedTransaction`[] | `[]` |
| `uncleHeaders` | [`BlockHeader`](BlockHeader.md)[] | `[]` |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | `{}` |

#### Defined in

[block.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L142)

## Properties

### \_common

• `Readonly` **\_common**: `default`

#### Defined in

[block.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L23)

___

### header

• `Readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Defined in

[block.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L19)

___

### transactions

• `Readonly` **transactions**: `TypedTransaction`[] = `[]`

#### Defined in

[block.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L20)

___

### txTrie

• `Readonly` **txTrie**: `Trie`

#### Defined in

[block.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L22)

___

### uncleHeaders

• `Readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

#### Defined in

[block.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L21)

## Methods

### canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlock`): `BN`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`BN`

#### Defined in

[block.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L371)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[block.ts:508](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L508)

___

### genTxTrie

▸ **genTxTrie**(): `Promise`<`void`\>

Generates transaction trie for validation.

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L210)

___

### hash

▸ **hash**(): `Buffer`

Produces a hash the RLP of the block.

#### Returns

`Buffer`

#### Defined in

[block.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L189)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

[block.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L196)

___

### raw

▸ **raw**(): [`BlockBuffer`](../README.md#blockbuffer)

Returns a Buffer Array of the raw Buffers of this block, in order.

#### Returns

[`BlockBuffer`](../README.md#blockbuffer)

#### Defined in

[block.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L176)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the rlp encoding of the block.

#### Returns

`Buffer`

#### Defined in

[block.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L203)

___

### toJSON

▸ **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Defined in

[block.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L397)

___

### validate

▸ **validate**(`blockchain`, `onlyHeader?`): `Promise`<`void`\>

Performs the following consistency checks on the block:

- Value checks on the header fields
- Signature and gasLimit validation for included txs
- Validation of the tx trie
- Consistency checks and header validation of included uncles

Throws if invalid.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `blockchain` | [`Blockchain`](../interfaces/Blockchain.md) | `undefined` | validate against an @ethereumjs/blockchain |
| `onlyHeader` | `boolean` | `false` | if should only validate the header (skips validating txTrie and unclesHash) (default: false) |

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L284)

___

### validateData

▸ **validateData**(`onlyHeader?`): `Promise`<`void`\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `onlyHeader` | `boolean` | `false` | if only passed the header, skip validating txTrie and unclesHash (default: false) |

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L298)

___

### validateDifficulty

▸ **validateDifficulty**(`parentBlock`): `boolean`

Checks that the block's `difficulty` matches the canonical difficulty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`boolean`

#### Defined in

[block.ts:380](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L380)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlock`): `boolean`

Validates if the block gasLimit remains in the
boundaries set by the protocol.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`boolean`

#### Defined in

[block.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L390)

___

### validateTransactions

▸ **validateTransactions**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

#### Defined in

[block.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L243)

▸ **validateTransactions**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Defined in

[block.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L244)

▸ **validateTransactions**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Defined in

[block.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L245)

___

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): `Promise`<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[block.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L224)

___

### validateUncles

▸ **validateUncles**(`blockchain`): `Promise`<`void`\>

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
| `blockchain` | [`Blockchain`](../interfaces/Blockchain.md) | additionally validate against an @ethereumjs/blockchain instance |

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L345)

___

### validateUnclesHash

▸ **validateUnclesHash**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

#### Defined in

[block.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L324)

___

### fromBlockData

▸ `Static` **fromBlockData**(`blockData?`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from a block data dictionary

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockData` | [`BlockData`](../interfaces/BlockData.md) |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L31)

___

### fromRLPSerializedBlock

▸ `Static` **fromRLPSerializedBlock**(`serialized`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L73)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from an array of Buffer values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`BlockBuffer`](../README.md#blockbuffer) |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L89)

___

### genesis

▸ `Static` **genesis**(`blockData?`, `opts?`): [`Block`](Block.md)

Alias for [Block.fromBlockData](Block.md#fromblockdata) with [BlockOptions.initWithGenesisHeader](../interfaces/BlockOptions.md#initwithgenesisheader) set to true.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockData` | [`BlockData`](../interfaces/BlockData.md) |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L133)
