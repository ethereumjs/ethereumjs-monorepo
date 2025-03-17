[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BlockBuilder

# Class: BlockBuilder

Defined in: [vm/src/buildBlock.ts:55](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L55)

## Constructors

### new BlockBuilder()

> **new BlockBuilder**(`vm`, `opts`): [`BlockBuilder`](BlockBuilder.md)

Defined in: [vm/src/buildBlock.ts:87](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L87)

#### Parameters

##### vm

[`VM`](VM.md)

##### opts

[`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

#### Returns

[`BlockBuilder`](BlockBuilder.md)

## Properties

### blobGasUsed

> **blobGasUsed**: `bigint` = `BIGINT_0`

Defined in: [vm/src/buildBlock.ts:63](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L63)

The cumulative blob gas used by the blobs in a block

***

### gasUsed

> **gasUsed**: `bigint` = `BIGINT_0`

Defined in: [vm/src/buildBlock.ts:59](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L59)

The cumulative gas used by the transactions added to the block.

## Accessors

### minerValue

#### Get Signature

> **get** **minerValue**(): `bigint`

Defined in: [vm/src/buildBlock.ts:83](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L83)

##### Returns

`bigint`

***

### transactionReceipts

#### Get Signature

> **get** **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/buildBlock.ts:79](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L79)

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Defined in: [vm/src/buildBlock.ts:217](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L217)

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

##### tx

`TypedTransaction`

##### \_\_namedParameters

###### allowNoBlobs

`boolean`

###### skipHardForkValidation

`boolean`

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

***

### build()

> **build**(`sealOpts`?): `Promise`\<\{ `block`: `Block`; `requests`: `undefined` \| `CLRequest`\<`CLRequestType`\>[]; \}\>

Defined in: [vm/src/buildBlock.ts:317](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L317)

This method constructs the finalized block, including withdrawals and any CLRequests.
It also:
 - Assigns the reward for miner (PoW)
 - Commits the checkpoint on the StateManager
 - Sets the tip of the VM's blockchain to this block
For PoW, optionally seals the block with params `nonce` and `mixHash`,
which is validated along with the block number and difficulty by ethash.
For PoA, please pass `blockOption.cliqueSigner` into the buildBlock constructor,
as the signer will be awarded the txs amount spent on gas as they are added.

Note: we add CLRequests here because they can be generated at any time during the
lifecycle of a pending block so need to be provided only when the block is finalized.

#### Parameters

##### sealOpts?

[`SealBlockOpts`](../interfaces/SealBlockOpts.md)

#### Returns

`Promise`\<\{ `block`: `Block`; `requests`: `undefined` \| `CLRequest`\<`CLRequestType`\>[]; \}\>

***

### getStatus()

> **getStatus**(): `BlockStatus`

Defined in: [vm/src/buildBlock.ts:139](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L139)

#### Returns

`BlockStatus`

***

### initState()

> **initState**(): `Promise`\<`void`\>

Defined in: [vm/src/buildBlock.ts:401](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L401)

#### Returns

`Promise`\<`void`\>

***

### logsBloom()

> **logsBloom**(): `Uint8Array`

Defined in: [vm/src/buildBlock.ts:156](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L156)

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\>

Defined in: [vm/src/buildBlock.ts:168](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L168)

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [vm/src/buildBlock.ts:295](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L295)

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\>

Defined in: [vm/src/buildBlock.ts:146](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L146)

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>
