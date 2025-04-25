[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BlockBuilder

# Class: BlockBuilder

Defined in: [vm/src/buildBlock.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L56)

## Constructors

### Constructor

> **new BlockBuilder**(`vm`, `opts`): `BlockBuilder`

Defined in: [vm/src/buildBlock.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L88)

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

Defined in: [vm/src/buildBlock.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L64)

The cumulative blob gas used by the blobs in a block

***

### gasUsed

> **gasUsed**: `bigint` = `BIGINT_0`

Defined in: [vm/src/buildBlock.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L60)

The cumulative gas used by the transactions added to the block.

## Accessors

### minerValue

#### Get Signature

> **get** **minerValue**(): `bigint`

Defined in: [vm/src/buildBlock.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L84)

##### Returns

`bigint`

***

### transactionReceipts

#### Get Signature

> **get** **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/buildBlock.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L80)

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Defined in: [vm/src/buildBlock.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L218)

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

##### tx

`TypedTransaction`

##### \_\_namedParameters

###### allowNoBlobs?

`boolean`

###### skipHardForkValidation?

`boolean`

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

***

### build()

> **build**(`sealOpts?`): `Promise`\<\{ `block`: `Block`; `requests`: `undefined` \| `CLRequest`\<`CLRequestType`\>[]; \}\>

Defined in: [vm/src/buildBlock.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L320)

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

Defined in: [vm/src/buildBlock.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L140)

#### Returns

`BlockStatus`

***

### initState()

> **initState**(): `Promise`\<`void`\>

Defined in: [vm/src/buildBlock.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L404)

#### Returns

`Promise`\<`void`\>

***

### logsBloom()

> **logsBloom**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/buildBlock.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L157)

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/buildBlock.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L169)

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [vm/src/buildBlock.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L298)

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/buildBlock.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L147)

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
