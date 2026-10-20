[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: [types.ts:492](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L492)

Result of executing a call via the [EVM](../classes/EVM.md).

## Properties

### blobGasUsed?

> `optional` **blobGasUsed?**: `bigint`

Defined in: [types.ts:531](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L531)

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L523)

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError?**: [`EVMError`](../classes/EVMError.md)

Defined in: [types.ts:497](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L497)

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [types.ts:505](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L505)

Amount of gas the code used to run

***

### gas?

> `optional` **gas?**: `bigint`

Defined in: [types.ts:501](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L501)

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

Defined in: [types.ts:527](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L527)

The gas refund counter

***

### logs?

> `optional` **logs?**: [`Log`](../type-aliases/Log.md)[]

Defined in: [types.ts:515](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L515)

Logs emitted during execution (`LOG0`–`LOG4`, and fork-specific synthetic logs such as
[EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) on `runCall`). Cleared when execution
reverts. See the package README section on event logs.

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: [types.ts:509](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L509)

Return value from the contract

***

### runState?

> `optional` **runState?**: `RunState`

Defined in: [types.ts:493](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L493)

***

### selfdestruct?

> `optional` **selfdestruct?**: [`SelfdestructMap`](../type-aliases/SelfdestructMap.md)

Defined in: [types.ts:519](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L519)

Selfdestructed accounts mapped to their beneficiary

***

### stateGasSpilled?

> `optional` **stateGasSpilled?**: `bigint`

Defined in: [types.ts:539](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L539)

EIP-8037: state gas paid from the frame's regular gas (spilled),
including spill merged from successful child frames. Propagated to the
parent frame's spill tracker on success; zeroed on frame failure.

#### Remarks

Experimental (Amsterdam): may change on patch releases.
