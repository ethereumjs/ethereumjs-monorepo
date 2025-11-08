[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: [types.ts:399](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L399)

Result of executing a call via the [EVM](../classes/EVM.md).

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [types.ts:436](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L436)

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:428](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L428)

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError**: [`EVMError`](../classes/EVMError.md)

Defined in: [types.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L404)

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [types.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L412)

Amount of gas the code used to run

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [types.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L408)

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: [types.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L432)

The gas refund counter

***

### logs?

> `optional` **logs**: [`Log`](../type-aliases/Log.md)[]

Defined in: [types.ts:420](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L420)

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: [types.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L416)

Return value from the contract

***

### runState?

> `optional` **runState**: `RunState`

Defined in: [types.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L400)

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L424)

A set of accounts to selfdestruct
