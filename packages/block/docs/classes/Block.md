[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / Block

# Class: Block

Defined in: [block/block.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L56)

Class representing a block in the Ethereum network. The [BlockHeader](BlockHeader.md) has its own
class and can be used independently, for a block it is included in the form of the
[Block.header](#header) property.

A block object can be created with one of the following constructor methods
(separate from the Block class to allow for tree shaking):

- [createBlock](../functions/createBlock.md)
- [createBlockFromBytesArray](../functions/createBlockFromBytesArray.md)
- [createBlockFromRLP](../functions/createBlockFromRLP.md)
- [createBlockFromRPC](../functions/createBlockFromRPC.md)
- [createBlockFromJSONRPCProvider](../functions/createBlockFromJSONRPCProvider.md)
- [createBlockFromExecutionPayload](../functions/createBlockFromExecutionPayload.md)
- [createBlockFromBeaconPayloadJSON](../functions/createBlockFromBeaconPayloadJSON.md)

## Constructors

### Constructor

> **new Block**(`header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `opts?`): `Block`

Defined in: [block/block.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L77)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

##### header?

[`BlockHeader`](BlockHeader.md)

##### transactions?

`TypedTransaction`[] = `[]`

##### uncleHeaders?

[`BlockHeader`](BlockHeader.md)[] = `[]`

##### withdrawals?

`Withdrawal`[]

##### opts?

[`BlockOptions`](../interfaces/BlockOptions.md) = `{}`

#### Returns

`Block`

#### Deprecated

Use the module-level factory functions such as [createBlock](../functions/createBlock.md),
[createBlockFromRLP](../functions/createBlockFromRLP.md), and [createBlockFromBytesArray](../functions/createBlockFromBytesArray.md) to create
a Block object from varying data types and options.

## Properties

### common

> `readonly` **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [block/block.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L61)

***

### header

> `readonly` **header**: [`BlockHeader`](BlockHeader.md)

Defined in: [block/block.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L57)

***

### transactions

> `readonly` **transactions**: `TypedTransaction`[] = `[]`

Defined in: [block/block.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L58)

***

### uncleHeaders

> `readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

Defined in: [block/block.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L59)

***

### withdrawals?

> `readonly` `optional` **withdrawals?**: `Withdrawal`[]

Defined in: [block/block.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L60)

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: [block/block.ts:500](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L500)

Return a compact error string representation of the object

#### Returns

`string`

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [block/block.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L162)

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Defined in: [block/block.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L193)

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

Human-readable error strings; empty when all txs are valid

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [block/block.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L141)

Returns the hash of the block.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Defined in: [block/block.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L148)

Determines if this block is the genesis block.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Defined in: [block/block.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L122)

Returns an array of the raw byte arrays for this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [block/block.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L155)

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Defined in: [block/block.ts:466](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L466)

Maps the block properties to the execution payload structure from the beacon chain,
see https://github.com/ethereum/consensus-specs/blob/dev/specs/bellatrix/beacon-chain.md#ExecutionPayload

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

dict with the execution payload parameters with camel case naming

***

### toJSON()

> **toJSON**(): [`JSONBlock`](../interfaces/JSONBlock.md)

Defined in: [block/block.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L446)

Returns the block in JSON format.

#### Returns

[`JSONBlock`](../interfaces/JSONBlock.md)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Defined in: [block/block.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L243)

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: [block/block.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L174)

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Defined in: [block/block.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L371)

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Defined in: [block/block.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L323)

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

##### parentHeader

[`BlockHeader`](BlockHeader.md)

header of parent block

#### Returns

`void`

***

### validateData()

> **validateData**(`onlyHeader?`, `verifyTxs?`, `validateBlockSize?`): `Promise`\<`void`\>

Defined in: [block/block.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L261)

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid
- Block size limit (EIP-7934)

#### Parameters

##### onlyHeader?

`boolean` = `false`

if only passed the header, skip validating txTrie and unclesHash (default: false)

##### verifyTxs?

`boolean` = `true`

if set to `false`, will not check for transaction validation errors (default: true)

##### validateBlockSize?

`boolean` = `false`

if set to `true`, will check for block size limit (EIP-7934) (default: false)

#### Returns

`Promise`\<`void`\>

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Defined in: [block/block.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L439)

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

##### parentBlock

`Block`

the parent of this `Block`

#### Returns

`void`

***

### validateUncles()

> **validateUncles**(): `void`

Defined in: [block/block.ts:414](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L414)

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Returns

`void`

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: [block/block.ts:384](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/block.ts#L384)

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise
