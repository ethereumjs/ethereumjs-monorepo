[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: [types.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L402)

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [types.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L439)

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:431](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L431)

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError**: [`EVMError`](../classes/EVMError.md)

Defined in: [types.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L407)

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [types.ts:415](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L415)

Amount of gas the code used to run

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [types.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L411)

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: [types.ts:435](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L435)

The gas refund counter

***

### logs?

> `optional` **logs**: [`Log`](../type-aliases/Log.md)[]

Defined in: [types.ts:423](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L423)

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: [types.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L419)

Return value from the contract

***

### runState?

> `optional` **runState**: `RunState`

Defined in: [types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L403)

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L427)

A set of accounts to selfdestruct
