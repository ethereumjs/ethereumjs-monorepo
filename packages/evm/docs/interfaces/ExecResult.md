[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: [types.ts:494](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L494)

Result of executing a call via the [EVM](../classes/EVM.md).

## Properties

### blobGasUsed?

> `optional` **blobGasUsed?**: `bigint`

Defined in: [types.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L533)

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:525](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L525)

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError?**: [`EVMError`](../classes/EVMError.md)

Defined in: [types.ts:499](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L499)

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [types.ts:507](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L507)

Amount of gas the code used to run

***

### gas?

> `optional` **gas?**: `bigint`

Defined in: [types.ts:503](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L503)

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

Defined in: [types.ts:529](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L529)

The gas refund counter

***

### logs?

> `optional` **logs?**: [`Log`](../type-aliases/Log.md)[]

Defined in: [types.ts:517](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L517)

Logs emitted during execution (`LOG0`–`LOG4`, and fork-specific synthetic logs such as
[EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) on `runCall`). Cleared when execution
reverts. See the package README section on event logs.

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: [types.ts:511](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L511)

Return value from the contract

***

### runState?

> `optional` **runState?**: `RunState`

Defined in: [types.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L495)

***

### selfdestruct?

> `optional` **selfdestruct?**: [`SelfdestructMap`](../type-aliases/SelfdestructMap.md)

Defined in: [types.ts:521](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L521)

Selfdestructed accounts mapped to their beneficiary

***

### stateGasSpilled?

> `optional` **stateGasSpilled?**: `bigint`

Defined in: [types.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L541)

EIP-8037: state gas paid from the frame's regular gas (spilled),
including spill merged from successful child frames. Propagated to the
parent frame's spill tracker on success; zeroed on frame failure.

#### Remarks

Experimental (Amsterdam): may change on patch releases.
