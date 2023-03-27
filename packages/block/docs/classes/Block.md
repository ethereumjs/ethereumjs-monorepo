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
- [withdrawals](Block.md#withdrawals)

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
- [validateWithdrawalsTrie](Block.md#validatewithdrawalstrie)
- [fromBlockData](Block.md#fromblockdata)
- [fromEthersProvider](Block.md#fromethersprovider)
- [fromRLPSerializedBlock](Block.md#fromrlpserializedblock)
- [fromRPC](Block.md#fromrpc)
- [fromValuesArray](Block.md#fromvaluesarray)
- [genTransactionsTrieRoot](Block.md#gentransactionstrieroot)
- [genWithdrawalsTrieRoot](Block.md#genwithdrawalstrieroot)

## Constructors

### constructor

• **new Block**(`header?`, `transactions?`, `uncleHeaders?`, `opts?`, `withdrawals?`)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `header?` | [`BlockHeader`](BlockHeader.md) | `undefined` |
| `transactions` | `TypedTransaction`[] | `[]` |
| `uncleHeaders` | [`BlockHeader`](BlockHeader.md)[] | `[]` |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | `{}` |
| `withdrawals?` | `Withdrawal`[] | `undefined` |

#### Defined in

[block.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L255)

## Properties

### \_common

• `Readonly` **\_common**: `Common`

#### Defined in

[block.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L40)

___

### header

• `Readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Defined in

[block.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L35)

___

### transactions

• `Readonly` **transactions**: `TypedTransaction`[] = `[]`

#### Defined in

[block.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L36)

___

### txTrie

• `Readonly` **txTrie**: `Trie`

#### Defined in

[block.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L39)

___

### uncleHeaders

• `Readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

#### Defined in

[block.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L37)

___

### withdrawals

• `Optional` `Readonly` **withdrawals**: `Withdrawal`[]

#### Defined in

[block.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L38)

## Methods

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[block.ts:518](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L518)

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

[block.ts:484](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L484)

___

### genTxTrie

▸ **genTxTrie**(): `Promise`<`void`\>

Generates transaction trie for validation.

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L337)

___

### hash

▸ **hash**(): `Buffer`

Returns the hash of the block.

#### Returns

`Buffer`

#### Defined in

[block.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L316)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

[block.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L323)

___

### raw

▸ **raw**(): [`BlockBuffer`](../README.md#blockbuffer)

Returns a Buffer Array of the raw Buffers of this block, in order.

#### Returns

[`BlockBuffer`](../README.md#blockbuffer)

#### Defined in

[block.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L298)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the rlp encoding of the block.

#### Returns

`Buffer`

#### Defined in

[block.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L330)

___

### toJSON

▸ **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Defined in

[block.ts:501](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L501)

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

[block.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L403)

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

[block.ts:494](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L494)

___

### validateTransactions

▸ **validateTransactions**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

#### Defined in

[block.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L365)

▸ **validateTransactions**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Defined in

[block.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L366)

▸ **validateTransactions**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Defined in

[block.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L367)

___

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): `Promise`<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[block.ts:346](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L346)

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

[block.ts:460](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L460)

___

### validateUnclesHash

▸ **validateUnclesHash**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

#### Defined in

[block.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L434)

___

### validateWithdrawalsTrie

▸ **validateWithdrawalsTrie**(): `Promise`<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`<`boolean`\>

#### Defined in

[block.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L443)

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

[block.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L74)

___

### fromEthersProvider

▸ `Static` **fromEthersProvider**(`provider`, `blockTag`, `opts`): `Promise`<[`Block`](Block.md)\>

Method to retrieve a block from the provider and format as a [Block](Block.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `string` \| `JsonRpcProvider` | an Ethers JsonRPCProvider |
| `blockTag` | `string` \| `bigint` | block hash or block number to be run |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | [BlockOptions](../interfaces/BlockOptions.md) |

#### Returns

`Promise`<[`Block`](Block.md)\>

the block specified by `blockTag`

#### Defined in

[block.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L212)

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

[block.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L126)

___

### fromRPC

▸ `Static` **fromRPC**(`blockData`, `uncles?`, `opts?`): [`Block`](Block.md)

Creates a new block object from Ethereum JSON RPC.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockData` | [`JsonRpcBlock`](../interfaces/JsonRpcBlock.md) | - |
| `uncles?` | `any`[] | Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex) |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L201)

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

[block.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L142)

___

### genTransactionsTrieRoot

▸ `Static` **genTransactionsTrieRoot**(`txs`, `emptyTrie?`): `Promise`<`Buffer`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txs` | `TypedTransaction`[] | array of TypedTransaction to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[block.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L60)

___

### genWithdrawalsTrieRoot

▸ `Static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie?`): `Promise`<`Buffer`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wts` | `Withdrawal`[] | array of Withdrawal to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[block.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L47)
