[@ethereumjs/vm](../README.md) / VM

# Class: VM

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

## Table of contents

### Properties

- [blockchain](VM.md#blockchain)
- [common](VM.md#common)
- [events](VM.md#events)
- [evm](VM.md#evm)
- [stateManager](VM.md#statemanager)

### Methods

- [buildBlock](VM.md#buildblock)
- [errorStr](VM.md#errorstr)
- [init](VM.md#init)
- [runBlock](VM.md#runblock)
- [runTx](VM.md#runtx)
- [shallowCopy](VM.md#shallowcopy)
- [create](VM.md#create)

## Properties

### blockchain

• `Readonly` **blockchain**: `BlockchainInterface`

The blockchain the VM operates on

#### Defined in

[vm/src/vm.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L41)

___

### common

• `Readonly` **common**: `Common`

#### Defined in

[vm/src/vm.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L43)

___

### events

• `Readonly` **events**: `AsyncEventEmitter`<[`VMEvents`](../README.md#vmevents)\>

#### Defined in

[vm/src/vm.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L45)

___

### evm

• `Readonly` **evm**: `EVMInterface`

The EVM used for bytecode execution

#### Defined in

[vm/src/vm.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L49)

___

### stateManager

• `Readonly` **stateManager**: `EVMStateManagerInterface`

The StateManager used by the VM

#### Defined in

[vm/src/vm.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L36)

## Methods

### buildBlock

▸ **buildBlock**(`opts`): `Promise`<[`BlockBuilder`](BlockBuilder.md)\>

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on [build](BlockBuilder.md#build)
or discarded with [revert](BlockBuilder.md#revert).

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md) |

#### Returns

`Promise`<[`BlockBuilder`](BlockBuilder.md)\>

An instance of [BlockBuilder](BlockBuilder.md) with methods:
- [addTransaction](BlockBuilder.md#addtransaction)
- [build](BlockBuilder.md#build)
- [revert](BlockBuilder.md#revert)

#### Defined in

[vm/src/vm.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L215)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[vm/src/vm.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L248)

___

### init

▸ **init**(`__namedParameters?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.genesisState?` | `GenesisState` |

#### Returns

`Promise`<`void`\>

#### Defined in

[vm/src/vm.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L139)

___

### runBlock

▸ **runBlock**(`opts`): `Promise`<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`RunBlockOpts`](../interfaces/RunBlockOpts.md) | Default values for options:  - `generate`: false |

#### Returns

`Promise`<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

#### Defined in

[vm/src/vm.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L184)

___

### runTx

▸ **runTx**(`opts`): `Promise`<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunTxOpts`](../interfaces/RunTxOpts.md) |

#### Returns

`Promise`<[`RunTxResult`](../interfaces/RunTxResult.md)\>

#### Defined in

[vm/src/vm.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L197)

___

### shallowCopy

▸ **shallowCopy**(): `Promise`<[`VM`](VM.md)\>

Returns a copy of the [VM](VM.md) instance.

Note that the returned copy will share the same db as the original for the blockchain and the statemanager

#### Returns

`Promise`<[`VM`](VM.md)\>

#### Defined in

[vm/src/vm.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L224)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`VM`](VM.md)\>

VM async constructor. Creates engine instance and initializes it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`VMOpts`](../interfaces/VMOpts.md) | VM engine constructor options |

#### Returns

`Promise`<[`VM`](VM.md)\>

#### Defined in

[vm/src/vm.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L78)
