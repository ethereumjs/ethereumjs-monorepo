[@ethereumjs/block](../README.md) / Block

# Class: Block

An object that represents the block.

## Table of contents

### Constructors

- [constructor](Block.md#constructor)

### Properties

- [common](Block.md#common)
- [header](Block.md#header)
- [transactions](Block.md#transactions)
- [txTrie](Block.md#txtrie)
- [uncleHeaders](Block.md#uncleheaders)
- [withdrawals](Block.md#withdrawals)

### Methods

- [errorStr](Block.md#errorstr)
- [ethashCanonicalDifficulty](Block.md#ethashcanonicaldifficulty)
- [genTxTrie](Block.md#gentxtrie)
- [getTransactionsValidationErrors](Block.md#gettransactionsvalidationerrors)
- [hash](Block.md#hash)
- [isGenesis](Block.md#isgenesis)
- [raw](Block.md#raw)
- [serialize](Block.md#serialize)
- [toJSON](Block.md#tojson)
- [transactionsAreValid](Block.md#transactionsarevalid)
- [transactionsTrieIsValid](Block.md#transactionstrieisvalid)
- [uncleHashIsValid](Block.md#unclehashisvalid)
- [validateBlobTransactions](Block.md#validateblobtransactions)
- [validateData](Block.md#validatedata)
- [validateGasLimit](Block.md#validategaslimit)
- [validateUncles](Block.md#validateuncles)
- [withdrawalsTrieIsValid](Block.md#withdrawalstrieisvalid)
- [fromBeaconPayloadJson](Block.md#frombeaconpayloadjson)
- [fromBlockData](Block.md#fromblockdata)
- [fromExecutionPayload](Block.md#fromexecutionpayload)
- [fromJsonRpcProvider](Block.md#fromjsonrpcprovider)
- [fromRLPSerializedBlock](Block.md#fromrlpserializedblock)
- [fromRPC](Block.md#fromrpc)
- [fromValuesArray](Block.md#fromvaluesarray)
- [genTransactionsTrieRoot](Block.md#gentransactionstrieroot)
- [genWithdrawalsTrieRoot](Block.md#genwithdrawalstrieroot)

## Constructors

### constructor

• **new Block**(`header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `header?` | [`BlockHeader`](BlockHeader.md) | `undefined` |
| `transactions` | `TypedTransaction`[] | `[]` |
| `uncleHeaders` | [`BlockHeader`](BlockHeader.md)[] | `[]` |
| `withdrawals?` | `Withdrawal`[] | `undefined` |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | `{}` |

#### Defined in

[block.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L360)

## Properties

### common

• `Readonly` **common**: `Common`

#### Defined in

[block.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L51)

___

### header

• `Readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Defined in

[block.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L46)

___

### transactions

• `Readonly` **transactions**: `TypedTransaction`[] = `[]`

#### Defined in

[block.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L47)

___

### txTrie

• `Readonly` **txTrie**: `Trie`

#### Defined in

[block.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L50)

___

### uncleHeaders

• `Readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

#### Defined in

[block.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L48)

___

### withdrawals

• `Optional` `Readonly` **withdrawals**: `Withdrawal`[]

#### Defined in

[block.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L49)

## Methods

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[block.ts:698](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L698)

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

[block.ts:664](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L664)

___

### genTxTrie

▸ **genTxTrie**(): `Promise`<`void`\>

Generates transaction trie for validation.

#### Returns

`Promise`<`void`\>

#### Defined in

[block.ts:441](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L441)

___

### getTransactionsValidationErrors

▸ **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Defined in

[block.ts:469](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L469)

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Defined in

[block.ts:420](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L420)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

[block.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L427)

___

### raw

▸ **raw**(): [`BlockBytes`](../README.md#blockbytes)

Returns a Array of the raw Bytes Arays of this block, in order.

#### Returns

[`BlockBytes`](../README.md#blockbytes)

#### Defined in

[block.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L402)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Defined in

[block.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L434)

___

### toJSON

▸ **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Defined in

[block.ts:681](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L681)

___

### transactionsAreValid

▸ **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Defined in

[block.ts:519](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L519)

___

### transactionsTrieIsValid

▸ **transactionsTrieIsValid**(): `Promise`<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Defined in

[block.ts:451](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L451)

___

### uncleHashIsValid

▸ **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Defined in

[block.ts:613](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L613)

___

### validateBlobTransactions

▸ **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentHeader` | [`BlockHeader`](BlockHeader.md) | header of parent block |

#### Returns

`void`

#### Defined in

[block.ts:567](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L567)

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

[block.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L534)

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

[block.ts:674](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L674)

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

[block.ts:640](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L640)

___

### withdrawalsTrieIsValid

▸ **withdrawalsTrieIsValid**(): `Promise`<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Defined in

[block.ts:623](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L623)

___

### fromBeaconPayloadJson

▸ `Static` **fromBeaconPayloadJson**(`payload`, `options?`): `Promise`<[`Block`](Block.md)\>

Method to retrieve a block from a beacon payload json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `BeaconPayloadJson` | json of a beacon beacon fetched from beacon apis |
| `options?` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`Promise`<[`Block`](Block.md)\>

the block constructed block

#### Defined in

[block.ts:348](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L348)

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

[block.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L85)

___

### fromExecutionPayload

▸ `Static` **fromExecutionPayload**(`payload`, `options?`): `Promise`<[`Block`](Block.md)\>

Method to retrieve a block from an execution payload

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`ExecutionPayload`](../README.md#executionpayload) |
| `options?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

`Promise`<[`Block`](Block.md)\>

the block constructed block

#### Defined in

[block.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L288)

___

### fromJsonRpcProvider

▸ `Static` **fromJsonRpcProvider**(`provider`, `blockTag`, `opts`): `Promise`<[`Block`](Block.md)\>

Method to retrieve a block from a JSON-RPC provider and format as a [Block](Block.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `string` \| `EthersProvider` | either a url for a remote provider or an Ethers JsonRpcProvider object |
| `blockTag` | `string` \| `bigint` | block hash or block number to be run |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | [BlockOptions](../interfaces/BlockOptions.md) |

#### Returns

`Promise`<[`Block`](Block.md)\>

the block specified by `blockTag`

#### Defined in

[block.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L228)

___

### fromRLPSerializedBlock

▸ `Static` **fromRLPSerializedBlock**(`serialized`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L134)

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

[block.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L217)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from an array of Bytes values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`BlockBytes`](../README.md#blockbytes) |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`Block`](Block.md)

#### Defined in

[block.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L150)

___

### genTransactionsTrieRoot

▸ `Static` **genTransactionsTrieRoot**(`txs`, `emptyTrie?`): `Promise`<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txs` | `TypedTransaction`[] | array of TypedTransaction to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[block.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L71)

___

### genWithdrawalsTrieRoot

▸ `Static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie?`): `Promise`<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wts` | `Withdrawal`[] | array of Withdrawal to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[block.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block.ts#L58)
