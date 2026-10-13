[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BlockBuilder

# Class: BlockBuilder

Defined in: [vm/src/buildBlock.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L77)

Incrementally assembles a block by executing transactions against a [VM](VM.md).

Created via [buildBlock](../functions/buildBlock.md); seals the header and transactions trie when finalized.

## Constructors

### Constructor

> **new BlockBuilder**(`vm`, `opts`): `BlockBuilder`

Defined in: [vm/src/buildBlock.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L118)

#### Parameters

##### vm

[`VM`](VM.md)

##### opts

[`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

#### Returns

`BlockBuilder`

## Properties

### blobGasUsed

> **blobGasUsed**: `bigint` = `BIGINT_0`

Defined in: [vm/src/buildBlock.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L94)

The cumulative blob gas used by the blobs in a block

***

### gasUsed

> **gasUsed**: `bigint` = `BIGINT_0`

Defined in: [vm/src/buildBlock.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L82)

Cumulative gas used by transactions added to the block (header `gasUsed`).
Under EIP-8037 this is `max(regular, state)` of the two dimensions.

## Accessors

### minerValue

#### Get Signature

> **get** **minerValue**(): `bigint`

Defined in: [vm/src/buildBlock.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L114)

##### Returns

`bigint`

***

### transactionReceipts

#### Get Signature

> **get** **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/buildBlock.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L110)

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters?`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Defined in: [vm/src/buildBlock.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L257)

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block (EIP-8037: per-dimension remaining).

#### Parameters

##### tx

`TypedTransaction`

##### \_\_namedParameters?

###### allowNoBlobs?

`boolean`

###### skipHardForkValidation?

`boolean`

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

***

### build()

> **build**(`sealOpts?`): `Promise`\<\{ `block`: [`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md); `blockLevelAccessList`: `BlockLevelAccessList` \| `undefined`; `requests`: `CLRequest`\<`CLRequestType`\>[] \| `undefined`; \}\>

Defined in: [vm/src/buildBlock.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L396)

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

`Promise`\<\{ `block`: [`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md); `blockLevelAccessList`: `BlockLevelAccessList` \| `undefined`; `requests`: `CLRequest`\<`CLRequestType`\>[] \| `undefined`; \}\>

***

### getStatus()

> **getStatus**(): `BlockStatus`

Defined in: [vm/src/buildBlock.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L179)

#### Returns

`BlockStatus`

***

### initState()

> **initState**(): `Promise`\<`void`\>

Defined in: [vm/src/buildBlock.ts:496](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L496)

#### Returns

`Promise`\<`void`\>

***

### logsBloom()

> **logsBloom**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/buildBlock.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L196)

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/buildBlock.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L208)

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [vm/src/buildBlock.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L374)

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/buildBlock.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L186)

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
