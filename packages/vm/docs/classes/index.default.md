[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

## Hierarchy

- `AsyncEventEmitter`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](index.default.md#constructor)

### Properties

- [\_common](index.default.md#_common)
- [blockchain](index.default.md#blockchain)
- [stateManager](index.default.md#statemanager)

### Methods

- [buildBlock](index.default.md#buildblock)
- [copy](index.default.md#copy)
- [getActiveOpcodes](index.default.md#getactiveopcodes)
- [init](index.default.md#init)
- [runBlock](index.default.md#runblock)
- [runBlockchain](index.default.md#runblockchain)
- [runCall](index.default.md#runcall)
- [runCode](index.default.md#runcode)
- [runTx](index.default.md#runtx)
- [create](index.default.md#create)

## Constructors

### constructor

• **new default**(`opts?`)

Instantiates a new {@link VM} Object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`VMOpts`](../interfaces/index.VMOpts.md) |

#### Overrides

AsyncEventEmitter.constructor

#### Defined in

[index.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L172)

## Properties

### \_common

• `Readonly` **\_common**: `default`

#### Defined in

[index.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L126)

___

### blockchain

• `Readonly` **blockchain**: `default`

The blockchain the VM operates on

#### Defined in

[index.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L124)

___

### stateManager

• `Readonly` **stateManager**: [`StateManager`](../interfaces/state_interface.StateManager.md)

The StateManager used by the VM

#### Defined in

[index.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L120)

## Methods

### buildBlock

▸ **buildBlock**(`opts`): `Promise`<[`BlockBuilder`](buildBlock.BlockBuilder.md)\>

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on [BlockBuilder.build](buildBlock.BlockBuilder.md#build)
or discarded with [BlockBuilder.revert](buildBlock.BlockBuilder.md#revert).

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`BuildBlockOpts`](../interfaces/buildBlock.BuildBlockOpts.md) |

#### Returns

`Promise`<[`BlockBuilder`](buildBlock.BlockBuilder.md)\>

An instance of [BlockBuilder](buildBlock.BlockBuilder.md) with methods:
- [BlockBuilder.addTransaction](buildBlock.BlockBuilder.md#addtransaction)
- [BlockBuilder.build](buildBlock.BlockBuilder.md#build)
- [BlockBuilder.revert](buildBlock.BlockBuilder.md#revert)

#### Defined in

[index.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L370)

___

### copy

▸ **copy**(): [`default`](index.default.md)

Returns a copy of the {@link VM} instance.

#### Returns

[`default`](index.default.md)

#### Defined in

[index.ts:386](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L386)

___

### getActiveOpcodes

▸ **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for VM execution

#### Returns

`OpcodeList`

#### Defined in

[index.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L379)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L256)

___

### runBlock

▸ **runBlock**(`opts`): `Promise`<[`RunBlockResult`](../interfaces/runBlock.RunBlockResult.md)\>

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`RunBlockOpts`](../interfaces/runBlock.RunBlockOpts.md) | Default values for options:  - `generate`: false |

#### Returns

`Promise`<[`RunBlockResult`](../interfaces/runBlock.RunBlockResult.md)\>

#### Defined in

[index.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L313)

___

### runBlockchain

▸ **runBlockchain**(`blockchain?`, `maxBlocks?`): `Promise`<`number` \| `void`\>

Processes blocks and adds them to the blockchain.

This method modifies the state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockchain?` | `default` | A {@link Blockchain} object to process |
| `maxBlocks?` | `number` | - |

#### Returns

`Promise`<`number` \| `void`\>

#### Defined in

[index.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L298)

___

### runCall

▸ **runCall**(`opts`): `Promise`<`EVMResult`\>

runs a call (or create) operation.

This method modifies the state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunCallOpts`](../interfaces/runCall.RunCallOpts.md) |

#### Returns

`Promise`<`EVMResult`\>

#### Defined in

[index.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L339)

___

### runCode

▸ **runCode**(`opts`): `Promise`<`ExecResult`\>

Runs EVM code.

This method modifies the state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunCodeOpts`](../interfaces/runCode.RunCodeOpts.md) |

#### Returns

`Promise`<`ExecResult`\>

#### Defined in

[index.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L351)

___

### runTx

▸ **runTx**(`opts`): `Promise`<[`RunTxResult`](../interfaces/runTx.RunTxResult.md)\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunTxOpts`](../interfaces/runTx.RunTxOpts.md) |

#### Returns

`Promise`<[`RunTxResult`](../interfaces/runTx.RunTxResult.md)\>

#### Defined in

[index.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L327)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`default`](index.default.md)\>

VM async constructor. Creates engine instance and initializes it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`VMOpts`](../interfaces/index.VMOpts.md) | VM engine constructor options |

#### Returns

`Promise`<[`default`](index.default.md)\>

#### Defined in

[index.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L162)
