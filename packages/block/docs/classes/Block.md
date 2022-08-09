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

- [errorStr](Block.md#errorstr)
- [ethashCanonicalDifficulty](Block.md#ethashcanonicaldifficulty)
- [genTxTrie](Block.md#gentxtrie)
- [hash](Block.md#hash)
- [isGenesis](Block.md#isgenesis)
- [raw](Block.md#raw)
- [serialize](Block.md#serialize)
- [toJSON](Block.md#tojson)
- [validateData](Block.md#validatedata)
- [validateGasLimit](Block.md#validategaslimit)
- [validateTransactions](Block.md#validatetransactions)
- [validateTransactionsTrie](Block.md#validatetransactionstrie)
- [validateUncles](Block.md#validateuncles)
- [validateUnclesHash](Block.md#validateuncleshash)
- [fromBlockData](Block.md#fromblockdata)
- [fromRLPSerializedBlock](Block.md#fromrlpserializedblock)
- [fromValuesArray](Block.md#fromvaluesarray)

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

[block.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L136)

## Properties

### \_common

• `Readonly` **\_common**: `Common`

#### Defined in

[block.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L26)

___

### header

• `Readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Defined in

[block.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L22)

___

### transactions

• `Readonly` **transactions**: `TypedTransaction`[] = `[]`

#### Defined in

[block.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L23)

___

### txTrie

• `Readonly` **txTrie**: `Trie`

#### Defined in

[block.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L25)

___

### uncleHeaders

• `Readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

#### Defined in

[block.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L24)

## Methods

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[block.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L368)

___

### ethashCanonicalDifficulty

▸ **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`bigint`

#### Defined in

[block.ts:340](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L340)

___

### genTxTrie

▸ **genTxTrie**(): `Promise`<`void`\>

Generates transaction trie for validation.

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L205)

___

### hash

▸ **hash**(): `Buffer`

Returns the hash of the block.

#### Returns

`Buffer`

#### Defined in

[block.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L184)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

[block.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L191)

___

### raw

▸ **raw**(): [`BlockBuffer`](../README.md#blockbuffer)

Returns a Buffer Array of the raw Buffers of this block, in order.

#### Returns

[`BlockBuffer`](../README.md#blockbuffer)

#### Defined in

[block.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L171)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the rlp encoding of the block.

#### Returns

`Buffer`

#### Defined in

[block.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L198)

___

### toJSON

▸ **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Defined in

[block.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L357)

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

[block.ts:275](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L275)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`void`

#### Defined in

[block.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L350)

___

### validateTransactions

▸ **validateTransactions**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

#### Defined in

[block.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L238)

▸ **validateTransactions**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Defined in

[block.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L239)

▸ **validateTransactions**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Defined in

[block.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L240)

___

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): `Promise`<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[block.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L219)

___

### validateUncles

▸ **validateUncles**(): `void`

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Returns

`void`

#### Defined in

[block.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L316)

___

### validateUnclesHash

▸ **validateUnclesHash**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

#### Defined in

[block.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L301)

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

[block.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L34)

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

[block.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L75)

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

[block.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L91)
