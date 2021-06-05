[@ethereumjs/vm](../README.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

## Hierarchy

- *AsyncEventEmitter*

  ↳ **default**

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

\+ **new default**(`opts?`: [*VMOpts*](../interfaces/index.vmopts.md)): [*default*](index.default.md)

Instantiates a new [[VM]] Object.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `opts` | [*VMOpts*](../interfaces/index.vmopts.md) | {} |

**Returns:** [*default*](index.default.md)

Overrides: AsyncEventEmitter.constructor

Defined in: [index.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L156)

## Properties

### \_common

• `Readonly` **\_common**: *default*

Defined in: [index.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L126)

___

### blockchain

• `Readonly` **blockchain**: *default*

The blockchain the VM operates on

Defined in: [index.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L124)

___

### stateManager

• `Readonly` **stateManager**: [*StateManager*](../interfaces/state_interface.statemanager.md)

The StateManager used by the VM

Defined in: [index.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L120)

## Methods

### buildBlock

▸ **buildBlock**(`opts`: [*BuildBlockOpts*](../interfaces/buildblock.buildblockopts.md)): *Promise*<[*BlockBuilder*](buildblock.blockbuilder.md)\>

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on `build()`
or discarded with `revert()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*BuildBlockOpts*](../interfaces/buildblock.buildblockopts.md) |

**Returns:** *Promise*<[*BlockBuilder*](buildblock.blockbuilder.md)\>

An instance of [BlockBuilder](buildblock.blockbuilder.md) with methods:
- `addTransaction(tx): RunTxResult`
- `build(sealOpts): Block`
- `revert()`

Defined in: [index.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L355)

___

### copy

▸ **copy**(): [*default*](index.default.md)

Returns a copy of the [[VM]] instance.

**Returns:** [*default*](index.default.md)

Defined in: [index.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L371)

___

### getActiveOpcodes

▸ **getActiveOpcodes**(): OpcodeList

Returns a list with the currently activated opcodes
available for VM execution

**Returns:** OpcodeList

Defined in: [index.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L364)

___

### init

▸ **init**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [index.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L241)

___

### runBlock

▸ **runBlock**(`opts`: [*RunBlockOpts*](../interfaces/runblock.runblockopts.md)): *Promise*<[*RunBlockResult*](../interfaces/runblock.runblockresult.md)\>

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [*RunBlockOpts*](../interfaces/runblock.runblockopts.md) | Default values for options:  - `generate`: false |

**Returns:** *Promise*<[*RunBlockResult*](../interfaces/runblock.runblockresult.md)\>

Defined in: [index.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L298)

___

### runBlockchain

▸ **runBlockchain**(`blockchain?`: *default*, `maxBlocks?`: *number*): *Promise*<number \| void\>

Processes blocks and adds them to the blockchain.

This method modifies the state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockchain?` | *default* | An [@ethereumjs/blockchain](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain) object to process |
| `maxBlocks?` | *number* | - |

**Returns:** *Promise*<number \| void\>

Defined in: [index.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L283)

___

### runCall

▸ **runCall**(`opts`: [*RunCallOpts*](../interfaces/runcall.runcallopts.md)): *Promise*<EVMResult\>

runs a call (or create) operation.

This method modifies the state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*RunCallOpts*](../interfaces/runcall.runcallopts.md) |

**Returns:** *Promise*<EVMResult\>

Defined in: [index.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L324)

___

### runCode

▸ **runCode**(`opts`: [*RunCodeOpts*](../interfaces/runcode.runcodeopts.md)): *Promise*<ExecResult\>

Runs EVM code.

This method modifies the state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*RunCodeOpts*](../interfaces/runcode.runcodeopts.md) |

**Returns:** *Promise*<ExecResult\>

Defined in: [index.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L336)

___

### runTx

▸ **runTx**(`opts`: [*RunTxOpts*](../interfaces/runtx.runtxopts.md)): *Promise*<[*RunTxResult*](../interfaces/runtx.runtxresult.md)\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*RunTxOpts*](../interfaces/runtx.runtxopts.md) |

**Returns:** *Promise*<[*RunTxResult*](../interfaces/runtx.runtxresult.md)\>

Defined in: [index.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L312)

___

### create

▸ `Static` **create**(`opts?`: [*VMOpts*](../interfaces/index.vmopts.md)): *Promise*<[*default*](index.default.md)\>

VM async constructor. Creates engine instance and initializes it.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `opts` | [*VMOpts*](../interfaces/index.vmopts.md) | {} | VM engine constructor options |

**Returns:** *Promise*<[*default*](index.default.md)\>

Defined in: [index.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L152)
