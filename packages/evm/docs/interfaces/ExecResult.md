[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Table of contents

### Properties

- [blobGasUsed](ExecResult.md#blobgasused)
- [createdAddresses](ExecResult.md#createdaddresses)
- [exceptionError](ExecResult.md#exceptionerror)
- [executionGasUsed](ExecResult.md#executiongasused)
- [gas](ExecResult.md#gas)
- [gasRefund](ExecResult.md#gasrefund)
- [logs](ExecResult.md#logs)
- [returnValue](ExecResult.md#returnvalue)
- [runState](ExecResult.md#runstate)
- [selfdestruct](ExecResult.md#selfdestruct)

## Properties

### blobGasUsed

• `Optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

#### Defined in

[types.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L313)

___

### createdAddresses

• `Optional` **createdAddresses**: `Set`<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

[types.ts:305](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L305)

___

### exceptionError

• `Optional` **exceptionError**: [`EvmError`](../classes/EvmError.md)

Description of the exception, if any occurred

#### Defined in

[types.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L281)

___

### executionGasUsed

• **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Defined in

[types.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L289)

___

### gas

• `Optional` **gas**: `bigint`

Amount of gas left

#### Defined in

[types.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L285)

___

### gasRefund

• `Optional` **gasRefund**: `bigint`

The gas refund counter

#### Defined in

[types.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L309)

___

### logs

• `Optional` **logs**: [`Log`](../README.md#log)[]

Array of logs that the contract emitted

#### Defined in

[types.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L297)

___

### returnValue

• **returnValue**: `Uint8Array`

Return value from the contract

#### Defined in

[types.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L293)

___

### runState

• `Optional` **runState**: `RunState`

#### Defined in

[types.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L277)

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`<`string`\>

A set of accounts to selfdestruct

#### Defined in

[types.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L301)
