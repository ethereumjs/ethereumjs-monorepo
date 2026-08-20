[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / AfterTxEvent

# Interface: AfterTxEvent

Defined in: [vm/src/types.ts:549](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L549)

Emitted by [VM](../classes/VM.md) after a transaction finishes processing via [runTx](../functions/runTx.md).

## Extends

- [`RunTxResult`](RunTxResult.md)

## Properties

### accessList?

> `optional` **accessList?**: `AccessList`

Defined in: [vm/src/types.ts:530](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L530)

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist)

***

### amountSpent

> **amountSpent**: `bigint`

Defined in: [vm/src/types.ts:482](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L482)

The amount of ether used by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent)

***

### blobGasUsed?

> `optional` **blobGasUsed?**: `bigint`

Defined in: [vm/src/types.ts:545](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L545)

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused)

***

### blockGasSpent

> **blockGasSpent**: `bigint`

Defined in: [vm/src/types.ts:502](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L502)

The amount of gas accounted for at block level.
Under EIP-7778 (Amsterdam) this excludes tx-level refund subtraction from header `gasUsed`.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blockGasSpent`](RunTxResult.md#blockgasspent)

***

### bloom

> **bloom**: `Bloom`

Defined in: [vm/src/types.ts:477](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L477)

Bloom filter resulted from transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom)

***

### createdAddress?

> `optional` **createdAddress?**: `Address`

Defined in: [evm/src/types.ts:484](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L484)

Address of created account during transaction, if any

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress)

***

### execResult

> **execResult**: `ExecResult`

Defined in: [evm/src/types.ts:488](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L488)

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [vm/src/types.ts:525](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L525)

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund)

***

### minerValue

> **minerValue**: `bigint`

Defined in: [vm/src/types.ts:540](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L540)

The value that accrues to the miner by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue)

***

### preimages?

> `optional` **preimages?**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:535](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L535)

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

Defined in: [vm/src/types.ts:487](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L487)

The tx receipt

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt)

***

### totalGasSpent

> **totalGasSpent**: `bigint`

Defined in: [vm/src/types.ts:494](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L494)

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent)

***

### transaction

> **transaction**: `TypedTransaction`

Defined in: [vm/src/types.ts:551](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L551)

The transaction which just finished processing

***

### txRegularGas?

> `optional` **txRegularGas?**: `bigint`

Defined in: [vm/src/types.ts:520](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L520)

EIP-8037 per-tx regular-gas total (`intrinsic_regular_gas + execution_regular_gas_used`,
with the EIP-7623 calldata floor applied via `max(tx_regular_gas, calldata_floor_gas_cost)`
at the block level). Undefined when EIP-8037 is inactive.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`txRegularGas`](RunTxResult.md#txregulargas)

***

### txStateGas?

> `optional` **txStateGas?**: `bigint`

Defined in: [vm/src/types.ts:511](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L511)

EIP-8037 per-tx state-gas total (`intrinsic_state_gas + execution_state_gas_used`).
Undefined when EIP-8037 is inactive. Used by `runBlock` to track the block-level
state-gas dimension and compute `gas_used = max(block_regular_gas_used, block_state_gas_used)`.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`txStateGas`](RunTxResult.md#txstategas)
