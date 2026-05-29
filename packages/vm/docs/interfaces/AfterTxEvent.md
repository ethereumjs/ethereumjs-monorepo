[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / AfterTxEvent

# Interface: AfterTxEvent

Defined in: [vm/src/types.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L541)

Execution result of a transaction

## Extends

- [`RunTxResult`](RunTxResult.md)

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

Defined in: [vm/src/types.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L523)

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist)

***

### amountSpent

> **amountSpent**: `bigint`

Defined in: [vm/src/types.ts:475](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L475)

The amount of ether used by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [vm/src/types.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L538)

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused)

***

### blockGasSpent

> **blockGasSpent**: `bigint`

Defined in: [vm/src/types.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L495)

The amount of gas accounted for at block level.
Under EIP-7778 (Amsterdam) this excludes tx-level refund subtraction from header `gasUsed`.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blockGasSpent`](RunTxResult.md#blockgasspent)

***

### bloom

> **bloom**: `Bloom`

Defined in: [vm/src/types.ts:470](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L470)

Bloom filter resulted from transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom)

***

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: evm/dist/esm/types.d.ts:367

Address of created account during transaction, if any

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress)

***

### execResult

> **execResult**: `ExecResult`

Defined in: evm/dist/esm/types.d.ts:371

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [vm/src/types.ts:518](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L518)

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund)

***

### minerValue

> **minerValue**: `bigint`

Defined in: [vm/src/types.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L533)

The value that accrues to the miner by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue)

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:528](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L528)

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

Defined in: [vm/src/types.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L480)

The tx receipt

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt)

***

### totalGasSpent

> **totalGasSpent**: `bigint`

Defined in: [vm/src/types.ts:487](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L487)

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent)

***

### transaction

> **transaction**: `TypedTransaction`

Defined in: [vm/src/types.ts:545](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L545)

The transaction which just got finished

***

### txRegularGas?

> `optional` **txRegularGas**: `bigint`

Defined in: [vm/src/types.ts:513](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L513)

EIP-8037 per-tx regular-gas total (`intrinsic_regular_gas + execution_regular_gas_used`,
with the EIP-7623 calldata floor applied via `max(tx_regular_gas, calldata_floor_gas_cost)`
at the block level). Undefined when EIP-8037 is inactive.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`txRegularGas`](RunTxResult.md#txregulargas)

***

### txStateGas?

> `optional` **txStateGas**: `bigint`

Defined in: [vm/src/types.ts:504](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L504)

EIP-8037 per-tx state-gas total (`intrinsic_state_gas + execution_state_gas_used`).
Undefined when EIP-8037 is inactive. Used by `runBlock` to track the block-level
state-gas dimension and compute `gas_used = max(block_regular_gas_used, block_state_gas_used)`.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`txStateGas`](RunTxResult.md#txstategas)
