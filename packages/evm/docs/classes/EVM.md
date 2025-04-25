[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVM

# Class: EVM

Defined in: [evm/src/evm.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L16)

The EVM (Ethereum Virtual Machine) is responsible for executing EVM bytecode, processing transactions, and managing state changes. It handles both contract calls and contract creation operations.

## Constructors

An EVM instance can be created with the constructor method:

* [createEVM](../functions/createEVM.md)

### Constructor

> **new EVM**(`opts`): `EVM`

Defined in: [evm/src/evm.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L16)

Instantiates a new EVM Object.

#### Parameters

##### opts

[`EVMOpts`](../interfaces/EVMOpts.md)

#### Returns

`EVM`

#### Deprecated

The direct usage of this constructor is discouraged since non-finalized async initialization might lead to side effects. Please use the async [createEVM](../functions/createEVM.md) constructor instead (same API).

## Properties

### blockchain

> `readonly` **blockchain**: `EVMMockBlockchainInterface`

Defined in: [evm/src/evm.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L25)

The blockchain interface used by the EVM

***

### common

> `readonly` **common**: `Common`

Defined in: [evm/src/evm.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L27)

Common configuration for the EVM

***

### events

> `readonly` **events**: `EventEmitter`\<[`EVMEvent`](../type-aliases/EVMEvent.md)\>

Defined in: [evm/src/evm.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L29)

Event emitter for EVM events

***

### stateManager

> `readonly` **stateManager**: `StateManagerInterface`

Defined in: [evm/src/evm.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L20)

The StateManager used by the EVM

***

### journal

> `readonly` **journal**: `Journal`

Defined in: [evm/src/evm.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L33)

The journal used for tracking state changes

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: [evm/src/evm.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L35)

The transient storage used for EIP-1153

## Methods

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

Defined in: [evm/src/evm.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L134)

Executes an EVM message, determining whether it's a call or create based on the `to` address. It checkpoints the state and reverts changes if an exception happens during the message execution.

#### Parameters

##### opts

[`EVMRunCallOpts`](../interfaces/EVMRunCallOpts.md)

#### Returns

`Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: [evm/src/evm.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L109)

Executes EVM bytecode directly without creating a message. This is useful for testing and debugging.

#### Parameters

##### opts

[`EVMRunCodeOpts`](../interfaces/EVMRunCodeOpts.md)

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

***

### shallowCopy()

> **shallowCopy**(): `EVM`

Defined in: [evm/src/evm.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L109)

Returns a shallow copy of the EVM instance. Note that the returned copy will share the same state manager and blockchain as the original.

#### Returns

`EVM`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `PerformanceLog[]`

Defined in: [evm/src/evm.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L109)

Returns the performance logs collected during EVM execution.

#### Returns

`PerformanceLog[]`

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: [evm/src/evm.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L109)

Clears all performance logs.

#### Returns

`void` 