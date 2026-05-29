[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: [types.ts:456](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L456)

Result of executing a call via the [EVM](../classes/EVM.md).

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [types.ts:493](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L493)

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:485](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L485)

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError**: [`EVMError`](../classes/EVMError.md)

Defined in: [types.ts:461](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L461)

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [types.ts:469](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L469)

Amount of gas the code used to run

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [types.ts:465](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L465)

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: [types.ts:489](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L489)

The gas refund counter

***

### logs?

> `optional` **logs**: [`Log`](../type-aliases/Log.md)[]

Defined in: [types.ts:477](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L477)

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: [types.ts:473](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L473)

Return value from the contract

***

### runState?

> `optional` **runState**: `RunState`

Defined in: [types.ts:457](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L457)

***

### selfdestruct?

> `optional` **selfdestruct**: [`SelfdestructMap`](../type-aliases/SelfdestructMap.md)

Defined in: [types.ts:481](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L481)

Selfdestructed accounts mapped to their beneficiary
